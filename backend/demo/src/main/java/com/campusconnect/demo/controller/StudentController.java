package com.campusconnect.demo.controller;

import com.campusconnect.demo.dto.*;
import com.campusconnect.demo.entity.Event;
import com.campusconnect.demo.entity.EventFeedback;
import com.campusconnect.demo.entity.EventRegistration;
import com.campusconnect.demo.entity.Student;
import com.campusconnect.demo.repository.EventRegistrationRepository;
import com.campusconnect.demo.repository.EventRepository;
import com.campusconnect.demo.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import com.campusconnect.demo.repository.EventFeedbackRepository;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentRepository studentRepository;
    private final EventRepository eventRepository;
    private final EventRegistrationRepository registrationRepository;
    private final EventFeedbackRepository feedbackRepository;

    // =========================================================
    // PROFILE
    // =========================================================

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {

        Student student = getCurrentStudent(authentication);

        StudentProfileResponse response =
                new StudentProfileResponse(
                        student.getId(),
                        student.getFullName(),
                        student.getEmail(),
                        student.getUsn(),
                        student.getYear(),
                        student.getDepartment(),
                        student.getRole().getName(),
                        student.isActive()
                );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            Authentication authentication,
            @RequestBody StudentProfileUpdateRequest request
    ) {

        Student student = getCurrentStudent(authentication);

        if (request.getFullName() == null ||
                request.getFullName().trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Full name is required.");
        }

        if (request.getYear() == null ||
                request.getYear() < 1 ||
                request.getYear() > 5) {

            return ResponseEntity.badRequest()
                    .body("Please enter a valid year.");
        }

        if (request.getDepartment() == null ||
                request.getDepartment().trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Department is required.");
        }

        student.setFullName(request.getFullName().trim());
        student.setYear(request.getYear());
        student.setDepartment(request.getDepartment().trim());

        studentRepository.save(student);

        return ResponseEntity.ok(
                "Profile updated successfully."
        );
    }

    // =========================================================
    // DASHBOARD
    // =========================================================

    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard(
            Authentication authentication
    ) {

        Student student = getCurrentStudent(authentication);

        long availableEvents =
                eventRepository.countPublishedUpcomingEvents();

        long myRegistrations =
                registrationRepository
                        .countByStudentIdAndStatus(
                                student.getId(),
                                "CONFIRMED"
                        );

        return ResponseEntity.ok(
                Map.of(
                        "studentName", student.getFullName(),
                        "totalEvents", availableEvents,
                        "myRegistrations", myRegistrations
                )
        );
    }

    // =========================================================
    // EVENTS
    // =========================================================

    @GetMapping("/events")
    public ResponseEntity<?> getEvents(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication
    ) {

        Student student = getCurrentStudent(authentication);

        if (page < 0) {
            page = 0;
        }

        if (size < 1) {
            size = 10;
        }

        if (size > 50) {
            size = 50;
        }

        PageRequest pageable =
                PageRequest.of(page, size);

        Page<Event> eventPage =
                eventRepository.findPublishedEvents(
                        search.trim(),
                        pageable
                );

        List<StudentEventResponse> events =
                eventPage.getContent()
                        .stream()
                        .map(event ->
                                convertToStudentEvent(
                                        event,
                                        student
                                )
                        )
                        .toList();

        return ResponseEntity.ok(
                new PageResponse<>(
                        events,
                        eventPage.getNumber(),
                        eventPage.getSize(),
                        eventPage.getTotalElements(),
                        eventPage.getTotalPages(),
                        eventPage.isLast()
                )
        );
    }

    // =========================================================
    // EVENT DETAILS
    // =========================================================

    @GetMapping("/events/{id}")
    public ResponseEntity<?> getEventDetails(
            @PathVariable Long id,
            Authentication authentication
    ) {

        Student student = getCurrentStudent(authentication);

        Event event =
                eventRepository
                        .findByIdAndStatus(id, "PUBLISHED")
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Event not found."
                                )
                        );

        return ResponseEntity.ok(
                convertToStudentEvent(
                        event,
                        student
                )
        );
    }

    // =========================================================
    // REGISTER
    // =========================================================

    @PostMapping("/events/{eventId}/register")
    public ResponseEntity<?> registerForEvent(
            @PathVariable Long eventId,
            Authentication authentication
    ) {

        Student student = getCurrentStudent(authentication);

        System.out.println("=================================");
        System.out.println("REGISTER EVENT");
        System.out.println("Authenticated email: " + authentication.getName());
        System.out.println("Student ID: " + student.getId());
        System.out.println("Student name: " + student.getFullName());
        System.out.println("Student email: " + student.getEmail());
        System.out.println("Student active: " + student.isActive());
        System.out.println("Event ID: " + eventId);
        System.out.println("=================================");

        if (!student.isActive()) {
            return ResponseEntity.badRequest()
                    .body("Your student account is inactive.");
        }

        Event event =
                eventRepository
                        .findByIdAndStatus(
                                eventId,
                                "PUBLISHED"
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Event not found or not published."
                                )
                        );

        if (event.getRegistrationDeadline() != null &&
                LocalDate.now()
                        .isAfter(event.getRegistrationDeadline())) {

            return ResponseEntity.badRequest()
                    .body("Registration deadline has passed.");
        }

        /*
         * If the student already has a registration:
         *
         * CONFIRMED -> already registered
         * CANCELLED -> reactivate registration
         */
        var existing =
                registrationRepository
                        .findByEventIdAndStudentId(
                                eventId,
                                student.getId()
                        );

        if (existing.isPresent()) {

            EventRegistration registration =
                    existing.get();

            if ("CONFIRMED".equalsIgnoreCase(
                    registration.getStatus())) {

                return ResponseEntity.badRequest()
                        .body(
                                "You are already registered for this event."
                        );
            }

            if ("CANCELLED".equalsIgnoreCase(
                    registration.getStatus())) {

                long registeredCount =
                        registrationRepository
                                .countByEventIdAndStatus(
                                        eventId,
                                        "CONFIRMED"
                                );

                if (event.getMaxParticipants() != null &&
                        registeredCount >=
                                event.getMaxParticipants()) {

                    return ResponseEntity.badRequest()
                            .body(
                                    "This event has reached maximum capacity."
                            );
                }

                registration.setStatus("CONFIRMED");
                registration.setRegisteredAt(
                        LocalDateTime.now()
                );

                registrationRepository.save(registration);

                return ResponseEntity.ok(
                        "Successfully registered for the event."
                );
            }
        }

        long registeredCount =
                registrationRepository
                        .countByEventIdAndStatus(
                                eventId,
                                "CONFIRMED"
                        );

        if (event.getMaxParticipants() != null &&
                registeredCount >= event.getMaxParticipants()) {

            return ResponseEntity.badRequest()
                    .body(
                            "This event has reached maximum capacity."
                    );
        }

        EventRegistration registration =
                new EventRegistration();

        registration.setEvent(event);
        registration.setStudent(student);
        registration.setRegisteredAt(
                LocalDateTime.now()
        );
        registration.setStatus("CONFIRMED");

        registrationRepository.save(registration);

        return ResponseEntity.ok(
                "Successfully registered for the event."
        );
    }

    @GetMapping("/registrations")
    public ResponseEntity<?> getMyRegistrations(
            Authentication authentication
    ) {

        Student student = getCurrentStudent(authentication);

        List<EventRegistration> registrations =
                registrationRepository
                        .findByStudentIdOrderByRegisteredAtDesc(
                                student.getId()
                        );

        List<StudentRegistrationResponse> response =
                registrations.stream()
                        .map(registration -> {

                            Event event =
                                    registration.getEvent();

                            boolean eventCompleted =
                                    isEventCompleted(event);

                            boolean feedbackSubmitted =
                                    feedbackRepository
                                            .existsByEventIdAndStudentId(
                                                    event.getId(),
                                                    student.getId()
                                            );

                            return new StudentRegistrationResponse(
                                    registration.getId(),
                                    event.getId(),
                                    event.getTitle(),
                                    event.getEventDate(),
                                    event.getStartTime(),
                                    event.getEndTime(),
                                    event.getVenue(),
                                    registration.getRegisteredAt(),
                                    registration.getStatus(),
                                    eventCompleted,
                                    feedbackSubmitted
                            );
                        })
                        .toList();

        return ResponseEntity.ok(response);
    }

    // =========================================================
// EVENT FEEDBACK
// =========================================================

    @PostMapping("/events/{eventId}/feedback")
    public ResponseEntity<?> submitFeedback(
            @PathVariable Long eventId,
            @RequestBody EventFeedbackRequest request,
            Authentication authentication
    ) {

        Student student =
                getCurrentStudent(authentication);

        Event event =
                eventRepository.findById(eventId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Event not found."
                                )
                        );

        // ---------------------------------------------------------
        // EVENT COMPLETION CHECK
        // ---------------------------------------------------------

        if (!isEventCompleted(event)) {

            return ResponseEntity.badRequest()
                    .body(
                            "Feedback can be submitted only after the event is completed."
                    );
        }

        // ---------------------------------------------------------
        // STUDENT REGISTRATION CHECK
        // ---------------------------------------------------------

        EventRegistration registration =
                registrationRepository
                        .findByEventIdAndStudentId(
                                eventId,
                                student.getId()
                        )
                        .orElse(null);

        if (registration == null ||
                !"CONFIRMED".equalsIgnoreCase(
                        registration.getStatus()
                )) {

            return ResponseEntity.badRequest()
                    .body(
                            "You can submit feedback only for an event you registered for."
                    );
        }

        // ---------------------------------------------------------
        // DUPLICATE CHECK
        // ---------------------------------------------------------

        if (feedbackRepository
                .existsByEventIdAndStudentId(
                        eventId,
                        student.getId()
                )) {

            return ResponseEntity.badRequest()
                    .body(
                            "You have already submitted feedback for this event."
                    );
        }

        // ---------------------------------------------------------
        // VALIDATE RATINGS
        // ---------------------------------------------------------

        if (!isValidRating(request.getQuestion1Rating()) ||
                !isValidRating(request.getQuestion2Rating()) ||
                !isValidRating(request.getQuestion3Rating()) ||
                !isValidRating(request.getQuestion4Rating()) ||
                !isValidRating(request.getQuestion5Rating()) ||
                !isValidRating(request.getQuestion6Rating()) ||
                !isValidRating(request.getQuestion7Rating()) ||
                !isValidRating(request.getQuestion8Rating()) ||
                !isValidRating(request.getQuestion9Rating()) ||
                !isValidRating(request.getQuestion10Rating())) {

            return ResponseEntity.badRequest()
                    .body(
                            "All ratings must be between 1 and 10."
                    );
        }

        // ---------------------------------------------------------
        // SAVE FEEDBACK
        // ---------------------------------------------------------

        EventFeedback feedback =
                new EventFeedback();

        feedback.setEvent(event);
        feedback.setStudent(student);

        feedback.setQuestion1Rating(
                request.getQuestion1Rating()
        );

        feedback.setQuestion2Rating(
                request.getQuestion2Rating()
        );

        feedback.setQuestion3Rating(
                request.getQuestion3Rating()
        );

        feedback.setQuestion4Rating(
                request.getQuestion4Rating()
        );

        feedback.setQuestion5Rating(
                request.getQuestion5Rating()
        );

        feedback.setQuestion6Rating(
                request.getQuestion6Rating()
        );

        feedback.setQuestion7Rating(
                request.getQuestion7Rating()
        );

        feedback.setQuestion8Rating(
                request.getQuestion8Rating()
        );

        feedback.setQuestion9Rating(
                request.getQuestion9Rating()
        );

        feedback.setQuestion10Rating(
                request.getQuestion10Rating()
        );

        feedback.setDescription(
                request.getDescription() == null
                        ? null
                        : request.getDescription().trim()
        );

        feedbackRepository.save(feedback);

        return ResponseEntity.ok(
                "Feedback submitted successfully."
        );
    }

    @GetMapping("/events/{eventId}/feedback")
    public ResponseEntity<?> getFeedbackStatus(
            @PathVariable Long eventId,
            Authentication authentication
    ) {

        Student student =
                getCurrentStudent(authentication);

        boolean submitted =
                feedbackRepository
                        .existsByEventIdAndStudentId(
                                eventId,
                                student.getId()
                        );

        return ResponseEntity.ok(
                Map.of(
                        "submitted",
                        submitted
                )
        );
    }

    private boolean isValidRating(
            Integer rating
    ) {

        return rating != null &&
                rating >= 1 &&
                rating <= 10;
    }

    private boolean isEventCompleted(
            Event event
    ) {

        if ("COMPLETED".equalsIgnoreCase(
                event.getStatus()
        )) {
            return true;
        }

        if (event.getEventDate() == null) {
            return false;
        }

        if (event.getEndTime() == null) {

            return LocalDate.now()
                    .isAfter(event.getEventDate());
        }

        LocalDateTime eventEnd =
                LocalDateTime.of(
                        event.getEventDate(),
                        event.getEndTime()
                );

        return LocalDateTime.now()
                .isAfter(eventEnd);
    }

    // =========================================================
    // CANCEL REGISTRATION
    // =========================================================

    @DeleteMapping("/registrations/{registrationId}")
    public ResponseEntity<?> cancelRegistration(
            @PathVariable Long registrationId,
            Authentication authentication
    ) {

        Student student = getCurrentStudent(authentication);

        EventRegistration registration =
                registrationRepository
                        .findById(registrationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Registration not found."
                                )
                        );

        if (!registration.getStudent()
                .getId()
                .equals(student.getId())) {

            return ResponseEntity
                    .status(403)
                    .body(
                            "You cannot cancel another student's registration."
                    );
        }

        if ("CANCELLED".equalsIgnoreCase(
                registration.getStatus())) {

            return ResponseEntity.badRequest()
                    .body(
                            "This registration is already cancelled."
                    );
        }

        registration.setStatus("CANCELLED");

        registrationRepository.save(registration);

        return ResponseEntity.ok(
                "Registration cancelled successfully."
        );
    }

    // =========================================================
    // HELPERS
    // =========================================================

    private Student getCurrentStudent(
            Authentication authentication
    ) {

        String email = authentication.getName();

        return studentRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student account not found."
                        )
                );
    }

    private StudentEventResponse convertToStudentEvent(
            Event event,
            Student student
    ) {

        long registeredCount =
                registrationRepository
                        .countByEventIdAndStatus(
                                event.getId(),
                                "CONFIRMED"
                        );

        boolean registered =
                registrationRepository
                        .findByEventIdAndStudentId(
                                event.getId(),
                                student.getId()
                        )
                        .map(registration ->
                                "CONFIRMED".equalsIgnoreCase(
                                        registration.getStatus()
                                )
                        )
                        .orElse(false);

        return new StudentEventResponse(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                event.getEventDate(),
                event.getStartTime(),
                event.getEndTime(),
                event.getVenue(),
                event.getMaxParticipants(),
                registeredCount,
                event.getRegistrationDeadline(),
                event.getImageUrl(),
                event.getStatus(),
                registered
        );
    }

    public record PageResponse<T>(
            List<T> content,
            int page,
            int size,
            long totalElements,
            int totalPages,
            boolean last
    ) {
    }
}