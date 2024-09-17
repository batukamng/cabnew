package com.mram.service.utils;

import com.google.firebase.messaging.FirebaseMessagingException;
import com.mram.config.notification.FirebaseMessagingService;
import com.mram.dao.MainDao;
import com.mram.model.core.LutUser;
import com.mram.repository.core.UserRepository;
import com.mram.repository.notif.NotificationRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MailNotificationService {

    @Autowired
    Environment env;

    @Autowired
    UserRepository userRepository;

    @Autowired
    NotificationRepository notificationRepository;

    @Autowired
    MainDao dao;

    @Autowired
    private FirebaseMessagingService firebaseMessagingService;

/*    @Autowired
    MQProducer MQProducer;*/

    private LutUser getUser(Long userId) {
        Optional<LutUser> byId = userRepository.findById(userId);
        return byId.orElse(null);
    }

    private boolean sendMail(LutUser lutUser) {
        return lutUser != null && lutUser.getDetail().getPushEmail() != null && lutUser.getDetail().getPushEmail() == 1 && lutUser.getEmail() != null && !lutUser.getEmail().equals("");
    }

    private boolean sendWeb(LutUser lutUser) {
        return lutUser != null && lutUser.getDetail().getPushWeb() != null && lutUser.getDetail().getPushWeb() == 1 && lutUser.getDetail().getFcmToken() != null && !lutUser.getDetail().getFcmToken().equals("");
    }





/*    public void text(Long userId, String title, String body) {
        text(userId, title, body, true, true);
    }

    public void text(Long userId, String title, String body, boolean doSendMail, boolean doSendNotif) {
        LutUser lutUser = getUser(userId);
        if (doSendMail && sendMail(lutUser)) {
            JSONObject mailData = new JSONObject();
            mailData.put("receiver", lutUser.getEmail());
            mailData.put("subject", title);
            mailData.put("template", "text_template");
            mailData.put("keys", new JSONObject()
                    .put("text", body)
                    .put("name", lutUser.getDetail().getFirstname())
            );
            MQProducer.sendMail(mailData.toString(), lutUser.getId());
        }
        if (doSendNotif && sendWeb(lutUser)) {
            JSONObject webData = new JSONObject();
            webData.put("tokens", new JSONArray().put(lutUser.getDetail().getFcmToken()));
            webData.put("data", new JSONObject()
                    .put("title", title)
                    .put("body", body)
            );
            MQProducer.sendNotif(webData.toString(), lutUser.getId());
        }
    }

    public void forceText(String email, String title, String body, String name) {
        JSONObject mailData = new JSONObject();
        mailData.put("receiver", email);
        mailData.put("subject", title);
        mailData.put("template", "text_template");
        mailData.put("keys", new JSONObject()
                .put("text", body)
                .put("name", name)
        );
        MQProducer.sendMessage("send_mail", mailData.toString());
    }

    public void textToTopic(String topic, String title, String body) {
        textToTopic(topic, title, body, null);
    }*/

    public void textToTopic(String topic, String title, String body, String image) throws FirebaseMessagingException {
        JSONObject webData = new JSONObject();
        webData.put("topic", topic);
        JSONObject data = new JSONObject()
                .put("title", title)
                .put("body", body);
        if (image != null) {
            data.put("image", image);
        }
        webData.put("data", data);
        firebaseMessagingService.sendNotification(webData);
    }

/*    public void textWithButton(Long userId, String title, String body, String buttonText, String buttonHref) {
        textWithButton(userId, title, body, buttonText, buttonHref, true, true);
    }

    public void textWithButton(Long userId, String title, String body, String buttonText, String buttonHref, boolean doSendMail, boolean doSendNotif) {
        LutUser lutUser = getUser(userId);
        if (doSendMail && sendMail(lutUser)) {
            JSONObject mailData = new JSONObject();
            mailData.put("receiver", lutUser.getEmail());
            mailData.put("subject", title);
            mailData.put("template", "button_template");
            mailData.put("keys", new JSONObject()
                    .put("text", body)
                    .put("button", buttonText)
                    .put("url", buttonHref)
                    .put("name", lutUser.getDetail().getFirstname())
            );
            MQProducer.sendMail(mailData.toString(), lutUser.getId());
        }
        if (doSendNotif && sendWeb(lutUser)) {
            JSONObject webData = new JSONObject();
            webData.put("tokens", new JSONArray().put(lutUser.getDetail().getFcmToken()));
            webData.put("data", new JSONObject()
                    .put("title", title)
                    .put("body", body)
                    .put("url", buttonHref)
            );
            MQProducer.sendNotif(webData.toString(), lutUser.getId());
        }
    }

    public void textToMail(String email, String title, String body) {
        JSONObject mailData = new JSONObject();
        mailData.put("receiver", email);
        mailData.put("subject", title);
        mailData.put("template", "text_template");
        mailData.put("keys", new JSONObject()
                .put("text", body)
                .put("name", "Эрхэм")
        );
        MQProducer.sendMail(mailData.toString());
    }*/

}
