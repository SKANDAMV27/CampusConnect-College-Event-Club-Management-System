package com.campusconnect.demo.repository;

import com.campusconnect.demo.entity.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

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

    List<EventRegistration>
    findByStudentIdOrderByRegisteredAtDesc(
            Long studentId
    );

    long countByStudentIdAndStatus(
            Long studentId,
            String status
    );

    Optional<EventRegistration> findByEventIdAndStudentId(
            Long eventId,
            Long studentId
    );

    long countByEventIdAndStatus(Long eventId, String status);
}