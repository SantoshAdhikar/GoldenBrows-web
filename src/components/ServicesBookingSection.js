// src/components/ServicesBookingSection.js
// COMPLETE FILE - Replace your entire ServicesBookingSection.js with this

import React, { useEffect, useMemo, useState } from "react";
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
  getErrorMessage 
} from "../utils/validationUtils";

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

export default function ServicesBookingSection() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // cart state
  const [cart, setCart] = useState([]);

  // booking form state
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingStaff, setBookingStaff] = useState("Any staff");
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Validation states
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

  // ✅ ADD THESE MODAL STATES
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // staff options from backend
  const [staffOptions, setStaffOptions] = useState(["Any staff"]);

  // -------- load services --------
  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch(`${API_BASE}/services`);
        if (!res.ok) throw new Error("Failed to load services");
        const data = await res.json();
        setServices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  // -------- load staff from backend --------
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

  // categories from backend
  const categories = useMemo(() => {
    const set = new Set();
    services.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return ["All", ...Array.from(set).sort()];
  }, [services]);

  const visibleServices =
    selectedCategory === "All"
      ? services
      : services.filter((s) => s.category === selectedCategory);

  const neonStyles = [
    { border: "#22d3ee", shadow: "rgba(34, 211, 238, 0.6)" },
    { border: "#a855f7", shadow: "rgba(168, 85, 247, 0.6)" },
    { border: "#f97316", shadow: "rgba(249, 115, 22, 0.6)" },
    { border: "#4ade80", shadow: "rgba(74, 222, 128, 0.6)" },
  ];

  const isInCart = (id) => cart.some((item) => item.id === id);

  const toggleCart = (service) => {
    setCart((prev) => {
      const exists = prev.some((item) => item.id === service.id);
      if (exists) {
        return prev.filter((item) => item.id !== service.id);
      }
      return [...prev, service];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, s) => sum + (s.price || 0), 0);
  const totalMinutes = cart.reduce(
    (sum, s) => sum + (s.durationMinutes || 0),
    0
  );

  // -------- VALIDATION HANDLERS --------
  
  function handleNameChange(e) {
    const value = e.target.value;
    setBookingName(value);
    
    if (touched.name) {
      if (!validateName(value)) {
        setFieldErrors((prev) => ({ ...prev, name: getErrorMessage.name.required }));
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
    
    if (field === 'name' && !validateName(bookingName)) {
      setFieldErrors((prev) => ({ ...prev, name: getErrorMessage.name.required }));
    } else if (field === 'email') {
      if (!bookingEmail.trim()) {
        setFieldErrors((prev) => ({ ...prev, email: "" }));
      } else if (!validateEmail(bookingEmail)) {
        setFieldErrors((prev) => ({ ...prev, email: getErrorMessage.email.invalid }));
      }
    } else if (field === 'phone') {
      const digits = getPhoneDigits(bookingPhone);
      if (digits.length === 0) {
        setFieldErrors((prev) => ({ ...prev, phone: "" }));
      } else if (digits.length < 10) {
        setFieldErrors((prev) => ({ ...prev, phone: "U.S. phone numbers are 10 digits." }));
      } else if (!validateUSPhone(digits)) {
        setFieldErrors((prev) => ({ ...prev, phone: getErrorMessage.phone.invalid }));
      }
    }
  }

  // ✅ UPDATED: This now only validates and shows modal
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingMessage("");

    setTouched({
      name: true,
      email: true,
      phone: true,
    });

    const errors = {};

    if (cart.length === 0) {
      setBookingMessage("Please add at least one service to your cart first.");
      return;
    }

    if (!bookingDate || !bookingTime) {
      setBookingMessage("Please fill in date and time before requesting.");
      return;
    }

    if (!validateName(bookingName)) {
      errors.name = getErrorMessage.name.required;
    }

    const digitsOnly = getPhoneDigits(bookingPhone);
    if (!digitsOnly) {
      errors.phone = getErrorMessage.phone.required;
    } else if (!validateUSPhone(digitsOnly)) {
      errors.phone = getErrorMessage.phone.invalid;
    }

    if (!bookingEmail.trim()) {
      errors.email = getErrorMessage.email.required;
    } else if (!validateEmail(bookingEmail)) {
      errors.email = getErrorMessage.email.invalid;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setBookingMessage("Please fix the highlighted fields.");
      return;
    }

    setFieldErrors({ name: "", email: "", phone: "" });

    // ✅ SHOW CONFIRMATION MODAL
    setShowConfirmModal(true);
  };

  // ✅ NEW: This actually submits after confirmation
  async function handleConfirmedSubmit() {
    setShowConfirmModal(false);
    setSubmitting(true);

    const serviceIds = cart.map((item) => item.id);
    
    let employeeId = null;
    if (bookingStaff !== "Any staff") {
      // Match staff name to ID if needed
    }

    const payload = {
      serviceIds,
      customerName: bookingName.trim(),
      phone: bookingPhone.trim(),
      email: bookingEmail.trim(),
      date: bookingDate,
      time: bookingTime,
      notes: bookingNotes.trim() || null,
      employeeId,
    };

    try {
      const res = await fetch(`${API_BASE}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to book appointment");
      }

      // ✅ SHOW SUCCESS MODAL
      setShowSuccessModal(true);

      // Reset form
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

  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>All Services</h2>
      <p style={styles.sectionSubtitle}>
        Browse all services, add them to your cart, and send an appointment
        request with your preferred date and time.
      </p>

      <div className="services-layout">
        {/* LEFT: neon service cards */}
        <div className="services-layout-left">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  border: cat === selectedCategory ? "1px solid #22c55e" : "1px solid #4b5563",
                  backgroundColor: cat === selectedCategory ? "#22c55e" : "rgba(15, 23, 42, 0.9)",
                  color: cat === selectedCategory ? "#0b1120" : "#e5e7eb",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                {cat === "All" ? "All" : prettyCategory(cat)}
              </button>
            ))}
          </div>

          {loading && <p>Loading services...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && !error && visibleServices.length === 0 && (
            <p>No services available yet.</p>
          )}

          <div style={styles.servicesGrid}>
            {visibleServices.map((s, index) => {
              const neon = neonStyles[index % neonStyles.length];
              const cardStyle = {
                ...styles.serviceCard,
                borderColor: neon.border,
                boxShadow: `0 0 22px ${neon.shadow}`,
              };
              const inCart = isInCart(s.id);

              return (
                <div key={s.id} style={cardStyle}>
                  {s.category && (
                    <p style={{ ...styles.serviceLabel, color: neon.border }}>
                      {prettyCategory(s.category)}
                    </p>
                  )}

                  {s.imagePath && (
                    <div style={{ marginBottom: 8 }}>
                      <img
                        src={API_BASE.replace("/api", "") + s.imagePath}
                        alt={s.name}
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 8,
                          marginBottom: 8,
                        }}
                      />
                    </div>
                  )}

                  <h3 style={styles.serviceName}>{s.name}</h3>

                  {s.description && (
                    <p style={styles.serviceDescription}>{s.description}</p>
                  )}

                  <div style={styles.serviceMetaRow}>
                    <span style={styles.servicePrice}>${s.price}</span>
                    <span style={styles.serviceDuration}>
                      {s.durationMinutes} min
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleCart(s)}
                    style={
                      inCart ? styles.cartRemoveButton : styles.cartAddButton
                    }
                  >
                    {inCart ? "Remove from cart" : "Add to cart"}
                  </button>

                  {!s.active && (
                    <p style={{ color: "#f97373", fontSize: 13, marginTop: 6 }}>
                      Currently inactive
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: cart summary + booking form */}
        <div className="services-layout-right">
          <div style={styles.cartPanel}>
            <h3 style={styles.cartPanelTitle}>
              Selected Services ({cart.length})
            </h3>

            {cart.length === 0 ? (
              <p style={styles.cartEmptyText}>
                No services selected yet. Click &quot;Add to cart&quot; on any
                service to build your appointment.
              </p>
            ) : (
              <>
                <ul style={styles.cartList}>
                  {cart.map((item) => (
                    <li key={item.id} style={styles.cartListItem}>
                      <div>
                        <div style={styles.cartItemName}>{item.name}</div>
                        <div style={styles.cartItemMeta}>
                          <span>${item.price}</span>
                          <span>{item.durationMinutes} min</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        style={styles.cartListRemoveButton}
                        aria-label="Remove from cart"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>

                <div style={styles.cartTotals}>
                  <div style={styles.cartTotalsRow}>
                    <span>Total price</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div style={styles.cartTotalsRow}>
                    <span>Estimated time</span>
                    <span>{totalMinutes} min</span>
                  </div>
                </div>

                <form onSubmit={handleBookingSubmit} style={styles.bookingForm}>
                  <div style={styles.bookingRow}>
                    <label style={styles.bookingLabel}>
                      Date
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        style={styles.bookingInput}
                      />
                    </label>
                    <label style={styles.bookingLabel}>
                      Time
                      <input
                        type="time"
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        style={styles.bookingInput}
                      />
                    </label>
                  </div>

                  <label style={styles.bookingLabel}>
                    Preferred staff (optional)
                    <select
                      value={bookingStaff}
                      onChange={(e) => setBookingStaff(e.target.value)}
                      style={{
                        ...styles.bookingInput,
                        ...styles.bookingSelect,
                      }}
                    >
                      {staffOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div style={styles.bookingRow}>
                    <label style={styles.bookingLabel}>
                      Name <span style={{ color: "red" }}>*</span>
                      <input
                        type="text"
                        value={bookingName}
                        onChange={handleNameChange}
                        onBlur={() => handleBlur('name')}
                        style={{
                          ...styles.bookingInput,
                          borderColor: fieldErrors.name && touched.name ? "red" : undefined,
                        }}
                      />
                      {fieldErrors.name && touched.name && (
                        <span style={{ color: "red", fontSize: 11, display: "block", marginTop: 2 }}>
                          {fieldErrors.name}
                        </span>
                      )}
                    </label>
                    <label style={styles.bookingLabel}>
                      Phone <span style={{ color: "red" }}>*</span>
                      <input
                        type="tel"
                        value={bookingPhone}
                        onChange={handlePhoneChange}
                        onBlur={() => handleBlur('phone')}
                        style={{
                          ...styles.bookingInput,
                          borderColor: fieldErrors.phone && touched.phone ? "red" : undefined,
                        }}
                        placeholder="(555) 123-4567"
                        maxLength={14}
                      />
                      {fieldErrors.phone && touched.phone && (
                        <span style={{ color: "red", fontSize: 11, display: "block", marginTop: 2 }}>
                          {fieldErrors.phone}
                        </span>
                      )}
                    </label>
                  </div>

                  <label style={styles.bookingLabel}>
                    Email <span style={{ color: "red" }}>*</span>
                    <input
                      type="email"
                      value={bookingEmail}
                      onChange={handleEmailChange}
                      onBlur={() => handleBlur('email')}
                      style={{
                        ...styles.bookingInput,
                        borderColor: fieldErrors.email && touched.email ? "red" : undefined,
                      }}
                      placeholder="you@example.com"
                    />
                    {fieldErrors.email && touched.email && (
                      <span style={{ color: "red", fontSize: 11, display: "block", marginTop: 2 }}>
                        {fieldErrors.email}
                      </span>
                    )}
                  </label>

                  <label style={styles.bookingLabel}>
                    Notes (optional)
                    <textarea
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      style={styles.bookingTextarea}
                    />
                  </label>

                  <button 
                    type="submit" 
                    style={styles.bookingSubmitButton}
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Request Appointment"}
                  </button>

                  {bookingMessage && (
                    <p style={{ marginTop: 6, fontSize: 12, color: bookingMessage.startsWith("Thank you") ? "#bbf7d0" : "#fecaca" }}>
                      {bookingMessage}
                    </p>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ✅ ADD MODALS HERE */}
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

      <SuccessMessageModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        customerName={bookingName}
        appointmentDate={bookingDate}
        appointmentTime={bookingTime}
      />
    </section>
  );
}