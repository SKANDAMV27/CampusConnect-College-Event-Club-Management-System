package com.campusconnect.demo.repository;

import com.campusconnect.demo.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
}