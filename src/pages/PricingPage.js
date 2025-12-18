// src/pages/PricingPage.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../apiConfig";
import { styles } from "../styles";

function PricingPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const res = await fetch(`${API_BASE}/services`);
      if (!res.ok) throw new Error("Failed to load services");
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error("Failed to load services:", err);
    } finally {
      setLoading(false);
    }
  }

  // Group services by category
  const groupedServices = services.reduce((acc, service) => {
    const category = service.category || "Other Services";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {});

  return (
    <main style={styles.main}>
      {/* Hero Section */}
      <section style={heroSectionStyle}>
        <h1 style={heroTitleStyle}>Our Pricing</h1>
        <p style={heroSubtitleStyle}>
          Transparent, affordable pricing for all our beauty services. No hidden fees, no surprises.
        </p>
      </section>

      {/* Pricing by Category */}
      <section style={styles.section}>
        {loading ? (
          <p>Loading services...</p>
        ) : (
          <>
            {Object.entries(groupedServices).map(([category, categoryServices]) => (
              <div key={category} style={categoryContainerStyle}>
                <h2 style={categoryTitleStyle}>{category}</h2>
                <div style={pricingGridStyle}>
                  {categoryServices.map((service) => (
                    <div key={service.id} style={priceCardStyle}>
                      {/* Popular Badge */}
                      {service.name.toLowerCase().includes("eyebrow") && (
                        <div style={popularBadgeStyle}>
                          ⭐ Most Popular
                        </div>
                      )}

                      {/* Service Name */}
                      <h3 style={serviceNameStyle}>{service.name}</h3>

                      {/* Description */}
                      {service.description && (
                        <p style={serviceDescStyle}>{service.description}</p>
                      )}

                      {/* Price & Duration */}
                      <div style={priceRowStyle}>
                        <div style={priceStyle}>
                          ${service.price?.toFixed(2) || "0.00"}
                        </div>
                        {service.durationMinutes && (
                          <div style={durationStyle}>
                            {service.durationMinutes} min
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </section>

      {/* Package Deals */}
      <section style={styles.section}>
        <h2 style={packageSectionTitleStyle}>💎 Package Deals</h2>
        <div style={packagesGridStyle}>
          {/* Package 1 */}
          <div style={packageCardStyle}>
            <div style={packageBadgeStyle}>SAVE $15</div>
            <h3 style={packageTitleStyle}>Monthly Beauty Package</h3>
            <div style={packagePriceStyle}>
              <span style={oldPriceStyle}>$80</span>
              <span style={newPriceStyle}>$65</span>
            </div>
            <ul style={packageListStyle}>
              <li>✓ 4 Eyebrow Threading Sessions</li>
              <li>✓ 1 Upper Lip Threading</li>
              <li>✓ Valid for 30 days</li>
              <li>✓ Save $15 total</li>
            </ul>
            <Link to="/services" style={packageButtonStyle}>
              Get This Package
            </Link>
          </div>

          {/* Package 2 */}
          <div style={{ ...packageCardStyle, ...featuredPackageStyle }}>
            <div style={bestValueBadgeStyle}>⭐ BEST VALUE</div>
            <h3 style={packageTitleStyle}>Full Face Package</h3>
            <div style={packagePriceStyle}>
              <span style={oldPriceStyle}>$45</span>
              <span style={newPriceStyle}>$35</span>
            </div>
            <ul style={packageListStyle}>
              <li>✓ Eyebrow Threading</li>
              <li>✓ Upper Lip Threading</li>
              <li>✓ Chin Threading</li>
              <li>✓ Sideburns Threading</li>
              <li>✓ Save $10</li>
            </ul>
            <Link to="/services" style={{ ...packageButtonStyle, ...featuredButtonStyle }}>
              Most Popular Choice
            </Link>
          </div>

          {/* Package 3 */}
          <div style={packageCardStyle}>
            <div style={packageBadgeStyle}>SAVE $8</div>
            <h3 style={packageTitleStyle}>Quick Refresh</h3>
            <div style={packagePriceStyle}>
              <span style={oldPriceStyle}>$25</span>
              <span style={newPriceStyle}>$17</span>
            </div>
            <ul style={packageListStyle}>
              <li>✓ Eyebrow Threading</li>
              <li>✓ Upper Lip Threading</li>
              <li>✓ Perfect for maintenance</li>
              <li>✓ Save $8</li>
            </ul>
            <Link to="/services" style={packageButtonStyle}>
              Get This Package
            </Link>
          </div>
        </div>
      </section>

      {/* Add-Ons */}
      <section style={styles.section}>
        <h2 style={addonsSectionTitleStyle}>➕ Add-Ons</h2>
        <p style={{ fontSize: 15, color: "#674846", marginBottom: 24, textAlign: "center" }}>
          Enhance any service with these affordable add-ons
        </p>
        <div style={addonsGridStyle}>
          <div style={addonCardStyle}>
            <div style={addonIconStyle}>💆</div>
            <h4 style={addonNameStyle}>Eyebrow Tinting</h4>
            <p style={addonDescStyle}>Define your brows with natural color</p>
            <div style={addonPriceStyle}>+$10</div>
          </div>

          <div style={addonCardStyle}>
            <div style={addonIconStyle}>✨</div>
            <h4 style={addonNameStyle}>Brow Shaping</h4>
            <p style={addonDescStyle}>Professional arch design</p>
            <div style={addonPriceStyle}>+$5</div>
          </div>

          <div style={addonCardStyle}>
            <div style={addonIconStyle}>🌟</div>
            <h4 style={addonNameStyle}>Soothing Gel</h4>
            <p style={addonDescStyle}>Calm and moisturize after threading</p>
            <div style={addonPriceStyle}>+$3</div>
          </div>

          <div style={addonCardStyle}>
            <div style={addonIconStyle}>💎</div>
            <h4 style={addonNameStyle}>Premium Treatment</h4>
            <p style={addonDescStyle}>Full face + tinting + gel</p>
            <div style={addonPriceStyle}>+$15</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.section}>
        <div style={ctaSectionStyle}>
          <h2 style={ctaTitleStyle}>Ready to Book?</h2>
          <p style={ctaDescStyle}>
            Book your appointment now and experience the Golden Brows difference!
          </p>
          <Link to="/services" style={ctaButtonStyle}>
            Book Your Appointment
          </Link>
          <p style={ctaNoticeStyle}>
            💡 All prices include consultation. First-time clients get 20% off!
          </p>
        </div>
      </section>
    </main>
  );
}

// ============================================
// STYLES
// ============================================

const heroSectionStyle = {
  textAlign: "center",
  padding: "40px 24px",
  background: "linear-gradient(135deg, rgba(255, 248, 220, 0.4) 0%, rgba(103, 72, 70, 0.1) 100%)",
  borderRadius: 20,
  margin: "0 24px 32px"
};

const heroTitleStyle = {
  fontSize: 36,
  fontWeight: "bold",
  color: "#674846",
  marginBottom: 12
};

const heroSubtitleStyle = {
  fontSize: 16,
  color: "#674846",
  maxWidth: 600,
  margin: "0 auto"
};

const categoryContainerStyle = {
  marginBottom: 48
};

const categoryTitleStyle = {
  fontSize: 28,
  fontWeight: "bold",
  color: "#674846",
  marginBottom: 24,
  paddingBottom: 12,
  borderBottom: "3px solid rgba(103, 72, 70, 0.3)"
};

const pricingGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: 20
};

const priceCardStyle = {
  position: "relative",
  background: "rgba(255, 248, 220, 0.95)",
  backdropFilter: "blur(10px)",
  borderRadius: 16,
  padding: 24,
  border: "2px solid rgba(103, 72, 70, 0.25)",
  boxShadow: "0 12px 35px rgba(103, 72, 70, 0.2)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  cursor: "pointer",
  boxSizing: "border-box"
};

const popularBadgeStyle = {
  position: "absolute",
  top: -12,
  right: 16,
  backgroundColor: "#f59e0b",
  color: "white",
  padding: "6px 14px",
  borderRadius: 20,
  fontSize: 12,
  fontWeight: "bold",
  boxShadow: "0 4px 12px rgba(245, 158, 11, 0.4)"
};

const serviceNameStyle = {
  fontSize: 20,
  fontWeight: "bold",
  color: "#674846",
  marginBottom: 8,
  marginTop: 8
};

const serviceDescStyle = {
  fontSize: 14,
  color: "#674846",
  marginBottom: 16,
  lineHeight: 1.5,
  opacity: 0.9
};

const priceRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingTop: 16,
  borderTop: "1px solid rgba(103, 72, 70, 0.2)"
};

const priceStyle = {
  fontSize: 28,
  fontWeight: "bold",
  color: "#674846"
};

const durationStyle = {
  fontSize: 14,
  color: "#674846",
  backgroundColor: "rgba(103, 72, 70, 0.1)",
  padding: "4px 12px",
  borderRadius: 12,
  fontWeight: 500
};

// Package Deals Styles
const packageSectionTitleStyle = {
  fontSize: 32,
  fontWeight: "bold",
  color: "#674846",
  textAlign: "center",
  marginBottom: 32
};

const packagesGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: 24,
  marginTop: 24
};

const packageCardStyle = {
  position: "relative",
  background: "rgba(255, 248, 220, 0.95)",
  backdropFilter: "blur(10px)",
  borderRadius: 20,
  padding: 32,
  border: "2px solid rgba(103, 72, 70, 0.3)",
  boxShadow: "0 15px 45px rgba(103, 72, 70, 0.25)",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column"
};

const featuredPackageStyle = {
  background: "linear-gradient(135deg, rgba(255, 248, 220, 0.98) 0%, rgba(255, 237, 185, 0.98) 100%)",
  border: "3px solid #f59e0b",
  transform: "scale(1.05)",
  boxShadow: "0 20px 60px rgba(245, 158, 11, 0.3)"
};

const packageBadgeStyle = {
  position: "absolute",
  top: -12,
  right: 20,
  backgroundColor: "#10b981",
  color: "white",
  padding: "6px 16px",
  borderRadius: 20,
  fontSize: 13,
  fontWeight: "bold",
  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)"
};

const bestValueBadgeStyle = {
  position: "absolute",
  top: -12,
  right: 20,
  backgroundColor: "#f59e0b",
  color: "white",
  padding: "8px 18px",
  borderRadius: 20,
  fontSize: 13,
  fontWeight: "bold",
  boxShadow: "0 6px 16px rgba(245, 158, 11, 0.5)"
};

const packageTitleStyle = {
  fontSize: 24,
  fontWeight: "bold",
  color: "#674846",
  marginBottom: 16,
  marginTop: 8
};

const packagePriceStyle = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 20
};

const oldPriceStyle = {
  fontSize: 20,
  color: "#9ca3af",
  textDecoration: "line-through"
};

const newPriceStyle = {
  fontSize: 36,
  fontWeight: "bold",
  color: "#674846"
};

const packageListStyle = {
  listStyle: "none",
  padding: 0,
  margin: "0 0 24px 0",
  flex: 1
};

const packageButtonStyle = {
  display: "block",
  textAlign: "center",
  padding: "14px 24px",
  backgroundColor: "#674846",
  color: "#fff8dc",
  borderRadius: 999,
  textDecoration: "none",
  fontSize: 16,
  fontWeight: 600,
  boxShadow: "0 4px 14px rgba(103, 72, 70, 0.4)",
  transition: "all 0.3s ease",
  marginTop: "auto"
};

const featuredButtonStyle = {
  backgroundColor: "#f59e0b",
  boxShadow: "0 6px 20px rgba(245, 158, 11, 0.4)"
};

// Add-ons Styles
const addonsSectionTitleStyle = {
  fontSize: 32,
  fontWeight: "bold",
  color: "#674846",
  textAlign: "center",
  marginBottom: 12
};

const addonsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 20
};

const addonCardStyle = {
  textAlign: "center",
  background: "rgba(255, 248, 220, 0.9)",
  backdropFilter: "blur(10px)",
  borderRadius: 16,
  padding: 24,
  border: "2px solid rgba(103, 72, 70, 0.2)",
  boxShadow: "0 8px 24px rgba(103, 72, 70, 0.15)",
  boxSizing: "border-box"
};

const addonIconStyle = {
  fontSize: 40,
  marginBottom: 12
};

const addonNameStyle = {
  fontSize: 18,
  fontWeight: "bold",
  color: "#674846",
  marginBottom: 8
};

const addonDescStyle = {
  fontSize: 13,
  color: "#674846",
  marginBottom: 12,
  opacity: 0.8
};

const addonPriceStyle = {
  fontSize: 22,
  fontWeight: "bold",
  color: "#10b981"
};

// CTA Styles
const ctaSectionStyle = {
  textAlign: "center",
  background: "linear-gradient(135deg, #674846 0%, #9d7b75 100%)",
  borderRadius: 24,
  padding: "48px 32px",
  boxShadow: "0 20px 60px rgba(103, 72, 70, 0.3)"
};

const ctaTitleStyle = {
  fontSize: 32,
  fontWeight: "bold",
  color: "#fff8dc",
  marginBottom: 12
};

const ctaDescStyle = {
  fontSize: 16,
  color: "#fff8dc",
  marginBottom: 24,
  opacity: 0.95
};

const ctaButtonStyle = {
  display: "inline-block",
  padding: "16px 40px",
  backgroundColor: "#fff8dc",
  color: "#674846",
  borderRadius: 999,
  textDecoration: "none",
  fontSize: 18,
  fontWeight: "bold",
  boxShadow: "0 6px 24px rgba(255, 248, 220, 0.3)",
  transition: "all 0.3s ease"
};

const ctaNoticeStyle = {
  fontSize: 14,
  color: "#fff8dc",
  marginTop: 20,
  opacity: 0.9
};

export default PricingPage;