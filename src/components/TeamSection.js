// src/components/TeamSection.js
// FIXED: Uses teamGrid for larger cards + reasonable image heights

import React, { useEffect, useState } from "react";
import { API_BASE } from "../apiConfig";
import { styles } from "../styles";

// backend host, e.g. http://localhost:8080
const backendBase = API_BASE.replace("/api", "");

function TeamSection() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contact, setContact] = useState(null);

  useEffect(() => {
    async function loadEmployees() {
      try {
        const res = await fetch(`${API_BASE}/employees`);
        if (!res.ok) throw new Error("Failed to load employees");
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    async function loadContact() {
      try {
        const res = await fetch(`${API_BASE}/contact`);
        if (!res.ok) return;
        const data = await res.json();
        setContact(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadEmployees();
    loadContact();
  }, []);

  return (
    <section id="team" style={styles.section}>
      {/* Header with logo + salon name */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {contact?.logoUrl && (
          <img
            src={backendBase + contact.logoUrl}
            alt={contact.salonName || "Golden Brows"}
            style={{
              width: 140,
              height: 140,
              borderRadius: "50%",
              objectFit: "cover",
              display: "block",
            }}
          />
        )}
        <div>
          <h2 style={styles.sectionTitle}>Our Team</h2>
          {contact?.salonName && (
            <p style={{ fontSize: 13, color: "#555" }}>{contact.salonName}</p>
          )}
        </div>
      </div>

      {loading && <p>Loading team...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && employees.length === 0 && (
        <p>Team coming soon.</p>
      )}

      {/* ✅ CHANGED: servicesGrid → teamGrid */}
      <div style={styles.teamGrid}>
        {employees.map((e) => (
          <div key={e.id} style={styles.serviceCard}>
            {e.photoUrl && (
              <div style={{ marginBottom: 8 }}>
                <img
                  src={backendBase + e.photoUrl}
                  alt={e.displayName || e.fullName}
                  style={{
                    width: "100%",
                    height: 300,  // ✅ CHANGED: 500 → 300
                    borderRadius: 8,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            )}

            <h3 style={{ marginBottom: 6 }}>
              {e.displayName || e.fullName}
            </h3>
            {e.role && (
              <p style={{ marginBottom: 4, fontSize: 14 }}>{e.role}</p>
            )}
            {e.specialties && (
              <p style={{ marginBottom: 4, fontSize: 13 }}>
                <strong>Specialties:</strong> {e.specialties}
              </p>
            )}
            {e.bio && (
              <p style={{ marginBottom: 4, fontSize: 13 }}>{e.bio}</p>
            )}
            {!e.active && (
              <p style={{ color: "red", fontSize: 13 }}>
                Currently not taking appointments
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default TeamSection;