package com.campusconnect.demo.placement.controller;

import com.campusconnect.demo.placement.dto.PlacementDtos.*;
import com.campusconnect.demo.placement.service.PlacementService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PlacementController {

    private final PlacementService service;

    public PlacementController(PlacementService service) {
        this.service = service;
    }

    @GetMapping("/admin/placements/students")
    @PreAuthorize("hasRole('ADMIN')")
    public List<StudentOption> students() {
        return service.students();
    }

    @GetMapping("/admin/placements")
    @PreAuthorize("hasRole('ADMIN')")
    public List<DriveResponse> adminDrives() {
        return service.adminDrives();
    }

    @PostMapping("/admin/placements")
    @PreAuthorize("hasRole('ADMIN')")
    public PublishResult create(
            @RequestBody CreateDriveRequest request) {
        return service.createDrive(request);
    }

    @GetMapping("/admin/placements/{id}/registrations")
    @PreAuthorize("hasRole('ADMIN')")
    public List<RegistrationResponse> registrations(
            @PathVariable Long id) {
        return service.registrations(id);
    }

    @PatchMapping(
            "/admin/placements/{id}/registrations/{registrationId}"
    )
    @PreAuthorize("hasRole('ADMIN')")
    public RegistrationResponse update(
            @PathVariable Long id,
            @PathVariable Long registrationId,
            @RequestBody UpdateRegistrationRequest request) {

        return service.updateRegistration(
                id, registrationId, request);
    }

    @GetMapping("/student/placements")
    @PreAuthorize("hasRole('STUDENT')")
    public List<DriveResponse> studentDrives(
            Authentication authentication) {

        return service.studentDrives(authentication.getName());
    }

    @PostMapping("/student/placements/{id}/register")
    @PreAuthorize("hasRole('STUDENT')")
    public RegistrationResponse register(
            @PathVariable Long id,
            Authentication authentication) {

        return service.register(
                id, authentication.getName());
    }
}