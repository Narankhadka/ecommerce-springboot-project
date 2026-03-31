package com.ecommerce.project.controller;

import com.ecommerce.project.model.AppRole;
import com.ecommerce.project.model.PasswordResetToken;
import com.ecommerce.project.model.User;
import com.ecommerce.project.repositories.PasswordResetTokenRepository;
import com.ecommerce.project.repositories.UserRepository;
import com.ecommerce.project.service.EmailService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class ForgotPasswordController {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Value("${frontend.url}")
    private String frontendUrl;

    public ForgotPasswordController(UserRepository userRepository,
                                    PasswordResetTokenRepository tokenRepository,
                                    EmailService emailService,
                                    PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * POST /api/auth/forgot-password
     * Body: { "email": "...", "role": "user" | "seller" | "admin" }
     *
     * Finds the user by email, verifies they hold the requested role,
     * then sends a password-reset link to their email address.
     * Always returns the same success message to prevent email enumeration.
     */
    @PostMapping("/forgot-password")
    @Transactional
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String roleStr = body.get("role");

        // Always respond the same way — don't leak whether the email exists
        Map<String, String> okResponse = Map.of(
                "message", "If that email is registered, a reset link has been sent."
        );

        if (email == null || email.isBlank() || roleStr == null || roleStr.isBlank()) {
            return ResponseEntity.ok(okResponse);
        }

        Optional<User> userOpt = userRepository.findByEmail(email.trim().toLowerCase());
        if (userOpt.isEmpty()) {
            return ResponseEntity.ok(okResponse);
        }

        User user = userOpt.get();

        // Verify the user actually has the requested role
        AppRole appRole = switch (roleStr.trim().toLowerCase()) {
            case "seller" -> AppRole.ROLE_SELLER;
            case "admin"  -> AppRole.ROLE_ADMIN;
            default       -> AppRole.ROLE_USER;
        };

        boolean hasRole = user.getRoles().stream()
                .anyMatch(r -> r.getRoleName() == appRole);

        if (!hasRole) {
            return ResponseEntity.ok(okResponse);
        }

        // Invalidate any existing token for this user before creating a new one
        tokenRepository.deleteByUser(user);

        // Create a new 15-minute token
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(UUID.randomUUID().toString());
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(15));
        tokenRepository.save(resetToken);

        String resetLink = frontendUrl + "/reset-password?token=" + resetToken.getToken();
        emailService.sendPasswordResetEmail(user.getEmail(), resetLink);

        return ResponseEntity.ok(okResponse);
    }

    /**
     * POST /api/auth/reset-password
     * Body: { "token": "...", "newPassword": "..." }
     *
     * Validates the token, updates the user's password, and deletes the token.
     */
    @PostMapping("/reset-password")
    @Transactional
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");

        if (token == null || token.isBlank() || newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Token and new password are required."));
        }

        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token.trim());
        if (tokenOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired reset token."));
        }

        PasswordResetToken resetToken = tokenOpt.get();
        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            return ResponseEntity.badRequest().body(Map.of("message", "Reset token has expired. Please request a new one."));
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(resetToken);

        return ResponseEntity.ok(Map.of("message", "Password reset successfully. You can now log in."));
    }
}
