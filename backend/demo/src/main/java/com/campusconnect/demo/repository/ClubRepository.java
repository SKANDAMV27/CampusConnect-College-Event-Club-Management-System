package com.campusconnect.demo.repository;

import com.campusconnect.demo.entity.Club;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClubRepository
        extends JpaRepository<Club, Long> {

    long countByActiveTrue();
}