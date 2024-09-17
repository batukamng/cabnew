package com.mram.config.notification;

import com.google.firebase.messaging.*;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FirebaseMessagingService {
    private final FirebaseMessaging firebaseMessaging;

    public FirebaseMessagingService(FirebaseMessaging firebaseMessaging) {
        this.firebaseMessaging = firebaseMessaging;
    }

    public void sendNotification(JSONObject object) throws FirebaseMessagingException {
        JSONObject data = object.getJSONObject("data");
        Notification.Builder builder = Notification.builder();
        if (data.has("title")) {
            builder.setTitle(data.getString("title"));
        }
        if (data.has("body")) {
            builder.setBody(data.getString("body"));
        }
        if (data.has("image")) {
            builder.setImage(data.getString("image"));
        }

        if (object.has("tokens")) {
            JSONArray array = object.getJSONArray("tokens");
            List<String> tokens = new ArrayList<>();
            for (int i=0; i<array.length(); i++) {
                if (array.get(i) != null && array.get(i) instanceof String) {
                    tokens.add(array.getString(i));
                }
            }
            if (tokens.isEmpty()) {
                return;
            }

            MulticastMessage.Builder messageBuilder = MulticastMessage.builder();
            messageBuilder.addAllTokens(tokens);
            messageBuilder.setNotification(builder.build());
            if (data.has("url")) {
                messageBuilder.putData("url", data.getString("url"));
            }

            try {
                firebaseMessaging.sendMulticast(messageBuilder.build());
            } catch (FirebaseMessagingException e) {
                throw new RuntimeException(e);
            }
        }
        if (object.has("topic")) {
            String topic = object.getString("topic");
            Message.Builder messageBuilder = Message.builder()
                    .setTopic(topic)
                    .setNotification(builder.build());

            if(data.has("image")){
                AndroidNotification androidNotification=
                        AndroidNotification.builder().setImage(data.getString("image")).build();
                AndroidConfig androidConfig=AndroidConfig.builder()
                        .setNotification(androidNotification).build();
                WebpushConfig webpushConfig=WebpushConfig.builder().putHeader("image",data.getString("image")).build();
                messageBuilder.setAndroidConfig(androidConfig);
                messageBuilder.setWebpushConfig(webpushConfig);
            }

            firebaseMessaging.send(messageBuilder.build());
        }
    }

    public void createSubscription(String topic,List<String> registrationTokens) throws FirebaseMessagingException {
        if(!registrationTokens.isEmpty()){
            firebaseMessaging.subscribeToTopic(registrationTokens, topic);
        }
    }

    public void unsubscribeFromTopic(String topic,List<String> registrationTokens) throws FirebaseMessagingException {
        if(!registrationTokens.isEmpty()){
            firebaseMessaging.unsubscribeFromTopic(registrationTokens, topic);
        }
    }

    public void create(String topic) {

    }
}
