package com.campusconnect.demo.repository;

import com.campusconnect.demo.entity.EventFeedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EventFeedbackRepository
        extends JpaRepository<EventFeedback, Long> {

    boolean existsByEventIdAndStudentId(
            Long eventId,
            Long studentId
    );

    Optional<EventFeedback> findByEventIdAndStudentId(
            Long eventId,
            Long studentId
    );

    List<EventFeedback> findByEventIdOrderBySubmittedAtDesc(
            Long eventId
    );
}