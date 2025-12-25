// src/components/SuccessMessageModal.js
// ✅ FIXED - Properly displays date and time (no more "Invalid Date")

import React from "react";
import { useNavigate } from "react-router-dom";

export default function SuccessMessageModal({
  isOpen,
  onClose,
  customerName,
  appointmentDate,
  appointmentTime,
}) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  // ✅ FIX: Format date properly
  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date";
    
    try {
      // dateString is in format "YYYY-MM-DD" from date input
      const date = new Date(dateString + 'T00:00:00'); // Add time to avoid timezone issues
      
      // Format as "Monday, January 15, 2025"
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString; // Return original if formatting fails
    }
  };

  // ✅ FIX: Format time properly
  const formatTime = (timeString) => {
    if (!timeString) return "Invalid Time";
    
    try {
      // timeString is in format "HH:MM" (24-hour) from time input
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const min = parseInt(minutes, 10);
      
      // Convert to 12-hour format
      const period = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      const minStr = min.toString().padStart(2, '0');
      
      return `${hour12}:${minStr} ${period}`;
    } catch (error) {
      console.error("Time formatting error:", error);
      return timeString; // Return original if formatting fails
    }
  };

  const formattedDate = formatDate(appointmentDate);
  const formattedTime = formatTime(appointmentTime);

  const handleGoHome = () => {
    onClose();
    navigate("/");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        style={overlayStyle}
        onClick={onClose}
      />

      {/* Modal */}
      <div style={modalStyle}>
        {/* Success Icon */}
        <div style={iconContainerStyle}>
          <div style={checkmarkCircleStyle}>
            <span style={checkmarkStyle}>✓</span>
          </div>
        </div>

        {/* Title */}
        <h2 style={titleStyle}>
          Appointment Confirmed! 🎉
        </h2>

        {/* Thank you message */}
        <p style={thankYouStyle}>
          Thank you, {customerName}!
        </p>

        {/* Confirmation text */}
        <p style={messageStyle}>
          Your appointment request has been successfully submitted.
        </p>

        {/* Appointment Details Card */}
        <div style={detailsCardStyle}>
          <div style={detailsHeaderStyle}>YOUR APPOINTMENT</div>
          
          <div style={detailRowStyle}>
            <span style={iconStyle}>📅</span>
            <span style={detailTextStyle}>{formattedDate}</span>
          </div>

          <div style={detailRowStyle}>
            <span style={iconStyle}>🕐</span>
            <span style={detailTextStyle}>{formattedTime}</span>
          </div>
        </div>

        {/* What happens next */}
        <div style={nextStepsCardStyle}>
          <div style={nextStepsHeaderStyle}>What happens next?</div>
          
          <div style={stepStyle}>
            <span style={stepIconStyle}>📧</span>
            <span style={stepTextStyle}>Check your email for confirmation details</span>
          </div>

          <div style={stepStyle}>
            <span style={stepIconStyle}>💖</span>
            <span style={stepTextStyle}>We'll call if we need to adjust your appointment</span>
          </div>

          <div style={closingMessageStyle}>
            <span style={heartEmojiStyle}>💕</span>
            You are our lovely customer and we can't wait to see you soon!
            <div style={thankYouTextStyle}>Thank you for choosing us!</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={buttonContainerStyle}>
          <button
            onClick={handleGoHome}
            style={primaryButtonStyle}
          >
            🏠 Go to Home
          </button>
          
          <button
            onClick={onClose}
            style={secondaryButtonStyle}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}

// ============================================
// 🎨 STYLES
// ============================================

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
  padding: "20px",
};

const modalStyle = {
  position: "relative",
  backgroundColor: "#fff",
  borderRadius: 24,
  padding: 40,
  maxWidth: 500,
  width: "100%",
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 25px 80px rgba(0, 0, 0, 0.3)",
  animation: "modalSlideIn 0.3s ease",
};

const iconContainerStyle = {
  display: "flex",
  justifyContent: "center",
  marginBottom: 20,
};

const checkmarkCircleStyle = {
  width: 80,
  height: 80,
  borderRadius: "50%",
  backgroundColor: "#4ade80",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 8px 24px rgba(74, 222, 128, 0.3)",
};

const checkmarkStyle = {
  fontSize: 48,
  color: "#fff",
  fontWeight: "bold",
};

const titleStyle = {
  fontSize: 28,
  fontWeight: 900,
  textAlign: "center",
  color: "#1f2937",
  marginBottom: 8,
  fontFamily: "'Roboto', sans-serif",
};

const thankYouStyle = {
  fontSize: 18,
  fontWeight: 600,
  textAlign: "center",
  color: "#374151",
  marginBottom: 12,
  fontFamily: "'Roboto', sans-serif",
};

const messageStyle = {
  fontSize: 15,
  textAlign: "center",
  color: "#6b7280",
  marginBottom: 24,
  lineHeight: 1.6,
  fontFamily: "'Roboto', sans-serif",
};

const detailsCardStyle = {
  backgroundColor: "#f9fafb",
  borderRadius: 16,
  padding: 20,
  marginBottom: 20,
  border: "2px solid #e5e7eb",
};

const detailsHeaderStyle = {
  fontSize: 12,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "#9ca3af",
  marginBottom: 16,
  textAlign: "center",
  fontFamily: "'Roboto', sans-serif",
};

const detailRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "12px 0",
  borderBottom: "1px solid #e5e7eb",
};

const iconStyle = {
  fontSize: 24,
  flexShrink: 0,
};

const detailTextStyle = {
  fontSize: 16,
  fontWeight: 600,
  color: "#1f2937",
  fontFamily: "'Roboto', sans-serif",
};

const nextStepsCardStyle = {
  backgroundColor: "#fffbeb",
  borderRadius: 16,
  padding: 20,
  marginBottom: 24,
  border: "2px solid #fef3c7",
};

const nextStepsHeaderStyle = {
  fontSize: 16,
  fontWeight: 800,
  color: "#92400e",
  marginBottom: 16,
  textAlign: "center",
  fontFamily: "'Roboto', sans-serif",
};

const stepStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: 12,
  marginBottom: 12,
  padding: "8px 0",
};

const stepIconStyle = {
  fontSize: 20,
  flexShrink: 0,
  marginTop: 2,
};

const stepTextStyle = {
  fontSize: 14,
  color: "#78350f",
  lineHeight: 1.5,
  fontFamily: "'Roboto', sans-serif",
};

const closingMessageStyle = {
  marginTop: 20,
  paddingTop: 16,
  borderTop: "2px solid #fef3c7",
  fontSize: 14,
  fontStyle: "italic",
  color: "#c2410c",
  textAlign: "center",
  lineHeight: 1.6,
  fontFamily: "'Roboto', sans-serif",
};

const heartEmojiStyle = {
  display: "block",
  fontSize: 24,
  marginBottom: 8,
};

const thankYouTextStyle = {
  marginTop: 8,
  fontSize: 15,
  fontWeight: 700,
  color: "#92400e",
  fontFamily: "'Roboto', sans-serif",
};

const buttonContainerStyle = {
  display: "flex",
  gap: 12,
  marginTop: 24,
};

const primaryButtonStyle = {
  flex: 1,
  padding: "14px 20px",
  borderRadius: 12,
  border: "none",
  backgroundColor: "#674846",
  color: "#fff8dc",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
  transition: "all 0.2s ease",
  fontFamily: "'Roboto', sans-serif",
  boxShadow: "0 4px 12px rgba(103, 72, 70, 0.3)",
};

const secondaryButtonStyle = {
  flex: 1,
  padding: "14px 20px",
  borderRadius: 12,
  border: "2px solid #e5e7eb",
  backgroundColor: "transparent",
  color: "#6b7280",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
  transition: "all 0.2s ease",
  fontFamily: "'Roboto', sans-serif",
};