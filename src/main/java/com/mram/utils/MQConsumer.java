package com.mram.utils;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mram.model.core.Organization;
import com.mram.repository.core.OrganizationRepository;
import jakarta.transaction.Transactional;
import lombok.SneakyThrows;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class MQConsumer {

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm:ss");

    @Autowired
    OrganizationRepository organizationRepository;

    @Autowired
    ObjectMapper mapper;

    @RabbitListener(queues = "#{environment.getProperty('spring.invest.routing.key')}")
    public void invest(String message) {
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        parseInvest(message);
    }

    @SneakyThrows
    @Transactional
    @Modifying
    public void parseInvest(String message) {
        JSONObject object;
        try {
            object = new JSONObject(message);
        } catch (JSONException ex) {
            return;
        }
        if (!object.has("class")) {
            return;
        }
        if (object.getString("class").equals("Organization")) {
            System.out.println("Organization");
            System.out.println("Start: " + formatter.format(LocalDateTime.now()));

            String data = object.getString("data");
            System.out.println("######");
            System.out.println(data);

            JSONArray array=new JSONArray(data);
            for (int i = 0; i < array.length(); i++) {
                JSONObject obj=array.getJSONObject(i);
                Organization org;
                if(organizationRepository.findByLpReg(obj.getString("lpReg")).isEmpty()){
                    org=new Organization();
                }
                else {
                    org=organizationRepository.findByLpReg(obj.getString("lpReg")).get(0);
                }
                org.setName(obj.getString("name"));
                org.setEmail(obj.getString("email"));
                org.setLpReg(obj.getString("lpReg"));
                org.setMobile(obj.isNull("mobile")?"":obj.getString("mobile"));
                org.setWeb(obj.getString("web"));
                org.setPhone(obj.getString("phone"));
                organizationRepository.save(org);
            }

            System.out.println("import done");
            System.out.println("End: " + formatter.format(LocalDateTime.now()));
        }
    }
}
