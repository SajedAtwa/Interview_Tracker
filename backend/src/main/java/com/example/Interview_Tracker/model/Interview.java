package com.example.Interview_Tracker.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "interviews")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Interview {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 120)
    private String company;

    @Column(nullable = false, length = 120)
    private String role;

    @Column(nullable = false)
    private Instant interviewDate;

    @Column(length = 40)
    private String status; // Scheduled, Completed, Rejected, Offer, etc.

    @Column(length = 2000)
    private String notes;

    @Column
    private Instant reminderSentAt;
}
