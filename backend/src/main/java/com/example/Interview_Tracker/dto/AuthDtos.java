package com.example.Interview_Tracker.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

public class AuthDtos {

    @Getter @Setter
    public static class RegisterRequest {
        @Email @NotBlank
        private String email;

        @NotBlank
        private String password;
    }

    @Getter @Setter
    public static class LoginRequest {
        @Email @NotBlank
        private String email;

        @NotBlank
        private String password;
    }

    @Getter @AllArgsConstructor
    public static class AuthResponse {
        private String token;
    }
}
