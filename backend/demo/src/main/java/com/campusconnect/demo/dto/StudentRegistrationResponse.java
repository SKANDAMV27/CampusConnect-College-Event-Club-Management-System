package com.campusconnect.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@AllArgsConstructor
public class StudentRegistrationResponse {

    private Long registrationId;

    private Long eventId;

    private String eventTitle;

    private LocalDate eventDate;

    private LocalTime startTime;

    private String venue;

    private LocalDateTime registeredAt;

    private String status;
}