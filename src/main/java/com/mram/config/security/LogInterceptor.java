package com.mram.config.security;

import com.mram.model.core.Activity;
import com.mram.model.core.LutUser;
import com.mram.repository.core.UserRepository;
import com.mram.service.core.ActivityService;
import com.mram.utils.HttpRequestResponseUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.handler.WebRequestHandlerInterceptorAdapter;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class LogInterceptor extends WebRequestHandlerInterceptorAdapter {
    private final ActivityService activityService;

    @Autowired
    UserRepository userRepository;

    public LogInterceptor(ActivityService activityService) {
        super(activityService);
        this.activityService = activityService;
    }


    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        String expires = response.getHeader("Expires");

        final String ip = HttpRequestResponseUtils.getClientIpAddress();
        final String url = HttpRequestResponseUtils.getRequestUrl();
        final String page = HttpRequestResponseUtils.getRequestUri();
        final String refererPage = HttpRequestResponseUtils.getRefererPage();
        final String queryString = HttpRequestResponseUtils.getPageQueryString();
        final String userAgent = HttpRequestResponseUtils.getUserAgent();
        final String requestMethod = HttpRequestResponseUtils.getRequestMethod();
        final LocalDateTime timestamp = LocalDateTime.now();


        Activity visitor = new Activity();
        Matcher m = Pattern.compile("\\(([^)]+)\\)").matcher(userAgent);
        if (m.find()) {
            visitor.setUserAgent(m.group(1));
        }
        if (SecurityContextHolder.getContext().getAuthentication() != null &&
                SecurityContextHolder.getContext().getAuthentication().isAuthenticated() &&
                !(SecurityContextHolder.getContext().getAuthentication() instanceof AnonymousAuthenticationToken)) {
            Optional<LutUser> user = userRepository
                    .findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
            user.ifPresent(lutUser -> visitor.setUserId(lutUser.getId()));
            if (page.contains("/api")) {
                visitor.setIp(ip);
                visitor.setMethod(requestMethod);
                visitor.setUrl(url);
                visitor.setExpires(expires);
                visitor.addTag(Activity.Tag.ALL);
                visitor.setPage(page);
                visitor.setQueryString(queryString);
                visitor.setRefererPage(refererPage);
                visitor.setUserAgent(userAgent);
                visitor.setLoggedTime(timestamp);
                visitor.setUniqueVisit(true);
                activityService.saveVisitorInfo(visitor);
                return super.preHandle(request, response, handler);
            }
        }
        return super.preHandle(request, response, handler);
    }

}
