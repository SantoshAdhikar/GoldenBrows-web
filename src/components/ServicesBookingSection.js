// src/components/ServicesBookingSection.js
// 🎯 SERVICES BOOKING SECTION - COMPLETE WITH COMMENTS
// Shows all services in grid, allows cart selection, booking form below
// Ultra-transparent "liquid glass" effect like video player

import React, { useEffect, useMemo, useState, useRef } from "react";
import { API_BASE } from "../apiConfig";
import { styles } from "../styles";
import AppointmentConfirmationModal from "./AppointmentConfirmationModal";
import SuccessMessageModal from "./SuccessMessageModal";
import {
  validateEmail,
  validateUSPhone,
  validateName,
  formatPhoneNumber,
  getPhoneDigits,
  getErrorMessage,
} from "../utils/validationUtils";

// ===========================
// 🛠️ UTILITY FUNCTIONS
// ===========================

// Formats category names (e.g., "face_threading" → "Face Threading")
function prettyCategory(cat) {
  if (!cat) return "";
  return cat
    .toString()
    .replace(/_/g, " ")
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Converts service name to URL-friendly slug
function slugify(name) {
  return (name || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ✅ Formats price with "+" if it's a "starting from" price
function formatPrice(service) {
  const price = Number(service.price || 0).toFixed(2);
  return service.priceFrom ? `$${price}+` : `$${price}`;
}

// ===========================
// 🖼️ IMAGE HANDLING
// ===========================

const LOCAL_SERVICE_IMAGE_BASE = "/images/services";
const PLACEHOLDER_IMAGE = `${LOCAL_SERVICE_IMAGE_BASE}/placeholder.jpg`;

// Gets correct image source for service (backend or local)
function getServiceImageSrc(service) {
  if (service?.imagePath) {
    if (service.imagePath.startsWith("http")) return service.imagePath;
    const backendRoot = API_BASE.replace(/\/api\/?$/, "");
    return backendRoot + service.imagePath;
  }
  const slug = slugify(service?.name);
  return `${LOCAL_SERVICE_IMAGE_BASE}/${slug}.jpg`;
}

// ===========================
// 📦 MAIN COMPONENT
// ===========================

export default function ServicesBookingSection() {
  // ===========================
  // 🔄 STATE MANAGEMENT
  // ===========================
  
  // Services data from API
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Shopping cart
  const [cart, setCart] = useState([]);

  // Booking form fields
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingStaff, setBookingStaff] = useState("Any staff");
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Form validation
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
  });

  // Modals
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Staff options
  const [staffOptions, setStaffOptions] = useState(["Any staff"]);

  // Floating button visibility
  const bookingFormRef = useRef(null);
  const [showStickyButton, setShowStickyButton] = useState(true);

  // ===========================
  // 🎬 EFFECTS / DATA LOADING
  // ===========================

  // Hide sticky button when booking form is visible
  useEffect(() => {
    function handleScroll() {
      if (!bookingFormRef.current) return;
      const formRect = bookingFormRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const isFormVisible = formRect.top < windowHeight - 100;
      setShowStickyButton(!isFormVisible);
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load services from API
  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch(`${API_BASE}/services`);
        if (!res.ok) throw new Error("Failed to load services");
        const data = await res.json();
        setServices(data);
      } catch (err) {
        setError(err.message || "Failed to load services");
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  // Load staff members from API
  useEffect(() => {
    async function loadStaff() {
      try {
        const res = await fetch(`${API_BASE}/employees`);
        if (!res.ok) throw new Error("Failed to load staff");
        const data = await res.json();

        const names = data.map((s) => {
          if (s.displayName) return s.displayName;
          if (s.name) return s.name;
          return `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim();
        });

        setStaffOptions(["Any staff", ...names]);
      } catch (err) {
        console.error("Error loading staff", err);
      }
    }
    loadStaff();
  }, []);

  // ===========================
  // 🧮 COMPUTED VALUES
  // ===========================

  // Get unique categories from services
  const categories = useMemo(() => {
    const set = new Set();
    services.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return ["All", ...Array.from(set).sort()];
  }, [services]);

  // Filter services by selected category
  const visibleServices =
    selectedCategory === "All"
      ? services
      : services.filter((s) => s.category === selectedCategory);

  // Neon accent colors for service cards
  const neonStyles = [
    { border: "#22d3ee" },
    { border: "#a855f7" },
    { border: "#f97316" },
    { border: "#4ade80" },
  ];

  // ===========================
  // 🛒 CART FUNCTIONS
  // ===========================

  const isInCart = (id) => cart.some((item) => item.id === id);

  const toggleCart = (service) => {
    setCart((prev) => {
      const exists = prev.some((item) => item.id === service.id);
      if (exists) return prev.filter((item) => item.id !== service.id);
      return [...prev, service];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Calculate cart totals
  const cartTotal = cart.reduce((sum, s) => sum + (s.price || 0), 0);
  const totalMinutes = cart.reduce(
    (sum, s) => sum + (s.durationMinutes || 0),
    0
  );

  // ===========================
  // 📜 SCROLL FUNCTIONS
  // ===========================

  const scrollToBooking = () => {
    if (bookingFormRef.current) {
      bookingFormRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      bookingFormRef.current.style.animation = "highlightPulse 1.5s ease";
      setTimeout(() => {
        if (bookingFormRef.current) bookingFormRef.current.style.animation = "";
      }, 1500);
    }
  };

  // ===========================
  // ✏️ FORM VALIDATION HANDLERS
  // ===========================

  function handleNameChange(e) {
    const value = e.target.value;
    setBookingName(value);

    if (touched.name) {
      if (!validateName(value)) {
        setFieldErrors((prev) => ({
          ...prev,
          name: getErrorMessage.name.required,
        }));
      } else {
        setFieldErrors((prev) => ({ ...prev, name: "" }));
      }
    }
  }

  function handlePhoneChange(e) {
    const formatted = formatPhoneNumber(e.target.value);
    setBookingPhone(formatted);

    if (touched.phone) {
      const digits = getPhoneDigits(formatted);

      if (digits.length === 0) {
        setFieldErrors((prev) => ({ ...prev, phone: "" }));
        return;
      }

      if (digits.length < 10) {
        setFieldErrors((prev) => ({
          ...prev,
          phone: "U.S. phone numbers are 10 digits.",
        }));
        return;
      }

      if (!validateUSPhone(digits)) {
        setFieldErrors((prev) => ({
          ...prev,
          phone: getErrorMessage.phone.invalid,
        }));
      } else {
        setFieldErrors((prev) => ({ ...prev, phone: "" }));
      }
    }
  }

  function handleEmailChange(e) {
    const value = e.target.value;
    setBookingEmail(value);

    if (touched.email) {
      if (!value.trim()) {
        setFieldErrors((prev) => ({ ...prev, email: "" }));
      } else if (!validateEmail(value)) {
        setFieldErrors((prev) => ({
          ...prev,
          email: getErrorMessage.email.invalid,
        }));
      } else {
        setFieldErrors((prev) => ({ ...prev, email: "" }));
      }
    }
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));

    if (field === "name" && !validateName(bookingName)) {
      setFieldErrors((prev) => ({
        ...prev,
        name: getErrorMessage.name.required,
      }));
    } else if (field === "email") {
      if (!bookingEmail.trim()) {
        setFieldErrors((prev) => ({ ...prev, email: "" }));
      } else if (!validateEmail(bookingEmail)) {
        setFieldErrors((prev) => ({
          ...prev,
          email: getErrorMessage.email.invalid,
        }));
      }
    } else if (field === "phone") {
      const digits = getPhoneDigits(bookingPhone);
      if (digits.length === 0) {
        setFieldErrors((prev) => ({ ...prev, phone: "" }));
      } else if (digits.length < 10) {
        setFieldErrors((prev) => ({
          ...prev,
          phone: "U.S. phone numbers are 10 digits.",
        }));
      } else if (!validateUSPhone(digits)) {
        setFieldErrors((prev) => ({
          ...prev,
          phone: getErrorMessage.phone.invalid,
        }));
      }
    }
  }

  // ===========================
  // 📨 FORM SUBMISSION
  // ===========================

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingMessage("");

    setTouched({ name: true, email: true, phone: true });

    const errors = {};

    if (cart.length === 0) {
      setBookingMessage("Please add at least one service to your cart first.");
      return;
    }

    if (!bookingDate || !bookingTime) {
      setBookingMessage("Please fill in date and time before requesting.");
      return;
    }

    if (!validateName(bookingName)) errors.name = getErrorMessage.name.required;

    const digitsOnly = getPhoneDigits(bookingPhone);
    if (!digitsOnly) errors.phone = getErrorMessage.phone.required;
    else if (!validateUSPhone(digitsOnly)) errors.phone = getErrorMessage.phone.invalid;

    if (!bookingEmail.trim()) errors.email = getErrorMessage.email.required;
    else if (!validateEmail(bookingEmail)) errors.email = getErrorMessage.email.invalid;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setBookingMessage("Please fix the highlighted fields.");
      return;
    }

    setFieldErrors({ name: "", email: "", phone: "" });
    setShowConfirmModal(true);
  };

  async function handleConfirmedSubmit() {
    setShowConfirmModal(false);
    setSubmitting(true);

    const serviceIds = cart.map((item) => item.id);

    const payload = {
      serviceIds,
      customerName: bookingName.trim(),
      phone: bookingPhone.trim(),
      email: bookingEmail.trim(),
      date: bookingDate,
      time: bookingTime,
      notes: bookingNotes.trim() || null,
      employeeId: null,
    };

    try {
      const res = await fetch(`${API_BASE}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to book appointment");
      }

      setShowSuccessModal(true);

      setCart([]);
      setBookingName("");
      setBookingPhone("");
      setBookingEmail("");
      setBookingNotes("");
      setBookingDate("");
      setBookingTime("");
      setBookingStaff("Any staff");
      setTouched({ name: false, email: false, phone: false });
      setFieldErrors({ name: "", email: "", phone: "" });
    } catch (err) {
      console.error("Booking error:", err);
      setBookingMessage(err.message || "Failed to book appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ===========================
  // 🎨 RENDER COMPONENT
  // ===========================

  return (
    <section style={styles.section}>
      {/* ===== 📋 PAGE HEADER ===== */}
      <h2 style={styles.sectionTitle}>All Services</h2>
      <p style={styles.sectionSubtitle}>
        Browse all services, add them to your cart, and scroll down to book your appointment.
      </p>

      {/* ===== 🏷️ CATEGORY FILTER TABS ===== */}
      <div style={{ display: "flex", flexWrap: "unwrap", gap: 8, marginBottom: 24 }}>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              border: cat === selectedCategory ? "2px solid #22c55e" : "1px solid #4b5563",
              backgroundColor: cat === selectedCategory ? "#22c55e" : "rgba(15, 23, 42, 0.9)",
              color: cat === selectedCategory ? "#0b1120" : "#e5e7eb",
              fontSize: 14,
              fontWeight: cat === selectedCategory ? "bold" : "normal",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {cat === "All" ? "All Services" : prettyCategory(cat)}
          </button>
        ))}
      </div>

      {/* ===== ⏳ LOADING / ERROR STATES ===== */}
      {loading && <p>Loading services...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && visibleServices.length === 0 && <p>No services available yet.</p>}

      {/* ===== 🎴 SERVICES GRID ===== */}
      {/* Each service card shows image, name, price, duration, add to cart button */}
      <div style={styles.servicesGrid}>
        {visibleServices.map((s, index) => {
          const neon = neonStyles[index % neonStyles.length];
          const inCart = isInCart(s.id);

          return (
            <div
              key={s.id}
              className="liquid-glass liquid-glass-hover"
              style={styles.serviceCard}
            >
              {/* Category badge */}
              {s.category && (
                <p style={{ ...styles.serviceLabel, color: neon.border }}>
                  {prettyCategory(s.category)}
                </p>
              )}

              {/* Service image */}
              <div
                style={{
                  width: "100%",
                  height: 170,
                  borderRadius: 16,
                  overflow: "hidden",
                  marginBottom: 12,
                  border: "1px solid rgba(255,255,255,0.35)",
                }}
              >
                <img
                  src={getServiceImageSrc(s)}
                  alt={s.name}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                  onError={(e) => {
                    if (s?.imagePath) {
                      e.currentTarget.style.display = "none";
                      return;
                    }

                    const slug = slugify(s?.name);
                    const step = Number(e.currentTarget.dataset.step || "0");

                    if (step === 0) {
                      e.currentTarget.dataset.step = "1";
                      e.currentTarget.src = `${LOCAL_SERVICE_IMAGE_BASE}/${slug}.jpeg`;
                      return;
                    }
                    if (step === 1) {
                      e.currentTarget.dataset.step = "2";
                      e.currentTarget.src = `${LOCAL_SERVICE_IMAGE_BASE}/${slug}.png`;
                      return;
                    }
                    if (step === 2) {
                      e.currentTarget.dataset.step = "3";
                      e.currentTarget.src = PLACEHOLDER_IMAGE;
                      return;
                    }

                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              {/* Service name */}
              <h3 style={styles.serviceName}>{s.name}</h3>

              {/* Service description */}
              {s.description && <p style={styles.serviceDescription}>{s.description}</p>}

              {/* Price and duration */}
              <div style={styles.serviceMetaRow}>
                <span style={styles.servicePrice}>{formatPrice(s)}</span>
                <span style={styles.serviceDuration}>{s.durationMinutes} min</span>
              </div>

              {/* Add to cart / Remove from cart button */}
              <button
                type="button"
                onClick={() => toggleCart(s)}
                style={inCart ? styles.cartRemoveButton : styles.cartAddButton}
              >
                {inCart ? "✓ Added to Cart" : "Add to Cart"}
              </button>

              {/* Inactive badge */}
              {!s.active && (
                <p style={{ color: "#ef4444", fontSize: 13, marginTop: 6 }}>
                  Currently inactive
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* ===== 📝 BOOKING FORM SECTION (BELOW SERVICES) ===== */}
      {/* This appears BELOW the services grid (not on the side) */}
      <div className="booking-form-container" ref={bookingFormRef}>
        <div className="booking-form-inner liquid-glass liquid-glass-strong">
          {/* Form header */}
          <div className="booking-header">
            <div>
              <h3 className="booking-title">Complete Your Booking</h3>
              <p className="booking-subtitle">
                Fill in your details below and we'll confirm your appointment by text/email.
              </p>
            </div>

            {/* Cart summary badges */}
            {cart.length > 0 && (
              <div className="booking-badges">
                <span className="booking-badge">
                  {cart.length} service{cart.length > 1 ? "s" : ""}
                </span>
                <span className="booking-badge booking-badge-gold">
                  ${cartTotal.toFixed(2)}
                </span>
                <span className="booking-badge">{totalMinutes} min</span>
              </div>
            )}
          </div>

          {/* Empty cart state */}
          {cart.length === 0 ? (
            <div className="booking-empty liquid-glass">
              <div className="booking-empty-icon">🛒</div>
              <div>
                <div className="booking-empty-title">No services selected</div>
                <div className="booking-empty-text">Add services above to get started.</div>
              </div>
            </div>
          ) : (
            <>
              {/* ===== 🛒 SELECTED SERVICES CARD ===== */}
              {/* Shows list of services in cart with remove buttons */}
              <div className="selected-services-card liquid-glass">
                <div className="selected-services-header">
                  <span className="selected-services-title">Selected Services</span>
                  <span className="selected-services-hint">Tap × to remove</span>
                </div>

                <div className="selected-services-list">
                  {cart.map((item) => (
                    <div key={item.id} className="selected-service-item">
                      <div className="selected-service-info">
                        <div className="selected-service-name">{item.name}</div>
                        <div className="selected-service-meta">
                          {formatPrice(item)} • {item.durationMinutes || 0} min
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="selected-service-remove"
                        aria-label="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Cart totals */}
                <div className="selected-services-summary">
                  <div className="summary-item">
                    <span className="summary-label">Total</span>
                    <span className="summary-value">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Duration</span>
                    <span className="summary-value">{totalMinutes} min</span>
                  </div>
                </div>
              </div>

              {/* ===== 📋 BOOKING FORM ===== */}
              {/* Customer fills in date, time, name, phone, email, notes */}
              <form onSubmit={handleBookingSubmit} className="booking-form">
                {/* Date and time row */}
                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label">Date *</label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Time *</label>
                    <input
                      type="time"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                {/* Staff preference */}
                <div className="form-field">
                  <label className="form-label">Preferred Staff (optional)</label>
                  <select
                    value={bookingStaff}
                    onChange={(e) => setBookingStaff(e.target.value)}
                    className="form-input"
                  >
                    {staffOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Name and phone row */}
                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label">Name *</label>
                    <input
                      type="text"
                      value={bookingName}
                      onChange={handleNameChange}
                      onBlur={() => handleBlur("name")}
                      className="form-input"
                      style={{
                        borderColor: fieldErrors.name && touched.name ? "#ef4444" : undefined,
                      }}
                      required
                    />
                    {fieldErrors.name && touched.name && (
                      <span className="form-error">{fieldErrors.name}</span>
                    )}
                  </div>

                  <div className="form-field">
                    <label className="form-label">Phone *</label>
                    <input
                      type="tel"
                      value={bookingPhone}
                      onChange={handlePhoneChange}
                      onBlur={() => handleBlur("phone")}
                      className="form-input"
                      placeholder="(555) 123-4567"
                      maxLength={14}
                      style={{
                        borderColor: fieldErrors.phone && touched.phone ? "#ef4444" : undefined,
                      }}
                      required
                    />
                    {fieldErrors.phone && touched.phone && (
                      <span className="form-error">{fieldErrors.phone}</span>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="form-field">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    value={bookingEmail}
                    onChange={handleEmailChange}
                    onBlur={() => handleBlur("email")}
                    className="form-input"
                    placeholder="you@example.com"
                    style={{
                      borderColor: fieldErrors.email && touched.email ? "#ef4444" : undefined,
                    }}
                    required
                  />
                  {fieldErrors.email && touched.email && (
                    <span className="form-error">{fieldErrors.email}</span>
                  )}
                </div>

                {/* Special notes */}
                <div className="form-field">
                  <label className="form-label">Special Notes (optional)</label>
                  <textarea
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    className="form-input form-textarea"
                    placeholder="Any allergies, preferences, or special requests?"
                    rows={4}
                  />
                </div>

                {/* Submit button */}
                <button type="submit" className="form-submit" disabled={submitting}>
                  {submitting ? "Submitting..." : "Request Appointment"}
                </button>

                {/* Success/error message */}
                {bookingMessage && (
                  <div
                    className={
                      bookingMessage.startsWith("Thank you")
                        ? "form-message form-message-success"
                        : "form-message form-message-error"
                    }
                  >
                    {bookingMessage}
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      </div>

      {/* ===== 🎈 FLOATING BOOK BUTTON ===== */}
      {/* Fixed button at bottom of screen - scrolls to booking form */}
      {/* Only visible when booking form is off-screen */}
      {cart.length > 0 && showStickyButton && (
        <button onClick={scrollToBooking} className="floating-book-button">
          <div className="floating-button-content">
            <span className="floating-button-text">
              Book {cart.length} Service{cart.length > 1 ? "s" : ""}
            </span>
            <span className="floating-button-price">
              ${cartTotal.toFixed(2)} • {totalMinutes} min
            </span>
          </div>
          <span className="floating-button-arrow">→</span>
        </button>
      )}

      {/* ===== 🔔 MODALS ===== */}
      {/* Confirmation modal - shows before submitting booking */}
      <AppointmentConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmedSubmit}
        appointmentData={{
          services: cart,
          date: bookingDate,
          time: bookingTime,
          staff: bookingStaff,
          name: bookingName,
          phone: bookingPhone,
          email: bookingEmail,
          totalPrice: cartTotal,
          totalDuration: totalMinutes,
        }}
      />

      {/* Success modal - shows after booking confirmed */}
      <SuccessMessageModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        customerName={bookingName}
        appointmentDate={bookingDate}
        appointmentTime={bookingTime}
      />

      {/* ===== 🎨 COMPONENT STYLES ===== */}
      {/* All CSS for this component */}
      <style>{`
        /* ===== ANIMATIONS ===== */
        @keyframes highlightPulse {
          0% { background-color: rgba(255, 248, 220, 0.4); }
          50% { background-color: rgba(103, 72, 70, 0.3); }
          100% { background-color: transparent; }
        }

        @keyframes pulseGlow {
          0%, 100% { 
            box-shadow: 0 10px 40px rgba(103, 72, 70, 0.5); 
          }
          50% { 
            box-shadow: 0 15px 50px rgba(103, 72, 70, 0.7), 
                        0 0 25px rgba(231, 203, 46, 0.5); 
          }
        }

        /* ===== BOOKING FORM CONTAINER ===== */
        /* Container that holds the entire booking form below services */
        .booking-form-container {
          margin-top: 60px;
          padding-top: 40px;
          border-top: 2px solid rgba(103, 72, 70, 0.15);
        }

        /* Inner container with glass effect */
        .booking-form-inner {
          max-width: 800px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 24px;
          padding: 32px;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.12),
            0 8px 20px rgba(0, 0, 0, 0.08);
        }

        @media (max-width: 640px) {
          .booking-form-inner {
            padding: 20px;
            border-radius: 20px;
          }
        }

        /* ===== BOOKING HEADER ===== */
        /* Title and badges at top of booking form */
        .booking-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 28px;
          flex-unwrap: unwrap;
        }

        .booking-title {
          margin: 0;
          font-size: 26px;
          font-weight: 800;
          color: #1f2937;
          letter-spacing: -0.03em;
        }

        @media (max-width: 640px) {
          .booking-title {
            font-size: 22px;
          }
        }

        .booking-subtitle {
          margin: 8px 0 0;
          font-size: 14px;
          color: #6b7280;
          line-height: 1.5;
        }

        /* ===== BADGES ===== */
        /* Small pills showing cart count, total price, duration */
        .booking-badges {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .booking-badge {
          padding: 10px 16px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 0, 0, 0.1);
          font-size: 13px;
          font-weight: 700;
          color: #374151;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .booking-badge-gold {
          background: rgba(231, 203, 46, 0.25);
          border-color: rgba(231, 203, 46, 0.4);
          color: #92400e;
        }

        /* ===== EMPTY STATE ===== */
        /* Shows when no services in cart */
        .booking-empty {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 28px;
          border-radius: 18px;
          background: rgba(249, 250, 251, 0.7);
          backdrop-filter: blur(10px);
          border: 2px dashed rgba(0, 0, 0, 0.12);
        }

        .booking-empty-icon {
          font-size: 32px;
        }

        .booking-empty-title {
          font-size: 16px;
          font-weight: 800;
          color: #111827;
          margin-bottom: 4px;
        }

        .booking-empty-text {
          font-size: 14px;
          color: #6b7280;
        }

        /* ===== SELECTED SERVICES CARD ===== */
        /* Card showing services in cart with remove buttons */
        .selected-services-card {
          margin-bottom: 28px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        }

        .selected-services-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: rgba(250, 250, 250, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }

        .selected-services-title {
          font-size: 15px;
          font-weight: 800;
          color: #111827;
        }

        .selected-services-hint {
          font-size: 12px;
          color: #9ca3af;
        }

        .selected-services-list {
          padding: 16px 20px;
        }

        .selected-service-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .selected-service-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .selected-service-info {
          flex: 1;
          min-width: 0;
        }

        .selected-service-name {
          font-size: 15px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 4px;
        }

        .selected-service-meta {
          font-size: 13px;
          color: #6b7280;
        }

        /* Remove button (× icon) */
        .selected-service-remove {
          min-width: 40px;
          min-height: 40px;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.12);
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          cursor: pointer;
          font-size: 22px;
          line-height: 1;
          color: #6b7280;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .selected-service-remove:hover {
          background: #fee2e2;
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.3);
        }

        .selected-service-remove:active {
          transform: scale(0.95);
        }

        /* Cart summary (total and duration) */
        .selected-services-summary {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          padding: 16px 20px;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
          background: rgba(250, 250, 250, 0.8);
          backdrop-filter: blur(10px);
        }

        .summary-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 14px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 0, 0, 0.08);
        }

        .summary-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #6b7280;
        }

        .summary-value {
          font-size: 20px;
          font-weight: 900;
          color: #111827;
        }

        @media (max-width: 640px) {
          .summary-value {
            font-size: 18px;
          }
        }

        /* ===== FORM ===== */
        /* Booking form with date, time, name, phone, email, notes */
        .booking-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Row with 2 fields side by side (date/time, name/phone) */
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        @media (max-width: 640px) {
          .form-row {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 14px;
          font-weight: 700;
          color: #374151;
        }

        /* Input fields (text, date, time, email, phone, select) */
        .form-input {
          width: 100%;
          padding: 16px;
          border-radius: 14px;
          border: 1px solid rgba(0, 0, 0, 0.15);
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          font-size: 15px;
          color: #111827;
          outline: none;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .form-input:focus {
          border-color: rgba(103, 72, 70, 0.6);
          box-shadow: 0 0 0 4px rgba(103, 72, 70, 0.12);
          background: rgba(255, 255, 255, 1);
        }

        .form-textarea {
          min-height: 120px;
          resize: vertical;
        }

        /* Error messages below invalid fields */
        .form-error {
          font-size: 12px;
          font-weight: 600;
          color: #ef4444;
        }

        /* Submit button */
        .form-submit {
          width: 100%;
          padding: 18px;
          border: none;
          border-radius: 16px;
          background: linear-gradient(135deg, #674846 0%, #8b6361 100%);
          color: #fff8dc;
          font-size: 17px;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 
            0 12px 28px rgba(103, 72, 70, 0.3),
            0 4px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .form-submit:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 16px 35px rgba(103, 72, 70, 0.4),
            0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .form-submit:active {
          transform: translateY(0);
        }

        .form-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /* Success/error message after submission */
        .form-message {
          padding: 14px 16px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.5;
        }

        .form-message-success {
          background: rgba(34, 197, 94, 0.12);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #14532d;
        }

        .form-message-error {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #7f1d1d;
        }

        /* ===== FLOATING BOOK BUTTON ===== */
        /* Fixed button at bottom - appears when booking form is off-screen */
        .floating-book-button {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 18px 28px;
          background: #674846;
          color: #fff8dc;
          border: 2px solid #e7cb2e;
          border-radius: 50px;
          cursor: pointer;
          box-shadow: 0 10px 40px rgba(103, 72, 70, 0.5);
          transition: all 0.3s ease;
          animation: pulseGlow 2s ease-in-out infinite;
          max-width: 90%;
          min-width: 300px;
        }

        @media (max-width: 640px) {
          .floating-book-button {
            min-width: 280px;
            padding: 16px 24px;
            gap: 16px;
          }
        }

        .floating-book-button:hover {
          transform: translateX(-50%) translateY(-3px);
          box-shadow: 0 15px 50px rgba(103, 72, 70, 0.6);
        }

        .floating-book-button:active {
          transform: translateX(-50%) translateY(-1px);
        }

        .floating-button-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          flex: 1;
        }

        .floating-button-text {
          font-size: 17px;
          font-weight: 900;
          margin-bottom: 4px;
        }

        @media (max-width: 640px) {
          .floating-button-text {
            font-size: 16px;
          }
        }

        .floating-button-price {
          font-size: 14px;
          opacity: 0.95;
        }

        @media (max-width: 640px) {
          .floating-button-price {
            font-size: 13px;
          }
        }

        .floating-button-arrow {
          font-size: 26px;
          font-weight: 900;
        }

        /* ===== CATEGORY TABS SCROLLBAR ===== */
        /* Add this to the <style> section at the bottom of ServicesBookingSection.js */
        
        /* Custom scrollbar for horizontal category tabs */
        div[style*="overflowX: auto"]::-webkit-scrollbar {
          height: 6px;
        }
        
        div[style*="overflowX: auto"]::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        
        div[style*="overflowX: auto"]::-webkit-scrollbar-thumb {
          background: rgba(103, 72, 70, 0.3);
          border-radius: 10px;
          transition: background 0.2s ease;
        }
        
        div[style*="overflowX: auto"]::-webkit-scrollbar-thumb:hover {
          background: rgba(103, 72, 70, 0.5);
        }
        
        /* Hide scrollbar on mobile */
        @media (max-width: 640px) {
          div[style*="overflowX: auto"]::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}