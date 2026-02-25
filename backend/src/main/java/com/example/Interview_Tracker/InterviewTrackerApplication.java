package com.example.Interview_Tracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class InterviewTrackerApplication {

	public static void main(String[] args) {
		SpringApplication.run(InterviewTrackerApplication.class, args);
	}

}
