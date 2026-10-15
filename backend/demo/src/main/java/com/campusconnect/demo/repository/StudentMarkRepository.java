package com.campusconnect.demo.repository;

import com.campusconnect.demo.entity.StudentMark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentMarkRepository
        extends JpaRepository<StudentMark, Long> {

    List<StudentMark> findByStudentIdOrderBySemesterAscSubjectNameAsc(
            Long studentId
    );

    boolean existsByStudentIdAndSemesterAndAcademicYearAndExamTypeAndSubjectCode(
            Long studentId,
            String semester,
            String academicYear,
            String examType,
            String subjectCode
    );

    boolean existsByStudentIdAndSemesterAndAcademicYearAndExamTypeAndSubjectCodeAndIdNot(
            Long studentId,
            String semester,
            String academicYear,
            String examType,
            String subjectCode,
            Long id
    );
}