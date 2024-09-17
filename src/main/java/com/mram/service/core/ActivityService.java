package com.mram.service.core;

import com.mram.model.core.Activity;
import com.mram.repository.core.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.ModelMap;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.context.request.WebRequestInterceptor;


@Service
public class ActivityService implements WebRequestInterceptor {

    @Autowired
    private ActivityRepository repository;

    public Activity saveVisitorInfo(Activity visitor) {
        return repository.save(visitor);
    }

    @Override
    public void preHandle(WebRequest request) throws Exception {

    }

    @Override
    public void postHandle(WebRequest request, ModelMap model) throws Exception {

    }

    @Override
    public void afterCompletion(WebRequest request, Exception ex) throws Exception {

    }
}
