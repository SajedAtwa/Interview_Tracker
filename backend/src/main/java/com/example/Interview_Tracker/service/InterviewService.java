package com.example.Interview_Tracker.service;

import com.example.Interview_Tracker.dto.InterviewDtos;
import com.example.Interview_Tracker.dto.InterviewImportRowDto;
import com.example.Interview_Tracker.model.Interview;
import com.example.Interview_Tracker.model.User;
import com.example.Interview_Tracker.repo.InterviewRepository;
import com.example.Interview_Tracker.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final UserRepository userRepository;

    public InterviewDtos.InterviewResponse create(UUID userId, InterviewDtos.CreateInterviewRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));

        Interview interview = Interview.builder()
                .user(user)
                .company(req.getCompany())
                .role(req.getRole())
                .interviewDate(req.getInterviewDate())
                .status(req.getStatus() == null ? "Scheduled" : req.getStatus())
                .notes(req.getNotes())
                .build();

        Interview saved = interviewRepository.save(interview);
        return toResponse(saved);
    }

    public List<InterviewDtos.InterviewResponse> list(UUID userId) {
        return interviewRepository.findAllByUserIdOrderByInterviewDateDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public InterviewDtos.InterviewResponse get(UUID userId, UUID interviewId) {
        Interview interview = interviewRepository.findByIdAndUserId(interviewId, userId)
                .orElseThrow(() -> new RuntimeException("Interview not found."));
        return toResponse(interview);
    }

    public InterviewDtos.InterviewResponse update(UUID userId, UUID interviewId, InterviewDtos.UpdateInterviewRequest req) {
        Interview interview = interviewRepository.findByIdAndUserId(interviewId, userId)
                .orElseThrow(() -> new RuntimeException("Interview not found."));

        interview.setCompany(req.getCompany());
        interview.setRole(req.getRole());
        interview.setInterviewDate(req.getInterviewDate());
        interview.setStatus(req.getStatus() == null ? "Scheduled" : req.getStatus());
        interview.setNotes(req.getNotes());

        Interview saved = interviewRepository.save(interview);
        return toResponse(saved);
    }

    public void delete(UUID userId, UUID interviewId) {
        Interview interview = interviewRepository.findByIdAndUserId(interviewId, userId)
                .orElseThrow(() -> new RuntimeException("Interview not found."));
        interviewRepository.delete(interview);
    }

    private InterviewDtos.InterviewResponse toResponse(Interview i) {
        InterviewDtos.InterviewResponse r = new InterviewDtos.InterviewResponse();
        r.setId(i.getId());
        r.setCompany(i.getCompany());
        r.setRole(i.getRole());
        r.setInterviewDate(i.getInterviewDate());
        r.setStatus(i.getStatus());
        r.setNotes(i.getNotes());
        return r;
    }

    public int importRows(UUID userId, List<InterviewImportRowDto> rows) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));

        List<Interview> toSave = new ArrayList<>();

        for (InterviewImportRowDto r : rows) {

            // Normalize required fields
            String company = nullToNull(r.getCompany());
            String role = nullToNull(r.getRole());

            // Hard skip rows missing REQUIRED fields (company + role)
            // (Your entity has nullable=false for both)
            if (isBlank(company) || isBlank(role)) {
                continue;
            }

            Instant interviewInstant;

            // interviewDate is nullable=false in your entity, so we must always set it.
            if (!isBlank(r.getInterviewDate())) {
                try {
                    interviewInstant = Instant.parse(r.getInterviewDate().trim());
                } catch (Exception e) {
                    // bad date -> default to now (or you can choose a fixed value)
                    interviewInstant = Instant.now();
                }
            } else {
                // missing date -> default to now
                interviewInstant = Instant.now();
            }

            Interview interview = Interview.builder()
                    .user(user)
                    .company(company.trim())
                    .role(role.trim())
                    .interviewDate(interviewInstant)
                    .status(isBlank(r.getStatus()) ? "Scheduled" : r.getStatus().trim())
                    .notes(nullToEmpty(r.getNotes()))
                    .build();

            toSave.add(interview);
        }

        interviewRepository.saveAll(toSave);
        return toSave.size();
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    // returns null if blank, otherwise original string
    private String nullToNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }

    private String nullToEmpty(String s) {
        return s == null ? "" : s.trim();
    }
}