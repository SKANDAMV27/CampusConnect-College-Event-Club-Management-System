package com.campusconnect.demo.controller;

import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatbotController {

    @PostMapping("/message")
    public ResponseEntity<?> chat(
            @RequestBody ChatbotRequest request
    ) {

        String message =
                request.getMessage() == null
                        ? ""
                        : request.getMessage()
                        .trim()
                        .toLowerCase();

        String response;

        if (message.isEmpty()) {

            response =
                    "Please type a question.";

        } else if (
                message.contains("hello") ||
                        message.contains("hi") ||
                        message.contains("hey")
        ) {

            response =
                    "Hello! 👋 I'm the CampusConnect Assistant. " +
                            "I can help you with events, clubs, registrations, " +
                            "announcements and your student account.";

        } else if (
                message.contains("event") &&
                        (
                                message.contains("upcoming") ||
                                        message.contains("available") ||
                                        message.contains("show")
                        )
        ) {

            response =
                    "You can view all available events from the " +
                            "Events section of CampusConnect.";

        } else if (
                message.contains("register") &&
                        message.contains("event")
        ) {

            response =
                    "To register for an event, open the Events page, " +
                            "select the event you want, and click the " +
                            "Register button.";

        } else if (
                message.contains("club")
        ) {

            response =
                    "You can view available campus clubs from the " +
                            "Clubs section.";

        } else if (
                message.contains("registration")
        ) {

            response =
                    "You can view your registered events from " +
                            "My Registrations.";

        } else if (
                message.contains("cancel")
        ) {

            response =
                    "To cancel an event registration, open " +
                            "My Registrations, select the registration, " +
                            "and use the Cancel option.";

        } else if (
                message.contains("profile")
        ) {

            response =
                    "You can update your name, year and department " +
                            "from your Profile page.";

        } else if (
                message.contains("password") ||
                        message.contains("forgot")
        ) {

            response =
                    "If you forgot your password, use the " +
                            "Forgot Password option on the Login page.";

        } else if (
                message.contains("announcement")
        ) {

            response =
                    "Campus announcements are published by administrators. " +
                            "Check the Announcements section for the latest updates.";

        } else {

            response =
                    "I'm not sure about that yet. You can ask me about " +
                            "events, clubs, registrations, announcements, " +
                            "your profile or account help.";

        }

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        response
                )
        );
    }

    @Data
    public static class ChatbotRequest {

        private String message;
    }
}