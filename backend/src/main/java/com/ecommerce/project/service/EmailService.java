package com.ecommerce.project.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("SabaikoPasal — Password Reset Request");
        message.setText(
                "Hello,\n\n" +
                "You requested a password reset for your SabaikoPasal account.\n\n" +
                "Click the link below to reset your password. This link is valid for 15 minutes:\n\n" +
                resetLink + "\n\n" +
                "If you did not request this, you can safely ignore this email.\n\n" +
                "— SabaikoPasal Team"
        );
        mailSender.send(message);
    }
}
