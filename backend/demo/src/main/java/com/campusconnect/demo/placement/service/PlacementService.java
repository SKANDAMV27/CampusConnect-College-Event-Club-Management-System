package com.campusconnect.demo.placement.service;

import com.campusconnect.demo.entity.Student;
import com.campusconnect.demo.repository.StudentRepository;
import com.campusconnect.demo.placement.dto.PlacementDtos.*;
import com.campusconnect.demo.placement.entity.*;
import com.campusconnect.demo.placement.repository.*;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PlacementService {

    private final PlacementDriveRepository driveRepo;
    private final PlacementInvitationRepository invitationRepo;
    private final PlacementRegistrationRepository registrationRepo;
    private final StudentRepository studentRepo;
    private final PlacementEmailService emailService;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    public PlacementService(
            PlacementDriveRepository driveRepo,
            PlacementInvitationRepository invitationRepo,
            PlacementRegistrationRepository registrationRepo,
            StudentRepository studentRepo,
            PlacementEmailService emailService) {

        this.driveRepo = driveRepo;
        this.invitationRepo = invitationRepo;
        this.registrationRepo = registrationRepo;
        this.studentRepo = studentRepo;
        this.emailService = emailService;
    }

    public List<StudentOption> students() {
        return studentRepo.findAll()
                .stream()
                .map(s -> new StudentOption(
                        s.getId(),
                        s.getFullName(),
                        s.getEmail(),
                        s.getUsn(),
                        s.getDepartment(),
                        s.getYear()
                ))
                .toList();
    }

    public List<DriveResponse> adminDrives() {
        return driveRepo.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toDrive)
                .toList();
    }

    public List<DriveResponse> studentDrives(String email) {
        Student student = studentByEmail(email);

        Set<Long> invitedDriveIds =
                invitationRepo.findByStudentId(student.getId())
                        .stream()
                        .map(i -> i.getDrive().getId())
                        .collect(Collectors.toSet());

        return driveRepo.findByPublishedTrueOrderByInterviewAtAsc()
                .stream()
                .filter(d -> invitedDriveIds.contains(d.getId()))
                .map(this::toDrive)
                .toList();
    }

    @Transactional
    public PublishResult createDrive(CreateDriveRequest req) {

        if (req.companyName() == null
                || req.companyName().isBlank()
                || req.jobTitle() == null
                || req.jobTitle().isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Company name and job title are required."
            );
        }

        if (req.salaryMin() != null
                && req.salaryMax() != null
                && req.salaryMin().compareTo(req.salaryMax()) > 0) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Minimum salary cannot exceed maximum salary."
            );
        }

        if (req.registrationDeadline() != null
                && req.registrationDeadline().isBefore(LocalDate.now())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Registration deadline cannot be in the past."
            );
        }

        if (req.selectAllStudents() == false
                && (req.studentIds() == null
                || req.studentIds().isEmpty())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Select at least one student."
            );
        }

        PlacementDrive drive = new PlacementDrive();

        drive.setCompanyName(req.companyName().trim());
        drive.setCompanyWebsite(req.companyWebsite());
        drive.setHrName(req.hrName());
        drive.setHrEmail(req.hrEmail());
        drive.setJobTitle(req.jobTitle().trim());
        drive.setJobDescription(req.jobDescription());
        drive.setLocation(req.location());
        drive.setSalaryMin(req.salaryMin());
        drive.setSalaryMax(req.salaryMax());

        drive.setSalaryCurrency(
                req.salaryCurrency() == null
                        || req.salaryCurrency().isBlank()
                        ? "INR"
                        : req.salaryCurrency()
        );

        drive.setEligibilityDepartments(
                req.eligibilityDepartments());
        drive.setMinimumCgpa(req.minimumCgpa());
        drive.setGraduationYear(req.graduationYear());
        drive.setRegistrationDeadline(
                req.registrationDeadline());
        drive.setInterviewAt(req.interviewAt());
        drive.setInterviewRounds(req.interviewRounds());
        drive.setPublished(req.publish());

        drive = driveRepo.save(drive);

        List<Student> selectedStudents;

        if (req.selectAllStudents()) {
            selectedStudents = studentRepo.findAll();
        } else {
            List<Long> ids = req.studentIds()
                    .stream()
                    .filter(Objects::nonNull)
                    .distinct()
                    .toList();

            selectedStudents = ids.stream()
                    .map(id -> studentRepo.findById(id)
                            .orElseThrow(() ->
                                    new ResponseStatusException(
                                            HttpStatus.BAD_REQUEST,
                                            "Unknown student ID: " + id)))
                    .toList();
        }

        int emailsSent = 0;
        int emailsFailed = 0;

        for (Student student : selectedStudents) {

            PlacementInvitation invitation =
                    new PlacementInvitation();

            invitation.setDrive(drive);
            invitation.setStudentId(student.getId());

            invitationRepo.save(invitation);

            if (drive.isPublished()) {
                if (emailService.sendInvitation(
                        student, drive, frontendUrl)) {
                    emailsSent++;
                } else {
                    emailsFailed++;
                }
            }
        }

        return new PublishResult(
                drive.getId(),
                selectedStudents.size(),
                emailsSent,
                emailsFailed,
                "Placement drive created and invitations saved."
        );
    }

    @Transactional
    public RegistrationResponse register(
            Long driveId, String email) {

        Student student = studentByEmail(email);

        PlacementDrive drive = driveRepo.findById(driveId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Placement drive not found."
                        ));

        if (!drive.isPublished()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This placement drive is not published."
            );
        }

        if (drive.getRegistrationDeadline() != null
                && drive.getRegistrationDeadline()
                .isBefore(LocalDate.now())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Registration deadline has passed."
            );
        }

        if (invitationRepo
                .findByDriveIdAndStudentId(
                        driveId, student.getId())
                .isEmpty()) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not invited to this placement drive."
            );
        }

        if (registrationRepo
                .findByDriveIdAndStudentId(
                        driveId, student.getId())
                .isPresent()) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "You have already registered for this drive."
            );
        }

        PlacementRegistration registration =
                new PlacementRegistration();

        registration.setDrive(drive);
        registration.setStudentId(student.getId());

        registration = registrationRepo.save(registration);

        try {
            emailService.sendRegistrationConfirmation(
                    student, drive, frontendUrl);
        } catch (Exception ignored) {
            // Do not undo a successful registration
            // if the confirmation email cannot be sent.
        }

        return toRegistration(registration, student);
    }

    public List<RegistrationResponse> registrations(
            Long driveId) {

        if (!driveRepo.existsById(driveId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Placement drive not found."
            );
        }

        Map<Long, Student> students =
                studentRepo.findAll()
                        .stream()
                        .collect(Collectors.toMap(
                                Student::getId,
                                s -> s
                        ));

        return registrationRepo
                .findByDriveIdOrderByRegisteredAtDesc(driveId)
                .stream()
                .map(r -> toRegistration(
                        r, students.get(r.getStudentId())))
                .toList();
    }

    @Transactional
    public RegistrationResponse updateRegistration(
            Long driveId,
            Long registrationId,
            UpdateRegistrationRequest req) {

        PlacementRegistration registration =
                registrationRepo.findById(registrationId)
                        .filter(r ->
                                r.getDrive().getId().equals(driveId))
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Registration not found."
                                ));

        Set<String> allowedStatuses = Set.of(
                "REGISTERED",
                "SHORTLISTED",
                "ROUND_1_PASSED",
                "ROUND_1_FAILED",
                "ROUND_2_PASSED",
                "ROUND_2_FAILED",
                "SELECTED",
                "REJECTED",
                "WITHDRAWN"
        );

        if (req.status() == null
                || !allowedStatuses.contains(req.status())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid placement status."
            );
        }

        registration.setStatus(req.status());
        registration.setAdminNotes(req.adminNotes());

        registration = registrationRepo.save(registration);

        Student student = studentRepo
                .findById(registration.getStudentId())
                .orElse(null);

        return toRegistration(registration, student);
    }

    private Student studentByEmail(String email) {
        return studentRepo.findAll()
                .stream()
                .filter(s -> s.getEmail() != null
                        && s.getEmail().equalsIgnoreCase(email))
                .findFirst()
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Student account not found."
                        ));
    }

    private DriveResponse toDrive(PlacementDrive d) {

        long invited = invitationRepo
                .findByDriveId(d.getId()).size();

        long registered = registrationRepo
                .findByDriveIdOrderByRegisteredAtDesc(
                        d.getId()).size();

        return new DriveResponse(
                d.getId(),
                d.getCompanyName(),
                d.getCompanyWebsite(),
                d.getHrName(),
                d.getHrEmail(),
                d.getJobTitle(),
                d.getJobDescription(),
                d.getLocation(),
                d.getSalaryMin(),
                d.getSalaryMax(),
                d.getSalaryCurrency(),
                d.getEligibilityDepartments(),
                d.getMinimumCgpa(),
                d.getGraduationYear(),
                d.getRegistrationDeadline(),
                d.getInterviewAt(),
                d.getInterviewRounds(),
                d.isPublished(),
                invited,
                registered
        );
    }

    private RegistrationResponse toRegistration(
            PlacementRegistration r, Student s) {

        return new RegistrationResponse(
                r.getId(),
                r.getStudentId(),
                s == null ? "Unknown student" : s.getFullName(),
                s == null ? "" : s.getEmail(),
                s == null ? "" : s.getUsn(),
                s == null ? "" : s.getDepartment(),
                s == null ? null : s.getYear(),
                r.getStatus(),
                r.getAdminNotes(),
                r.getRegisteredAt()
        );
    }
}