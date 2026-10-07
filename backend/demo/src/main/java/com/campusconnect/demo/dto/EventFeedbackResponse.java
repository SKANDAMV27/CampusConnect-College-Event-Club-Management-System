package com.campusconnect.demo.dto;

import java.time.LocalDateTime;

public record EventFeedbackResponse(

        Long id,

        Long eventId,

        String eventTitle,

        String studentName,

        String studentUsn,

        Integer question1Rating,
        Integer question2Rating,
        Integer question3Rating,
        Integer question4Rating,
        Integer question5Rating,
        Integer question6Rating,
        Integer question7Rating,
        Integer question8Rating,
        Integer question9Rating,
        Integer question10Rating,

        String description,

        LocalDateTime submittedAt
) {
}