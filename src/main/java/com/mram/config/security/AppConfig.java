package com.mram.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mram.base.listeners.AuthenticationFailureEventListener;
import com.mram.base.listeners.AuthenticationSuccessEventListener;
import org.springframework.boot.autoconfigure.web.servlet.DispatcherServletAutoConfiguration;
import org.springframework.context.ApplicationListener;
import org.apache.catalina.security.SecurityConfig;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextListener;
import org.springframework.web.servlet.DispatcherServlet;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@Import({ SecurityConfig.class })
public class AppConfig implements WebMvcConfigurer {
    private final AuthenticationSuccessEventListener successEventListener;
    private final AuthenticationFailureEventListener failureEventListener;

    @Autowired
    public AppConfig(LogInterceptor logInterceptor, AuthenticationSuccessEventListener successEventListener, AuthenticationFailureEventListener failureEventListener) {
        this.successEventListener = successEventListener;
        this.failureEventListener = failureEventListener;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // WebMvcConfigurer.super.addInterceptors(registry);
        // registry.addInterceptor(activityInterceptor);
    }

    @Bean
    public ApplicationListener loginSuccessListener() {
        return this.successEventListener;
    }

    @Bean
    public ApplicationListener loginFailureListener() {
        return this.failureEventListener;
    }

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
    @Bean
    RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        converter.setObjectMapper(new ObjectMapper());
        restTemplate.getMessageConverters().add(converter);
        return restTemplate;
    }


    @Bean
    public RequestContextListener requestContextListener() {
        return new RequestContextListener();
    }

 /*   @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOriginPattern("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("OPTIONS");
        config.addAllowedMethod("PATCH");
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }*/

    @Bean(name = DispatcherServletAutoConfiguration.DEFAULT_DISPATCHER_SERVLET_BEAN_NAME)
    public DispatcherServlet dispatcherServlet() {
        DispatcherServlet dispatcherServlet = new DispatcherServlet();
        dispatcherServlet.setDispatchOptionsRequest(true);
        return dispatcherServlet;
    }
}
