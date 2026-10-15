package com.campusconnect.demo.marks;

import com.campusconnect.demo.entity.StudentMark;
import java.time.LocalDateTime;

public record MarkResponse(
        Long id,
        Long studentId,
        String studentName,
        String usn,
        String email,
        String department,
        Integer year,
        String semester,
        String academicYear,
        String examType,
        String subjectCode,
        String subjectName,
        Integer internalMarks,
        Integer internalMaxMarks,
        Integer externalMarks,
        Integer externalMaxMarks,
        Integer totalMarks,
        Integer totalMaxMarks,
        double percentage,
        String grade,
        String resultStatus,
        String publicationStatus,
        String remarks,
        String createdBy,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static MarkResponse from(StudentMark mark) {
        int total = mark.getInternalMarks()
                + mark.getExternalMarks();

        int maximum = mark.getInternalMaxMarks()
                + mark.getExternalMaxMarks();

        double percentage = maximum == 0
                ? 0
                : total * 100.0 / maximum;

        String grade =
                percentage >= 90 ? "A+"
                        : percentage >= 80 ? "A"
                        : percentage >= 70 ? "B+"
                        : percentage >= 60 ? "B"
                        : percentage >= 50 ? "C"
                        : percentage >= 35 ? "D"
                        : "F";

        String result = percentage >= 35
                ? "PASS"
                : "FAIL";

        return new MarkResponse(
                mark.getId(),
                mark.getStudent().getId(),
                mark.getStudent().getFullName(),
                mark.getStudent().getUsn(),
                mark.getStudent().getEmail(),
                mark.getStudent().getDepartment(),
                mark.getStudent().getYear(),
                mark.getSemester(),
                mark.getAcademicYear(),
                mark.getExamType(),
                mark.getSubjectCode(),
                mark.getSubjectName(),
                mark.getInternalMarks(),
                mark.getInternalMaxMarks(),
                mark.getExternalMarks(),
                mark.getExternalMaxMarks(),
                total,
                maximum,
                Math.round(percentage * 100.0) / 100.0,
                grade,
                result,
                mark.getPublicationStatus(),
                mark.getRemarks(),
                mark.getCreatedBy(),
                mark.getCreatedAt(),
                mark.getUpdatedAt()
        );
    }
}