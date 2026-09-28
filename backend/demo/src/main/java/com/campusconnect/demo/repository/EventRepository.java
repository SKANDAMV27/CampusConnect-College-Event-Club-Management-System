package com.campusconnect.demo.repository;

import com.campusconnect.demo.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository
        extends JpaRepository<Event, Long> {

    long countByStatus(String status);
}