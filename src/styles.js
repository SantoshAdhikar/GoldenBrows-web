// src/styles.js
// 🔥 ULTRA-TRANSPARENT GLASS EFFECT - Like Video Player Controls!

export const styles = {
  // ===========================
  // 📄 PAGE LAYOUT + BACKGROUND
  // ===========================
  page: {
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    backgroundColor: "#ffffff",
    color: "#1f2937",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },

  // ===========================
  // 🔝 HEADER + NAVBAR
  // ===========================
  header: {
    padding: "12px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(40px) saturate(180%)",
    WebkitBackdropFilter: "blur(40px) saturate(180%)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    position: "sticky",
    top: 0,
    zIndex: 20,
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.03)",
  },

  logo: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#1f2937",
  },

  nav: {
    display: "flex",
    gap: 16,
  },

  navLink: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px 14px",
    borderRadius: 999,
    textDecoration: "none",
    fontSize: 16,
    fontWeight: 500,
    color: "#1f2937",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    transition: "all 0.2s ease",
  },

  logoSection: {
    flex: "0 0 auto",
  },

  logoTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    marginBottom: "0.25rem",
    color: "#1f2937",
  },

  logoSubline: {
    fontSize: "0.75rem",
    color: "#6b7280",
    opacity: 0.9,
  },

  logoImageContainer: {
    flex: "0 0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 1rem",
  },

  headerLogoImage: {
    height: "50px",
    width: "auto",
    objectFit: "contain",
  },

  // ===========================
  // 🎯 HERO SECTION
  // ===========================
  heroSection: {
    padding: "32px 16px 32px",
    maxWidth: "1100px",
    margin: "0 auto",
  },

  heroTitle: {
    fontSize: 32,
    margin: "0 0 12px",
    color: "#1f2937",
    fontWeight: "bold",
  },

  heroSubtitle: {
    fontSize: 16,
    maxWidth: 520,
    margin: "0 0 20px",
    color: "#4b5563",
  },

  primaryButton: {
    display: "inline-block",
    padding: "10px 18px",
    backgroundColor: "#674846",
    color: "#ffffff",
    borderRadius: 999,
    textDecoration: "none",
    fontSize: 14,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    boxShadow: "0 4px 14px rgba(103, 72, 70, 0.3)",
    transition: "all 0.2s ease",
  },

  heroRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
    flexWrap: "wrap",
  },

  heroLeft: {
    flex: "1 1 320px",
  },

  heroRight: {
    flex: "0 0 auto",
    minWidth: 200,
    textAlign: "right",
  },

  heroRightTitle: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 8,
    color: "#1f2937",
  },

  heroSocialRow: {
    display: "flex",
    gap: 8,
    justifyContent: "flex-end",
    flexWrap: "wrap",
  },

  heroSocialIcon: {
    width: 38,
    height: 38,
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 700,
    backgroundColor: "#674846",
    boxShadow: "0 2px 8px rgba(103, 72, 70, 0.3)",
    transition: "all 0.2s ease",
  },

  promoBar: {
    marginTop: 20,
    borderRadius: 999,
    border: "1px solid rgba(255, 255, 255, 0.3)",
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(40px) saturate(180%)",
    WebkitBackdropFilter: "blur(40px) saturate(180%)",
    padding: "6px 0",
    overflow: "hidden",
  },

  // ===========================
  // 📐 MAIN LAYOUT + SECTIONS
  // ===========================
  main: {
    flex: 1,
  },

  section: {
    padding: "40px 40px",
    maxWidth: "1920px",  // ✅ Changed from 1400px - much wider!
    width: "100%",
    margin: "0 auto",
    boxSizing: "border-box",
  },

  sectionTitle: {
    fontSize: 36,
    fontWeight: 800,
    textAlign: "center",
    marginBottom: 12,
    color: "#1f2937",
  },

  sectionSubtitle: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 32,
    fontSize: 16,
  },

  // ===========================
  // 🎴 SERVICES GRID (Small cards for services)
  // ===========================
  servicesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",  // ✅ Small cards
    gap: 16,
    marginBottom: 60,
    width: "100%",
  },

  // ===========================
  // 👥 TEAM GRID (Larger cards for team members)
  // ===========================
  teamGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",  // ✅ Larger cards
    gap: 24,
    marginBottom: 60,
    width: "100%",
  },

  // ===========================
  // 💎 SERVICE CARD - ULTRA TRANSPARENT! 🔥
  // Like video player controls - very see-through!
  // ===========================
  serviceCard: {
    // 🔥 ULTRA TRANSPARENT - Only 8% white!
    background: "rgba(255, 255, 255, 0.01)",
    backdropFilter: "blur(30px) saturate(150%)",
    WebkitBackdropFilter: "blur(30px) saturate(150%)",

    borderRadius: 18,
    padding: 20,

    // Subtle border
    border: "1px solid rgba(182, 29, 228, 0.86)",

    // Soft shadow
    boxShadow: "0 8px 32px rgba(132, 30, 216, 0.59)",

    transition: "all 0.3s ease",
    cursor: "pointer",
  },

  // Small label at top of service card
  serviceLabel: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: 12,
  },

  // Service name/title
  serviceName: {
    fontSize: 18,
    fontWeight: 800,
    marginBottom: 8,
    color: "#e930f0ff",
    textShadow: "0 2px 8px rgba(0,0,0,0.3)",
  },

  // Service description
  serviceDescription: {
    fontSize: 13,
    color: "rgba(133, 11, 233, 0.85)",
    marginBottom: 16,
    lineHeight: 1.5,
  },

  // Row with price + duration
  serviceMetaRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  // Price text
  servicePrice: {
    fontSize: 22,
    fontWeight: 900,
    color: "#a507eeff",
    textShadow: "0 2px 8px rgba(226, 31, 31, 0.84)",
  },

  // Duration text
  serviceDuration: {
    fontSize: 14,
    color: "rgba(211, 19, 236, 1)",
    fontWeight: 600,
  },

  // ===========================
  // 🛒 CART BUTTONS
  // ===========================
  cartAddButton: {
    width: "100%",
    padding: "14px",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg, #674846 0%, #8b6361 100%)",
    color: "#fff",
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },

  cartRemoveButton: {
    width: "100%",
    padding: "14px",
    borderRadius: 12,
    border: "none",
    background: "rgba(239, 68, 68, 0.9)",
    color: "#fff",
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },

  // ===========================
  // 📝 FORMS + INPUTS
  // ===========================
  form: {
    maxWidth: 480,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  label: {
    display: "flex",
    flexDirection: "column",
    fontSize: 14,
    gap: 4,
    color: "#374151",
  },

  input: {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid rgba(255, 255, 255, 0.3)",
    fontSize: 14,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    color: "#1f2937",
    outline: "none",
    transition: "all 0.2s ease",
  },

  // ===========================
  // 🦶 FOOTER
  // ===========================
  footer: {
    padding: "16px 24px",
    borderTop: "1px solid rgba(255, 255, 255, 0.2)",
    fontSize: 13,
    textAlign: "center",
    backgroundColor: "rgba(103, 72, 70, 0.95)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    color: "#ffffff",
  },

  // ===========================
  // 📞 CONTACT SECTION
  // ===========================
  contactGrid: {
    display: "grid",
    gap: 16,
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    alignItems: "flex-start",
  },

  logoImage: {
    width: 90,
    height: "auto",
    borderRadius: 8,
    marginBottom: 8,
    objectFit: "cover",
  },

  socialRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },

  socialChip: {
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255, 255, 255, 0.3)",
    fontSize: 13,
    textDecoration: "none",
    color: "#ffffff",
    backgroundColor: "rgba(103, 72, 70, 0.9)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    transition: "all 0.2s ease",
  },

  // ===========================
  // 🛒 CART PANEL (if used)
  // ===========================
  cartPanel: {
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(40px) saturate(180%)",
    WebkitBackdropFilter: "blur(40px) saturate(180%)",
    borderRadius: 20,
    padding: 16,
    border: "1px solid rgba(255, 255, 255, 0.25)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)",
    color: "#1f2937",
    position: "sticky",
    top: 88,
    minWidth: 260,
  },

  cartPanelTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 8,
    color: "#1f2937",
  },

  cartEmptyText: {
    fontSize: 13,
    color: "#6b7280",
  },

  cartList: {
    listStyle: "none",
    margin: "8px 0 0",
    padding: 0,
    maxHeight: 220,
    overflowY: "auto",
  },

  cartListItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 13,
    padding: "8px 10px",
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    marginBottom: 8,
  },

  cartItemName: {
    fontWeight: 500,
    color: "#1f2937",
  },

  cartItemMeta: {
    display: "flex",
    gap: 10,
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },

  cartListRemoveButton: {
    border: "none",
    background: "transparent",
    color: "#ef4444",
    fontSize: 16,
    cursor: "pointer",
    padding: 0,
    lineHeight: 1,
  },

  cartTotals: {
    marginTop: 10,
    borderTop: "1px solid rgba(255, 255, 255, 0.3)",
    paddingTop: 10,
    fontSize: 13,
  },

  cartTotalsRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 4,
    color: "#1f2937",
  },

  // ===========================
  // 📋 BOOKING FORM (if used separately)
  // ===========================
  bookingForm: {
    marginTop: 14,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  bookingRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },

  bookingLabel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    fontSize: 13,
    color: "#374151",
    gap: 4,
  },

  bookingInput: {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    color: "#1f2937",
    fontSize: 13,
    outline: "none",
    transition: "all 0.2s ease",
  },

  bookingSelect: {
    paddingRight: 28,
    cursor: "pointer",
  },

  bookingTextarea: {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    color: "#1f2937",
    fontSize: 13,
    minHeight: 80,
    resize: "vertical",
    outline: "none",
    transition: "all 0.2s ease",
  },

  bookingSubmitButton: {
    marginTop: 6,
    width: "100%",
    padding: "10px 14px",
    borderRadius: 999,
    border: "none",
    backgroundColor: "#674846",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(103, 72, 70, 0.3)",
    transition: "all 0.2s ease",
  },

  // ===========================
  // 📝 BLOG STYLES (if used)
  // ===========================
  blogListCard: {
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(40px) saturate(180%)",
    WebkitBackdropFilter: "blur(40px) saturate(180%)",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    border: "1px solid rgba(255, 255, 255, 0.25)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)",
    transition: "all 0.3s ease",
  },

  blogListTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 4,
    color: "#1f2937",
  },

  blogListExcerpt: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 8,
  },

  blogListMeta: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 8,
  },

  // Blog detail page
  blogDetailWrapper: {
    maxWidth: "900px",
    margin: "0 auto",
  },

  blogBackLink: {
    display: "inline-block",
    marginBottom: 16,
    fontSize: 13,
    color: "#674846",
    textDecoration: "none",
  },

  blogDetailTitle: {
    fontSize: 28,
    marginBottom: 8,
    color: "#1f2937",
    fontWeight: "bold",
  },

  blogDetailMeta: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 20,
  },

  blogDetailBody: {
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(40px) saturate(180%)",
    WebkitBackdropFilter: "blur(40px) saturate(180%)",
    borderRadius: 20,
    border: "1px solid rgba(255, 255, 255, 0.25)",
    padding: 20,
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)",
    lineHeight: 1.7,
    fontSize: 15,
    color: "#1f2937",
    marginBottom: 24,
  },

  blogDetailParagraph: {
    marginBottom: 12,
    color: "#374151",
  },

  blogShareBar: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(30px)",
    WebkitBackdropFilter: "blur(30px)",
    borderRadius: 16,
    border: "1px solid rgba(255, 255, 255, 0.3)",
    padding: 12,
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    marginBottom: 24,
  },

  blogShareLabel: {
    fontSize: 13,
    color: "#6b7280",
    marginRight: 8,
  },

  blogShareButton: {
    padding: "6px 10px",
    borderRadius: 999,
    border: "none",
    backgroundColor: "#674846",
    color: "#ffffff",
    fontSize: 12,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  blogShareLink: {
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    color: "#674846",
    fontSize: 12,
    cursor: "pointer",
    textDecoration: "none",
    transition: "all 0.2s ease",
  },

  blogCommentsTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: "#1f2937",
    fontWeight: "bold",
  },

  blogCommentCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(30px)",
    WebkitBackdropFilter: "blur(30px)",
    borderRadius: 16,
    border: "1px solid rgba(255, 255, 255, 0.25)",
    padding: 14,
    marginBottom: 12,
  },

  blogCommentHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 4,
    fontSize: 12,
    color: "#6b7280",
  },

  blogCommentName: {
    fontWeight: 600,
    color: "#1f2937",
  },

  blogCommentText: {
    fontSize: 14,
    color: "#374151",
  },

  blogCommentFormWrapper: {
    marginTop: 16,
    borderTop: "1px solid rgba(255, 255, 255, 0.2)",
    paddingTop: 16,
  },

  // ===========================
  // ⚙️ ADMIN STYLES (if used)
  // ===========================
  adminTable: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 13,
    marginTop: 8,
  },
  
  adminTh: {
    textAlign: "left",
    padding: "8px 10px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.08,
    color: "#374151",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  
  adminTd: {
    padding: "8px 10px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    verticalAlign: "top",
    color: "#1f2937",
  },
  
  adminEditInput: {
    width: "100%",
    padding: "6px 8px",
    borderRadius: 8,
    border: "1px solid rgba(81, 106, 219, 1)",
    backgroundColor: "rgba(221, 77, 77, 0.3)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    color: "#1f2937",
    fontSize: 13,
    outline: "none",
  },
  
  adminEditButton: {
    padding: "6px 10px",
    fontSize: 12,
    borderRadius: 999,
    border: "none",
    backgroundColor: "#674846",
    color: "#ffffff",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  
  adminSaveButton: {
    padding: "6px 10px",
    fontSize: 12,
    borderRadius: 999,
    border: "none",
    backgroundColor: "#674846",
    color: "#ffffff",
    cursor: "pointer",
    marginRight: 6,
    transition: "all 0.2s ease",
  },
  
  adminCancelButton: {
    padding: "6px 10px",
    fontSize: 12,
    borderRadius: 999,
    border: "1px solid rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    color: "#674846",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
};

// ============================================
// 📱 MOBILE OPTIMIZATION UTILITIES
// ============================================

export const breakpoints = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1280px'
};

export const isMobile = () => window.innerWidth <= 768;
export const isTablet = () => window.innerWidth > 768 && window.innerWidth <= 1024;
export const isDesktop = () => window.innerWidth > 1024;

export const touchTargets = {
  minHeight: '44px',
  minWidth: '44px',
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    minHeight: '44px'
  },
  input: {
    padding: '12px 16px',
    fontSize: '16px',
    minHeight: '44px'
  }
};

export const mobileButton = {
  padding: '14px 28px',
  fontSize: '16px',
  minHeight: '48px',
  minWidth: '48px',
  borderRadius: '12px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 600,
  transition: 'all 0.2s ease',
  WebkitTapHighlightColor: 'transparent',
  touchAction: 'manipulation',
  userSelect: 'none'
};

export const mobileInput = {
  width: '100%',
  padding: '14px 16px',
  fontSize: '16px',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '12px',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  outline: 'none',
  minHeight: '48px',
  WebkitAppearance: 'none',
  transition: 'all 0.2s ease'
};