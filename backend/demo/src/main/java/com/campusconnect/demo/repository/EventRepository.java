package com.campusconnect.demo.repository;

import com.campusconnect.demo.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {

    long countByStatus(String status);

    @Query("""
        SELECT event
        FROM Event event
        WHERE
            (
                :search IS NULL
                OR :search = ''
                OR LOWER(event.title) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(event.venue) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(event.description) LIKE LOWER(CONCAT('%', :search, '%'))
            )
        AND
            (
                :status IS NULL
                OR :status = ''
                OR event.status = :status
            )
        """)
    Page<Event> searchEvents(
            @Param("search") String search,
            @Param("status") String status,
            Pageable pageable
    );

    @Query("""
        SELECT e
        FROM Event e
        WHERE e.status = 'PUBLISHED'
        AND (
            :search = ''
            OR LOWER(e.title) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(e.description) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(e.venue) LIKE LOWER(CONCAT('%', :search, '%'))
        )
        ORDER BY e.eventDate ASC, e.startTime ASC
    """)
    Page<Event> findPublishedEvents(
            String search,
            Pageable pageable
    );

    Optional<Event> findByIdAndStatus(
            Long id,
            String status
    );

    @Query("""
        SELECT COUNT(e)
        FROM Event e
        WHERE e.status = 'PUBLISHED'
        AND e.eventDate >= CURRENT_DATE
    """)
    long countPublishedUpcomingEvents();
}