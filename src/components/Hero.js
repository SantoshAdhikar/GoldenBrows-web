// src/components/Hero.js
import React from "react";
import { styles } from "../styles";

const PROMO_TEXT =
  "🎉 Live Promotion: 20% OFF for new clients · Free brow tint with any full-face threading · Refer a friend and you both get $5 OFF · Same-day appointments available · ";

export default function Hero() {
  const handleScrollToBooking = () => {
    const el = document.getElementById("booking-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* Local CSS just for the promo ticker so it DEFINITELY animates */}
      <style>{`
        @keyframes gbPromoScroll {
          0% {
            transform: translateX(100%);   /* start off screen on the right */
          }
          100% {
            transform: translateX(-100%);  /* end off screen on the left */
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
        {/* TOP ROW: left = title + button, right = socials */}
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
              {/* Facebook */}
              <a
                href="https://www.facebook.com/your-page"
                target="_blank"
                rel="noreferrer"
                title="Facebook"
                style={{
                  ...styles.heroSocialIcon,
                  background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                }}
              >
                f
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/your-page"
                target="_blank"
                rel="noreferrer"
                title="Instagram"
                style={{
                  ...styles.heroSocialIcon,
                  background: "linear-gradient(135deg,#f97316,#ec4899)",
                }}
              >
                IG
              </a>

              {/* Threads */}
              <a
                href="https://www.threads.net/@your-page"
                target="_blank"
                rel="noreferrer"
                title="Threads"
                style={{
                  ...styles.heroSocialIcon,
                  background: "linear-gradient(135deg,#000000,#111827)",
                }}
              >
                @
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/1XXXXXXXXXX" // <- put your real number
                target="_blank"
                rel="noreferrer"
                title="WhatsApp"
                style={{
                  ...styles.heroSocialIcon,
                  background: "linear-gradient(135deg,#22c55e,#15803d)",
                }}
              >
                WA
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@your-page"
                target="_blank"
                rel="noreferrer"
                title="TikTok"
                style={{
                  ...styles.heroSocialIcon,
                  background: "linear-gradient(135deg,#22d3ee,#a855f7)",
                }}
              >
                ♬
              </a>

              {/* X (Twitter) */}
              <a
                href="https://x.com/your-page"
                target="_blank"
                rel="noreferrer"
                title="X"
                style={{
                  ...styles.heroSocialIcon,
                  background: "linear-gradient(135deg,#020617,#0f172a)",
                }}
              >
                𝕏
              </a>
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
