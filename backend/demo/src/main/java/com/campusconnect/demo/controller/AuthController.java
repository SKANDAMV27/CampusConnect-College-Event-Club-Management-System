package com.campusconnect.demo.controller;

import com.campusconnect.demo.dto.AdminRegisterRequest;
import com.campusconnect.demo.dto.ForgotPasswordRequest;
import com.campusconnect.demo.dto.LoginRequest;
import com.campusconnect.demo.dto.ResetPasswordRequest;
import com.campusconnect.demo.dto.StudentRegisterRequest;
import com.campusconnect.demo.service.AuthService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

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

    // =====================================================
    // FORGOT PASSWORD
    // =====================================================

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody ForgotPasswordRequest request
    ) {

        authService.forgotPassword(request);

        return ResponseEntity.ok(
                new MessageResponse(
                        "If an account exists with this email, "
                                + "a password reset link has been sent."
                )
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordRequest request
    ) {

        authService.resetPassword(request);

        return ResponseEntity.ok(
                new MessageResponse(
                        "Password has been reset successfully."
                )
        );
    }
    private record MessageResponse(String message) {
    }
}