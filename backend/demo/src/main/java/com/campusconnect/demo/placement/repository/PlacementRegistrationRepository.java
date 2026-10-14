package com.campusconnect.demo.placement.repository;

import com.campusconnect.demo.placement.entity.PlacementRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PlacementRegistrationRepository
        extends JpaRepository<PlacementRegistration, Long> {

    List<PlacementRegistration>
    findByDriveIdOrderByRegisteredAtDesc(Long driveId);

    List<PlacementRegistration>
    findByStudentIdOrderByRegisteredAtDesc(Long studentId);

    Optional<PlacementRegistration> findByDriveIdAndStudentId(
            Long driveId, Long studentId);
}