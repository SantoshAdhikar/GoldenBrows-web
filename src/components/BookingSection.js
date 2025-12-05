// src/components/BookingSection.js
import React, { useEffect, useState } from "react";
import { API_BASE } from "../apiConfig";
import { styles } from "../styles";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// format 10 digits as XXX-XXX-XXXX
function formatUsPhone(digits) {
  const d = digits.slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
}

// validate U.S. phone using libphonenumber
function isValidUsPhone(digitsOnly) {
  if (digitsOnly.length !== 10) return false;
  const phoneNumber = parsePhoneNumberFromString(`+1${digitsOnly}`, "US");
  return !!phoneNumber && phoneNumber.isValid();
}

// pretty label like "02:30 PM"
function formatTimeLabel(hhmm) {
  if (!hhmm) return "";
  const [hStr, mStr] = hhmm.split(":");
  let h = parseInt(hStr, 10);
  const suffix = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${h}:${mStr} ${suffix}`;
}

export default function BookingSection() {
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [selectedServiceIds, setSelectedServiceIds] = useState([]);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [timesLoading, setTimesLoading] = useState(false);
  const [timesError, setTimesError] = useState("");

  const [employeeId, setEmployeeId] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState(""); // formatted: XXX-XXX-XXXX
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    phone: "",
  });

  // ---------------- LOAD SERVICES + EMPLOYEES ----------------
  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch(`${API_BASE}/services`);
        if (!res.ok) throw new Error("Failed to load services");
        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    }

    async function loadEmployees() {
      try {
        const res = await fetch(`${API_BASE}/employees`);
        if (!res.ok) return;
        const data = await res.json();
        setEmployees(data);
      } catch {
        // ignore
      }
    }

    loadServices();
    loadEmployees();
  }, []);

  function toggleService(id) {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  // ---------------- LOAD AVAILABLE TIMES (NEEDS BACKEND) ----------------
  useEffect(() => {
    async function loadAvailableTimes() {
      if (!date) {
        setAvailableTimes([]);
        return;
      }

      setTimesLoading(true);
      setTimesError("");

      try {
        const params = new URLSearchParams({ date }); // yyyy-mm-dd
        if (employeeId) params.append("employeeId", employeeId);

        // Backend endpoint you need to create (see section 3 below)
        const res = await fetch(
          `${API_BASE}/appointments/available-times?` + params.toString()
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to load available times");
        }

        const data = await res.json(); // expect ["09:00","09:30",...]
        setAvailableTimes(data);
      } catch (err) {
        console.error("Time load error:", err);
        setTimesError(err.message || "Failed to load available times");
        setAvailableTimes([]);
      } finally {
        setTimesLoading(false);
      }
    }

    loadAvailableTimes();
  }, [date, employeeId]);

  // ---------------- PHONE CHANGE (format + live validation) ----------------
  function handlePhoneChange(e) {
    const raw = e.target.value;
    const digits = raw.replace(/\D/g, "");

    // stop at 10 digits
    if (digits.length > 10) return;

    const formatted = formatUsPhone(digits);
    setPhone(formatted);

    // live feedback
    if (digits.length === 0) {
      setFieldErrors((prev) => ({ ...prev, phone: "" }));
      return;
    }

    if (digits.length < 10) {
      setFieldErrors((prev) => ({
        ...prev,
        phone: "U.S. numbers are 10 digits.",
      }));
      return;
    }

    if (!isValidUsPhone(digits)) {
      setFieldErrors((prev) => ({
        ...prev,
        phone: "Please enter a valid U.S. phone number.",
      }));
    } else {
      setFieldErrors((prev) => ({ ...prev, phone: "" }));
    }
  }

  // simple email check
  function isValidEmail(value) {
    const trimmed = value.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(trimmed);
  }

  // ---------------- SUBMIT ----------------
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setFieldErrors({ email: "", phone: "" });

    if (selectedServiceIds.length === 0) {
      setError("At least one service must be selected.");
      return;
    }

    if (!date || !time || !name.trim() || !phone.trim() || !email.trim()) {
      setError("Date, time, name, phone, and email are required.");
      return;
    }

    // email validation
    if (!isValidEmail(email)) {
      setFieldErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address.",
      }));
      setError("Please fix the highlighted fields.");
      return;
    }

    const digitsOnly = phone.replace(/\D/g, "");
    if (!isValidUsPhone(digitsOnly)) {
      setFieldErrors((prev) => ({
        ...prev,
        phone: "Please enter a valid 10-digit U.S. phone number.",
      }));
      setError("Please fix the highlighted fields.");
      return;
    }

    const payload = {
      serviceIds: selectedServiceIds,
      customerName: name.trim(),
      phone: phone.trim(), // backend will strip non-digits
      email: email.trim(),
      date, // "2025-11-28"
      time, // "13:30" from select
      notes: notes.trim() || null,
      employeeId: employeeId ? Number(employeeId) : null,
    };

    setSubmitting(true);

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
        throw new Error(
          text && text.length < 300
            ? text
            : `Failed to book appointment (HTTP ${res.status})`
        );
      }

      setSuccess(
        "Your appointment request has been sent. We will confirm by phone or text."
      );
      setSelectedServiceIds([]);
      setNotes("");
    } catch (err) {
      console.error("Booking error:", err);
      setError(err.message || "Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  }

  // ---------------- RENDER ----------------
  return (
    <section id="booking-section" style={styles.section}>
      <h2 style={styles.sectionTitle}>Book an Appointment</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Services */}
        <label style={styles.label}>Select services</label>
        <div
          style={{
            border: "1px solid #e0d6cf",
            borderRadius: 6,
            maxHeight: 220,
            overflowY: "auto",
            padding: 8,
            marginBottom: 8,
            fontSize: 14,
          }}
        >
          {services.length === 0 && <p>No services available yet.</p>}
          {services
            .filter((s) => s.active)
            .map((s) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedServiceIds.includes(s.id)}
                  onChange={() => toggleService(s.id)}
                  style={{ marginRight: 6 }}
                />
                <span>
                  {s.name}{" "}
                  <span style={{ color: "#555" }}>
                    ${s.price} · {s.durationMinutes} min
                  </span>
                </span>
              </div>
            ))}
        </div>
        <p style={{ fontSize: 12, marginBottom: 16 }}>
          You can choose more than one service for the same visit.
        </p>

        {/* Date / time */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 8,
          }}
        >
          <label style={{ ...styles.label, flex: 1, minWidth: 160 }}>
            Date
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={styles.input}
            />
          </label>

          <label style={{ ...styles.label, flex: 1, minWidth: 140 }}>
            Time
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={styles.input}
            >
              <option value="">Select a time</option>
              {availableTimes.map((t) => (
                <option key={t} value={t}>
                  {formatTimeLabel(t)}
                </option>
              ))}
            </select>
            {timesLoading && (
              <span style={{ fontSize: 11 }}>Loading available times…</span>
            )}
            {timesError && (
              <span style={{ fontSize: 11, color: "red" }}>{timesError}</span>
            )}
            {date && !timesLoading && availableTimes.length === 0 && !timesError && (
              <span style={{ fontSize: 11 }}>No times available for this day.</span>
            )}
          </label>
        </div>

        {/* Staff */}
        <label style={styles.label}>
          Preferred staff (optional)
          <select
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            style={styles.input}
          >
            <option value="">Any staff</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.displayName || emp.fullName}
              </option>
            ))}
          </select>
        </label>

        {/* Customer info */}
        <label style={styles.label}>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Phone (U.S.)
          <div style={{ display: "flex", gap: 8 }}>
            <span
              style={{
                padding: "8px 10px",
                borderRadius: 6,
                border: "1px solid #e0d6cf",
                fontSize: 13,
                background: "#f7f2ee",
                whiteSpace: "nowrap",
              }}
            >
              +1
            </span>
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              style={{ ...styles.input, flex: 1 }}
              placeholder="000-000-0000"
              maxLength={12} // 10 digits + 2 hyphens
            />
          </div>
          {fieldErrors.phone && (
            <span style={{ color: "red", fontSize: 12 }}>
              {fieldErrors.phone}
            </span>
          )}
        </label>

        <label style={styles.label}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            placeholder="you@example.com"
          />
          {fieldErrors.email && (
            <span style={{ color: "red", fontSize: 12 }}>
              {fieldErrors.email}
            </span>
          )}
        </label>

        <label style={styles.label}>
          Notes (optional)
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ ...styles.input, minHeight: 80, resize: "vertical" }}
          />
        </label>

        <button
          type="submit"
          style={styles.primaryButton}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Request Appointment"}
        </button>

        {error && (
          <p style={{ color: "red", marginTop: 8, fontSize: 13 }}>{error}</p>
        )}
        {success && (
          <p style={{ color: "green", marginTop: 8, fontSize: 13 }}>
            {success}
          </p>
        )}
      </form>
    </section>
  );
}
