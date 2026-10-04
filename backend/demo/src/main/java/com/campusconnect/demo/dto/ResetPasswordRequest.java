package com.campusconnect.demo.dto;

import lombok.Data;

@Data
public class ResetPasswordRequest {

    private String token;

    private String password;

    private String confirmPassword;
}