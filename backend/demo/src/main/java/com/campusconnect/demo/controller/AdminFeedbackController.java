package com.campusconnect.demo.controller;

import com.campusconnect.demo.dto.EventFeedbackResponse;
import com.campusconnect.demo.entity.Event;
import com.campusconnect.demo.entity.EventFeedback;
import com.campusconnect.demo.repository.EventFeedbackRepository;
import com.campusconnect.demo.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/feedback")
@RequiredArgsConstructor
public class AdminFeedbackController {

    private final EventRepository eventRepository;
    private final EventFeedbackRepository feedbackRepository;

    // =========================================================
    // GET EVENTS
    // =========================================================

    @GetMapping("/events")
    public ResponseEntity<?> getEvents() {

        List<Event> events =
                eventRepository.findAll();

        List<Map<String, Object>> response =
                events.stream()
                        .map(event ->
                                Map.<String, Object>of(
                                        "id",
                                        event.getId(),

                                        "title",
                                        event.getTitle(),

                                        "eventDate",
                                        event.getEventDate(),

                                        "startTime",
                                        event.getStartTime(),

                                        "endTime",
                                        event.getEndTime(),

                                        "venue",
                                        event.getVenue(),

                                        "status",
                                        event.getStatus(),

                                        "feedbackCount",
                                        feedbackRepository
                                                .findByEventIdOrderBySubmittedAtDesc(
                                                        event.getId()
                                                )
                                                .size()
                                )
                        )
                        .toList();

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // GET FEEDBACK BY EVENT
    // =========================================================

    @GetMapping("/events/{eventId}")
    public ResponseEntity<?> getEventFeedback(
            @PathVariable Long eventId
    ) {

        Event event =
                eventRepository.findById(eventId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Event not found."
                                )
                        );

        List<EventFeedback> feedbackList =
                feedbackRepository
                        .findByEventIdOrderBySubmittedAtDesc(
                                eventId
                        );

        List<EventFeedbackResponse> response =
                feedbackList.stream()
                        .map(feedback ->
                                new EventFeedbackResponse(
                                        feedback.getId(),

                                        event.getId(),

                                        event.getTitle(),

                                        feedback
                                                .getStudent()
                                                .getFullName(),

                                        feedback
                                                .getStudent()
                                                .getUsn(),

                                        feedback.getQuestion1Rating(),
                                        feedback.getQuestion2Rating(),
                                        feedback.getQuestion3Rating(),
                                        feedback.getQuestion4Rating(),
                                        feedback.getQuestion5Rating(),
                                        feedback.getQuestion6Rating(),
                                        feedback.getQuestion7Rating(),
                                        feedback.getQuestion8Rating(),
                                        feedback.getQuestion9Rating(),
                                        feedback.getQuestion10Rating(),

                                        feedback.getDescription(),

                                        feedback.getSubmittedAt()
                                )
                        )
                        .toList();

        return ResponseEntity.ok(response);
    }
}