// src/components/PromotionBanner.js
import React, { useEffect, useState } from "react";
import { API_BASE } from "../apiConfig";

function PromotionBanner() {
  const [promotions, setPromotions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadFeaturedPromotions();
  }, []);

  useEffect(() => {
    // Auto-rotate banners every 5 seconds if multiple promos
    if (promotions.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % promotions.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [promotions.length]);

  // Track promotion views
  useEffect(() => {
    if (promotions.length > 0 && promotions[currentIndex] && window.gtag) {
      window.gtag('event', 'view_promotion', {
        event_category: 'engagement',
        event_label: promotions[currentIndex].title,
        value: 1
      });
    }
  }, [promotions, currentIndex]);

  async function loadFeaturedPromotions() {
    try {
      const res = await fetch(`${API_BASE}/promotions/featured`);
      if (res.ok) {
        const data = await res.json();
        setPromotions(data);
      }
    } catch (err) {
      console.error("Failed to load promotions:", err);
    }
  }

  if (promotions.length === 0) {
    return null; // Don't render if no active promotions
  }

  const currentPromo = promotions[currentIndex];

  return (
    <div style={bannerContainerStyle}>
      <div 
        style={{
          ...bannerStyle,
          background: currentPromo.bannerColor || 
            "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)"
        }}
      >
        {/* Discount Badge */}
        {currentPromo.discountText && (
          <div style={discountBadgeStyle}>
            {currentPromo.discountText}
          </div>
        )}

        {/* Content */}
        <div style={contentStyle}>
          <h2 style={titleStyle}>
            🎉 {currentPromo.title}
          </h2>
          <p style={descriptionStyle}>
            {currentPromo.description}
          </p>
          
          {currentPromo.code && (
            <div style={promoCodeStyle}>
              <span style={{ fontSize: 13, opacity: 0.9 }}>Use code:</span>
              <span style={codeTextStyle}>{currentPromo.code}</span>
            </div>
          )}

          {currentPromo.termsAndConditions && (
            <p style={termsStyle}>
              * {currentPromo.termsAndConditions}
            </p>
          )}
        </div>

        {/* Dots indicator (if multiple promos) */}
        {promotions.length > 1 && (
          <div style={dotsContainerStyle}>
            {promotions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                style={{
                  ...dotStyle,
                  opacity: index === currentIndex ? 1 : 0.5,
                  transform: index === currentIndex ? "scale(1.2)" : "scale(1)"
                }}
                aria-label={`Go to promotion ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const bannerContainerStyle = {
  margin: "0 0 32px 0"
};

const bannerStyle = {
  position: "relative",
  borderRadius: 20,
  padding: "40px 32px",
  color: "#ffffff",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
  overflow: "hidden",
  minHeight: 180,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const discountBadgeStyle = {
  position: "absolute",
  top: 20,
  right: 20,
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  color: "#ff6b6b",
  padding: "12px 20px",
  borderRadius: 12,
  fontSize: 24,
  fontWeight: "bold",
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
  transform: "rotate(5deg)"
};

const contentStyle = {
  textAlign: "center",
  maxWidth: 700,
  zIndex: 1
};

const titleStyle = {
  fontSize: 32,
  fontWeight: "bold",
  margin: "0 0 12px 0",
  textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)"
};

const descriptionStyle = {
  fontSize: 18,
  margin: "0 0 16px 0",
  lineHeight: 1.5,
  opacity: 0.95
};

const promoCodeStyle = {
  display: "inline-flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 4,
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  padding: "12px 24px",
  borderRadius: 12,
  border: "2px dashed rgba(255, 255, 255, 0.5)",
  marginTop: 8
};

const codeTextStyle = {
  fontSize: 20,
  fontWeight: "bold",
  letterSpacing: 2,
  fontFamily: "monospace"
};

const termsStyle = {
  fontSize: 12,
  marginTop: 16,
  opacity: 0.8,
  fontStyle: "italic"
};

const dotsContainerStyle = {
  position: "absolute",
  bottom: 16,
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  gap: 8,
  zIndex: 2
};

const dotStyle = {
  width: 10,
  height: 10,
  borderRadius: "50%",
  backgroundColor: "#ffffff",
  border: "none",
  cursor: "pointer",
  padding: 0,
  transition: "all 0.3s ease"
};

export default PromotionBanner;