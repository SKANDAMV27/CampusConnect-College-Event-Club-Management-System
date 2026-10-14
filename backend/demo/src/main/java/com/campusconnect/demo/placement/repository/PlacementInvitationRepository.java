package com.campusconnect.demo.placement.repository;

import com.campusconnect.demo.placement.entity.PlacementInvitation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PlacementInvitationRepository
        extends JpaRepository<PlacementInvitation, Long> {

    List<PlacementInvitation> findByStudentId(Long studentId);

    List<PlacementInvitation> findByDriveId(Long driveId);

    Optional<PlacementInvitation> findByDriveIdAndStudentId(
            Long driveId, Long studentId);
}