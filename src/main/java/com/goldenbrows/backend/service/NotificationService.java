package com.goldenbrows.backend.service;

import com.goldenbrows.backend.model.Appointment;
import com.goldenbrows.backend.model.BlogComment;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

//    private final JavaMailSender mailSender;
//
//    @Value("${app.notifications.to:}")
//    private String notificationTo;
//
//    @Value("${app.notifications.from:}")
//    private String fromAddress;
//
//    private void send(SimpleMailMessage message) {
//        if (notificationTo == null || notificationTo.isBlank()) {
//            return; // if you didn't configure, just skip
//        }
//        try {
//            if (fromAddress != null && !fromAddress.isBlank()) {
//                message.setFrom(fromAddress);
//            }
//            message.setTo(notificationTo);
//            mailSender.send(message);
//        } catch (Exception ex) {
//            // don't break the app if email fails
//            System.err.println("Failed to send email: " + ex.getMessage());
//        }
//    }
//
//    public void sendAppointmentCreated(Appointment appt) {
//        SimpleMailMessage msg = new SimpleMailMessage();
//        msg.setSubject("New booking from " + appt.getCustomerName());
//
//        StringBuilder body = new StringBuilder();
//        body.append("New appointment booked:\n\n");
//        body.append("Name: ").append(appt.getCustomerName()).append("\n");
//        body.append("Phone: ").append(appt.getPhone()).append("\n");
//        if (appt.getEmail() != null) {
//            body.append("Email: ").append(appt.getEmail()).append("\n");
//        }
//        if (appt.getService() != null) {
//            body.append("Service: ").append(appt.getService().getName()).append("\n");
//        }
//        body.append("When: ").append(appt.getAppointmentTime()).append("\n");
//        if (appt.getEmployee() != null) {
//            body.append("Staff: ")
//                .append(appt.getEmployee().getDisplayName() != null
//                        ? appt.getEmployee().getDisplayName()
//                        : appt.getEmployee().getFullName())
//                .append("\n");
//        }
//        if (appt.getNotes() != null && !appt.getNotes().isBlank()) {
//            body.append("Notes: ").append(appt.getNotes()).append("\n");
//        }
//
//        msg.setText(body.toString());
//        send(msg);
//    }
//
//    public void sendNewComment(BlogComment comment) {
//        SimpleMailMessage msg = new SimpleMailMessage();
//        msg.setSubject("New blog comment from " + comment.getAuthorName());
//
//        StringBuilder body = new StringBuilder();
//        if (comment.getPost() != null) {
//            body.append("Post: ")
//                .append(comment.getPost().getTitle())
//                .append(" (slug: ")
//                .append(comment.getPost().getSlug())
//                .append(")\n\n");
//        }
//        body.append("Name: ").append(comment.getAuthorName()).append("\n\n");
//        body.append(comment.getContent());
//        msg.setText(body.toString());
//
//        send(msg);
//    }
//}
	// No JavaMailSender, no @Value, no Lombok constructor

    public void sendAppointmentCreated(Appointment appt) {
        // Just log to console for now
        StringBuilder body = new StringBuilder();
        body.append("\n=== New appointment booked ===\n");
        body.append("Name: ").append(appt.getCustomerName()).append("\n");
        body.append("Phone: ").append(appt.getPhone()).append("\n");
        if (appt.getEmail() != null) {
            body.append("Email: ").append(appt.getEmail()).append("\n");
        }
        if (appt.getService() != null) {
            body.append("Service: ").append(appt.getService().getName()).append("\n");
        }
        body.append("When: ").append(appt.getAppointmentTime()).append("\n");
        if (appt.getEmployee() != null) {
            body.append("Staff: ")
                    .append(appt.getEmployee().getDisplayName() != null
                            ? appt.getEmployee().getDisplayName()
                            : appt.getEmployee().getFullName())
                    .append("\n");
        }
        if (appt.getNotes() != null && !appt.getNotes().isBlank()) {
            body.append("Notes: ").append(appt.getNotes()).append("\n");
        }
        body.append("================================\n");

        System.out.println(body);
    }

    public void sendNewComment(BlogComment comment) {
        StringBuilder body = new StringBuilder();
        body.append("\n=== New blog comment ===\n");
        if (comment.getPost() != null) {
            body.append("Post: ")
                    .append(comment.getPost().getTitle())
                    .append(" (slug: ").append(comment.getPost().getSlug()).append(")\n");
        }
        body.append("Name: ").append(comment.getAuthorName()).append("\n");
        body.append("Comment: ").append(comment.getContent()).append("\n");
        if (comment.getAdminReply() != null && !comment.getAdminReply().isBlank()) {
            body.append("Admin reply: ").append(comment.getAdminReply()).append("\n");
        }
        body.append("================================\n");

        System.out.println(body);
    }
}
