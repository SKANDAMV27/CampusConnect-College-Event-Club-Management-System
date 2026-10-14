package com.campusconnect.demo.placement.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public final class PlacementDtos {

    private PlacementDtos() {}

    public record StudentOption(
            Long id,
            String fullName,
            String email,
            String usn,
            String department,
            Integer year
    ) {}

    public record CreateDriveRequest(
            String companyName,
            String companyWebsite,
            String hrName,
            String hrEmail,
            String jobTitle,
            String jobDescription,
            String location,
            BigDecimal salaryMin,
            BigDecimal salaryMax,
            String salaryCurrency,
            String eligibilityDepartments,
            BigDecimal minimumCgpa,
            Integer graduationYear,
            LocalDate registrationDeadline,
            LocalDateTime interviewAt,
            String interviewRounds,
            boolean publish,
            boolean selectAllStudents,
            List<Long> studentIds
    ) {}

    public record DriveResponse(
            Long id,
            String companyName,
            String companyWebsite,
            String hrName,
            String hrEmail,
            String jobTitle,
            String jobDescription,
            String location,
            BigDecimal salaryMin,
            BigDecimal salaryMax,
            String salaryCurrency,
            String eligibilityDepartments,
            BigDecimal minimumCgpa,
            Integer graduationYear,
            LocalDate registrationDeadline,
            LocalDateTime interviewAt,
            String interviewRounds,
            boolean published,
            long invitedCount,
            long registeredCount
    ) {}

    public record RegistrationResponse(
            Long id,
            Long studentId,
            String studentName,
            String email,
            String usn,
            String department,
            Integer year,
            String status,
            String adminNotes,
            LocalDateTime registeredAt
    ) {}

    public record UpdateRegistrationRequest(
            String status,
            String adminNotes
    ) {}

    public record PublishResult(
            Long driveId,
            int invited,
            int emailsSent,
            int emailsFailed,
            String message
    ) {}
}