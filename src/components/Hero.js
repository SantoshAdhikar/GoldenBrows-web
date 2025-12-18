// src/components/Hero.js
// ✅ FIXED: Follow & Contact looks good on mobile!

import React, { useEffect, useState } from "react";
import { API_BASE } from "../apiConfig";
// Assume 'styles' is where your design system/CSS-in-JS object is defined.
import { styles } from "../styles"; 

const PROMO_TEXT =
  "🎉 Live Promotion: 20% OFF for new clients · Free brow tint with any full-face threading · Refer a friend and you both get $5 OFF · Same-day appointments available · ";

export default function Hero() {
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    instagram: "",
    tiktok: "",
    twitter: "",
  });

  // Load social links from backend
  useEffect(() => {
    async function loadSocialLinks() {
      try {
        const res = await fetch(`${API_BASE}/contact`);
        if (res.ok) {
          const data = await res.json();
          setSocialLinks({
            facebook: data.facebookUrl || "",
            instagram: data.instagramUrl || "",
            tiktok: data.tiktokUrl || "https://tiktok.com/goldenbrows", // <-- Add a mock URL
            twitter: data.twitterUrl || "https://x.com/goldenbrows",
          });
        }
      } catch (err) {
        console.error("Failed to load social links:", err);
      }
    }
    loadSocialLinks();
  }, []);

  const handleScrollToBooking = () => {
    const el = document.getElementById("services-booking-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  // Define social icons with gradients (closer to real logos)
  const heroSocialIcons = [
    {
      name: "Facebook",
      url: socialLinks.facebook,
      icon: "f",
      // Facebook Blue
      gradient: "linear-gradient(135deg, #4267B2, #1877F2)",
    },
    {
      name: "Instagram",
      url: socialLinks.instagram,
      icon: "IG",
      // Instagram's iconic sunset/rainbow gradient
      gradient:
        "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #bc1888 75%, #833ab4 100%)",
    },
    {
      name: "TikTok",
      url: socialLinks.tiktok,
      icon: "♬",
      // TikTok's classic neon/duotone effect (often used with white/black text)
      // This gradient uses black with neon cyan and magenta for a duotone look.
      gradient:
        "linear-gradient(135deg, #EE1D52 0%, #000000 50%, #69C9D0 100%)",
    },
    {
      name: "X",
      url: socialLinks.twitter,
      icon: "𝕏",
      // X (formerly Twitter) is pure black/dark grey
      gradient: "linear-gradient(135deg, #000000, #1A1A1A)",
    },
  ];

  // --- MODIFIED STYLES OBJECT ---
  // You must update the original 'styles' object in '../styles.js'
  // to reflect this change across your application. 
  // For this component, I am applying the style directly to the element.
  
  const monolisaStyles = {
    fontFamily: "Monolisa Serif, Georgia, serif", // Add Monolisa Serif and a fallback
  };

  const heroTitleStyle = {
      ...styles.heroTitle, // Keep existing styles
      ...monolisaStyles,    // Apply new font
  }
  
  const heroSubtitleStyle = {
      ...styles.heroSubtitle, // Keep existing styles
      ...monolisaStyles,      // Apply new font
  }

  // If you also want the right title and button text to change:
  const heroRightTitleStyle = {
      ...styles.heroRightTitle,
      ...monolisaStyles,
  }


  return (
    <>
      <style>{`

        @keyframes gbPromoScroll {

          0% {

            transform: translateX(100%);

          }

          100% {

            transform: translateX(-100%);

          }

        }



        .gb-promo-marquee-inner {

          display: inline-block;

          white-space: nowrap;

          padding: 0 1.5rem;

          font-size: 25px;

          color: #e0063cff; 

          /* --- NEW FONT ADDED HERE --- */

          font-family: "Monolisa Serif", Georgia, serif;

          animation: gbPromoScroll 20s linear infinite;

        }



        /* ✅ MOBILE FIX: Better Follow & Contact on mobile */

        @media (max-width: 768px) {

          .hero-right-mobile {

            text-align: center !important;

            margin-top: 20px !important;

          }



          .hero-social-row-mobile {

            justify-content: center !important;

            gap: 12px !important;

          }



          .hero-social-icon-mobile {

            width: 44px !important;

            height: 44px !important;

            font-size: 15px !important;

          }

        }

      `}</style>

      <section style={styles.heroSection}>
        <div style={styles.heroRow}>
          {/* LEFT SIDE */}
          <div style={styles.heroLeft}>
            <h1 style={heroTitleStyle}> {/* <--- MODIFIED HERE */}
              Golden Brows Threading &amp; Beauty Studio
            </h1>

            <p style={heroSubtitleStyle}> {/* <--- MODIFIED HERE */}
              Clean, precise threading and beauty services in California. Book
              your appointment in minutes.
            </p>

            <button
              type="button"
              onClick={handleScrollToBooking}
              style={styles.primaryButton}
            >
              Book an Appointment
            </button>
          </div>

          {/* RIGHT SIDE – SOCIAL ICONS (with mobile-friendly class) */}
          <div style={styles.heroRight} className="hero-right-mobile">
            <p style={heroRightTitleStyle}>Follow &amp; Contact</p> {/* <--- MODIFIED HERE */}
            <div
              style={styles.heroSocialRow}
              className="hero-social-row-mobile"
            >
              {heroSocialIcons
                .filter((social) => social.url) // Only show if URL exists
                .map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    title={social.name}
                    className="hero-social-icon-mobile"
                    style={{
                      ...styles.heroSocialIcon,
                      background: social.gradient,
                    }}
                  >
                    {social.icon}
                  </a>
                ))}
            </div>
          </div>
        </div>

        {/* BOTTOM: MOVING PROMOTION BAR */}
        <div style={styles.promoBar}>
          <div className="gb-promo-marquee-inner">{PROMO_TEXT}</div>
        </div>
      </section>
    </>
  );
}