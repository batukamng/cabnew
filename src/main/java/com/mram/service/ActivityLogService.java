package com.mram.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mram.model.core.ActivityLog;
import com.mram.repository.core.ActivityLogRepository;
import com.mram.utils.HttpRequestResponseUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class ActivityLogService {

    final String ip = HttpRequestResponseUtils.getClientIpAddress();
    final String url = HttpRequestResponseUtils.getRequestUrl();
    final String page = HttpRequestResponseUtils.getRequestUri();
    final String refererPage = HttpRequestResponseUtils.getRefererPage();
    final String queryString = HttpRequestResponseUtils.getPageQueryString();
    final String userAgent = HttpRequestResponseUtils.getUserAgent();
    final String requestMethod = HttpRequestResponseUtils.getRequestMethod();
    final LocalDateTime timestamp = LocalDateTime.now();
    private final ActivityLogRepository repository;
    private static final Logger logger = LoggerFactory.getLogger(ActivityLog.class);

    public ActivityLogService(ActivityLogRepository repository) {
        this.repository = repository;
    }

    public ActivityLog create() {
        ActivityLog item=new ActivityLog();
        item.setUserJson(HttpRequestResponseUtils.getLoggedInUser());
        item.setIp(ip);
        item.setMethod(requestMethod);
        item.setUserAgent(userAgent);
        item.setLoggedTime(timestamp);
        return item;
    }

    public ActivityLog createLog(String json){
        ObjectMapper mapper = new ObjectMapper();
        ActivityLog activityLog = null;
        try {
            activityLog = mapper.readValue(json, ActivityLog.class);
            return repository.save(activityLog);
        } catch (JsonProcessingException e) {
            logger.error(e.getMessage(), e);
        }
        return null;
    }
}
