package com.campusconnect.demo.repository;

import com.campusconnect.demo.entity.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRegistrationRepository
        extends JpaRepository<EventRegistration, Long> {

    long countByStatus(String status);

    long countByEventId(Long eventId);

    List<EventRegistration>
    findByEventIdOrderByRegisteredAtDesc(
            Long eventId
    );

    List<EventRegistration>
    findAllByOrderByRegisteredAtDesc();

    boolean existsByEventIdAndStudentId(
            Long eventId,
            Long studentId
    );
}