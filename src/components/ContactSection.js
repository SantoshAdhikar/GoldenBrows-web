// src/components/ContactSection.js
import React, { useEffect, useState } from "react";
import { API_BASE } from "../apiConfig";
import { styles } from "../styles";

function ContactSection() {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadContact() {
      try {
        const res = await fetch(`${API_BASE}/contact`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to load contact info");
        }
        const data = await res.json();
        setContact(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadContact();
  }, []);

  if (loading) {
    return (
      <section id="contact" style={styles.section}>
        <h2 style={styles.sectionTitle}>Contact</h2>
        <p>Loading contact info...</p>
      </section>
    );
  }

  if (error || !contact) {
    return (
      <section id="contact" style={styles.section}>
        <h2 style={styles.sectionTitle}>Contact</h2>
        <p style={{ color: "red" }}>
          {error || "Contact information not available yet."}
        </p>
      </section>
    );
  }

  const salonName =
    contact.salonName || "Golden Brows Threading & Beauty Studio";

  return (
    <section id="contact" style={styles.section}>
      <h2 style={styles.sectionTitle}>Contact &amp; Location</h2>

      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
        }}
      >
        {/* LEFT: logo + address + phone/email */}
        <div>
          {contact.logoUrl && (
            <div style={{ marginBottom: 12 }}>
              <img
                src={contact.logoUrl}
                alt={salonName}
                style={{ maxWidth: 180, height: "auto" }}
              />
            </div>
          )}

          <p style={{ marginBottom: 6 }}>
            <strong>{salonName}</strong>
          </p>

          {(contact.addressLine1 || contact.addressLine2) && (
            <p style={{ marginBottom: 6, whiteSpace: "pre-line" }}>
              {contact.addressLine1}
              {contact.addressLine2 ? "\n" + contact.addressLine2 : ""}
            </p>
          )}

          {contact.phone && (
            <p style={{ marginBottom: 4 }}>
              <strong>Phone:</strong>{" "}
              <a
                href={`tel:${contact.phone}`}
                style={{ color: "#b07c4f", textDecoration: "none" }}
              >
                {contact.phone}
              </a>
            </p>
          )}

          {contact.email && (
            <p style={{ marginBottom: 4 }}>
              <strong>Email:</strong>{" "}
              <a
                href={`mailto:${contact.email}`}
                style={{ color: "#b07c4f", textDecoration: "none" }}
              >
                {contact.email}
              </a>
            </p>
          )}

          <div
            style={{
              marginTop: 10,
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                style={{
                  ...styles.primaryButton,
                  textDecoration: "none",
                  fontSize: 13,
                  padding: "8px 14px",
                }}
              >
                Call now
              </a>
            )}
            {contact.googleMapsUrl && (
              <a
                href={contact.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  ...styles.primaryButton,
                  backgroundColor: "#fff",
                  color: "#b07c4f",
                  border: "1px solid #b07c4f",
                  textDecoration: "none",
                  fontSize: 13,
                  padding: "8px 14px",
                }}
              >
                Get directions
              </a>
            )}
          </div>
        </div>

        {/* RIGHT: social links */}
        <div>
          <h3 style={{ marginBottom: 8, fontSize: 16 }}>Follow us</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {contact.instagramUrl && (
              <a
                href={contact.instagramUrl}
                target="_blank"
                rel="noreferrer"
                style={socialLinkStyle}
              >
                Instagram
              </a>
            )}
            {contact.facebookUrl && (
              <a
                href={contact.facebookUrl}
                target="_blank"
                rel="noreferrer"
                style={socialLinkStyle}
              >
                Facebook
              </a>
            )}
            {contact.tiktokUrl && (
              <a
                href={contact.tiktokUrl}
                target="_blank"
                rel="noreferrer"
                style={socialLinkStyle}
              >
                TikTok
              </a>
            )}
            {contact.yelpUrl && (
              <a
                href={contact.yelpUrl}
                target="_blank"
                rel="noreferrer"
                style={socialLinkStyle}
              >
                Yelp
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const socialLinkStyle = {
  fontSize: 14,
  textDecoration: "none",
  color: "#b07c4f",
};

export default ContactSection;
