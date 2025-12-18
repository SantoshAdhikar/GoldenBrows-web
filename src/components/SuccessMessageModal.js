// src/components/SuccessMessageModal.js
// ✅ FIXED: Added "Go Home" button so customers aren't stuck!

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

  const handleGoHome = () => {
    onClose();
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Success Icon */}
        <div style={iconContainerStyle}>
          <div style={iconStyle}>✓</div>
        </div>

        {/* Title */}
        <h2 style={titleStyle}>Appointment Confirmed! 🎉</h2>

        {/* Subtitle */}
        <p style={subtitleStyle}>Thank you, {customerName}!</p>
        <p style={messageStyle}>
          Your appointment request has been successfully submitted.
        </p>

        {/* Appointment Details */}
        <div style={detailsBoxStyle}>
          <p style={detailsHeadingStyle}>YOUR APPOINTMENT</p>
          <div style={detailsContentStyle}>
            <div style={detailItemStyle}>
              <span style={iconSmallStyle}>📅</span>
              <span>{new Date(appointmentDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div style={detailItemStyle}>
              <span style={iconSmallStyle}>🕐</span>
              <span>{appointmentTime}</span>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div style={nextStepsBoxStyle}>
          <p style={nextStepsTitleStyle}>What happens next?</p>
          <div style={nextStepsListStyle}>
            <div style={nextStepItemStyle}>
              <span style={iconSmallStyle}>📧</span>
              <span>Check your email for confirmation details</span>
            </div>
            <div style={nextStepItemStyle}>
              <span style={iconSmallStyle}>📱</span>
              <span> 💖💖💖💖💖💖💖💖 </span>
            </div>
            <div style={nextStepItemStyle}>
              <span style={iconSmallStyle}>📞</span>
              <span>We'll call if we need to adjust your appointment</span>
            </div>
          </div>
        </div>

        {/* Thank You Message */}
        <p style={thankYouStyle}>
          💖 You are our lovely customer and we can't wait to see you soon!
          <br />
          <span style={{ color: "#10b981", fontWeight: "bold", fontSize: 16 }}>
            Thank you for choosing us!
          </span>
        </p>

        {/* ✅ NEW: Action Buttons */}
        <div style={buttonContainerStyle}>
          <button onClick={handleGoHome} style={homeButtonStyle}>
            🏠 Go to Home
          </button>
          <button onClick={onClose} style={closeButtonStyle}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// STYLES
// ============================================

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  backdropFilter: "blur(4px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2000,
  padding: 20,
  overflowY: "auto",
};

const modalStyle = {
  backgroundColor: "#fff",
  borderRadius: 24,
  padding: "40px 32px",
  maxWidth: 500,
  width: "100%",
  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
  textAlign: "center",
  position: "relative",
  margin: "auto",
  maxHeight: "90vh",
  overflowY: "auto",
};

const iconContainerStyle = {
  marginBottom: 24,
};

const iconStyle = {
  width: 80,
  height: 80,
  borderRadius: "50%",
  backgroundColor: "#10b981",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 48,
  fontWeight: "bold",
  margin: "0 auto",
  boxShadow: "0 8px 24px rgba(16, 185, 129, 0.3)",
};

const titleStyle = {
  fontSize: 28,
  fontWeight: "bold",
  color: "#1f2937",
  marginBottom: 12,
};

const subtitleStyle = {
  fontSize: 18,
  color: "#6b7280",
  marginBottom: 8,
};

const messageStyle = {
  fontSize: 15,
  color: "#6b7280",
  marginBottom: 24,
  lineHeight: 1.5,
};

const detailsBoxStyle = {
  backgroundColor: "#f9fafb",
  borderRadius: 16,
  padding: "20px",
  marginBottom: 20,
  border: "1px solid #e5e7eb",
};

const detailsHeadingStyle = {
  fontSize: 12,
  fontWeight: "bold",
  color: "#9ca3af",
  letterSpacing: "0.05em",
  marginBottom: 12,
};

const detailsContentStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const detailItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  fontSize: 15,
  color: "#374151",
};

const iconSmallStyle = {
  fontSize: 18,
};

const nextStepsBoxStyle = {
  backgroundColor: "#fffbeb",
  borderRadius: 16,
  padding: "20px",
  marginBottom: 20,
  border: "1px solid #fef3c7",
};

const nextStepsTitleStyle = {
  fontSize: 16,
  fontWeight: "bold",
  color: "#92400e",
  marginBottom: 12,
};

const nextStepsListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  textAlign: "left",
};

const nextStepItemStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
  fontSize: 14,
  color: "#78350f",
};

const thankYouStyle = {
  fontSize: 14,
  color: "#6b7280",
  fontStyle: "italic",
  marginBottom: 24,
  lineHeight: 1.6,
};

// ✅ NEW: Button styles
const buttonContainerStyle = {
  display: "flex",
  gap: 12,
  justifyContent: "center",
  flexWrap: "wrap",
};

const homeButtonStyle = {
  padding: "14px 28px",
  backgroundColor: "#674846",
  color: "#fff8dc",
  border: "none",
  borderRadius: 999,
  fontSize: 16,
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(103, 72, 70, 0.3)",
  transition: "all 0.3s ease",
  minWidth: 140,
};

const closeButtonStyle = {
  padding: "14px 28px",
  backgroundColor: "#f3f4f6",
  color: "#374151",
  border: "1px solid #d1d5db",
  borderRadius: 999,
  fontSize: 16,
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
  minWidth: 140,
};