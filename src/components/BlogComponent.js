// src/components/BlogComponent.js
// 🎨 MAIN BLOG LIST COMPONENT - Used by both BlogListPage.js and BlogSection.js
// 🔤 ROBOTO FONT - Professional & Clean
// ✅ Change colors here → Updates everywhere automatically!

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../apiConfig";
import { styles } from "../styles";

function BlogComponent({ 
  showAll = false,        // true for full blog page, false for homepage preview
  latest = false,         // true to use /blog/latest endpoint
  limit = null,          // limit number of items (for homepage)
  showTitle = true,      // show page title
  showSubtitle = true,   // show subtitle
  showViewAll = false,   // show "View all" link (for homepage)
}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      setError("");
      try {
        // Use different endpoint based on context
        const endpoint = latest ? `${API_BASE}/blog/latest` : `${API_BASE}/blog`;
        const res = await fetch(endpoint);
        
        if (!res.ok) {
          if (!showAll) {
            // For homepage, silently fail
            setPosts([]);
            return;
          }
          throw new Error("Failed to load blog posts");
        }
        
        const data = await res.json();
        
        // Apply limit if specified (for homepage)
        const items = limit ? data.slice(0, limit) : data;
        setPosts(items);
      } catch (err) {
        if (showAll) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, [showAll, latest, limit]);

  // Don't show section if no items (for homepage)
  if (!showAll && (loading || posts.length === 0)) {
    return null;
  }

  return (
    <section style={styles.section}>
      {/* ===== 📋 HEADER ===== */}
      {(showTitle || showViewAll) && (
        <div style={showViewAll ? liquidGlassStyles.headerContainer : {}}>
          {showTitle && (
            <div>
              <h1 style={showAll ? liquidGlassStyles.pageTitle : liquidGlassStyles.sectionTitle}>
                {showAll ? "Beauty Tips & Updates" : "Latest Posts"}
              </h1>
              {showSubtitle && showAll && (
                <p style={liquidGlassStyles.pageSubtitle}>
                  Learn more about threading, skincare, and special offers from Golden Brows.
                </p>
              )}
            </div>
          )}
          
          {showViewAll && (
            <Link to="/blog" style={liquidGlassStyles.viewAllLink}>
              View all →
            </Link>
          )}
        </div>
      )}

      {/* ===== ⏳ LOADING / ERROR STATES ===== */}
      {showAll && loading && (
        <div style={liquidGlassStyles.messageBox}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>✨</div>
          Loading posts...
        </div>
      )}
      
      {showAll && error && (
        <div style={liquidGlassStyles.errorBox}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
          <p style={{ margin: "0 0 12px" }}>{error}</p>
        </div>
      )}

      {showAll && !loading && !error && posts.length === 0 && (
        <div style={liquidGlassStyles.messageBox}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📝</div>
          No blog posts yet.
        </div>
      )}

      {/* ===== 📝 BLOG POSTS GRID ===== */}
      <div style={liquidGlassStyles.blogGrid}>
        {posts.map((post) => {
          const isHovered = hoveredCard === post.id;
          const formattedDate = post.createdAt && 
            post.createdAt.replace("T", " ").slice(0, 16);

          return (
            <Link
              key={post.id}
              to={`/blog/${post.slug || post.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <article
                style={liquidGlassStyles.blogCard(isHovered)}
                onMouseEnter={() => setHoveredCard(post.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* ===== 📅 DATE BADGE ===== */}
                {formattedDate && (
                  <div style={liquidGlassStyles.dateBadge}>
                    {formattedDate}
                  </div>
                )}

                {/* ===== 📝 CONTENT ===== */}
                <div style={liquidGlassStyles.cardContent}>
                  <h3 style={liquidGlassStyles.cardTitle}>
                    {post.title}
                  </h3>

                  {post.excerpt && (
                    <p style={liquidGlassStyles.cardExcerpt}>
                      {post.excerpt}
                    </p>
                  )}

                  {/* ===== 📖 READ MORE LINK ===== */}
                  <div style={liquidGlassStyles.readMoreLink}>
                    Read full post →
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
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

  // Blog grid
  blogGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 24,
    marginBottom: 60,
    width: "100%",
  },

  // Blog card - Ultra liquid glass
  blogCard: (isHovered) => ({
    backgroundColor: isHovered 
      ? "rgba(255, 255, 255, 1)" 
      : "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(30px) saturate(150%)",
    WebkitBackdropFilter: "blur(30px) saturate(150%)",
    borderRadius: 18,
    padding: 24,
    border: isHovered 
      ? "1px solid rgba(187, 26, 26, 1)" 
      : "1px solid rgba(243, 29, 232, 1)",
    boxShadow: isHovered
      ? "0 20px 60px rgba(209, 17, 177, 1), 0 8px 24px rgba(0, 0, 0, 0.15)"
      : "0 8px 32px rgba(224, 24, 231, 1)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    overflow: "hidden",
    transform: isHovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
    fontFamily: "'Roboto', sans-serif",
    position: "relative",
  }),

  // Date badge
  dateBadge: {
    display: "inline-block",
    fontSize: 11,
    fontWeight: 700,
    color: "rgba(255, 248, 255, 0.9)",
    backgroundColor: "rgba(182, 29, 243, 0.9)",  // ✅ CHANGE COLOR HERE
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    padding: "6px 12px",
    borderRadius: 999,
    marginBottom: 16,
    fontFamily: "'Roboto', sans-serif",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },

  // Card content
  cardContent: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  // Card title
  cardTitle: {
    fontSize: 22,
    fontWeight: 700,
    margin: 0,
    color: "#c81aebff",  // ✅ CHANGE COLOR HERE
    textShadow: "0 2px 8px rgba(223, 27, 27, 0.88)",
    fontFamily: "'Roboto', sans-serif",
    letterSpacing: "-0.01em",
    lineHeight: 1.3,
  },

  // Card excerpt
  cardExcerpt: {
    fontSize: 14,
    color: "rgba(234, 17, 253, 0.97)",  // ✅ CHANGE COLOR HERE
    margin: 0,
    lineHeight: 1.6,
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 400,
  },

  // Read more link
  readMoreLink: {
    fontSize: 13,
    fontWeight: 600,
    color: "#c227d6ff",  // ✅ CHANGE COLOR HERE
    textDecoration: "underline",
    fontFamily: "'Roboto', sans-serif",
    marginTop: 8,
  },

  // Message box (loading/empty)
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
};

export default BlogComponent;