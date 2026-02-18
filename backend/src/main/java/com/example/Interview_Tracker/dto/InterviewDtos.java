package com.example.Interview_Tracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

public class InterviewDtos {

    @Getter
    @Setter
    public static class CreateInterviewRequest {
        @NotBlank
        private String company;

        @NotBlank
        private String role;

        @NotNull
        private Instant interviewDate;

        private String status;
        private String notes;
    }

    @Getter
    @Setter
    public static class UpdateInterviewRequest {
        @NotBlank
        private String company;

        @NotBlank
        private String role;

        @NotNull
        private Instant interviewDate;

        private String status;
        private String notes;
    }

    @Getter
    @Setter
    public static class InterviewResponse {
        private UUID id;
        private String company;
        private String role;
        private Instant interviewDate;
        private String status;
        private String notes;
    }
}