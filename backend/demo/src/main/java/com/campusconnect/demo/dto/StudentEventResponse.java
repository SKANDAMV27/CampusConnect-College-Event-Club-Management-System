package com.campusconnect.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
public class StudentEventResponse {

    private Long id;

    private String title;

    private String description;

    private LocalDate eventDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private String venue;

    private Integer maxParticipants;

    private Long registeredCount;

    private LocalDate registrationDeadline;

    private String imageUrl;

    private String status;

    private boolean registered;
}