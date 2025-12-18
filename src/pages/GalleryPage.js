// src/pages/GalleryPage.js
import React, { useEffect, useState } from "react";
import { API_BASE } from "../apiConfig";
import { styles } from "../styles";

const backendBase = API_BASE.replace("/api", "");

function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    loadGallery();
    
    // Track gallery page view
    if (window.gtag) {
      window.gtag('event', 'view_gallery', {
        event_category: 'engagement',
        value: 1
      });
    }
  }, []);

  async function loadGallery() {
    try {
      console.log("Fetching gallery from:", `${API_BASE}/gallery`);
      
      const res = await fetch(`${API_BASE}/gallery`);
      
      console.log("Response status:", res.status);
      console.log("Response ok:", res.ok);
      
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to load gallery: ${res.status} - ${text}`);
      }
      
      const data = await res.json();
      console.log("Gallery data received:", data);
      
      setGalleryItems(data);
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Gallery load error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Get unique categories
  const categories = ["all", ...new Set(galleryItems.map(item => item.category).filter(Boolean))];

  // Filter by category
  const filteredItems = selectedCategory === "all" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <main style={styles.main}>
      <section style={styles.section}>
        <h1 style={styles.sectionTitle}>Our Work Gallery</h1>
        <p style={styles.sectionSubtitle}>
          See the amazing transformations and results from Golden Brows
        </p>

        {/* Category Filter */}
        <div style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginBottom: 24,
          justifyContent: "center"
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                ...styles.primaryButton,
                backgroundColor: selectedCategory === cat ? "#674846" : "transparent",
                color: selectedCategory === cat ? "#fff8dc" : "#674846",
                border: "1px solid #674846",
                padding: "8px 16px",
                fontSize: 14,
                textTransform: "capitalize"
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading && <p>Loading gallery...</p>}
        {error && (
          <div>
            <p style={{ color: "red" }}>{error}</p>
            <button 
              onClick={loadGallery}
              style={{
                ...styles.primaryButton,
                marginTop: 10
              }}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filteredItems.length === 0 && (
          <p>No gallery items yet.</p>
        )}

        {/* Gallery Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
        }}>
          {filteredItems.map((item) => (
            <div key={item.id} style={galleryCardStyle}>
              {/* Before/After Layout */}
              {item.beforeImageUrl ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {/* Before Image */}
                  <div style={{ position: "relative" }}>
                    <img
                      src={backendBase + item.beforeImageUrl}
                      alt="Before"
                      style={galleryImageStyle}
                      onClick={() => setLightboxImage(backendBase + item.beforeImageUrl)}
                      onError={(e) => {
                        console.error("Failed to load before image:", backendBase + item.beforeImageUrl);
                        e.target.style.display = 'none';
                      }}
                    />
                    <div style={beforeAfterLabelStyle}>Before</div>
                  </div>
                  {/* After Image */}
                  <div style={{ position: "relative" }}>
                    <img
                      src={backendBase + item.imageUrl}
                      alt="After"
                      style={galleryImageStyle}
                      onClick={() => setLightboxImage(backendBase + item.imageUrl)}
                      onError={(e) => {
                        console.error("Failed to load after image:", backendBase + item.imageUrl);
                        e.target.style.display = 'none';
                      }}
                    />
                    <div style={beforeAfterLabelStyle}>After</div>
                  </div>
                </div>
              ) : (
                /* Single Image */
                <img
                  src={backendBase + item.imageUrl}
                  alt={item.title}
                  style={galleryImageStyle}
                  onClick={() => setLightboxImage(backendBase + item.imageUrl)}
                  onError={(e) => {
                    console.error("Failed to load image:", backendBase + item.imageUrl);
                    e.target.style.display = 'none';
                  }}
                />
              )}

              {/* Title & Description */}
              <div style={{ padding: "12px 0" }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4, color: "#674846" }}>
                  {item.title}
                </h3>
                {item.category && (
                  <span style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    color: "#674846",
                    fontWeight: 600,
                    letterSpacing: 0.5
                  }}>
                    {item.category}
                  </span>
                )}
                {item.description && (
                  <p style={{ fontSize: 13, color: "#674846", marginTop: 6 }}>
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {lightboxImage && (
          <div
            style={lightboxOverlayStyle}
            onClick={() => setLightboxImage(null)}
          >
            <img
              src={lightboxImage}
              alt="Full size"
              style={lightboxImageStyle}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              style={closeLightboxButtonStyle}
              onClick={() => setLightboxImage(null)}
            >
              ✕
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

// Styles
const galleryCardStyle = {
  background: "radial-gradient(circle at top left, rgba(255, 248, 220, 0.3), transparent 55%), rgba(255, 248, 220, 0.92)",
  borderRadius: 16,
  padding: 12,
  border: "1px solid rgba(103, 72, 70, 0.3)",
  boxShadow: "0 8px 24px rgba(103, 72, 70, 0.2)",
  backdropFilter: "blur(14px)",
  transition: "transform 0.2s, box-shadow 0.2s",
  cursor: "pointer",
};

const galleryImageStyle = {
  width: "100%",
  height: 220,
  objectFit: "cover",
  borderRadius: 12,
  cursor: "pointer",
  transition: "transform 0.2s",
};

const beforeAfterLabelStyle = {
  position: "absolute",
  top: 8,
  left: 8,
  backgroundColor: "rgba(103, 72, 70, 0.9)",
  color: "#fff8dc",
  padding: "4px 8px",
  borderRadius: 4,
  fontSize: 11,
  fontWeight: 600,
  textTransform: "uppercase",
};

const lightboxOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.9)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
  cursor: "pointer",
};

const lightboxImageStyle = {
  maxWidth: "90%",
  maxHeight: "90%",
  objectFit: "contain",
  borderRadius: 8,
  cursor: "default",
};

const closeLightboxButtonStyle = {
  position: "absolute",
  top: 20,
  right: 20,
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  border: "2px solid white",
  color: "white",
  fontSize: 24,
  width: 40,
  height: 40,
  borderRadius: "50%",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default GalleryPage;