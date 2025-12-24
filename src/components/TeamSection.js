// src/components/TeamSection.js
// 🎨 LIQUID GLASS UI - iPhone Control Center / Video Player Aesthetic
// Ultra-transparent glassmorphism with high-end blur effects
// ✅ CENTERED: Header and employee cards centered on page

import React, { useEffect, useState } from "react";
import { API_BASE } from "../apiConfig";
import { styles } from "../styles";

const backendBase = API_BASE.replace("/api", "");

function TeamSection() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contact, setContact] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

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

  // 🎨 LIQUID GLASS STYLES
  const liquidGlassStyles = {
    // Main section container
    section: {
      ...styles.section,
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",  // ✅ Center everything
    },

    // Header container with glass effect - CENTERED
    headerContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",  // ✅ Center content inside
      gap: 16,
      marginBottom: 40,
      padding: 24,
      borderRadius: 24,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(40px) saturate(180%)",
      WebkitBackdropFilter: "blur(40px) saturate(180%)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      maxWidth: "600px",  // ✅ Limit width for centered look
      width: "100%",
    },

    // Logo with glass border
    logoImage: {
      width: 120,
      height: 120,
      borderRadius: "50%",
      objectFit: "cover",
      display: "block",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
      transition: "all 0.3s ease",
    },

    // Section title with glass text effect
    sectionTitle: {
      fontSize: 42,
      fontWeight: 900,
      margin: 0,
      color: "#f808f8ff",
      textShadow: "0 2px 8px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.1)",
      letterSpacing: "-0.02em",
      textAlign: "center",  // ✅ Center text
    },

    // Subtitle
    subtitle: {
      fontSize: 14,
      color: "rgba(220, 26, 238, 0.83)",
      margin: "8px 0 0",
      fontWeight: 500,
      textAlign: "center",  // ✅ Center text
    },

    // Team grid - CENTERED
    teamGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
      gap: 24,
      marginBottom: 60,
      width: "100%",
      maxWidth: "900px",  // ✅ Limit width and center
      justifyContent: "center",  // ✅ Center grid items
    },

    // Team member card - Ultra liquid glass
    teamCard: (isHovered) => ({
      backgroundColor: isHovered 
        ? "rgba(255, 255, 255, 0.12)" 
        : "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(40px) saturate(180%)",
      WebkitBackdropFilter: "blur(40px) saturate(180%)",
      borderRadius: 24,
      padding: 0,
      border: isHovered 
        ? "1px solid rgba(255, 255, 255, 0.3)" 
        : "1px solid rgba(255, 255, 255, 0.2)",
      boxShadow: isHovered
        ? "0 20px 60px rgba(0, 0, 0, 0.25), 0 8px 24px rgba(0, 0, 0, 0.15)"
        : "0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: "pointer",
      overflow: "hidden",
      transform: isHovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
    }),

    // Image container
    imageContainer: {
      position: "relative",
      width: "100%",
      height: 300,
      borderRadius: "20px 20px 0 0",
      overflow: "hidden",
      marginBottom: 0,
    },

    // Team member image
    teamImage: (isHovered) => ({
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
      transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: isHovered ? "scale(1.1)" : "scale(1)",
      filter: isHovered ? "brightness(1.1) saturate(1.2)" : "brightness(1) saturate(1)",
    }),

    // Image overlay
    imageOverlay: (isHovered) => ({
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: isHovered
        ? "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)"
        : "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 100%)",
      transition: "all 0.4s ease",
      pointerEvents: "none",
    }),

    // Content container (below image)
    contentContainer: {
      padding: 24,
      backgroundColor: "rgba(255, 255, 255, 0.03)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
    },

    // Name
    memberName: {
      fontSize: 22,
      fontWeight: 800,
      margin: "0 0 8px",
      color: "#f131e8ff",
      textShadow: "0 2px 8px rgba(204, 17, 211, 0.93)",
      letterSpacing: "-0.01em",
    },

    // Role
    memberRole: {
      fontSize: 15,
      fontWeight: 600,
      margin: "0 0 12px",
      color: "rgba(248, 28, 248, 1)",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      display: "inline-block",
      padding: "4px 12px",
      borderRadius: 999,
      backgroundColor: "rgba(131, 63, 187, 0.25)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
    },

    // Specialties
    specialtiesLabel: {
      fontSize: 11,
      fontWeight: 800,
      color: "rgba(224, 17, 243, 1)",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      marginBottom: 6,
    },

    specialtiesText: {
      fontSize: 14,
      color: "rgba(191, 21, 243, 1)",
      lineHeight: 1.6,
      marginBottom: 12,
    },

    // Bio
    bio: {
      fontSize: 13,
      color: "rgba(250, 31, 221, 0.84)",
      lineHeight: 1.7,
      marginBottom: 0,
    },

    // Inactive badge
    inactiveBadge: {
      fontSize: 12,
      fontWeight: 700,
      color: "#ff6b6b",
      backgroundColor: "rgba(255, 107, 107, 0.15)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      padding: "6px 12px",
      borderRadius: 999,
      border: "1px solid rgba(255, 107, 107, 0.3)",
      marginTop: 12,
      display: "inline-block",
    },

    // Loading/error states with glass
    messageContainer: {
      padding: 32,
      borderRadius: 20,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(40px) saturate(180%)",
      WebkitBackdropFilter: "blur(40px) saturate(180%)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      textAlign: "center",
      color: "rgba(255, 255, 255, 0.9)",
      fontSize: 16,
      fontWeight: 600,
      maxWidth: "600px",  // ✅ Limit width for centered look
      width: "100%",
    },
  };

  return (
    <section id="team" style={liquidGlassStyles.section}>
      {/* ===== GLASS HEADER WITH LOGO - CENTERED ===== */}
      <div style={liquidGlassStyles.headerContainer}>
        {contact?.logoUrl && (
          <img
            src={backendBase + contact.logoUrl}
            alt={contact.salonName || "Golden Brows"}
            style={liquidGlassStyles.logoImage}
          />
        )}
        <div>
          <h2 style={liquidGlassStyles.sectionTitle}>Our Team</h2>
          {contact?.salonName && (
            <p style={liquidGlassStyles.subtitle}>{contact.salonName}</p>
          )}
        </div>
      </div>

      {/* ===== LOADING / ERROR STATES ===== */}
      {loading && (
        <div style={liquidGlassStyles.messageContainer}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>✨</div>
          Loading our amazing team...
        </div>
      )}

      {error && (
        <div style={{ ...liquidGlassStyles.messageContainer, borderColor: "rgba(255, 107, 107, 0.3)" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
          {error}
        </div>
      )}

      {!loading && !error && employees.length === 0 && (
        <div style={liquidGlassStyles.messageContainer}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>👥</div>
          Our team is coming soon!
        </div>
      )}

      {/* ===== TEAM GRID - CENTERED ===== */}
      <div style={liquidGlassStyles.teamGrid}>
        {employees.map((e) => {
          const isHovered = hoveredCard === e.id;

          return (
            <div
              key={e.id}
              style={liquidGlassStyles.teamCard(isHovered)}
              onMouseEnter={() => setHoveredCard(e.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Team member photo */}
              {e.photoUrl && (
                <div style={liquidGlassStyles.imageContainer}>
                  <img
                    src={backendBase + e.photoUrl}
                    alt={e.displayName || e.fullName}
                    style={liquidGlassStyles.teamImage(isHovered)}
                  />
                  <div style={liquidGlassStyles.imageOverlay(isHovered)} />
                </div>
              )}

              {/* Content area */}
              <div style={liquidGlassStyles.contentContainer}>
                {/* Name */}
                <h3 style={liquidGlassStyles.memberName}>
                  {e.displayName || e.fullName}
                </h3>

                {/* Role */}
                {e.role && (
                  <div style={liquidGlassStyles.memberRole}>{e.role}</div>
                )}

                {/* Specialties */}
                {e.specialties && (
                  <div style={{ marginTop: 16 }}>
                    <div style={liquidGlassStyles.specialtiesLabel}>
                      Specialties
                    </div>
                    <p style={liquidGlassStyles.specialtiesText}>
                      {e.specialties}
                    </p>
                  </div>
                )}

                {/* Bio */}
                {e.bio && (
                  <p style={liquidGlassStyles.bio}>{e.bio}</p>
                )}

                {/* Inactive badge */}
                {!e.active && (
                  <div style={liquidGlassStyles.inactiveBadge}>
                    Currently not taking appointments
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== COMPONENT STYLES ===== */}
      <style>{`
        /* Smooth animations */
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        /* Glass shine effect on hover */
        @keyframes glassShine {
          0% {
            transform: translateX(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) rotate(45deg);
          }
        }

        /* Ensure smooth transitions */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </section>
  );
}

export default TeamSection;