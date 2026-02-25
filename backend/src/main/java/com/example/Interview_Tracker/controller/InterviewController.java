package com.example.Interview_Tracker.controller;

import com.example.Interview_Tracker.dto.InterviewDtos;
import com.example.Interview_Tracker.service.InterviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.example.Interview_Tracker.dto.InterviewImportRowDto;
import java.util.Map;

import java.util.List;
import java.util.UUID;
import com.example.Interview_Tracker.service.ReminderJob;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;
    private final ReminderJob reminderJob;
    private UUID userId(Authentication auth) {
        return (UUID) auth.getPrincipal();
    }

    @PostMapping
    public InterviewDtos.InterviewResponse create(Authentication auth,
                                                  @Valid @RequestBody InterviewDtos.CreateInterviewRequest req) {
        return interviewService.create(userId(auth), req);
    }

    @GetMapping
    public List<InterviewDtos.InterviewResponse> list(Authentication auth) {
        return interviewService.list(userId(auth));
    }

    @GetMapping("/{id}")
    public InterviewDtos.InterviewResponse get(Authentication auth, @PathVariable UUID id) {
        return interviewService.get(userId(auth), id);
    }

    @PutMapping("/{id}")
    public InterviewDtos.InterviewResponse update(Authentication auth,
                                                  @PathVariable UUID id,
                                                  @Valid @RequestBody InterviewDtos.UpdateInterviewRequest req) {
        return interviewService.update(userId(auth), id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(Authentication auth, @PathVariable UUID id) {
        interviewService.delete(userId(auth), id);
    }

    @PostMapping("/import")
    public Map<String, Object> importInterviews(
            Authentication auth,
            @Valid @RequestBody List<InterviewImportRowDto> rows
    ) {
        int imported = interviewService.importRows(userId(auth), rows);
        return Map.of("imported", imported);
    }

    @PostMapping("/test-email")
    public Map<String, String> testEmail(Authentication auth) {
        // sends to the logged-in user's email
        // (so you don't hardcode yours)
        reminderJob.testManual("sajedatwa78@gmail.com"); // OR fetch from DB if you want
        return Map.of("status", "Triggered test email");
    }
}