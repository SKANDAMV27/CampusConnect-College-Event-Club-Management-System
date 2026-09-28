package com.campusconnect.demo.dto;

import lombok.Data;

@Data
public class AnnouncementRequest {

    private String title;

    private String message;

    private Boolean published;
}