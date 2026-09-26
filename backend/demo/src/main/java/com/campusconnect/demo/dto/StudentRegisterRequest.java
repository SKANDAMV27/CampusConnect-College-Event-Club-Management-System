package com.campusconnect.demo.dto;

import lombok.Data;

@Data
public class StudentRegisterRequest {

    private String fullName;
    private String email;
    private String usn;
    private Integer year;
    private String department;
    private String password;
}