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

@Service

public class AuthService {

    private final StudentRepository studentRepository;
    private final AdminRepository adminRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(StudentRepository studentRepository, AdminRepository adminRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.studentRepository = studentRepository;
        this.adminRepository = adminRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
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
}