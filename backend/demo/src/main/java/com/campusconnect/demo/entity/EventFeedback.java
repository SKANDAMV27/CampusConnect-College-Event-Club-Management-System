package com.campusconnect.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "event_feedback",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_event_student_feedback",
                        columnNames = {"event_id", "student_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
public class EventFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "event_id",
            nullable = false
    )
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "student_id",
            nullable = false
    )
    private Student student;

    @Column(nullable = false)
    private Integer question1Rating;

    @Column(nullable = false)
    private Integer question2Rating;

    @Column(nullable = false)
    private Integer question3Rating;

    @Column(nullable = false)
    private Integer question4Rating;

    @Column(nullable = false)
    private Integer question5Rating;

    @Column(nullable = false)
    private Integer question6Rating;

    @Column(nullable = false)
    private Integer question7Rating;

    @Column(nullable = false)
    private Integer question8Rating;

    @Column(nullable = false)
    private Integer question9Rating;

    @Column(nullable = false)
    private Integer question10Rating;

    @Column(
            columnDefinition = "TEXT"
    )
    private String description;

    @Column(nullable = false)
    private LocalDateTime submittedAt;

    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
    }
}