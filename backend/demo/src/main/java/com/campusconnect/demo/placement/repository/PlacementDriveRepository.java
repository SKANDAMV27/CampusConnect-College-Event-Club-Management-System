package com.campusconnect.demo.placement.repository;

import com.campusconnect.demo.placement.entity.PlacementDrive;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlacementDriveRepository
        extends JpaRepository<PlacementDrive, Long> {

    List<PlacementDrive> findAllByOrderByCreatedAtDesc();

    List<PlacementDrive> findByPublishedTrueOrderByInterviewAtAsc();
}