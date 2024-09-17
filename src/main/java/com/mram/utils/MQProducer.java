package com.mram.utils;

import com.mram.model.core.MailNotifLog;
import com.mram.repository.core.MailNotifLogRepository;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MQProducer {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    MailNotifLogRepository mailNotifLogRepository;

    public void sendMail(String message, Long userId) {
        sendMessage("send_mail", message);
        MailNotifLog log = new MailNotifLog();
        log.setType("mail");
        log.setUserId(userId);
        log.setMessage(message);
        mailNotifLogRepository.save(log);
    }

    public void sendMail(String message) {
        sendMessage("send_mail", message);
    }

    public void sendNotif(String message, Long userId) {
        sendMessage("send_notif", message);
        MailNotifLog log = new MailNotifLog();
        log.setType("notification");
        log.setUserId(userId);
        log.setMessage(message);
        mailNotifLogRepository.save(log);
    }

    public void sendNotif(String message, String topic) {
        sendMessage("send_notif", message);
        MailNotifLog log = new MailNotifLog();
        log.setType("notification");
        log.setTopic(topic);
        log.setMessage(message);
        mailNotifLogRepository.save(log);
    }

    public void subscribeToTopic(String topic, List<String> tokens) {
        JSONObject data = new JSONObject();
        data.put("topic", topic);
        data.put("action", "subscribe");
        JSONArray tokensArr = new JSONArray();
        for (String token: tokens) {
            tokensArr.put(token);
        }
        data.put("tokens", tokensArr);
        sendMessage("subscribe_topic", data.toString());
    }

    public void unsubscribeFromTopic(String topic, List<String> tokens) {
        JSONObject data = new JSONObject();
        data.put("topic", topic);
        data.put("action", "unsubscribe");
        JSONArray tokensArr = new JSONArray();
        for (String token: tokens) {
            tokensArr.put(token);
        }
        data.put("tokens", tokensArr);
        sendMessage("subscribe_topic", data.toString());
    }

    public void createTopic(String topic) {
        JSONObject data = new JSONObject();
        data.put("topic", topic);
        data.put("action", "create");
        sendMessage("subscribe_topic", data.toString());
    }

    public void sendMessage(String exchangeName, String message) {
        System.out.println(message);
        rabbitTemplate.convertAndSend(exchangeName, message);
    }

    public void importData(String exchangeName, String message) {
        System.out.println(message);
        rabbitTemplate.convertAndSend(exchangeName, message);
    }
}
