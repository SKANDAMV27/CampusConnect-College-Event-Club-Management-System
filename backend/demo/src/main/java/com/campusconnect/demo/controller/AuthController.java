package com.campusconnect.demo.controller;

import com.campusconnect.demo.dto.*;
import com.campusconnect.demo.service.AuthService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }


    @PostMapping("/register/student")
    public ResponseEntity<?> registerStudent(
            @RequestBody StudentRegisterRequest request
    ) {

        return ResponseEntity.ok(
                authService.registerStudent(request)
        );
    }


    @PostMapping("/register/admin")
    public ResponseEntity<?> registerAdmin(
            @RequestBody AdminRegisterRequest request
    ) {

        return ResponseEntity.ok(
                authService.registerAdmin(request)
        );
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request
    ) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }
}