// src/components/Hero.js
// UPDATED: Loads social links from backend API

import React, { useEffect, useState } from "react";
import { API_BASE } from "../apiConfig";
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
            tiktok: data.tiktokUrl || "",
            twitter: data.twitterUrl || "",
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

  // Define social icons with gradients
  const heroSocialIcons = [
    {
      name: "Facebook",
      url: socialLinks.facebook,
      icon: "f",
      gradient: "linear-gradient(135deg,#2563eb,#1d4ed8)",
    },
    {
      name: "Instagram",
      url: socialLinks.instagram,
      icon: "IG",
      gradient: "linear-gradient(135deg,#f97316,#ec4899)",
    },
    {
      name: "TikTok",
      url: socialLinks.tiktok,
      icon: "♬",
      gradient: "linear-gradient(135deg,#22d3ee,#a855f7)",
    },
    {
      name: "X",
      url: socialLinks.twitter,
      icon: "𝕏",
      gradient: "linear-gradient(135deg,#020617,#0f172a)",
    },
  ];

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
          font-size: 14px;
          color: #e5e7eb;
          animation: gbPromoScroll 22s linear infinite;
        }
      `}</style>

      <section style={styles.heroSection}>
        <div style={styles.heroRow}>
          {/* LEFT SIDE */}
          <div style={styles.heroLeft}>
            <h1 style={styles.heroTitle}>
              Golden Brows Threading &amp; Beauty Studio
            </h1>

            <p style={styles.heroSubtitle}>
              Clean, precise threading and beauty services in California. Book your appointment in minutes.
            </p>

            <button
              type="button"
              onClick={handleScrollToBooking}
              style={styles.primaryButton}
            >
              Book an Appointment
            </button>
          </div>

          {/* RIGHT SIDE – SOCIAL ICONS */}
          <div style={styles.heroRight}>
            <p style={styles.heroRightTitle}>Follow &amp; Contact</p>
            <div style={styles.heroSocialRow}>
              {heroSocialIcons
                .filter((social) => social.url) // Only show if URL exists
                .map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    title={social.name}
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
          <div className="gb-promo-marquee-inner">
            {PROMO_TEXT}
          </div>
        </div>
      </section>
    </>
  );
}