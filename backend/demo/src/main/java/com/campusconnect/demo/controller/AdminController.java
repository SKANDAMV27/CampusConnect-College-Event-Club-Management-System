package com.campusconnect.demo.controller;

import com.campusconnect.demo.dto.AnnouncementRequest;
import com.campusconnect.demo.dto.ClubRequest;
import com.campusconnect.demo.dto.EventRequest;
import com.campusconnect.demo.entity.Admin;
import com.campusconnect.demo.entity.Announcement;
import com.campusconnect.demo.entity.Club;
import com.campusconnect.demo.entity.Event;
import com.campusconnect.demo.entity.EventRegistration;
import com.campusconnect.demo.entity.Student;
import com.campusconnect.demo.repository.AdminRepository;
import com.campusconnect.demo.repository.AnnouncementRepository;
import com.campusconnect.demo.repository.ClubRepository;
import com.campusconnect.demo.repository.EventRegistrationRepository;
import com.campusconnect.demo.repository.EventRepository;
import com.campusconnect.demo.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminRepository adminRepository;
    private final StudentRepository studentRepository;
    private final EventRepository eventRepository;
    private final ClubRepository clubRepository;
    private final EventRegistrationRepository eventRegistrationRepository;
    private final AnnouncementRepository announcementRepository;

    // =========================================================
    // DASHBOARD
    // =========================================================

    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard() {

        Map<String, Object> response = new LinkedHashMap<>();

        response.put(
                "totalStudents",
                studentRepository.countByActiveTrue()
        );

        response.put(
                "totalEvents",
                eventRepository.count()
        );

        response.put(
                "totalClubs",
                clubRepository.countByActiveTrue()
        );

        response.put(
                "totalRegistrations",
                eventRegistrationRepository.countByStatus("CONFIRMED")
        );

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // STUDENTS
    // =========================================================

    @GetMapping("/students")
    public ResponseEntity<List<Student>> getStudents() {
        return ResponseEntity.ok(studentRepository.findAll());
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<?> getStudent(@PathVariable Long id) {

        return studentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    @PutMapping("/students/{id}/status")
    public ResponseEntity<?> updateStudentStatus(
            @PathVariable Long id,
            @RequestParam boolean active
    ) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Student not found")
                );

        student.setActive(active);

        studentRepository.save(student);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        active
                                ? "Student activated successfully"
                                : "Student deactivated successfully"
                )
        );
    }

    @GetMapping("/events")
    public ResponseEntity<?> getEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status
    ) {

        if (page < 0) {
            page = 0;
        }

        if (size < 1 || size > 100) {
            size = 10;
        }

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(
                        Sort.Direction.DESC,
                        "eventDate"
                )
        );

        Page<Event> eventPage =
                eventRepository.searchEvents(
                        search,
                        status,
                        pageable
                );

        return ResponseEntity.ok(eventPage);
    }

    @PostMapping("/events")
    public ResponseEntity<?> createEvent(
            @RequestBody EventRequest request,
            Authentication authentication
    ) {

        String email = authentication.getName();

        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Admin not found")
                );

        Event event = new Event();

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setEventDate(request.getEventDate());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setVenue(request.getVenue());
        event.setMaxParticipants(request.getMaxParticipants());
        event.setRegistrationDeadline(
                request.getRegistrationDeadline()
        );
        event.setImageUrl(request.getImageUrl());
        event.setStatus(request.getStatus());
        event.setCreatedBy(admin);

        Event savedEvent = eventRepository.save(event);

        return ResponseEntity.ok(savedEvent);
    }

    @PutMapping("/events/{id}")
    public ResponseEntity<?> updateEvent(
            @PathVariable Long id,
            @RequestBody EventRequest request
    ) {

        Event event = eventRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Event not found")
                );

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setEventDate(request.getEventDate());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setVenue(request.getVenue());
        event.setMaxParticipants(request.getMaxParticipants());
        event.setRegistrationDeadline(
                request.getRegistrationDeadline()
        );
        event.setImageUrl(request.getImageUrl());
        event.setStatus(request.getStatus());

        return ResponseEntity.ok(
                eventRepository.save(event)
        );
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<?> deleteEvent(
            @PathVariable Long id
    ) {

        Event event = eventRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Event not found")
                );

        eventRepository.delete(event);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Event deleted successfully"
                )
        );
    }

    // =========================================================
    // CLUBS
    // =========================================================

    @GetMapping("/clubs")
    public ResponseEntity<List<Club>> getClubs() {

        return ResponseEntity.ok(
                clubRepository.findAll()
        );
    }

    @PostMapping("/clubs")
    public ResponseEntity<?> createClub(
            @RequestBody ClubRequest request
    ) {

        if (clubRepository.existsByName(request.getName())) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message",
                            "Club name already exists"
                    )
            );
        }

        Club club = new Club();

        club.setName(request.getName());
        club.setDescription(request.getDescription());
        club.setFacultyCoordinator(
                request.getFacultyCoordinator()
        );
        club.setContactEmail(request.getContactEmail());
        club.setContactPhone(request.getContactPhone());
        club.setActive(request.getActive());

        return ResponseEntity.ok(
                clubRepository.save(club)
        );
    }

    @PutMapping("/clubs/{id}")
    public ResponseEntity<?> updateClub(
            @PathVariable Long id,
            @RequestBody ClubRequest request
    ) {

        Club club = clubRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Club not found")
                );

        club.setName(request.getName());
        club.setDescription(request.getDescription());
        club.setFacultyCoordinator(
                request.getFacultyCoordinator()
        );
        club.setContactEmail(request.getContactEmail());
        club.setContactPhone(request.getContactPhone());
        club.setActive(request.getActive());

        return ResponseEntity.ok(
                clubRepository.save(club)
        );
    }

    @DeleteMapping("/clubs/{id}")
    public ResponseEntity<?> deleteClub(
            @PathVariable Long id
    ) {

        Club club = clubRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Club not found")
                );

        clubRepository.delete(club);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Club deleted successfully"
                )
        );
    }

    // =========================================================
    // REGISTRATIONS
    // =========================================================

    @GetMapping("/registrations")
    public ResponseEntity<List<EventRegistration>>
    getRegistrations() {

        return ResponseEntity.ok(
                eventRegistrationRepository
                        .findAllByOrderByRegisteredAtDesc()
        );
    }

    @GetMapping("/registrations/event/{eventId}")
    public ResponseEntity<List<EventRegistration>>
    getEventRegistrations(
            @PathVariable Long eventId
    ) {

        return ResponseEntity.ok(
                eventRegistrationRepository
                        .findByEventIdOrderByRegisteredAtDesc(
                                eventId
                        )
        );
    }

    @GetMapping("/registrations/{id}")
    public ResponseEntity<?> getRegistration(
            @PathVariable Long id
    ) {

        return eventRegistrationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    @PutMapping("/registrations/{id}/status")
    public ResponseEntity<?> updateRegistrationStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {

        EventRegistration registration =
                eventRegistrationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Registration not found"
                                )
                        );

        registration.setStatus(status.toUpperCase());

        return ResponseEntity.ok(
                eventRegistrationRepository.save(registration)
        );
    }

    // =========================================================
    // ANNOUNCEMENTS
    // =========================================================

    @GetMapping("/announcements")
    public ResponseEntity<List<Announcement>>
    getAnnouncements() {

        return ResponseEntity.ok(
                announcementRepository
                        .findAllByOrderByCreatedAtDesc()
        );
    }

    @PostMapping("/announcements")
    public ResponseEntity<?> createAnnouncement(
            @RequestBody AnnouncementRequest request,
            Authentication authentication
    ) {

        String email = authentication.getName();

        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Admin not found")
                );

        Announcement announcement =
                new Announcement();

        announcement.setTitle(request.getTitle());
        announcement.setMessage(request.getMessage());
        announcement.setCreatedAt(LocalDateTime.now());
        announcement.setCreatedBy(admin);

        return ResponseEntity.ok(
                announcementRepository.save(announcement)
        );
    }

    @PutMapping("/announcements/{id}")
    public ResponseEntity<?> updateAnnouncement(
            @PathVariable Long id,
            @RequestBody AnnouncementRequest request
    ) {

        Announcement announcement =
                announcementRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Announcement not found"
                                )
                        );

        announcement.setTitle(request.getTitle());
        announcement.setMessage(request.getMessage());
        return ResponseEntity.ok(
                announcementRepository.save(announcement)
        );
    }

    @DeleteMapping("/announcements/{id}")
    public ResponseEntity<?> deleteAnnouncement(
            @PathVariable Long id
    ) {

        Announcement announcement =
                announcementRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Announcement not found"
                                )
                        );

        announcementRepository.delete(announcement);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Announcement deleted successfully"
                )
        );
    }

    // =========================================================
    // PROFILE
    // =========================================================

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(
            Authentication authentication
    ) {

        String email = authentication.getName();

        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Admin not found")
                );

        Map<String, Object> profile =
                new LinkedHashMap<>();

        profile.put("id", admin.getId());
        profile.put("fullName", admin.getFullName());
        profile.put("email", admin.getEmail());
        profile.put(
                "role",
                admin.getRole().getName()
        );

        return ResponseEntity.ok(profile);
    }


}