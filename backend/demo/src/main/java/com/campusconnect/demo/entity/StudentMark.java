package com.campusconnect.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "student_marks",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_student_mark_subject_exam",
                columnNames = {
                        "student_id",
                        "semester",
                        "academic_year",
                        "exam_type",
                        "subject_code"
                }
        )
)
@Getter
@Setter
@NoArgsConstructor
public class StudentMark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(nullable = false, length = 20)
    private String semester;

    @Column(name = "academic_year", nullable = false, length = 20)
    private String academicYear;

    @Column(name = "exam_type", nullable = false, length = 40)
    private String examType;

    @Column(name = "subject_code", nullable = false, length = 30)
    private String subjectCode;

    @Column(name = "subject_name", nullable = false, length = 120)
    private String subjectName;

    @Column(name = "internal_marks", nullable = false)
    private Integer internalMarks;

    @Column(name = "internal_max_marks", nullable = false)
    private Integer internalMaxMarks;

    @Column(name = "external_marks", nullable = false)
    private Integer externalMarks;

    @Column(name = "external_max_marks", nullable = false)
    private Integer externalMaxMarks;

    @Column(nullable = false, length = 20)
    private String publicationStatus = "DRAFT";

    @Column(length = 500)
    private String remarks;

    @Column(nullable = false, length = 255)
    private String createdBy;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void beforeUpdate() {
        updatedAt = LocalDateTime.now();
    }
}