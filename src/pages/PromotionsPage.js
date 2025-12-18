// src/pages/PromotionsPage.js
import React, { useEffect, useState } from "react";
import { API_BASE } from "../apiConfig";
import { styles } from "../styles";

function PromotionsPage() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPromotions();
  }, []);

  async function loadPromotions() {
    try {
      const res = await fetch(`${API_BASE}/promotions`);
      if (!res.ok) throw new Error("Failed to load promotions");
      const data = await res.json();
      setPromotions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const isExpiringSoon = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return daysLeft <= 7 && daysLeft > 0;
  };

  return (
    <main style={styles.main}>
      <section style={styles.section}>
        <h1 style={styles.sectionTitle}>Current Promotions & Special Offers</h1>
        <p style={styles.sectionSubtitle}>
          Save on your favorite services with our limited-time offers!
        </p>

        {loading && <p>Loading promotions...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && promotions.length === 0 && (
          <div style={emptyStateStyle}>
            <p style={{ fontSize: 18, color: "#674846", marginBottom: 16 }}>
              No active promotions at the moment.
            </p>
            <p style={{ fontSize: 14, color: "#674846", opacity: 0.8 }}>
              Check back soon for exciting deals!
            </p>
          </div>
        )}

        <div style={promotionsGridStyle}>
          {promotions.map((promo) => (
            <div key={promo.id} style={promoCardStyle}>
              {/* Discount Badge */}
              {promo.discountText && (
                <div style={cardDiscountBadgeStyle}>
                  {promo.discountText}
                </div>
              )}

              {/* Expiring Soon Badge */}
              {isExpiringSoon(promo.endDate) && (
                <div style={expiringSoonBadgeStyle}>
                  ⏰ Ending Soon!
                </div>
              )}

              {/* Content */}
              <h3 style={cardTitleStyle}>{promo.title}</h3>
              <p style={cardDescriptionStyle}>{promo.description}</p>

              {/* Promo Code */}
              {promo.code && (
                <div style={cardPromoCodeStyle}>
                  <span style={{ fontSize: 12, color: "#674846", opacity: 0.8 }}>
                    Promo Code:
                  </span>
                  <div style={cardCodeBoxStyle}>
                    {promo.code}
                  </div>
                </div>
              )}

              {/* Valid Dates */}
              <div style={validDatesStyle}>
                <span>📅 Valid: {formatDate(promo.startDate)} - {formatDate(promo.endDate)}</span>
              </div>

              {/* Terms */}
              {promo.termsAndConditions && (
                <p style={cardTermsStyle}>
                  * {promo.termsAndConditions}
                </p>
              )}

              {/* CTA Button */}
              <a
                href="/services"
                style={{
                  ...styles.primaryButton,
                  textDecoration: "none",
                  display: "block",
                  marginTop: 16,
                  width: "100%",
                  textAlign: "center",
                  boxSizing: "border-box"
                }}
              >
                Book Now
              </a>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

// Styles
const emptyStateStyle = {
  textAlign: "center",
  padding: "60px 20px",
  background: "rgba(255, 248, 220, 0.5)",
  borderRadius: 16,
  border: "2px dashed rgba(103, 72, 70, 0.3)"
};

const promotionsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: 24,
  marginTop: 24
};

const promoCardStyle = {
  position: "relative",
  background: "rgba(255, 248, 220, 0.95)",
  backdropFilter: "blur(10px)",
  borderRadius: 20,
  padding: 28,
  border: "2px solid rgba(103, 72, 70, 0.25)",
  boxShadow: "0 15px 45px rgba(103, 72, 70, 0.25), 0 8px 25px rgba(0, 0, 0, 0.12)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  cursor: "pointer",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column"
};

const cardDiscountBadgeStyle = {
  position: "absolute",
  top: -12,
  right: 20,
  backgroundColor: "#ff6b6b",
  color: "#ffffff",
  padding: "8px 16px",
  borderRadius: 8,
  fontSize: 16,
  fontWeight: "bold",
  boxShadow: "0 4px 12px rgba(255, 107, 107, 0.4)",
  transform: "rotate(-3deg)"
};

const expiringSoonBadgeStyle = {
  position: "absolute",
  top: -12,
  left: 20,
  backgroundColor: "#f59e0b",
  color: "#ffffff",
  padding: "6px 12px",
  borderRadius: 8,
  fontSize: 13,
  fontWeight: "bold",
  boxShadow: "0 4px 12px rgba(245, 158, 11, 0.4)"
};

const cardTitleStyle = {
  fontSize: 22,
  fontWeight: "bold",
  color: "#674846",
  marginBottom: 12,
  marginTop: 8
};

const cardDescriptionStyle = {
  fontSize: 15,
  color: "#674846",
  lineHeight: 1.6,
  marginBottom: 16
};

const cardPromoCodeStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  marginBottom: 16
};

const cardCodeBoxStyle = {
  backgroundColor: "#ca3126ff",
  color: "#fff8dc",
  padding: "12px 16px",
  borderRadius: 8,
  fontSize: 18,
  fontWeight: "bold",
  letterSpacing: 2,
  textAlign: "center",
  fontFamily: "monospace",
  border: "2px dashed rgba(255, 248, 220, 0.3)"
};

const validDatesStyle = {
  fontSize: 13,
  color: "#674846",
  opacity: 0.8,
  marginBottom: 8
};

const cardTermsStyle = {
  fontSize: 11,
  color: "#674846",
  opacity: 0.7,
  fontStyle: "italic",
  marginTop: 12,
  paddingTop: 12,
  borderTop: "1px solid rgba(103, 72, 70, 0.2)"
};

export default PromotionsPage;