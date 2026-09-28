package com.campusconnect.demo.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class EventRequest {

    private String title;

    private String description;

    private LocalDate eventDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private String venue;

    private Integer maxParticipants;

    private LocalDate registrationDeadline;

    private String imageUrl;

    private String status;
}