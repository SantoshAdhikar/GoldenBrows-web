// src/pages/FAQPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../apiConfig";
import { styles } from "../styles";

function FAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadFAQs();
  }, []);

  async function loadFAQs() {
    try {
      const res = await fetch(`${API_BASE}/faqs`);
      if (!res.ok) throw new Error("Failed to load FAQs");
      const data = await res.json();
      setFaqs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Handle smooth scroll to contact section
  const handleContactClick = (e) => {
    e.preventDefault();
    
    // Navigate to home page
    navigate("/");
    
    // Wait for navigation, then scroll to contact
    setTimeout(() => {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ 
          behavior: "smooth", 
          block: "start" 
        });
      }
    }, 100);
  };

  // Get unique categories
  const categories = ["all", ...new Set(faqs.map(faq => faq.category).filter(Boolean))];

  // Filter by category and search
  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <main style={styles.main}>
      <section style={styles.section}>
        <h1 style={styles.sectionTitle}>Frequently Asked Questions</h1>
        <p style={styles.sectionSubtitle}>
          Find answers to common questions about our services
        </p>

        {/* Search Bar */}
        <div style={{ marginBottom: 24 }}>
          <input
            type="text"
            placeholder="🔍 Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              fontSize: 16,
              border: "2px solid rgba(103, 72, 70, 0.3)",
              borderRadius: 12,
              backgroundColor: "rgba(255, 248, 220, 0.95)",
              outline: "none",
            }}
          />
        </div>

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
                border: "2px solid #674846",
                padding: "8px 16px",
                fontSize: 14,
                textTransform: "capitalize"
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading && <p>Loading FAQs...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && filteredFAQs.length === 0 && (
          <p>No FAQs found. Try a different search or category.</p>
        )}

        {/* FAQ List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filteredFAQs.map((faq) => (
            <div
              key={faq.id}
              style={faqCardStyle(expandedId === faq.id)}
              onClick={() => toggleExpand(faq.id)}
            >
              {/* Question */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer"
              }}>
                <h3 style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#674846",
                  margin: 0,
                  paddingRight: 16
                }}>
                  {faq.question}
                </h3>
                <span style={{
                  fontSize: 24,
                  color: "#674846",
                  transform: expandedId === faq.id ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                  flexShrink: 0
                }}>
                  ▼
                </span>
              </div>

              {/* Category Badge */}
              {faq.category && (
                <span style={{
                  display: "inline-block",
                  marginTop: 8,
                  fontSize: 11,
                  textTransform: "uppercase",
                  color: "#674846",
                  backgroundColor: "rgba(103, 72, 70, 0.1)",
                  padding: "4px 8px",
                  borderRadius: 4,
                  fontWeight: 600,
                  letterSpacing: 0.5
                }}>
                  {faq.category}
                </span>
              )}

              {/* Answer (collapsible) */}
              {expandedId === faq.id && (
                <div style={{
                  marginTop: 16,
                  paddingTop: 16,
                  borderTop: "2px solid rgba(103, 72, 70, 0.2)",
                  animation: "fadeIn 0.3s ease"
                }}>
                  <p style={{
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: "#674846",
                    margin: 0,
                    whiteSpace: "pre-wrap"
                  }}>
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        {filteredFAQs.length > 0 && (
          <div style={{
            marginTop: 40,
            padding: 32,
            background: "rgba(255, 248, 220, 0.95)",
            borderRadius: 16,
            border: "2px solid rgba(103, 72, 70, 0.3)",
            boxShadow: "0 12px 40px rgba(103, 72, 70, 0.25)",
            textAlign: "center"
          }}>
            <h3 style={{ fontSize: 22, marginBottom: 12, color: "#674846" }}>
              Still have questions?
            </h3>
            <p style={{ fontSize: 16, marginBottom: 20, color: "#674846" }}>
              We're here to help! Contact us and we'll get back to you shortly.
            </p>
            <a
              href="/#contact"
              onClick={handleContactClick}
              style={{
                ...styles.primaryButton,
                textDecoration: "none",
                display: "inline-block",
                cursor: "pointer"
              }}
            >
              Contact Us
            </a>
          </div>
        )}
      </section>

      {/* CSS Animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}

// Dynamic style based on expanded state
const faqCardStyle = (isExpanded) => ({
  background: "rgba(255, 248, 220, 0.95)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  borderRadius: 16,
  padding: 24,
  border: isExpanded ? "2px solid #674846" : "2px solid rgba(103, 72, 70, 0.25)",
  boxShadow: isExpanded 
    ? "0 15px 45px rgba(103, 72, 70, 0.3), 0 8px 25px rgba(0, 0, 0, 0.12)"
    : "0 10px 35px rgba(103, 72, 70, 0.2), 0 5px 15px rgba(0, 0, 0, 0.08)",
  cursor: "pointer",
  transition: "all 0.3s ease",
  transform: isExpanded ? "scale(1.02)" : "scale(1)",
});

export default FAQPage;