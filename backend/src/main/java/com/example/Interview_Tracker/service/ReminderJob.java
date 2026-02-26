package com.example.Interview_Tracker.service;

import com.example.Interview_Tracker.model.Interview;
import com.example.Interview_Tracker.repo.InterviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class ReminderJob {

    private final InterviewRepository interviewRepository;
    private final EmailService emailService;

    private static final DateTimeFormatter FMT =
            DateTimeFormatter.ofPattern("EEE, MMM d yyyy 'at' h:mm a z")
                    .withZone(ZoneId.systemDefault());

    // runs every 5 minutes
    @Transactional
    @Scheduled(fixedDelay = 300_000)
    public void send24HourReminders() {
        Instant now = Instant.now();

        // window = interviews happening 24h-24h5m from now (approx)
        Instant start = now.plusSeconds(24 * 3600);
        Instant end = start.plusSeconds(60 * 60);

        log.info("ReminderJob tick. now={} window=[{}, {})", now, start, end);

        List<Interview> due = interviewRepository
            .findByInterviewDateBetweenAndReminderSentAtIsNull(start, end);

        log.info("ReminderJob found {} due interviews", due.size());

        for (Interview it : due) {
            String to = it.getUser().getEmail(); // users already have email
            String subject = "Interview Reminder: " + it.getCompany() + " — " + it.getRole();

            String body =
                    "Reminder: You have an interview coming up.\n\n" +
                    "Company: " + it.getCompany() + "\n" +
                    "Role: " + it.getRole() + "\n" +
                    "When: " + FMT.format(it.getInterviewDate()) + "\n\n" +
                    (it.getNotes() != null && !it.getNotes().isBlank()
                            ? "Notes:\n" + it.getNotes() + "\n\n"
                            : "") +
                    "— Interview Tracker";

            emailService.sendInterviewReminder(to, subject, body);

            it.setReminderSentAt(Instant.now());
            interviewRepository.save(it);
        }
    }

    // manual test trigger (does not touch DB)
    public void testManual(String to) {
        String subject = "Test Reminder: Interview Tracker";
        String body = "If you received this, Brevo SMTP is working ✅";
        emailService.sendInterviewReminder(to, subject, body);
    }
}