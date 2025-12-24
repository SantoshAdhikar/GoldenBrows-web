// src/components/GalleryComponent.js
// 🎨 MAIN GALLERY COMPONENT - Used by both GalleryPage.js and GallerySection.js
// 🔤 ROBOTO FONT - Professional & Clean
// ✅ Change colors here → Updates everywhere automatically!

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../apiConfig";
import { styles } from "../styles";

const backendBase = API_BASE.replace("/api", "");

function GalleryComponent({ 
  showAll = false,        // true for full gallery page, false for homepage preview
  featured = false,       // true to show only featured items
  limit = null,          // limit number of items (for homepage)
  showTitle = true,      // show page title
  showSubtitle = true,   // show subtitle
  showFilters = true,    // show category filters
  showViewAll = false,   // show "View all" link (for homepage)
}) {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxImage, setLightboxImage] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    loadGallery();
    
    // Track gallery page view (only for full page)
    if (showAll && window.gtag) {
      window.gtag('event', 'view_gallery', {
        event_category: 'engagement',
        value: 1
      });
    }
  }, [showAll]);

  async function loadGallery() {
    try {
      const endpoint = featured ? `${API_BASE}/gallery/featured` : `${API_BASE}/gallery`;
      console.log("Fetching gallery from:", endpoint);
      
      const res = await fetch(endpoint);
      
      console.log("Response status:", res.status);
      console.log("Response ok:", res.ok);
      
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to load gallery: ${res.status} - ${text}`);
      }
      
      const data = await res.json();
      console.log("Gallery data received:", data);
      
      // Apply limit if specified (for homepage)
      const items = limit ? data.slice(0, limit) : data;
      setGalleryItems(items);
      setError("");
    } catch (err) {
      console.error("Gallery load error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Don't show section if no items (for homepage)
  if (!showAll && (loading || galleryItems.length === 0)) {
    return null;
  }

  // Get unique categories
  const categories = showFilters 
    ? ["all", ...new Set(galleryItems.map(item => item.category).filter(Boolean))]
    : [];

  // Filter by category
  const filteredItems = selectedCategory === "all" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  // Choose grid style based on context
  const gridStyle = showAll ? liquidGlassStyles.galleryGrid : liquidGlassStyles.galleryGridHomepage;
  const imageWrapperStyle = showAll ? liquidGlassStyles.imageWrapper : liquidGlassStyles.imageWrapperHomepage;
  const singleImageStyle = showAll ? liquidGlassStyles.singleImageWrapper : liquidGlassStyles.singleImageWrapperHomepage;
  const cardContentStyle = showAll ? liquidGlassStyles.cardContent : liquidGlassStyles.cardContentHomepage;
  const cardTitleStyle = showAll ? liquidGlassStyles.cardTitle : liquidGlassStyles.cardTitleHomepage;

  return (
    <section style={styles.section}>
      {/* ===== 📋 HEADER ===== */}
      {(showTitle || showViewAll) && (
        <div style={showViewAll ? liquidGlassStyles.headerContainer : {}}>
          {showTitle && (
            <div>
              <h1 style={showAll ? liquidGlassStyles.pageTitle : liquidGlassStyles.sectionTitle}>
                {showAll ? "Our Work Gallery" : "Our Work"}
              </h1>
              {showSubtitle && showAll && (
                <p style={liquidGlassStyles.pageSubtitle}>
                  See the amazing transformations and results from Golden Brows
                </p>
              )}
            </div>
          )}
          
          {showViewAll && (
            <Link to="/gallery" style={liquidGlassStyles.viewAllLink}>
              View all →
            </Link>
          )}
        </div>
      )}

      {/* ===== 🏷️ CATEGORY FILTER TABS ===== */}
      {showFilters && categories.length > 0 && (
        <div style={liquidGlassStyles.categoryContainer}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={liquidGlassStyles.categoryButton(selectedCategory === cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* ===== ⏳ LOADING / ERROR STATES ===== */}
      {showAll && loading && (
        <div style={liquidGlassStyles.messageBox}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>✨</div>
          Loading gallery...
        </div>
      )}
      
      {showAll && error && (
        <div style={liquidGlassStyles.errorBox}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
          <p style={{ margin: "0 0 12px" }}>{error}</p>
          <button onClick={loadGallery} style={liquidGlassStyles.retryButton}>
            Retry
          </button>
        </div>
      )}

      {showAll && !loading && !error && filteredItems.length === 0 && (
        <div style={liquidGlassStyles.messageBox}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🖼️</div>
          No gallery items yet.
        </div>
      )}

      {/* ===== 🎴 GALLERY GRID ===== */}
      <div style={gridStyle}>
        {filteredItems.map((item) => {
          const isHovered = hoveredCard === item.id;
          
          const cardContent = (
            <div
              style={liquidGlassStyles.galleryCard(isHovered)}
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* ===== 📸 IMAGES (Before/After or Single) ===== */}
              {item.beforeImageUrl ? (
                // Before/After Layout
                <div style={liquidGlassStyles.beforeAfterContainer}>
                  {/* Before Image */}
                  <div style={imageWrapperStyle}>
                    <img
                      src={backendBase + item.beforeImageUrl}
                      alt="Before"
                      style={liquidGlassStyles.galleryImage}
                      onClick={showAll ? () => setLightboxImage(backendBase + item.beforeImageUrl) : undefined}
                      onError={(e) => {
                        console.error("Failed to load before image:", backendBase + item.beforeImageUrl);
                        e.target.style.display = 'none';
                      }}
                    />
                    <div style={liquidGlassStyles.beforeAfterLabel}>Before</div>
                  </div>
                  
                  {/* After Image */}
                  <div style={imageWrapperStyle}>
                    <img
                      src={backendBase + item.imageUrl}
                      alt="After"
                      style={liquidGlassStyles.galleryImage}
                      onClick={showAll ? () => setLightboxImage(backendBase + item.imageUrl) : undefined}
                      onError={(e) => {
                        console.error("Failed to load after image:", backendBase + item.imageUrl);
                        e.target.style.display = 'none';
                      }}
                    />
                    <div style={liquidGlassStyles.beforeAfterLabel}>After</div>
                  </div>
                </div>
              ) : (
                // Single Image
                <div style={singleImageStyle}>
                  <img
                    src={backendBase + item.imageUrl}
                    alt={item.title}
                    style={liquidGlassStyles.galleryImage}
                    onClick={showAll ? () => setLightboxImage(backendBase + item.imageUrl) : undefined}
                    onError={(e) => {
                      console.error("Failed to load image:", backendBase + item.imageUrl);
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* ===== 📝 TITLE & DESCRIPTION ===== */}
              <div style={cardContentStyle}>
                <h3 style={cardTitleStyle}>
                  {item.title}
                </h3>
                
                {item.category && (
                  <span style={liquidGlassStyles.categoryBadge}>
                    {item.category}
                  </span>
                )}
                
                {showAll && item.description && (
                  <p style={liquidGlassStyles.cardDescription}>
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          );

          // Wrap in Link for homepage, plain div for full page
          return showAll ? (
            <div key={item.id}>{cardContent}</div>
          ) : (
            <Link
              key={item.id}
              to="/gallery"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {cardContent}
            </Link>
          );
        })}
      </div>

      {/* ===== 🔍 LIGHTBOX MODAL (Full page only) ===== */}
      {showAll && lightboxImage && (
        <div
          style={liquidGlassStyles.lightboxOverlay}
          onClick={() => setLightboxImage(null)}
        >
          <img
            src={lightboxImage}
            alt="Full size"
            style={liquidGlassStyles.lightboxImage}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            style={liquidGlassStyles.closeLightboxButton}
            onClick={() => setLightboxImage(null)}
          >
            ✕
          </button>
        </div>
      )}
    </section>
  );
}

// ============================================
// 🎨 LIQUID GLASS STYLES - CHANGE COLORS HERE!
// ============================================

const liquidGlassStyles = {
  // Page title
  pageTitle: {
    fontSize: 42,
    fontWeight: 900,
    textAlign: "center",
    marginBottom: 12,
    color: "#d11df5ff",  // ✅ CHANGE COLOR HERE
    textShadow: "0 2px 8px rgba(42, 90, 247, 0.3)",
    fontFamily: "'Roboto', sans-serif",
    letterSpacing: "-0.02em",
  },

  // Page subtitle
  pageSubtitle: {
    textAlign: "center",
    color: "rgba(181, 11, 248, 0.85)",  // ✅ CHANGE COLOR HERE
    marginBottom: 32,
    fontSize: 16,
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 400,
  },

  // Section title (for homepage)
  sectionTitle: {
    fontSize: 36,
    fontWeight: 800,
    margin: 0,
    color: "#d11df5ff",  // ✅ CHANGE COLOR HERE
    textShadow: "0 2px 8px rgba(42, 90, 247, 0.3)",
    fontFamily: "'Roboto', sans-serif",
    letterSpacing: "-0.02em",
  },

  // Header container (for homepage)
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },

  // View all link (for homepage)
  viewAllLink: {
    fontSize: 14,
    fontWeight: 600,
    color: "rgba(181, 11, 248, 0.85)",  // ✅ CHANGE COLOR HERE
    textDecoration: "none",
    fontFamily: "'Roboto', sans-serif",
    padding: "8px 16px",
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    transition: "all 0.2s ease",
  },

  // Category filter container
  categoryContainer: {
    display: "flex",
    gap: 8,
    flexWrap: "nowrap",
    overflowX: "auto",
    marginBottom: 40,
    paddingBottom: 8,
    justifyContent: "center",
    WebkitOverflowScrolling: "touch",
  },

  // Category button
  categoryButton: (isSelected) => ({
    minWidth: 100,
    flexShrink: 0,
    padding: "10px 20px",
    borderRadius: 999,
    border: isSelected ? "2px solid #e6ec8bff" : "1px solid rgba(255, 255, 255, 0.2)",
    backgroundColor: isSelected ? "#f1ef6eff" : "#f1ef6eff",  // ✅ CHANGE COLOR HERE
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    color: isSelected ? "#e126f1ff" : "#e412ebff",  // ✅ CHANGE COLOR HERE
    fontSize: 14,
    fontWeight: isSelected ? 700 : 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
    textTransform: "capitalize",
    fontFamily: "'Roboto', sans-serif",
    whiteSpace: "nowrap",
  }),

  // Gallery grid (full page)
  galleryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 24,
    marginBottom: 60,
    width: "100%",
  },

  // Gallery grid (homepage)
  galleryGridHomepage: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 24,
    marginBottom: 60,
    width: "100%",
  },

  // Gallery card - Ultra liquid glass
  galleryCard: (isHovered) => ({
    backgroundColor: isHovered 
      ? "rgba(255, 255, 255, 0.12)" 
      : "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(30px) saturate(150%)",
    WebkitBackdropFilter: "blur(30px) saturate(150%)",
    borderRadius: 18,
    padding: 0,
    border: isHovered 
      ? "1px solid rgba(255, 255, 255, 0.3)" 
      : "1px solid rgba(255, 255, 255, 0.15)",
    boxShadow: isHovered
      ? "0 20px 60px rgba(0, 0, 0, 0.25), 0 8px 24px rgba(0, 0, 0, 0.15)"
      : "0 8px 32px rgba(0, 0, 0, 0.15)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    overflow: "hidden",
    transform: isHovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
    fontFamily: "'Roboto', sans-serif",
  }),

  // Before/After container
  beforeAfterContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 2,
    borderRadius: "18px 18px 0 0",
    overflow: "hidden",
  },

  // Single image wrapper (full page)
  singleImageWrapper: {
    position: "relative",
    width: "100%",
    height: 240,
    borderRadius: "18px 18px 0 0",
    overflow: "hidden",
  },

  // Single image wrapper (homepage)
  singleImageWrapperHomepage: {
    position: "relative",
    width: "100%",
    height: 200,
    borderRadius: "18px 18px 0 0",
    overflow: "hidden",
  },

  // Image wrapper (full page)
  imageWrapper: {
    position: "relative",
    height: 200,
    overflow: "hidden",
  },

  // Image wrapper (homepage)
  imageWrapperHomepage: {
    position: "relative",
    height: 160,
    overflow: "hidden",
  },

  // Gallery image
  galleryImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    cursor: "pointer",
    transition: "transform 0.3s ease",
  },

  // Before/After label
  beforeAfterLabel: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    color: "#eb14e0ff",  // ✅ CHANGE COLOR HERE
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontFamily: "'Roboto', sans-serif",
    boxShadow: "0 2px 8px rgba(235, 14, 14, 0.79)",
  },

  // Card content (full page)
  cardContent: {
    padding: 20,
    backgroundColor: "rgba(228, 12, 12, 0.03)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  },

  // Card content (homepage)
  cardContentHomepage: {
    padding: 16,
    backgroundColor: "rgba(228, 12, 12, 0.03)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  },

  // Card title (full page)
  cardTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 8,
    color: "#c81aebff",  // ✅ CHANGE COLOR HERE
    textShadow: "0 2px 8px rgba(223, 27, 27, 0.88)",
    fontFamily: "'Roboto', sans-serif",
    letterSpacing: "-0.01em",
  },

  // Card title (homepage)
  cardTitleHomepage: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 8,
    margin: 0,
    color: "#c81aebff",  // ✅ CHANGE COLOR HERE
    textShadow: "0 2px 8px rgba(223, 27, 27, 0.88)",
    fontFamily: "'Roboto', sans-serif",
    letterSpacing: "-0.01em",
  },

  // Category badge
  categoryBadge: {
    display: "inline-block",
    fontSize: 11,
    textTransform: "uppercase",
    color: "rgba(255, 248, 255, 0.9)",
    fontWeight: 700,
    letterSpacing: "0.08em",
    fontFamily: "'Roboto', sans-serif",
    padding: "4px 10px",
    borderRadius: 999,
    backgroundColor: "rgba(182, 29, 243, 0.9)",  // ✅ CHANGE COLOR HERE
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    marginBottom: 8,
  },

  // Card description
  cardDescription: {
    fontSize: 13,
    color: "rgba(234, 17, 253, 0.97)",  // ✅ CHANGE COLOR HERE
    marginTop: 8,
    lineHeight: 1.6,
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 400,
  },

  // Message box
  messageBox: {
    padding: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(40px) saturate(180%)",
    WebkitBackdropFilter: "blur(40px) saturate(180%)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "'Roboto', sans-serif",
    maxWidth: "600px",
    margin: "0 auto",
  },

  // Error box
  errorBox: {
    padding: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(40px) saturate(180%)",
    WebkitBackdropFilter: "blur(40px) saturate(180%)",
    border: "1px solid rgba(255, 107, 107, 0.3)",
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "'Roboto', sans-serif",
    maxWidth: "600px",
    margin: "0 auto",
  },

  // Retry button
  retryButton: {
    padding: "12px 24px",
    borderRadius: 999,
    border: "none",
    backgroundColor: "#674846",
    color: "#d80606ff",  // ✅ CHANGE COLOR HERE
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Roboto', sans-serif",
    boxShadow: "0 4px 14px rgba(103, 72, 70, 0.3)",
    transition: "all 0.2s ease",
  },

  // Lightbox overlay
  lightboxOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    cursor: "pointer",
    padding: 20,
  },

  // Lightbox image
  lightboxImage: {
    maxWidth: "90%",
    maxHeight: "90%",
    objectFit: "contain",
    borderRadius: 12,
    cursor: "default",
    boxShadow: "0 20px 80px rgba(0, 0, 0, 0.5)",
  },

  // Close lightbox button
  closeLightboxButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    color: "white",
    fontSize: 24,
    width: 50,
    height: 50,
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 300,
    transition: "all 0.2s ease",
  },
};

export default GalleryComponent;