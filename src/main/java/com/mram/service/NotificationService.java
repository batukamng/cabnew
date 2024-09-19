package com.mram.service;

import com.google.firebase.messaging.FirebaseMessagingException;
import com.mram.config.notification.FirebaseMessagingService;
import com.mram.dao.MainDao;
import com.mram.model.core.LutUser;
import com.mram.model.dto.NotificationDto;
import com.mram.model.notif.*;
import com.mram.model.view.NotificationView;
import com.mram.repository.core.UserRepository;
import com.mram.repository.notif.*;
import com.mram.service.utils.MailNotificationService;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@AllArgsConstructor
public class NotificationService {

    private final SeenRepository seenRepository;
    private final FcmRepository fcmRepository;
    private final UserRepository userRepository;
    private final MainDao dao;
    private final ChannelRepository channelRepository;
    private final SubscriberRepository subscriberRepository;
    private final NotificationRepository notificationRepository;
    // private final MQProducer producer;
    private final MailNotificationService mailNotificationService;
    private FirebaseMessagingService firebaseMessagingService;

    public NotificationSeen saveSeen(Long ntfId, Long userId) {
        if (!seenRepository.existsByNtfIdAndUserId(ntfId, userId)) {
            NotificationSeen item = new NotificationSeen();
            item.setNtfId(ntfId);
            item.setUserId(userId);
            return seenRepository.save(item);
        } else {
            return seenRepository.findByNtfIdAndUserId(ntfId, userId);
        }
    }

    public void saveToken(String token) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Optional<LutUser> user = userRepository.findByUsername(authentication.getName());
        if (user.isPresent()) {
            if (!fcmRepository.existsUserToken(user.get().getId(), token)) {
                NotificationFcm item = new NotificationFcm();
                item.setFcm(token);
                if (item != null && user.get().getId() != null) {
                    item.setUserId(user.get().getId());
                }
                fcmRepository.save(item);
            }
        }
    }

    public Optional<NotificationChannel> getChannel(String code, String topic) {
        return channelRepository.getByCodeTopic(code, topic);
    }

    public Long saveChannel(String code, String topic) {
        NotificationChannel item = new NotificationChannel();
        item.setCode(code);
        item.setTopic(topic);
        return channelRepository.save(item).getId();
    }

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }

    public void deleteChannel(Long channelId) {
        channelRepository.deleteById(channelId);
    }

    @SneakyThrows
    public void saveSubscription(Long channelId, Long userId) {
        NotificationSubscriber item = new NotificationSubscriber();
        item.setChannelId(channelId);
        item.setUserId(userId);
        if (subscriberRepository.existsUserId(channelId, userId).isEmpty()) {
            subscriberRepository.save(item);
        }
        item.setChannel(channelRepository.getReferenceById(channelId));
        List<NotificationFcm> tokensFcm = fcmRepository.findByUserId(userId);
        firebaseMessagingService.createSubscription(item.getChannel().getTopic(),
                tokensFcm.stream().map(NotificationFcm::getFcm).collect(Collectors.toList()));
        List<String> tokens = new ArrayList<>();
        JSONObject data = new JSONObject();
        data.put("topic", item.getChannel().getTopic());
        data.put("tokens", tokensFcm.stream().map(NotificationFcm::getFcm).collect(Collectors.toList()));
        String topic = item.getChannel().getTopic();
        // List<String> tokens = new ArrayList<>();
        if (data.has("tokens")) {
            JSONArray tokensData = data.getJSONArray("tokens");
            for (int i = 0; i < tokensData.length(); i++) {
                tokens.add(tokensData.getString(i));
            }
        }
        if (data.has("token")) {
            tokens.add(data.getString("token"));
        }
        if (!data.has("action")) {
            firebaseMessagingService.createSubscription(topic, tokens);
        } else {
            switch (data.getString("action")) {
                case "create":
                    firebaseMessagingService.create(topic);
                    break;
                case "unsubscribe":
                    firebaseMessagingService.unsubscribeFromTopic(topic, tokens);
                    break;
                case "subscribe":
                    firebaseMessagingService.createSubscription(topic, tokens);
                    break;
                default:
                    break;
            }
            System.out.println("Consumed message = ");
        }

    }

    public void unSubscribe(Long channelId, Long userId) {
        NotificationChannel channel = channelRepository.getReferenceById(channelId);
        subscriberRepository.unSubscribe(channelId, userId);
        List<NotificationFcm> tokens = fcmRepository.findByUserId(userId);
        // deleteSubscription(channel.getTopic(),
        // tokens.stream().map(NotificationFcm::getFcm).collect(Collectors.toList()).toString());
    }

    public void deleteSubscription(String topic, String registrationToken) {
        List<String> objects = new ArrayList<>();
        objects.add(registrationToken);
        // producer.unsubscribeFromTopic(topic,objects);
    }

    public NotificationView getItem(Long id) {
        return (NotificationView) dao.getHQLResult("from NotificationView v where v.id=" + id + "", "current");
    }

    public void saveSeenAll(Long userId) {
        List<NotificationView> items = (List<NotificationView>) dao
                .getHQLResult("from NotificationView v where v.userId=" + userId + "", "list");
        for (NotificationView item : items) {
            if (!seenRepository.existsByNtfIdAndUserId(item.getId(), userId)) {
                NotificationSeen seen = new NotificationSeen();
                seen.setNtfId(item.getId());
                seen.setUserId(userId);
                seenRepository.save(seen);
            }
        }
    }

    public String postToTopic(NotificationDto dto) throws FirebaseMessagingException {
        // Long channelId=channelRepository.findByCodeTopic(dto.getCode(),
        // dto.getTopic());
        NotificationMessage notificationMessage = new NotificationMessage();
        notificationMessage.setChannelId(dto.getChannelId());
        notificationMessage.setTitle(dto.getSubject());
        notificationMessage.setBody(dto.getContent());
        notificationRepository.save(notificationMessage);

        mailNotificationService.textToTopic(
                dto.getTopic(),
                dto.getSubject(),
                dto.getContent(),
                dto.getImage());

        return String.valueOf(notificationMessage.getId());
    }

    public void saveItem(NotificationMessage item) throws FirebaseMessagingException {
        // notificationRepository.save(item);
        // item.setChannel(channelRepository.getReferenceById(item.getChannelId()));
        NotificationChannel channel = channelRepository.getReferenceById(item.getChannelId());
        NotificationDto dto = new NotificationDto();
        dto.setTopic(channel.getTopic());
        dto.setSubject(item.getTitle());
        dto.setContent(item.getBody());
        dto.setChannelId(item.getChannelId());
        String messageId = postToTopic(dto);
        System.out.println("messageId : " + messageId);
    }

    public void postToTopicJson(JSONObject webData) {
        Optional<NotificationChannel> channel = channelRepository.getByCodeTopic("plan", webData.getString("topic"));
        if (channel != null) {
            if (channel.isPresent()) {
                NotificationMessage notificationMessage = new NotificationMessage();
                notificationMessage.setChannelId(channel.get().getId());
                notificationMessage.setTitle(webData.getString("title"));
                notificationMessage.setBody(webData.getString("body"));
                notificationRepository.save(notificationMessage);
            }
        }

    }
}
