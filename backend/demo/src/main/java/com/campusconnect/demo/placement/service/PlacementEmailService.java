package com.campusconnect.demo.placement.service;

import com.campusconnect.demo.entity.Student;
import com.campusconnect.demo.placement.entity.PlacementDrive;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class PlacementEmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String from;

    public PlacementEmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public boolean sendInvitation(
            Student student,
            PlacementDrive drive,
            String frontendUrl) {

        if (student.getEmail() == null ||
                student.getEmail().isBlank()) {
            return false;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();

            if (from != null && !from.isBlank()) {
                message.setFrom(from);
            }

            message.setTo(student.getEmail());

            message.setSubject(
                    "Campus placement invitation: "
                            + drive.getCompanyName());

            message.setText(
                    "Hello " + student.getFullName() + ",\n\n"
                            + "You have been invited to a campus placement drive.\n\n"
                            + "Company: " + drive.getCompanyName() + "\n"
                            + "Job role: " + drive.getJobTitle() + "\n"
                            + "Location: " + safe(drive.getLocation()) + "\n"
                            + "Minimum package: " + safe(drive.getSalaryMin()) + "\n"
                            + "Maximum package: " + safe(drive.getSalaryMax()) + "\n"
                            + "Registration deadline: "
                            + safe(drive.getRegistrationDeadline()) + "\n"
                            + "Interview date: " + safe(drive.getInterviewAt()) + "\n"
                            + "Interview rounds: "
                            + safe(drive.getInterviewRounds()) + "\n\n"
                            + safe(drive.getJobDescription()) + "\n\n"
                            + "Log in to CampusConnect to register:\n"
                            + frontendUrl + "\n\n"
                            + "Regards,\nCampusConnect Placement Cell"
            );

            mailSender.send(message);
            return true;

        } catch (Exception exception) {
            return false;
        }
    }

    public void sendRegistrationConfirmation(
            Student student,
            PlacementDrive drive,
            String frontendUrl) {

        if (student.getEmail() == null ||
                student.getEmail().isBlank()) {
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();

        if (from != null && !from.isBlank()) {
            message.setFrom(from);
        }

        message.setTo(student.getEmail());

        message.setSubject(
                "Registration confirmed: " + drive.getCompanyName());

        message.setText(
                "Hello " + student.getFullName() + ",\n\n"
                        + "Your registration for "
                        + drive.getCompanyName() + " - "
                        + drive.getJobTitle() + " is confirmed.\n\n"
                        + "Interview date: " + safe(drive.getInterviewAt())
                        + "\n\n"
                        + "CampusConnect Placement Cell\n"
                        + frontendUrl + "/placements"
        );

        mailSender.send(message);
    }

    private String safe(Object value) {
        return value == null
                ? "Not specified"
                : value.toString();
    }
}