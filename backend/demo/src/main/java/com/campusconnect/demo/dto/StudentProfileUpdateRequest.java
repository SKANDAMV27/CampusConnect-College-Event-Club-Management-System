package com.campusconnect.demo.dto;

import lombok.Data;

@Data
public class StudentProfileUpdateRequest {

    private String fullName;

    private Integer year;

    private String department;
}