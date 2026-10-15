package com.campusconnect.demo.marks;

import com.campusconnect.demo.entity.Student;
import com.campusconnect.demo.entity.StudentMark;
import com.campusconnect.demo.repository.StudentMarkRepository;
import com.campusconnect.demo.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class MarksService {

    private final StudentMarkRepository marks;
    private final StudentRepository students;

    @Transactional(readOnly = true)
    public List<MarkResponse> adminList(
            String search,
            String semester,
            String academicYear,
            String status) {

        return marks.findAll().stream()
                .filter(m ->
                        matches(m.getStudent().getFullName(), search)
                                || matches(m.getStudent().getUsn(), search)
                                || matches(m.getStudent().getEmail(), search))
                .filter(m -> blank(semester)
                        || m.getSemester().equalsIgnoreCase(semester))
                .filter(m -> blank(academicYear)
                        || m.getAcademicYear().equalsIgnoreCase(academicYear))
                .filter(m -> blank(status)
                        || m.getPublicationStatus().equalsIgnoreCase(status))
                .map(MarkResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MarkResponse> studentList(
            String email,
            String semester,
            String academicYear) {

        Student student = students.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Student account not found"
                ));

        return marks.findByStudentIdOrderBySemesterAscSubjectNameAsc(
                        student.getId())
                .stream()
                .filter(m -> "PUBLISHED".equals(
                        m.getPublicationStatus()))
                .filter(m -> blank(semester)
                        || m.getSemester().equalsIgnoreCase(semester))
                .filter(m -> blank(academicYear)
                        || m.getAcademicYear().equalsIgnoreCase(academicYear))
                .map(MarkResponse::from)
                .toList();
    }

    @Transactional
    public MarkResponse create(
            MarkRequest request,
            String adminEmail) {

        StudentMark mark = new StudentMark();

        apply(mark, request, null);
        mark.setCreatedBy(adminEmail);

        return MarkResponse.from(marks.save(mark));
    }

    @Transactional
    public MarkResponse update(
            Long id,
            MarkRequest request) {

        StudentMark mark = get(id);

        if ("PUBLISHED".equals(mark.getPublicationStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Unpublish this result before editing it"
            );
        }

        apply(mark, request, id);

        return MarkResponse.from(marks.save(mark));
    }

    @Transactional
    public MarkResponse setPublication(
            Long id,
            boolean publish) {

        StudentMark mark = get(id);

        mark.setPublicationStatus(
                publish ? "PUBLISHED" : "DRAFT"
        );

        return MarkResponse.from(marks.save(mark));
    }

    @Transactional
    public void delete(Long id) {
        StudentMark mark = get(id);

        if ("PUBLISHED".equals(mark.getPublicationStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Unpublish this result before deleting it"
            );
        }

        marks.delete(mark);
    }

    private StudentMark get(Long id) {
        return marks.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Marks record not found"
                ));
    }

    private void apply(
            StudentMark mark,
            MarkRequest request,
            Long currentId) {

        Student student = students.findById(request.studentId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Student not found"
                ));

        if (!student.isActive()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Cannot assign marks to an inactive student"
            );
        }

        if (request.internalMarks() > request.internalMaxMarks()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Internal marks cannot exceed maximum internal marks"
            );
        }

        if (request.externalMarks() > request.externalMaxMarks()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "External marks cannot exceed maximum external marks"
            );
        }

        String semester = request.semester().trim();
        String academicYear = request.academicYear().trim();
        String examType = request.examType()
                .trim().toUpperCase(Locale.ROOT);
        String subjectCode = request.subjectCode()
                .trim().toUpperCase(Locale.ROOT);

        boolean duplicate = currentId == null
                ? marks.existsByStudentIdAndSemesterAndAcademicYearAndExamTypeAndSubjectCode(
                student.getId(),
                semester,
                academicYear,
                examType,
                subjectCode)
                : marks.existsByStudentIdAndSemesterAndAcademicYearAndExamTypeAndSubjectCodeAndIdNot(
                student.getId(),
                semester,
                academicYear,
                examType,
                subjectCode,
                currentId);

        if (duplicate) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Marks already exist for this student, semester, year, exam and subject code"
            );
        }

        mark.setStudent(student);
        mark.setSemester(semester);
        mark.setAcademicYear(academicYear);
        mark.setExamType(examType);
        mark.setSubjectCode(subjectCode);
        mark.setSubjectName(request.subjectName().trim());
        mark.setInternalMarks(request.internalMarks());
        mark.setInternalMaxMarks(request.internalMaxMarks());
        mark.setExternalMarks(request.externalMarks());
        mark.setExternalMaxMarks(request.externalMaxMarks());
        mark.setRemarks(
                request.remarks() == null
                        ? null
                        : request.remarks().trim()
        );
    }

    private boolean matches(String value, String query) {
        return blank(query)
                || (value != null
                && value.toLowerCase(Locale.ROOT)
                .contains(query.trim().toLowerCase(Locale.ROOT)));
    }

    private boolean blank(String value) {
        return value == null || value.isBlank();
    }
}