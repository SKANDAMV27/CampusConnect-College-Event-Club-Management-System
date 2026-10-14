
package com.campusconnect.demo.placement.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "placement_invitations",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_drive_student_invite",
                columnNames = {"drive_id", "student_id"}
        )
)
public class PlacementInvitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "drive_id", nullable = false)
    private PlacementDrive drive;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(nullable = false)
    private String status = "INVITED";

    @Column(nullable = false)
    private LocalDateTime invitedAt = LocalDateTime.now();

    public Long getId() {
        return id;
    }

    public PlacementDrive getDrive() {
        return drive;
    }

    public void setDrive(PlacementDrive drive) {
        this.drive = drive;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getInvitedAt() {
        return invitedAt;
    }
}
