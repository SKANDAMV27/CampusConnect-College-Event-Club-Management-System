package com.campusconnect.demo.dto;

import lombok.Data;

@Data
public class AdminRegisterRequest {

    private String fullName;
    private String email;
    private String password;
}