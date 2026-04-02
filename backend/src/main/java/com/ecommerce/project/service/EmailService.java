package com.ecommerce.project.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.from}")
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

    @Async
    public void sendWelcomeEmail(String to, String username) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(fromEmail);
            msg.setTo(to);
            msg.setSubject("Welcome to SabaikoPasal!");
            msg.setText(
                    "Namaste " + username + ",\n\n" +
                    "Welcome to SabaikoPasal — your one-stop destination for quality products in Nepal.\n\n" +
                    "Your account has been created successfully. Start shopping now!\n\n" +
                    "SabaikoPasal Team");
            mailSender.send(msg);
        } catch (Exception e) {
            log.error("Welcome email failed: {}", e.getMessage());
        }
    }

    @Async
    public void sendOrderConfirmationToCustomer(String to, String username, Long orderId, Double totalAmount) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(fromEmail);
            msg.setTo(to);
            msg.setSubject("Order Confirmed — #" + orderId);
            msg.setText(
                    "Namaste " + username + ",\n\n" +
                    "Your order #" + orderId + " has been placed successfully!\n\n" +
                    "Total Amount: Rs. " + totalAmount +
                    "\nStatus: Placed\n\n" +
                    "We will notify you when your order ships.\n\n" +
                    "Thank you for shopping with SabaikoPasal!");
            mailSender.send(msg);
        } catch (Exception e) {
            log.error("Order confirmation email failed: {}", e.getMessage());
        }
    }

    @Async
    public void sendNewOrderNotificationToSeller(String sellerEmail, String sellerName, Long orderId,
                                                  String productName, Integer quantity, Double amount) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(fromEmail);
            msg.setTo(sellerEmail);
            msg.setSubject("New Order Received — #" + orderId);
            msg.setText(
                    "Namaste " + sellerName + ",\n\n" +
                    "You have received a new order!\n\n" +
                    "Order ID: #" + orderId + "\n" +
                    "Product: " + productName + "\n" +
                    "Quantity: " + quantity + "\n" +
                    "Amount: Rs. " + amount + "\n\n" +
                    "Please log in to your seller panel to process this order.\n\n" +
                    "SabaikoPasal Team");
            mailSender.send(msg);
        } catch (Exception e) {
            log.error("Seller notification email failed: {}", e.getMessage());
        }
    }

    @Async
    public void sendOrderStatusUpdateToCustomer(String to, String username, Long orderId, String newStatus) {
        try {
            String statusMessage;
            if (newStatus.equals("Delivered")) {
                statusMessage =
                        "Your order has been delivered. We hope you enjoy your purchase! " +
                        "Please consider leaving a review.";
            } else if (newStatus.equals("Shipped")) {
                statusMessage = "Your order is on the way!";
            } else if (newStatus.equals("Out for Delivery")) {
                statusMessage = "Your order is out for delivery. Expect it today!";
            } else {
                statusMessage = "You can track your order in your profile.";
            }
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(fromEmail);
            msg.setTo(to);
            msg.setSubject("Order #" + orderId + " — Status Updated to " + newStatus);
            msg.setText(
                    "Namaste " + username + ",\n\n" +
                    "Your order #" + orderId + " status has been updated to: " + newStatus + "\n\n" +
                    statusMessage + "\n\n" +
                    "SabaikoPasal Team");
            mailSender.send(msg);
        } catch (Exception e) {
            log.error("Status update email failed: {}", e.getMessage());
        }
    }

    @Async
    public void sendPasswordChangedEmail(String to, String username) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(fromEmail);
            msg.setTo(to);
            msg.setSubject("Password Changed — SabaikoPasal");
            msg.setText(
                    "Namaste " + username + ",\n\n" +
                    "Your password has been changed successfully.\n\n" +
                    "If you did not make this change, please reset your password immediately using Forgot Password.\n\n" +
                    "SabaikoPasal Team");
            mailSender.send(msg);
        } catch (Exception e) {
            log.error("Password changed email failed: {}", e.getMessage());
        }
    }
}
