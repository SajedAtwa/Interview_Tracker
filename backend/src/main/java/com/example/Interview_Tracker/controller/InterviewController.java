package com.example.Interview_Tracker.controller;

import com.example.Interview_Tracker.dto.InterviewDtos;
import com.example.Interview_Tracker.service.InterviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;

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
}