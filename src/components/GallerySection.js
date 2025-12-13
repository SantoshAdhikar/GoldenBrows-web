// src/components/GallerySection.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../apiConfig";
import { styles } from "../styles";

const backendBase = API_BASE.replace("/api", "");

function GallerySection() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetch(`${API_BASE}/gallery/featured`);
        if (!res.ok) return;
        const data = await res.json();
        // Limit to 6 items for homepage
        setFeaturedItems(data.slice(0, 6));
      } catch (err) {
        console.error("Failed to load featured gallery", err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  if (loading || featuredItems.length === 0) {
    return null; // Don't show section if no featured items
  }

  return (
    <section style={styles.section}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16
      }}>
        <h2 style={styles.sectionTitle}>Our Work</h2>
        <Link
          to="/gallery"
          style={{
            fontSize: 14,
            color: "#674846",
            textDecoration: "underline"
          }}
        >
          View all →
        </Link>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 16,
      }}>
        {featuredItems.map((item) => (
          <Link
            key={item.id}
            to="/gallery"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div style={galleryPreviewCardStyle}>
              {/* Show before/after side by side if available */}
              {item.beforeImageUrl ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                  <div style={{ position: "relative" }}>
                    <img
                      src={backendBase + item.beforeImageUrl}
                      alt="Before"
                      style={previewImageStyle}
                    />
                    <div style={smallLabelStyle}>Before</div>
                  </div>
                  <div style={{ position: "relative" }}>
                    <img
                      src={backendBase + item.imageUrl}
                      alt="After"
                      style={previewImageStyle}
                    />
                    <div style={smallLabelStyle}>After</div>
                  </div>
                </div>
              ) : (
                <img
                  src={backendBase + item.imageUrl}
                  alt={item.title}
                  style={previewImageStyle}
                />
              )}

              <div style={{ padding: "8px 0" }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "#674846" }}>
                  {item.title}
                </h3>
                {item.category && (
                  <span style={{
                    fontSize: 10,
                    textTransform: "uppercase",
                    color: "#674846",
                    letterSpacing: 0.5
                  }}>
                    {item.category}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// Styles
const galleryPreviewCardStyle = {
  background: "rgba(255, 248, 220, 0.9)",
  borderRadius: 12,
  padding: 10,
  border: "1px solid rgba(103, 72, 70, 0.3)",
  boxShadow: "0 4px 12px rgba(103, 72, 70, 0.15)",
  transition: "transform 0.2s, box-shadow 0.2s",
  cursor: "pointer",
};

const previewImageStyle = {
  width: "100%",
  height: 150,
  objectFit: "cover",
  borderRadius: 8,
};

const smallLabelStyle = {
  position: "absolute",
  top: 4,
  left: 4,
  backgroundColor: "rgba(103, 72, 70, 0.9)",
  color: "#fff8dc",
  padding: "2px 6px",
  borderRadius: 3,
  fontSize: 9,
  fontWeight: 600,
  textTransform: "uppercase",
};

export default GallerySection;