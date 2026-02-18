package com.example.Interview_Tracker.repo;

import com.example.Interview_Tracker.model.Interview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InterviewRepository extends JpaRepository<Interview, UUID> {
    List<Interview> findAllByUserIdOrderByInterviewDateDesc(UUID userId);
    Optional<Interview> findByIdAndUserId(UUID id, UUID userId);
}
