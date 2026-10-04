package com.campusconnect.demo.service;

import com.campusconnect.demo.dto.*;
import com.campusconnect.demo.entity.Admin;
import com.campusconnect.demo.entity.Role;
import com.campusconnect.demo.entity.Student;
import com.campusconnect.demo.repository.AdminRepository;
import com.campusconnect.demo.repository.RoleRepository;
import com.campusconnect.demo.repository.StudentRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.campusconnect.demo.dto.ForgotPasswordRequest;
import com.campusconnect.demo.dto.ResetPasswordRequest;
import com.campusconnect.demo.entity.PasswordResetToken;
import com.campusconnect.demo.repository.PasswordResetTokenRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service

public class AuthService {

    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final StudentRepository studentRepository;
    private final AdminRepository adminRepository;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;

    public AuthService(StudentRepository studentRepository, AdminRepository adminRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, JwtService jwtService,PasswordResetTokenRepository passwordResetTokenRepository,EmailService emailService) {
        this.studentRepository = studentRepository;
        this.adminRepository = adminRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailService = emailService;
    }


    public String registerStudent(
            StudentRegisterRequest request
    ) {

        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (studentRepository.existsByUsn(request.getUsn())) {
            throw new RuntimeException("USN already exists");
        }

        Role role = roleRepository
                .findByName("STUDENT")
                .orElseThrow(() ->
                        new RuntimeException(
                                "STUDENT role not found"
                        )
                );

        Student student = new Student();

        student.setFullName(request.getFullName());
        student.setEmail(request.getEmail());
        student.setUsn(request.getUsn());
        student.setYear(request.getYear());
        student.setDepartment(request.getDepartment());
        student.setActive(true);
        student.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        student.setRole(role);

        studentRepository.save(student);

        return "Student registered successfully";
    }


    public String registerAdmin(
            AdminRegisterRequest request
    ) {

        if (adminRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException(
                    "Admin email already exists"
            );
        }

        Role role = roleRepository
                .findByName("ADMIN")
                .orElseThrow(() ->
                        new RuntimeException(
                                "ADMIN role not found"
                        )
                );

        Admin admin = new Admin();

        admin.setFullName(request.getFullName());
        admin.setEmail(request.getEmail());

        admin.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        admin.setRole(role);

        adminRepository.save(admin);

        return "Admin registered successfully";
    }


    public LoginResponse login(
            LoginRequest request
    ) {

        String email = request.getEmail();
        String password = request.getPassword();


        // Student login
        var studentOptional =
                studentRepository.findByEmail(email);

        if (studentOptional.isPresent()) {

            Student student = studentOptional.get();

            if (!passwordEncoder.matches(
                    password,
                    student.getPassword()
            )) {
                throw new RuntimeException(
                        "Invalid email or password"
                );
            }

            String role =
                    student.getRole().getName();

            String token =
                    jwtService.generateToken(
                            student.getEmail(),
                            role
                    );

            return new LoginResponse(
                    token,
                    role,
                    student.getFullName(),
                    student.getEmail()
            );
        }


        // Admin login
        var adminOptional =
                adminRepository.findByEmail(email);

        if (adminOptional.isPresent()) {

            Admin admin = adminOptional.get();

            if (!passwordEncoder.matches(
                    password,
                    admin.getPassword()
            )) {
                throw new RuntimeException(
                        "Invalid email or password"
                );
            }

            String role =
                    admin.getRole().getName();

            String token =
                    jwtService.generateToken(
                            admin.getEmail(),
                            role
                    );

            return new LoginResponse(
                    token,
                    role,
                    admin.getFullName(),
                    admin.getEmail()
            );
        }


        throw new RuntimeException(
                "Invalid email or password"
        );
    }

    public void forgotPassword(ForgotPasswordRequest request) {

        String email = request.getEmail();

        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        email = email.trim().toLowerCase();

        boolean studentExists =
                studentRepository.findByEmail(email).isPresent();

        boolean adminExists =
                adminRepository.findByEmail(email).isPresent();

        /*
         * Do not reveal whether the email exists.
         * This prevents account enumeration.
         */

        if (!studentExists && !adminExists) {
            return;
        }

        // Remove old reset tokens
        passwordResetTokenRepository.deleteByEmail(email);

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken =
                new PasswordResetToken();

        resetToken.setToken(token);
        resetToken.setEmail(email);
        resetToken.setExpiresAt(
                LocalDateTime.now().plusMinutes(15)
        );
        resetToken.setUsed(false);

        passwordResetTokenRepository.save(resetToken);

        emailService.sendPasswordResetEmail(
                email,
                token
        );
    }

    public void resetPassword(
            ResetPasswordRequest request
    ) {

        if (request.getToken() == null ||
                request.getToken().trim().isEmpty()) {

            throw new RuntimeException("Invalid reset token");
        }

        if (request.getPassword() == null ||
                request.getPassword().trim().isEmpty()) {

            throw new RuntimeException("Password is required");
        }

        if (!request.getPassword()
                .equals(request.getConfirmPassword())) {

            throw new RuntimeException(
                    "Passwords do not match"
            );
        }

        if (request.getPassword().length() < 8) {

            throw new RuntimeException(
                    "Password must contain at least 8 characters"
            );
        }

        PasswordResetToken resetToken =
                passwordResetTokenRepository
                        .findByToken(request.getToken())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid or expired reset link"
                                )
                        );

        if (resetToken.isUsed()) {

            throw new RuntimeException(
                    "This reset link has already been used"
            );
        }

        if (resetToken.getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            throw new RuntimeException(
                    "This reset link has expired"
            );
        }

        String email = resetToken.getEmail();

        Optional<Student> student =
                studentRepository.findByEmail(email);

        if (student.isPresent()) {

            Student existingStudent = student.get();

            existingStudent.setPassword(
                    passwordEncoder.encode(
                            request.getPassword()
                    )
            );

            studentRepository.save(existingStudent);

        } else {

            Optional<Admin> admin =
                    adminRepository.findByEmail(email);

            if (admin.isEmpty()) {

                throw new RuntimeException(
                        "Account not found"
                );
            }

            Admin existingAdmin = admin.get();

            existingAdmin.setPassword(
                    passwordEncoder.encode(
                            request.getPassword()
                    )
            );

            adminRepository.save(existingAdmin);
        }

        resetToken.setUsed(true);

        passwordResetTokenRepository.save(resetToken);
    }
}