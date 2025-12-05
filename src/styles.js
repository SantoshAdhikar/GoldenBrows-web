// src/styles.js
// Global style object shared across your components
export const styles = {
  // ===========================
  // PAGE LAYOUT + BACKGROUND
  // ===========================
  page: {
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",

    // Default text color for most of the site
    color: "#310a31",

    // Transparent so we see the gradient defined below
    backgroundColor: "transparent",

    // Make page fill full height and stack header / main / footer vertically
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",

    // 🔹 Elegant salon gradient background
    background:
      "radial-gradient(circle at top left, rgba(44, 102, 110, 0.15), transparent 55%)," +
      "radial-gradient(circle at bottom right, rgba(49, 10, 49, 0.25), transparent 55%)," +
      "#f0edee",
    
    // Make gradient large so animation looks smooth
    backgroundSize: "200% 200%",

    // Uses @keyframes salonGradientMove from index.css
    animation: "salonGradientMove 18s ease infinite",
  },

  // ===========================
  // HEADER + NAVBAR
  // ===========================
  header: {
    padding: "12px 24px",

    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    // Thin bottom border line under the header
    borderBottom: "1px solid rgba(44, 102, 110, 0.25)",

    // Header background color (elegant teal with transparency)
    backgroundColor: "rgba(44, 102, 110, 0.85)",

    position: "sticky",
    top: 0,
    zIndex: 20,

    // Soft blur behind header (glass effect)
    backdropFilter: "blur(12px)",
  },

  // Logo text in header
  logo: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#f0edee",
  },

  // Container for nav links in header
  nav: {
    display: "flex",
    gap: 16,
  },

 
  // Individual header nav link styling (elegant pill)
  navLink: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",

    padding: "6px 14px",
    borderRadius: 999,

    textDecoration: "none",
    fontSize: 16,
    fontWeight: 500,

    // text color
    color: "#f0edee",

    // teal border
    border: "1px solid rgba(44, 102, 110, 0.6)",

    // transparent background
    backgroundColor: "rgba(49, 10, 49, 0.25)",

    // elegant glow
    boxShadow: "0 0 16px rgba(22, 201, 224, 0.86)",
  },

  // ===========================
  // HERO SECTION
  // ===========================
  heroSection: {
    padding: "32px 16px 32px",
    maxWidth: "1100px",
    margin: "0 auto",
  },

  heroTitle: {
    fontSize: 32,
    margin: "0 0 12px",
    color: "#310a31",
  },

  heroSubtitle: {
    fontSize: 16,
    maxWidth: 520,
    margin: "0 0 20px",
    color: "#2c666e",
  },

  primaryButton: {
    display: "inline-block",
    padding: "10px 18px",
    backgroundColor: "#2c666e",
    color: "#f0edee",
    borderRadius: 999,
    textDecoration: "none",
    fontSize: 14,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    boxShadow: "0 4px 14px rgba(44, 102, 110, 0.4)",
  },

  // Hero layout (left text + right socials)
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
    color: "#310a31",
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
    color: "#f0edee",
    fontSize: 14,
    fontWeight: 700,
    backgroundColor: "#2c666e",
    boxShadow: "0 0 14px rgba(44, 102, 110, 0.5)",
  },

  // Promo bar container (marquee)
  promoBar: {
    marginTop: 20,
    borderRadius: 999,
    border: "1px solid rgba(54, 188, 206, 0.72)",
    background: "rgba(179, 32, 179, 0.9)",
    padding: "6px 0",
    overflow: "hidden",
  },

  // ===========================
  // MAIN LAYOUT
  // ===========================
  main: {
    flex: 1,
  },

  section: {
    padding: "24px",
  },

  sectionTitle: {
    fontSize: 22,
    marginBottom: 16,
    color: "#310a31",
  },

  // Optional subtitle under section titles
  sectionSubtitle: {
    fontSize: 14,
    color: "#2c666e",
    marginBottom: 16,
    maxWidth: 520,
  },

  // Layout for services grid on home page
  servicesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
  },

  // ===========================
  // SERVICE CARD (ELEGANT BOX)
  // ===========================
  serviceCard: {
    // Elegant salon gradient
    background:
      "radial-gradient(circle at top left, rgba(44, 102, 110, 0.12), transparent 55%), rgba(240, 237, 238, 0.95)",

    borderRadius: 18,
    padding: 16,

    // Teal border
    border: "1px solid rgba(44, 102, 110, 0.3)",

    // Soft shadow
    boxShadow: "0 8px 24px rgba(49, 10, 49, 0.93)",

    // Blur behind card (glass effect)
    backdropFilter: "blur(14px)",

    color: "#310a31",
  },

  // Small label text at top of card (category label)
  serviceLabel: {
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: "#2c666e",
  },

  // Service name (e.g. "Eyebrow Threading")
  serviceName: {
    fontSize: 18,
    fontWeight: 600,
    color: "#310a31",
  },

  // Service description text
  serviceDescription: {
    fontSize: 14,
    color: "#2c666e",
    marginTop: 4,
    marginBottom: 4,
  },

  // Row that holds price + duration
  serviceMetaRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 13,
    color: "#2c666e",
    marginTop: 4,
  },

  // Price text styling
  servicePrice: {
    fontWeight: 600,
    color: "#310a31",
  },

  // Duration text (minutes)
  serviceDuration: {
    fontStyle: "italic",
  },

  // Optional "points" row
  servicePointsRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 12,
    color: "#310a31",
    marginTop: 6,
    borderTop: "1px dashed rgba(44, 102, 110, 0.3)",
    paddingTop: 6,
  },

  // Value text in the points row
  servicePointsValue: {
    fontWeight: 600,
    color: "#2c666e",
  },

  // ===========================
  // FORMS (e.g. Contact / Booking)
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
    color: "#310a31",
  },

  input: {
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid rgba(44, 102, 110, 0.4)",
    fontSize: 14,
    backgroundColor: "rgba(240, 237, 238, 0.9)",
    color: "#310a31",
  },

  // ===========================
  // FOOTER
  // ===========================
  footer: {
    padding: "16px 24px",
    borderTop: "1px solid rgba(44, 102, 110, 0.25)",
    fontSize: 13,
    textAlign: "center",
    backgroundColor: "rgba(49, 10, 49, 0.85)",
    backdropFilter: "blur(10px)",
    color: "#f0edee",
  },

  // ===========================
  // CONTACT SECTION LAYOUT
  // ===========================
  contactGrid: {
    display: "grid",
    gap: 16,
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    alignItems: "flex-start",
  },

  // Logo image shown in footer or contact section
  logoImage: {
    width: 90,
    height: "auto",
    borderRadius: 8,
    marginBottom: 8,
    objectFit: "cover",
  },

  // Row for social link chips
  socialRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },

  // Individual social link pill
  socialChip: {
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(44, 102, 110, 0.5)",
    fontSize: 13,
    textDecoration: "none",
    color: "#f0edee",
    backgroundColor: "rgba(44, 102, 110, 0.8)",
    backdropFilter: "blur(8px)",
  },

  // ===========================
  // CART PANEL (Services page)
  // ===========================
  cartPanel: {
    background:
      "radial-gradient(circle at top left, rgba(44, 102, 110, 0.12), transparent 55%), rgba(240, 237, 238, 0.98)",
    borderRadius: 18,
    padding: 16,
    border: "1px solid rgba(44, 102, 110, 0.4)",
    boxShadow: "0 8px 28px rgba(49, 10, 49, 0.2)",
    backdropFilter: "blur(14px)",
    color: "#310a31",
    position: "sticky",
    top: 88,
    minWidth: 260,
  },

  cartPanelTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 8,
    color: "#310a31",
  },

  cartEmptyText: {
    fontSize: 13,
    color: "#2c666e",
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
    borderRadius: 10,
    backgroundColor: "rgba(240, 237, 238, 0.9)",
    border: "1px solid rgba(44, 102, 110, 0.3)",
    marginBottom: 8,
  },

  cartItemName: {
    fontWeight: 500,
    color: "#310a31",
  },

  cartItemMeta: {
    display: "flex",
    gap: 10,
    fontSize: 12,
    color: "#2c666e",
    marginTop: 2,
  },

  cartListRemoveButton: {
    border: "none",
    background: "transparent",
    color: "#310a31",
    fontSize: 16,
    cursor: "pointer",
    padding: 0,
    lineHeight: 1,
  },

  cartTotals: {
    marginTop: 10,
    borderTop: "1px solid rgba(44, 102, 110, 0.3)",
    paddingTop: 10,
    fontSize: 13,
  },

  cartTotalsRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  cartAddButton: {
    marginTop: 12,
    width: "100%",
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid #2c666e",
    backgroundColor: "#2c666e",
    color: "#f0edee",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(44, 102, 110, 0.3)",
  },

  cartRemoveButton: {
    marginTop: 12,
    width: "100%",
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid #310a31",
    backgroundColor: "rgba(82, 21, 82, 0.15)",
    color: "#310a31",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
  },

  // ===========================
  // BOOKING FORM (Services page)
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
    color: "#310a31",
    gap: 4,
  },

  bookingInput: {
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid rgba(44, 102, 110, 0.4)",
    backgroundColor: "rgba(240, 237, 238, 0.9)",
    color: "#310a31",
    fontSize: 13,
    outline: "none",
  },

  bookingSelect: {
    paddingRight: 28,
    cursor: "pointer",
  },

  bookingTextarea: {
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid rgba(44, 102, 110, 0.4)",
    backgroundColor: "rgba(240, 237, 238, 0.9)",
    color: "#310a31",
    fontSize: 13,
    minHeight: 80,
    resize: "vertical",
    outline: "none",
  },

  bookingSubmitButton: {
    marginTop: 6,
    width: "100%",
    padding: "10px 14px",
    borderRadius: 999,
    border: "none",
    backgroundColor: "#2c666e",
    color: "#f0edee",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(44, 102, 110, 0.4)",
  },

  // ===== BLOG DETAIL PAGE =====
  blogDetailWrapper: {
    maxWidth: "900px",
    margin: "0 auto",
  },

  blogBackLink: {
    display: "inline-block",
    marginBottom: 16,
    fontSize: 13,
    color: "#2c666e",
    textDecoration: "none",
  },

  blogDetailTitle: {
    fontSize: 28,
    marginBottom: 8,
    color: "#310a31",
  },

  blogDetailMeta: {
    fontSize: 13,
    color: "#2c666e",
    marginBottom: 20,
  },

  blogDetailBody: {
    background:
      "radial-gradient(circle at top left, rgba(44, 102, 110, 0.12), transparent 55%), rgba(240, 237, 238, 0.96)",
    borderRadius: 16,
    border: "1px solid rgba(44, 102, 110, 0.3)",
    padding: 20,
    boxShadow: "0 12px 32px rgba(49, 10, 49, 0.15)",
    lineHeight: 1.7,
    fontSize: 15,
    color: "#310a31",
    marginBottom: 24,
  },

  blogDetailParagraph: {
    marginBottom: 12,
  },

  blogShareBar: {
    backgroundColor: "rgba(240, 237, 238, 0.9)",
    borderRadius: 12,
    border: "1px solid rgba(44, 102, 110, 0.3)",
    padding: 12,
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    marginBottom: 24,
  },

  blogShareLabel: {
    fontSize: 13,
    color: "#310a31",
    marginRight: 8,
  },

  blogShareButton: {
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid #2c666e",
    backgroundColor: "#2c666e",
    color: "#f0edee",
    fontSize: 12,
    cursor: "pointer",
  },

  blogShareLink: {
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(44, 102, 110, 0.4)",
    backgroundColor: "rgba(240, 237, 238, 0.9)",
    color: "#310a31",
    fontSize: 12,
    cursor: "pointer",
    textDecoration: "none",
  },

  blogCommentsTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: "#310a31",
  },

  blogCommentCard: {
    backgroundColor: "rgba(240, 237, 238, 0.96)",
    borderRadius: 12,
    border: "1px solid rgba(44, 102, 110, 0.3)",
    padding: 14,
    marginBottom: 12,
  },

  blogCommentHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 4,
    fontSize: 12,
    color: "#2c666e",
  },

  blogCommentName: {
    fontWeight: 600,
    color: "#310a31",
  },

  blogCommentText: {
    fontSize: 14,
    color: "#310a31",
  },

  blogCommentFormWrapper: {
    marginTop: 16,
    borderTop: "1px solid rgba(44, 102, 110, 0.3)",
    paddingTop: 16,
  },

  // ===== BLOG LIST (home + /blog page) =====
  blogListCard: {
    background:
      "radial-gradient(circle at top left, rgba(44, 102, 110, 0.12), transparent 55%), rgba(240, 237, 238, 0.98)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    border: "1px solid rgba(44, 102, 110, 0.3)",
    boxShadow: "0 12px 32px rgba(151, 32, 151, 0.9)",
  },

  blogListTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 4,
    color: "#310a31",
  },

  blogListExcerpt: {
    fontSize: 14,
    color: "#2c666e",
    marginBottom: 8,
  },

  blogListMeta: {
    fontSize: 12,
    color: "#2c666e",
    marginBottom: 8,
  },

  // ===== ADMIN SERVICE TABLE =====
  adminTable: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 13,
    marginTop: 8,
  },
  
  adminTh: {
    textAlign: "left",
    padding: "8px 10px",
    borderBottom: "1px solid rgba(44, 102, 110, 0.3)",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.08,
    color: "#2c666e",
    backgroundColor: "rgba(240, 237, 238, 0.9)",
  },
  
  adminTd: {
    padding: "8px 10px",
    borderBottom: "1px solid rgba(240, 237, 238, 0.8)",
    verticalAlign: "top",
    color: "#310a31",
  },
  
  adminEditInput: {
    width: "100%",
    padding: "6px 8px",
    borderRadius: 6,
    border: "1px solid rgba(44, 102, 110, 0.4)",
    backgroundColor: "#f0edee",
    color: "#310a31",
    fontSize: 13,
  },
  
  adminEditButton: {
    padding: "6px 10px",
    fontSize: 12,
    borderRadius: 999,
    border: "1px solid #2c666e",
    backgroundColor: "#2c666e",
    color: "#f0edee",
    cursor: "pointer",
  },
  
  adminSaveButton: {
    padding: "6px 10px",
    fontSize: 12,
    borderRadius: 999,
    border: "1px solid #2c666e",
    backgroundColor: "#2c666e",
    color: "#f0edee",
    cursor: "pointer",
    marginRight: 6,
  },
  
  adminCancelButton: {
    padding: "6px 10px",
    fontSize: 12,
    borderRadius: 999,
    border: "1px solid rgba(44, 102, 110, 0.4)",
    backgroundColor: "transparent",
    color: "#310a31",
    cursor: "pointer",
  },
};