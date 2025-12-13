// src/components/ReviewsSection.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../apiConfig";
import { styles } from "../styles";

function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedReviews() {
      try {
        const res = await fetch(`${API_BASE}/reviews/featured`);
        if (!res.ok) return;
        const data = await res.json();
        setReviews(data.slice(0, 3)); // Show max 3 on homepage
      } catch (err) {
        console.error("Failed to load reviews", err);
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

    loadFeaturedReviews();
    loadStats();
  }, []);

  if (loading || reviews.length === 0) {
    return null; // Don't show section if no featured reviews
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

  return (
    <section style={styles.section}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16
      }}>
        <h2 style={styles.sectionTitle}>What Our Customers Say</h2>
        <Link
          to="/reviews"
          style={{
            fontSize: 14,
            color: "#674846",
            textDecoration: "underline"
          }}
        >
          View all reviews →
        </Link>
      </div>

      {/* Average Rating Banner */}
      {stats.totalReviews > 0 && (
        <div style={ratingBannerStyle}>
          <span style={{ fontSize: 32, fontWeight: "bold" }}>
            {stats.averageRating.toFixed(1)}
          </span>
          <span style={{ fontSize: 24, marginLeft: 8 }}>
            {renderStars(Math.round(stats.averageRating))}
          </span>
          <span style={{ fontSize: 14, marginLeft: 12, color: "#674846" }}>
            ({stats.totalReviews} reviews)
          </span>
        </div>
      )}

      {/* Featured Reviews Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 16,
        marginTop: 16
      }}>
        {reviews.map((review) => (
          <div key={review.id} style={reviewCardStyle}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>
              {renderStars(review.rating)}
            </div>
            
            <p style={{ 
              fontSize: 14, 
              color: "#674846", 
              lineHeight: 1.6,
              marginBottom: 12,
              // Limit to 3 lines
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}>
              "{review.comment}"
            </p>
            
            <div style={{ 
              fontSize: 13, 
              fontWeight: 600, 
              color: "#674846",
              borderTop: "1px solid rgba(103, 72, 70, 0.2)",
              paddingTop: 8
            }}>
              - {review.customerName}
            </div>
            
            {review.serviceReceived && (
              <div style={{ 
                fontSize: 11, 
                color: "#999",
                fontStyle: "italic",
                marginTop: 4
              }}>
                {review.serviceReceived}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Leave Review CTA */}
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <Link
          to="/reviews"
          style={{
            ...styles.primaryButton,
            textDecoration: "none",
            display: "inline-block"
          }}
        >
          Leave a Review ⭐
        </Link>
      </div>
    </section>
  );
}

// Styles
const ratingBannerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  background: "rgba(255, 248, 220, 0.95)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  borderRadius: 16,
  border: "2px solid rgba(103, 72, 70, 0.25)",
  boxShadow: "0 12px 40px rgba(103, 72, 70, 0.25), 0 6px 20px rgba(0, 0, 0, 0.1)",
  color: "#674846",
};

const reviewCardStyle = {
  background: "rgba(255, 248, 220, 0.95)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  borderRadius: 16,
  padding: 20,
  border: "2px solid rgba(103, 72, 70, 0.25)",
  boxShadow: "0 10px 35px rgba(103, 72, 70, 0.2), 0 5px 15px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
};

export default ReviewsSection;