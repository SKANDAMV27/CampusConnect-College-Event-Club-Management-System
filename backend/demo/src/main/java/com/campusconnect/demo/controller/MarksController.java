package com.campusconnect.demo.controller;

import com.campusconnect.demo.marks.MarkRequest;
import com.campusconnect.demo.marks.MarkResponse;
import com.campusconnect.demo.marks.MarksService;
import com.campusconnect.demo.repository.StudentRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class MarksController {

    private final MarksService marksService;
    private final StudentRepository students;

    @GetMapping("/api/admin/marks/students")
    public ResponseEntity<?> students(
            @RequestParam(required = false) String search) {

        String query = search == null
                ? ""
                : search.trim().toLowerCase();

        return ResponseEntity.ok(
                students.findAll().stream()
                        .filter(student -> student.isActive())
                        .filter(student ->
                                query.isBlank()
                                        || student.getFullName().toLowerCase().contains(query)
                                        || student.getUsn().toLowerCase().contains(query)
                                        || student.getEmail().toLowerCase().contains(query))
                        .map(student -> Map.of(
                                "id", student.getId(),
                                "name", student.getFullName(),
                                "usn", student.getUsn(),
                                "email", student.getEmail(),
                                "department", student.getDepartment(),
                                "year", student.getYear()
                        ))
                        .toList()
        );
    }

    @GetMapping("/api/admin/marks")
    public ResponseEntity<?> adminMarks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String semester,
            @RequestParam(required = false) String academicYear,
            @RequestParam(required = false) String status) {

        return ResponseEntity.ok(
                marksService.adminList(
                        search, semester, academicYear, status
                )
        );
    }

    @PostMapping("/api/admin/marks")
    public ResponseEntity<MarkResponse> create(
            @Valid @RequestBody MarkRequest request,
            Authentication authentication) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(marksService.create(
                        request, authentication.getName()
                ));
    }

    @PutMapping("/api/admin/marks/{id}")
    public ResponseEntity<MarkResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody MarkRequest request) {

        return ResponseEntity.ok(
                marksService.update(id, request)
        );
    }

    @PostMapping("/api/admin/marks/{id}/publish")
    public ResponseEntity<MarkResponse> publish(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                marksService.setPublication(id, true)
        );
    }

    @PostMapping("/api/admin/marks/{id}/unpublish")
    public ResponseEntity<MarkResponse> unpublish(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                marksService.setPublication(id, false)
        );
    }

    @DeleteMapping("/api/admin/marks/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {

        marksService.delete(id);

        Map<String, String> result = new LinkedHashMap<>();
        result.put("message", "Draft marks deleted successfully");

        return ResponseEntity.ok(result);
    }

    @GetMapping("/api/student/marks")
    public ResponseEntity<?> studentMarks(
            Authentication authentication,
            @RequestParam(required = false) String semester,
            @RequestParam(required = false) String academicYear) {

        return ResponseEntity.ok(
                marksService.studentList(
                        authentication.getName(),
                        semester,
                        academicYear
                )
        );
    }
}