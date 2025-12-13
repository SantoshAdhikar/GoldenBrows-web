package com.goldenbrows.backend.service;

import com.goldenbrows.backend.model.Appointment;
import com.goldenbrows.backend.model.BlogComment;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.time.format.DateTimeFormatter;

/**
 * Notification service that supports both console logging and email
 * Email is OPTIONAL - it will work fine without email configuration
 */
@Service
@Slf4j
public class NotificationService {

    // Optional - only injected if spring-boot-starter-mail is added
    private JavaMailSender mailSender;

    @Value("${app.notification.from-email:}")
    private String fromEmail;

    @Value("${app.notification.to-email:}")
    private String toEmail;

    @Value("${app.notification.customer-emails-enabled:false}")
    private boolean customerEmailsEnabled;

    @Value("${app.notification.console-enabled:true}")
    private boolean consoleEnabled;

    @Value("${app.business.name:Golden Brows}")
    private String businessName;

    @Value("${app.business.phone:+1-555-123-4567}")
    private String businessPhone;

    @Value("${app.business.address:123 Beauty Street, Los Angeles, CA}")
    private String businessAddress;

    // Constructor that accepts optional JavaMailSender
    public NotificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // Default constructor for when mail is not configured
    public NotificationService() {
        this.mailSender = null;
    }

    @PostConstruct
    public void init() {
        if (mailSender != null && customerEmailsEnabled) {
            log.info("✅ Email notifications ENABLED");
        } else if (mailSender == null) {
            log.info("📧 Email notifications DISABLED (no mail configuration)");
        } else {
            log.info("📧 Email notifications DISABLED (set app.notification.customer-emails-enabled=true to enable)");
        }
        
        if (consoleEnabled) {
            log.info("📝 Console logging ENABLED");
        }
    }

    /**
     * Send appointment confirmation to customer
     */
    public void sendAppointmentCreated(Appointment appointment) {
        // Always log to console if enabled
        if (consoleEnabled) {
            logAppointmentToConsole(appointment);
        }

        // Send email to customer if enabled
        if (customerEmailsEnabled && mailSender != null) {
            try {
                sendCustomerConfirmationEmail(appointment);
            } catch (Exception e) {
                log.error("Failed to send customer confirmation email", e);
            }
        }

        // Send notification email to business owner if configured
        if (toEmail != null && !toEmail.isBlank() && mailSender != null) {
            try {
                sendBusinessNotificationEmail(appointment);
            } catch (Exception e) {
                log.error("Failed to send business notification email", e);
            }
        }
    }

    /**
     * Log appointment to console (your current implementation)
     */
    private void logAppointmentToConsole(Appointment appt) {
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

    /**
     * Send beautiful confirmation email to customer
     */
    private void sendCustomerConfirmationEmail(Appointment appointment) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(appointment.getEmail());
        message.setSubject("✨ Your Appointment at " + businessName + " is Confirmed!");
        message.setText(buildCustomerEmailBody(appointment));

        mailSender.send(message);
        log.info("✅ Customer confirmation email sent to {}", appointment.getEmail());
    }

    /**
     * Send notification email to business owner
     */
    private void sendBusinessNotificationEmail(Appointment appointment) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("🔔 New Booking: " + appointment.getCustomerName());
        message.setText(buildBusinessNotificationBody(appointment));

        mailSender.send(message);
        log.info("✅ Business notification email sent to {}", toEmail);
    }

    /**
     * Build beautiful email for customer
     */
    private String buildCustomerEmailBody(Appointment appointment) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("EEEE, MMMM dd, yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("h:mm a");

        String date = appointment.getAppointmentTime().format(dateFormatter);
        String time = appointment.getAppointmentTime().format(timeFormatter);

        StringBuilder body = new StringBuilder();
        body.append("Dear ").append(appointment.getCustomerName()).append(",\n\n");
        body.append("🎉 Thank you for booking with us! We're excited to see you.\n\n");
        body.append("Your appointment has been confirmed:\n\n");
        body.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        body.append("📅 Date: ").append(date).append("\n");
        body.append("🕐 Time: ").append(time).append("\n");
        
        if (appointment.getService() != null) {
            body.append("💅 Service: ").append(appointment.getService().getName()).append("\n");
            body.append("💰 Price: $").append(appointment.getService().getPrice()).append("\n");
            body.append("⏱️ Duration: ").append(appointment.getService().getDurationMinutes()).append(" minutes\n");
        }
        
        if (appointment.getEmployee() != null) {
            String staffName = appointment.getEmployee().getDisplayName() != null 
                ? appointment.getEmployee().getDisplayName() 
                : appointment.getEmployee().getFullName();
            body.append("👤 Staff: ").append(staffName).append("\n");
        }
        
        body.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
        
        if (appointment.getNotes() != null && !appointment.getNotes().isBlank()) {
            body.append("📝 Your notes: ").append(appointment.getNotes()).append("\n\n");
        }
        
        body.append("💖 You are our lovely customer and we can't wait to see you soon!\n\n");
        body.append("IMPORTANT REMINDERS:\n");
        body.append("• Please arrive 5-10 minutes early\n");
        body.append("• If you need to cancel or reschedule, please call us at ").append(businessPhone).append("\n");
        body.append("• Cancellations less than 24 hours in advance may incur a fee\n\n");
        body.append("Our Location:\n");
        body.append(businessAddress).append("\n\n");
        body.append("Questions? Reply to this email or call us at ").append(businessPhone).append("\n\n");
        body.append("Thank you for choosing ").append(businessName).append("!\n\n");
        body.append("With love,\n");
        body.append("The ").append(businessName).append(" Team 💕\n");

        return body.toString();
    }

    /**
     * Build notification email for business owner
     */
    private String buildBusinessNotificationBody(Appointment appointment) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("EEEE, MMMM dd, yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("h:mm a");

        String date = appointment.getAppointmentTime().format(dateFormatter);
        String time = appointment.getAppointmentTime().format(timeFormatter);

        StringBuilder body = new StringBuilder();
        body.append("New appointment booking received:\n\n");
        body.append("Customer: ").append(appointment.getCustomerName()).append("\n");
        body.append("Phone: ").append(appointment.getPhone()).append("\n");
        body.append("Email: ").append(appointment.getEmail()).append("\n\n");
        body.append("Date: ").append(date).append("\n");
        body.append("Time: ").append(time).append("\n");
        
        if (appointment.getService() != null) {
            body.append("Service: ").append(appointment.getService().getName()).append("\n");
            body.append("Price: $").append(appointment.getService().getPrice()).append("\n");
        }
        
        if (appointment.getEmployee() != null) {
            String staffName = appointment.getEmployee().getDisplayName() != null 
                ? appointment.getEmployee().getDisplayName() 
                : appointment.getEmployee().getFullName();
            body.append("Staff: ").append(staffName).append("\n");
        }
        
        if (appointment.getNotes() != null && !appointment.getNotes().isBlank()) {
            body.append("\nNotes: ").append(appointment.getNotes()).append("\n");
        }

        return body.toString();
    }

    /**
     * Send blog comment notification (your existing implementation)
     */
    public void sendNewComment(BlogComment comment) {
        if (consoleEnabled) {
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

        // Send email notification to business if configured
        if (toEmail != null && !toEmail.isBlank() && mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(toEmail);
                message.setSubject("New blog comment from " + comment.getAuthorName());
                
                StringBuilder emailBody = new StringBuilder();
                if (comment.getPost() != null) {
                    emailBody.append("Post: ")
                        .append(comment.getPost().getTitle())
                        .append(" (slug: ")
                        .append(comment.getPost().getSlug())
                        .append(")\n\n");
                }
                emailBody.append("Name: ").append(comment.getAuthorName()).append("\n\n");
                emailBody.append(comment.getContent());
                
                message.setText(emailBody.toString());
                mailSender.send(message);
            } catch (Exception e) {
                log.error("Failed to send comment notification email", e);
            }
        }
    }
}