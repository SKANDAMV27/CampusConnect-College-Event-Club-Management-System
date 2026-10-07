package com.campusconnect.demo.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;


public record StudentRegistrationResponse(

        Long registrationId,

        Long eventId,

        String eventTitle,

        LocalDate eventDate,

        LocalTime startTime,

        LocalTime endTime,

        String venue,

        LocalDateTime registeredAt,

        String status,

        boolean eventCompleted,

        boolean feedbackSubmitted

) {
}