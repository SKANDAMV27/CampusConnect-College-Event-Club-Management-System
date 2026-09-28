package com.campusconnect.demo.dto;

import lombok.Data;

@Data
public class ClubRequest {

    private String name;

    private String description;

    private String facultyCoordinator;

    private String contactEmail;

    private String contactPhone;

    private Boolean active;
}