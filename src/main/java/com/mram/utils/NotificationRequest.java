package com.mram.utils;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationRequest {
    private Long id;
    private String userFrom;
    private String content;
    private String title;
    private String url;
    private String regDtm;
    private int nType;
    private boolean isRead;
}
