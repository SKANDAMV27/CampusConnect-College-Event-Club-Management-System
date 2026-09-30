package com.campusconnect.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StudentProfileResponse {

    private Long id;

    private String fullName;

    private String email;

    private String usn;

    private Integer year;

    private String department;

    private String role;

    private boolean active;
}