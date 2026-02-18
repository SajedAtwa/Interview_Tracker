package com.example.Interview_Tracker.service;

import com.example.Interview_Tracker.dto.InterviewDtos;
import com.example.Interview_Tracker.model.Interview;
import com.example.Interview_Tracker.model.User;
import com.example.Interview_Tracker.repo.InterviewRepository;
import com.example.Interview_Tracker.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
}