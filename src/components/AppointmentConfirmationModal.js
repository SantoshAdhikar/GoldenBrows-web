// src/components/AppointmentConfirmationModal.js
import React from "react";

export default function AppointmentConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  appointmentData,
}) {
  if (!isOpen) return null;

  const { services, date, time, staff, name, phone, email, totalPrice, totalDuration } = appointmentData;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 32,
          maxWidth: 500,
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              backgroundColor: "#22c55e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <span style={{ fontSize: 32, color: "#fff" }}>✓</span>
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>
            Confirm Your Appointment
          </h2>
          <p style={{ color: "#64748b", fontSize: 14 }}>
            Please review your appointment details before confirming
          </p>
        </div>

        <div style={{ backgroundColor: "#f8fafc", borderRadius: 8, padding: 20, marginBottom: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: "#64748b", marginBottom: 8, textTransform: "uppercase" }}>
              Services
            </h3>
            <div>
              {services && services.length > 0 ? (
                services.map((service, index) => (
                  <div key={index} style={{ padding: "8px 0", borderBottom: index < services.length - 1 ? "1px solid #e2e8f0" : "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 15, color: "#0f172a" }}>{service.name}</span>
                      <span style={{ fontSize: 14, color: "#64748b" }}>${service.price}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No services selected</p>
              )}
            </div>
            {totalPrice > 0 && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "2px solid #e2e8f0", display: "flex", justifyContent: "space-between", fontWeight: 600 }}>
                <span style={{ color: "#0f172a" }}>Total</span>
                <span style={{ color: "#22c55e", fontSize: 18 }}>${totalPrice.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: "#64748b", marginBottom: 8, textTransform: "uppercase" }}>
              Date & Time
            </h3>
            <p style={{ fontSize: 15, color: "#0f172a", marginBottom: 4 }}>📅 {formatDate(date)}</p>
            <p style={{ fontSize: 15, color: "#0f172a" }}>
              🕐 {formatTime(time)}
              {totalDuration && <span style={{ color: "#64748b", fontSize: 13, marginLeft: 8 }}>(approx. {totalDuration} min)</span>}
            </p>
          </div>

          {staff && staff !== "Any staff" && (
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: "#64748b", marginBottom: 8, textTransform: "uppercase" }}>
                Staff Member
              </h3>
              <p style={{ fontSize: 15, color: "#0f172a" }}>👤 {staff}</p>
            </div>
          )}

          <div>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: "#64748b", marginBottom: 8, textTransform: "uppercase" }}>
              Your Information
            </h3>
            <p style={{ fontSize: 15, color: "#0f172a", marginBottom: 4 }}>{name}</p>
            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 2 }}>📱 {phone}</p>
            <p style={{ fontSize: 14, color: "#64748b" }}>✉️ {email}</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="button"
            onClick={onClose}
            style={{ flex: 1, padding: "12px 24px", fontSize: 15, fontWeight: 600, color: "#64748b", backgroundColor: "#f1f5f9", border: "none", borderRadius: 8, cursor: "pointer" }}
          >
            Go Back
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{ flex: 1, padding: "12px 24px", fontSize: 15, fontWeight: 600, color: "#fff", backgroundColor: "#22c55e", border: "none", borderRadius: 8, cursor: "pointer" }}
          >
            Confirm Appointment
          </button>
        </div>

        <p style={{ marginTop: 16, textAlign: "center", fontSize: 12, color: "#94a3b8" }}>
          You will receive a confirmation via text and email
        </p>
      </div>
    </div>
  );
}