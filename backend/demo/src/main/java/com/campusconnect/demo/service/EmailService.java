package com.campusconnect.demo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public void sendPasswordResetEmail(
            String email,
            String token
    ) {

        String resetLink =
                frontendUrl + "/reset-password?token=" + token;

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject(
                "CampusConnect - Reset Your Password"
        );

        message.setText(
                "Hello,\n\n"
                        + "We received a request to reset your CampusConnect password.\n\n"
                        + "Click the link below to create a new password:\n\n"
                        + resetLink
                        + "\n\n"
                        + "This link will expire in 15 minutes.\n\n"
                        + "If you did not request a password reset, "
                        + "you can safely ignore this email.\n\n"
                        + "Regards,\n"
                        + "CampusConnect Team"
        );

        mailSender.send(message);
    }
}