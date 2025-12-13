// src/components/SuccessMessageModal.js
import React from "react";

/**
 * Success message modal shown after appointment is booked
 * Props:
 * - isOpen: boolean
 * - onClose: function
 * - customerName: string
 * - appointmentDate: string
 * - appointmentTime: string
 */
export default function SuccessMessageModal({
  isOpen,
  onClose,
  customerName,
  appointmentDate,
  appointmentTime,
}) {
  if (!isOpen) return null;

  // Format date nicely
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  // Format time to 12-hour
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours, 10);
    const suffix = h >= 12 ? "PM" : "AM";
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${hour12}:${minutes} ${suffix}`;
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 20,
        animation: "fadeIn 0.3s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 40,
          maxWidth: 480,
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          textAlign: "center",
          animation: "slideUp 0.4s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Icon with Animation */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            backgroundColor: "#dcfce7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            animation: "scaleIn 0.5s ease",
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              backgroundColor: "#22c55e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 36, color: "#fff" }}>✓</span>
          </div>
        </div>

        {/* Success Message */}
        <h2
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: 12,
          }}
        >
          Appointment Confirmed! 🎉
        </h2>

        <p
          style={{
            fontSize: 16,
            color: "#64748b",
            marginBottom: 24,
            lineHeight: 1.6,
          }}
        >
          Thank you, <strong style={{ color: "#22c55e" }}>{customerName}</strong>!
          <br />
          Your appointment request has been successfully submitted.
        </p>

        {/* Appointment Details Box */}
        <div
          style={{
            backgroundColor: "#f8fafc",
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
            border: "2px solid #e2e8f0",
          }}
        >
          <p
            style={{
              fontSize: 14,
              color: "#64748b",
              marginBottom: 12,
              fontWeight: 600,
            }}
          >
            YOUR APPOINTMENT
          </p>
          <p style={{ fontSize: 16, color: "#0f172a", marginBottom: 8 }}>
            📅 {formatDate(appointmentDate)}
          </p>
          <p style={{ fontSize: 16, color: "#0f172a" }}>
            🕐 {formatTime(appointmentTime)}
          </p>
        </div>

        {/* What's Next Section */}
        <div
          style={{
            backgroundColor: "#fffbeb",
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
            border: "2px solid #fef3c7",
          }}
        >
          <h3
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#92400e",
              marginBottom: 12,
            }}
          >
            What happens next?
          </h3>
          <ul
            style={{
              textAlign: "left",
              padding: 0,
              margin: 0,
              listStyle: "none",
              fontSize: 14,
              color: "#78350f",
              lineHeight: 1.8,
            }}
          >
            <li style={{ marginBottom: 8 }}>
              ✉️ Check your email for confirmation details
            </li>
            <li style={{ marginBottom: 8 }}>
              📱 You'll receive a text message shortly
            </li>
            <li>📞 We'll call if we need to adjust your appointment</li>
          </ul>
        </div>

        {/* Lovely Message */}
        <div
          style={{
            padding: 20,
            marginBottom: 24,
            fontStyle: "italic",
          }}
        >
          <p
            style={{
              fontSize: 16,
              color: "#64748b",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            💖 You are our lovely customer and we can't wait to see you soon!
            <br />
            <span style={{ color: "#22c55e", fontWeight: 600 }}>
              Thank you for choosing us!
            </span>
          </p>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            width: "100%",
            padding: "14px 24px",
            fontSize: 16,
            fontWeight: 600,
            color: "#fff",
            backgroundColor: "#22c55e",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#16a34a";
            e.target.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#22c55e";
            e.target.style.transform = "translateY(0)";
          }}
        >
          Got it, thanks!
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}