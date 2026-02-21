package com.example.Interview_Tracker.dto;

import lombok.Data;

@Data
public class InterviewImportRowDto {
    private String company;
    private String role;
    // ISO-8601 string, e.g. "2026-02-19T18:30:00Z" or "2026-02-19T18:30:00"
    private String interviewDate;
    private String status;
    private String notes;
}