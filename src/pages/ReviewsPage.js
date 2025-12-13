// src/pages/ReviewsPage.js
import React, { useEffect, useState } from "react";
import { API_BASE } from "../apiConfig";
import { styles } from "../styles";

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Review submission form
  const [showForm, setShowForm] = useState(false);
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
  }, []);

  async function loadReviews() {
    try {
      const res = await fetch(`${API_BASE}/reviews`);
      if (!res.ok) throw new Error("Failed to load reviews");
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      setError(err.message);
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

    // Validate rating
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
      setShowForm(false);
      
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

  return (
    <main style={styles.main}>
      <section style={styles.section}>
        <h1 style={styles.sectionTitle}>Customer Reviews</h1>
        
        {/* Stats Banner */}
        <div style={statsBannerStyle}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, fontWeight: "bold", color: "#674846" }}>
              {stats.averageRating.toFixed(1)}
            </div>
            <div style={{ fontSize: 32 }}>
              {renderStars(Math.round(stats.averageRating))}
            </div>
            <div style={{ fontSize: 14, color: "#674846", marginTop: 8 }}>
              Based on {stats.totalReviews} reviews
            </div>
          </div>
        </div>

        {/* Leave Review Button */}
        {!showForm && !submitSuccess && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              ...styles.primaryButton,
              marginBottom: 24
            }}
          >
            ✍️ Leave a Review
          </button>
        )}

        {/* Success Message */}
        {submitSuccess && (
          <div style={successMessageStyle}>
            ✅ Thank you for your review! It will appear after admin approval.
          </div>
        )}

        {/* Review Submission Form */}
        {showForm && (
          <div style={reviewFormStyle}>
            <h3 style={{ marginBottom: 16 }}>Share Your Experience</h3>
            <form onSubmit={handleSubmitReview}>
              <label style={styles.label}>
                Your Name *
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  style={styles.input}
                  required
                />
              </label>

              <label style={styles.label}>
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

              <label style={styles.label}>
                Service Received (optional)
                <input
                  type="text"
                  value={formData.serviceReceived}
                  onChange={(e) => setFormData({ ...formData, serviceReceived: e.target.value })}
                  style={styles.input}
                  placeholder="e.g., Eyebrow Threading"
                />
              </label>

              <label style={styles.label}>
                Your Review *
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  style={{ ...styles.input, minHeight: 100, resize: "vertical" }}
                  placeholder="Tell us about your experience..."
                  required
                />
              </label>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={styles.primaryButton}
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    ...styles.primaryButton,
                    backgroundColor: "transparent",
                    color: "#674846"
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews List */}
        {loading && <p>Loading reviews...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && reviews.length === 0 && (
          <p>No reviews yet. Be the first to leave one!</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 24 }}>
          {reviews.map(review => (
            <div key={review.id} style={reviewCardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: "#674846" }}>
                    {review.customerName}
                  </div>
                  <div style={{ fontSize: 24, marginTop: 4 }}>
                    {renderStars(review.rating)}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "#999" }}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>

              {review.serviceReceived && (
                <div style={{ fontSize: 12, color: "#674846", marginTop: 8, fontStyle: "italic" }}>
                  Service: {review.serviceReceived}
                </div>
              )}

              <p style={{ marginTop: 12, color: "#674846", lineHeight: 1.6 }}>
                {review.comment}
              </p>

              {review.adminReply && (
                <div style={adminReplyStyle}>
                  <strong style={{ color: "#674846" }}>Golden Brows Team:</strong>
                  <p style={{ marginTop: 4 }}>{review.adminReply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

// Styles
const statsBannerStyle = {
  background: "rgba(255, 248, 220, 0.95)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  borderRadius: 20,
  padding: 40,
  marginBottom: 24,
  border: "2px solid rgba(103, 72, 70, 0.3)",
  boxShadow: "0 15px 50px rgba(103, 72, 70, 0.3), 0 8px 25px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
  display: "flex",
  justifyContent: "center",
};

const reviewFormStyle = {
  background: "rgba(255, 248, 220, 0.95)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  borderRadius: 20,
  padding: 32,
  marginBottom: 24,
  border: "2px solid rgba(103, 72, 70, 0.3)",
  boxShadow: "0 20px 60px rgba(103, 72, 70, 0.35), 0 10px 30px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
  transform: "translateY(0)",
  transition: "all 0.3s ease",
};

const reviewCardStyle = {
  background: "rgba(255, 248, 220, 0.95)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  borderRadius: 16,
  padding: 24,
  border: "2px solid rgba(103, 72, 70, 0.25)",
  boxShadow: "0 12px 40px rgba(103, 72, 70, 0.25), 0 6px 20px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
};

const adminReplyStyle = {
  marginTop: 16,
  paddingTop: 16,
  borderTop: "2px solid rgba(103, 72, 70, 0.2)",
  backgroundColor: "rgba(103, 72, 70, 0.05)",
  padding: 12,
  borderRadius: 8,
  fontSize: 14,
  color: "#674846",
};

const successMessageStyle = {
  backgroundColor: "#d1fae5",
  color: "#065f46",
  padding: 16,
  borderRadius: 8,
  marginBottom: 24,
  textAlign: "center",
  fontWeight: 600,
};

export default ReviewsPage;