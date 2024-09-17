package com.mram.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificationDto {
    private String subject;
    private String content;
    private Long channelId;
    private Map<String, String> data;
    private String image;
    private String topic;
    private String code;
}