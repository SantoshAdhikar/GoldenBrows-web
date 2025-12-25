// src/components/ReviewsComponent.js
// 🎨 MAIN REVIEWS COMPONENT - Used by both ReviewsPage.js and ReviewsSection.js
// 🔤 ROBOTO FONT - Professional & Clean
// ✅ Change colors here → Updates everywhere automatically!

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../apiConfig";
import { styles } from "../styles";

function ReviewsComponent({ 
  showAll = false,        // true for full reviews page, false for homepage preview
  featured = false,       // true to show only featured reviews
  limit = null,          // limit number of reviews (for homepage)
  showTitle = true,      // show page title
  showSubtitle = true,   // show subtitle
  showViewAll = false,   // show "View all" link (for homepage)
  showForm = false,      // show review submission form (full page only)
  showStats = true,      // show stats banner
}) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);
  
  // Review submission form state
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    rating: 0,
    comment: "",
    serviceReceived: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
  loadReviews();
  loadStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [featured, limit]);

  async function loadReviews() {
    setLoading(true);
    setError("");
    try {
      const endpoint = featured ? `${API_BASE}/reviews/featured` : `${API_BASE}/reviews`;
      const res = await fetch(endpoint);
      
      if (!res.ok) {
        if (!showAll) {
          setReviews([]);
          return;
        }
        throw new Error("Failed to load reviews");
      }
      
      const data = await res.json();
      const items = limit ? data.slice(0, limit) : data;
      setReviews(items);
    } catch (err) {
      if (showAll) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    try {
      const res = await fetch(`${API_BASE}/reviews/stats`);
      if (!res.ok) return;
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  }

  async function handleSubmitReview(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    if (formData.rating === 0) {
      setError("Please select a star rating");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Failed to submit review");

      setSubmitSuccess(true);
      setFormData({ customerName: "", rating: 0, comment: "", serviceReceived: "" });
      setFormVisible(false);
      
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const renderStars = (rating) => {
    return (
      <span style={{ letterSpacing: "2px" }}>
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            style={{
              color: i < rating ? "#FFD700" : "#D1D5DB",
              fontSize: "inherit",
              textShadow: i < rating 
                ? "0 0 3px rgba(255, 215, 0, 0.5)" 
                : "none"
            }}
          >
            ★
          </span>
        ))}
      </span>
    );
  };

  // Don't show section if no reviews (for homepage)
  if (!showAll && (loading || reviews.length === 0)) {
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
                {showAll ? "Customer Reviews" : "What Our Customers Say"}
              </h1>
            </div>
          )}
          
          {showViewAll && (
            <Link to="/reviews" style={liquidGlassStyles.viewAllLink}>
              View all reviews →
            </Link>
          )}
        </div>
      )}

      {/* ===== 📊 STATS BANNER ===== */}
      {showStats && stats.totalReviews > 0 && (
        <div style={liquidGlassStyles.statsBanner(showAll)}>
          <div style={{ textAlign: "center" }}>
            <div style={liquidGlassStyles.statsRating(showAll)}>
              {stats.averageRating.toFixed(1)}
            </div>
            <div style={liquidGlassStyles.statsStars(showAll)}>
              {renderStars(Math.round(stats.averageRating))}
            </div>
            <div style={liquidGlassStyles.statsText}>
              {showAll ? `Based on ${stats.totalReviews} reviews` : `(${stats.totalReviews} reviews)`}
            </div>
          </div>
        </div>
      )}

      {/* ===== ✍️ LEAVE REVIEW BUTTON / FORM ===== */}
      {showForm && !formVisible && !submitSuccess && (
        <button
          onClick={() => setFormVisible(true)}
          style={liquidGlassStyles.leaveReviewButton}
        >
          ✍️ Leave a Review
        </button>
      )}

      {/* ===== ✅ SUCCESS MESSAGE ===== */}
      {submitSuccess && (
        <div style={liquidGlassStyles.successMessage}>
          ✅ Thank you for your review! It will appear after admin approval.
        </div>
      )}

      {/* ===== 📝 REVIEW FORM ===== */}
      {showForm && formVisible && (
        <div style={liquidGlassStyles.reviewForm}>
          <h3 style={liquidGlassStyles.formTitle}>Share Your Experience</h3>
          <form onSubmit={handleSubmitReview}>
            <label style={liquidGlassStyles.label}>
              Your Name *
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                style={liquidGlassStyles.input}
                required
              />
            </label>

            <label style={liquidGlassStyles.label}>
              Rating *
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    onClick={() => setFormData({ ...formData, rating: star })}
                    onMouseEnter={(e) => e.target.style.transform = "scale(1.2)"}
                    onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                    style={{
                      fontSize: 32,
                      cursor: "pointer",
                      color: star <= formData.rating ? "#FFD700" : "#D1D5DB",
                      transition: "all 0.2s ease",
                      textShadow: star <= formData.rating 
                        ? "0 0 5px rgba(255, 215, 0, 0.5)" 
                        : "none"
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </label>

            <label style={liquidGlassStyles.label}>
              Service Received (optional)
              <input
                type="text"
                value={formData.serviceReceived}
                onChange={(e) => setFormData({ ...formData, serviceReceived: e.target.value })}
                style={liquidGlassStyles.input}
                placeholder="e.g., Eyebrow Threading"
              />
            </label>

            <label style={liquidGlassStyles.label}>
              Your Review *
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                style={{ ...liquidGlassStyles.input, minHeight: 100, resize: "vertical" }}
                placeholder="Tell us about your experience..."
                required
              />
            </label>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="submit"
                disabled={submitting}
                style={liquidGlassStyles.submitButton}
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={() => setFormVisible(false)}
                style={liquidGlassStyles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===== ⏳ LOADING / ERROR STATES ===== */}
      {showAll && loading && (
        <div style={liquidGlassStyles.messageBox}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>✨</div>
          Loading reviews...
        </div>
      )}
      
      {showAll && error && (
        <div style={liquidGlassStyles.errorBox}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
          <p style={{ margin: "0 0 12px" }}>{error}</p>
        </div>
      )}

      {showAll && !loading && !error && reviews.length === 0 && (
        <div style={liquidGlassStyles.messageBox}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⭐</div>
          No reviews yet. Be the first to leave one!
        </div>
      )}

      {/* ===== ⭐ REVIEWS GRID ===== */}
      <div style={liquidGlassStyles.reviewsGrid}>
        {reviews.map((review) => {
          const isHovered = hoveredCard === review.id;
          const formattedDate = review.createdAt && 
            new Date(review.createdAt).toLocaleDateString();

          return (
            <div
              key={review.id}
              style={liquidGlassStyles.reviewCard(isHovered, showAll)}
              onMouseEnter={() => setHoveredCard(review.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* ===== 👤 CUSTOMER INFO ===== */}
              <div style={liquidGlassStyles.reviewHeader(showAll)}>
                <div>
                  <div style={liquidGlassStyles.customerName}>
                    {review.customerName}
                  </div>
                  <div style={liquidGlassStyles.starsContainer}>
                    {renderStars(review.rating)}
                  </div>
                </div>
                {showAll && formattedDate && (
                  <div style={liquidGlassStyles.dateText}>
                    {formattedDate}
                  </div>
                )}
              </div>

              {/* ===== 💼 SERVICE RECEIVED ===== */}
              {review.serviceReceived && (
                <div style={liquidGlassStyles.serviceBadge}>
                  {review.serviceReceived}
                </div>
              )}

              {/* ===== 💬 COMMENT ===== */}
              <p style={liquidGlassStyles.commentText(showAll)}>
                "{review.comment}"
              </p>

              {/* ===== 💎 ADMIN REPLY ===== */}
              {review.adminReply && showAll && (
                <div style={liquidGlassStyles.adminReply}>
                  <strong style={{ color: "#c81aebff" }}>Golden Brows Team:</strong>
                  <p style={{ marginTop: 4, margin: 0 }}>{review.adminReply}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ===== 📝 LEAVE REVIEW CTA (Homepage) ===== */}
      {!showAll && (
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link
            to="/reviews"
            style={liquidGlassStyles.ctaButton}
          >
            Leave a Review ⭐
          </Link>
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
    marginBottom: 24,
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

  // Stats banner
  statsBanner: (showAll) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: showAll ? 40 : 20,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(30px) saturate(150%)",
    WebkitBackdropFilter: "blur(30px) saturate(150%)",
    borderRadius: 20,
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
    marginBottom: 24,
  }),

  // Stats rating number
  statsRating: (showAll) => ({
    fontSize: showAll ? 48 : 32,
    fontWeight: "bold",
    color: "#c81aebff",  // ✅ CHANGE COLOR HERE
    fontFamily: "'Roboto', sans-serif",
  }),

  // Stats stars
  statsStars: (showAll) => ({
    fontSize: showAll ? 32 : 24,
    marginTop: 4,
  }),

  // Stats text
  statsText: {
    fontSize: 14,
    color: "rgba(234, 17, 253, 0.97)",  // ✅ CHANGE COLOR HERE
    marginTop: 8,
    fontFamily: "'Roboto', sans-serif",
  },

  // Leave review button
  leaveReviewButton: {
    padding: "12px 24px",
    borderRadius: 999,
    border: "none",
    backgroundColor: "#f1ef6eff",  // ✅ CHANGE COLOR HERE
    color: "#e126f1ff",  // ✅ CHANGE COLOR HERE
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Roboto', sans-serif",
    boxShadow: "0 4px 14px rgba(241, 239, 110, 0.3)",
    transition: "all 0.2s ease",
    marginBottom: 24,
  },

  // Success message
  successMessage: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    color: "#22c55e",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    textAlign: "center",
    fontWeight: 600,
    fontFamily: "'Roboto', sans-serif",
    border: "1px solid rgba(34, 197, 94, 0.3)",
  },

  // Review form
  reviewForm: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(30px) saturate(150%)",
    WebkitBackdropFilter: "blur(30px) saturate(150%)",
    borderRadius: 20,
    padding: 32,
    marginBottom: 24,
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
  },

  // Form title
  formTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: "#c81aebff",  // ✅ CHANGE COLOR HERE
    marginBottom: 16,
    fontFamily: "'Roboto', sans-serif",
    textShadow: "0 2px 8px rgba(223, 27, 27, 0.88)",
  },

  // Form label
  label: {
    display: "block",
    marginBottom: 16,
    fontSize: 14,
    fontWeight: 600,
    color: "rgba(234, 17, 253, 0.97)",  // ✅ CHANGE COLOR HERE
    fontFamily: "'Roboto', sans-serif",
  },

  // Form input
  input: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid rgba(255, 255, 255, 0.2)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    color: "#0d0d0eff",
    fontSize: 14,
    fontFamily: "'Roboto', sans-serif",
    marginTop: 6,
    boxSizing: "border-box",
  },

  // Submit button
  submitButton: {
    padding: "12px 24px",
    borderRadius: 999,
    border: "none",
    backgroundColor: "#f1ef6eff",  // ✅ CHANGE COLOR HERE
    color: "#e126f1ff",  // ✅ CHANGE COLOR HERE
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Roboto', sans-serif",
    boxShadow: "0 4px 14px rgba(241, 239, 110, 0.3)",
    transition: "all 0.2s ease",
  },

  // Cancel button
  cancelButton: {
    padding: "12px 24px",
    borderRadius: 999,
    border: "1px solid rgba(255, 255, 255, 0.2)",
    backgroundColor: "transparent",
    color: "rgba(234, 17, 253, 0.97)",  // ✅ CHANGE COLOR HERE
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Roboto', sans-serif",
    transition: "all 0.2s ease",
  },

  // Reviews grid
  reviewsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 24,
    marginTop: 24,
  },

  // Review card
  reviewCard: (isHovered, showAll) => ({
    backgroundColor: isHovered 
      ? "rgba(255, 255, 255, 0.12)" 
      : "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(30px) saturate(150%)",
    WebkitBackdropFilter: "blur(30px) saturate(150%)",
    borderRadius: 18,
    padding: showAll ? 24 : 20,
    border: isHovered 
      ? "1px solid rgba(255, 255, 255, 0.3)" 
      : "1px solid rgba(255, 255, 255, 0.15)",
    boxShadow: isHovered
      ? "0 20px 60px rgba(0, 0, 0, 0.25), 0 8px 24px rgba(0, 0, 0, 0.15)"
      : "0 8px 32px rgba(0, 0, 0, 0.15)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    transform: isHovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
    fontFamily: "'Roboto', sans-serif",
  }),

  // Review header
  reviewHeader: (showAll) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: showAll ? "start" : "center",
    marginBottom: 12,
  }),

  // Customer name
  customerName: {
    fontSize: 18,
    fontWeight: 700,
    color: "#c81aebff",  // ✅ CHANGE COLOR HERE
    textShadow: "0 2px 8px rgba(223, 27, 27, 0.88)",
    fontFamily: "'Roboto', sans-serif",
  },

  // Stars container
  starsContainer: {
    fontSize: 20,
    marginTop: 4,
  },

  // Date text
  dateText: {
    fontSize: 12,
    color: "rgba(234, 17, 253, 0.7)",  // ✅ CHANGE COLOR HERE
    fontFamily: "'Roboto', sans-serif",
  },

  // Service badge
  serviceBadge: {
    display: "inline-block",
    fontSize: 11,
    fontWeight: 700,
    color: "rgba(255, 248, 255, 0.9)",
    backgroundColor: "rgba(182, 29, 243, 0.9)",  // ✅ CHANGE COLOR HERE
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    padding: "4px 10px",
    borderRadius: 999,
    marginBottom: 12,
    fontFamily: "'Roboto', sans-serif",
    letterSpacing: "0.05em",
    fontStyle: "italic",
  },

  // Comment text
  commentText: (showAll) => ({
    fontSize: 14,
    color: "rgba(234, 17, 253, 0.97)",  // ✅ CHANGE COLOR HERE
    lineHeight: 1.6,
    margin: 0,
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 400,
    ...(showAll ? {} : {
      display: "-webkit-box",
      WebkitLineClamp: 3,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    }),
  }),

  // Admin reply
  adminReply: {
    marginTop: 16,
    paddingTop: 16,
    borderTop: "1px solid rgba(255, 255, 255, 0.2)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    color: "rgba(234, 17, 253, 0.97)",  // ✅ CHANGE COLOR HERE
    fontFamily: "'Roboto', sans-serif",
  },

  // CTA button (homepage)
  ctaButton: {
    textDecoration: "none",
    display: "inline-block",
    padding: "12px 24px",
    borderRadius: 999,
    backgroundColor: "#f1ef6eff",  // ✅ CHANGE COLOR HERE
    color: "#e126f1ff",  // ✅ CHANGE COLOR HERE
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "'Roboto', sans-serif",
    boxShadow: "0 4px 14px rgba(241, 239, 110, 0.3)",
    transition: "all 0.2s ease",
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
};

export default ReviewsComponent;