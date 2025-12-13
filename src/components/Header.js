// src/components/Header.js - Mobile Optimized
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { API_BASE } from "../apiConfig";
import { styles } from "../styles";

const SALON_ADDRESS = "15733 Downey Ave, Paramount, CA, 90723";

// backend host, e.g. http://localhost:8080
const backendBase = API_BASE.replace("/api", "");

function Header() {
  const [contact, setContact] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function loadContact() {
      try {
        const res = await fetch(`${API_BASE}/contact`);
        if (!res.ok) return;
        const data = await res.json();
        setContact(data);
      } catch (err) {
        console.error("Failed to load contact info:", err);
      }
    }
    loadContact();

    // Handle window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Disable body scroll when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }
  }, [isMobileMenuOpen]);

  // Handle smooth scroll to sections
  const handleSectionClick = (e, sectionId) => {
    e.preventDefault();
    setIsMobileMenuOpen(false); // Close mobile menu
    
    // If we're not on the home page, navigate there first
    if (location.pathname !== "/") {
      navigate("/");
      // Wait a bit for navigation to complete, then scroll
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    } else {
      // Already on home page, just scroll
      scrollToSection(sectionId);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: "smooth", 
        block: "start" 
      });
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const salonName = contact?.salonName || "Golden Brows Threading & Beauty Studio";

  return (
    <>
      <header style={headerStyle}>
        <div style={headerContainerStyle}>
          {/* Business Name Section */}
          <div style={logoStyle}>
            <Link 
              to="/" 
              style={{ 
                textDecoration: "none", 
                color: "#674846", 
                display: "flex", 
                alignItems: "center", 
                gap: "12px" 
              }}
              onClick={closeMobileMenu}
            >
              {/* Logo Image */}
              {contact?.logoUrl && (
                <img 
                  src={backendBase + contact.logoUrl}
                  alt={salonName}
                  style={logoImageStyle}
                />
              )}
              
              {/* Salon Name & Address Text */}
              <div>
                <div style={{ 
                  fontSize: isMobile ? "16px" : "20px", 
                  fontWeight: "bold", 
                  marginBottom: "4px",
                  color: "#674846",
                  lineHeight: 1.2
                }}>
                  {salonName}
                </div>
                <div style={{ 
                  fontSize: isMobile ? "10px" : "12px", 
                  color: "#674846",
                  opacity: 0.9,
                  lineHeight: 1.3
                }}>
                  {contact?.addressLine1 || SALON_ADDRESS}
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav style={styles.nav}>
              <Link to="/services" style={styles.navLink}>
                Services
              </Link>
              <Link to="/services" style={styles.navLink}>
                Book Now
              </Link>
              <Link to="/gallery" style={styles.navLink}>
                Gallery
              </Link>
              <Link to="/reviews" style={styles.navLink}>
                Reviews
              </Link>
              <Link to="/faq" style={styles.navLink}>
                FAQ
              </Link>
              <Link to="/promotions" style={styles.navLink}>
  Promotions
</Link>
              <Link to="/blog" style={styles.navLink}>
                Blog
              </Link>
              <a 
                href="/#team" 
                onClick={(e) => handleSectionClick(e, "team")}
                style={styles.navLink}
              >
                Our Team
              </a>
            </nav>
          )}

          {/* Mobile Hamburger Button */}
          {isMobile && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={hamburgerStyle}
              aria-label="Toggle menu"
            >
              <span style={hamburgerLineStyle(isMobileMenuOpen, 0)}></span>
              <span style={hamburgerLineStyle(isMobileMenuOpen, 1)}></span>
              <span style={hamburgerLineStyle(isMobileMenuOpen, 2)}></span>
            </button>
          )}
        </div>
      </header>

      {/* Mobile Menu Overlay & Sidebar */}
      {isMobile && (
        <>
          {/* Overlay */}
          <div
            style={overlayStyle(isMobileMenuOpen)}
            onClick={closeMobileMenu}
          />
          
          {/* Mobile Menu Sidebar */}
          <nav style={mobileMenuStyle(isMobileMenuOpen)}>
            {/* Menu Header */}
            <div style={mobileMenuHeaderStyle}>
              <h3 style={{ color: "#674846", margin: 0 }}>Menu</h3>
              <button
                onClick={closeMobileMenu}
                style={closeButtonStyle}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* Navigation Links */}
            <div style={mobileNavLinksStyle}>
              <Link
                to="/services"
                style={mobileNavLinkStyle}
                onClick={closeMobileMenu}
              >
                🛍️ Services
              </Link>
              <Link
                to="/services"
                style={mobileNavLinkStyle}
                onClick={closeMobileMenu}
              >
                📅 Book Now
              </Link>
              <Link
                to="/gallery"
                style={mobileNavLinkStyle}
                onClick={closeMobileMenu}
              >
                📸 Gallery
              </Link>
              <Link
                to="/reviews"
                style={mobileNavLinkStyle}
                onClick={closeMobileMenu}
              >
                ⭐ Reviews
              </Link>
              <Link
                to="/faq"
                style={mobileNavLinkStyle}
                onClick={closeMobileMenu}
              >
                ❓ FAQ
              </Link>
              <Link
                to="/blog"
                style={mobileNavLinkStyle}
                onClick={closeMobileMenu}
              >
                📝 Blog
              </Link>
              <a
                href="/#team"
                onClick={(e) => handleSectionClick(e, "team")}
                style={mobileNavLinkStyle}
              >
                👥 Our Team
              </a>
            </div>

            {/* Contact Info in Mobile Menu */}
            {contact && (
              <div style={mobileContactStyle}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#674846" }}>
                  Contact Us
                </div>
                {contact.phone && (
                  <a href={`tel:${contact.phone}`} style={mobileContactLinkStyle}>
                    📞 {contact.phone}
                  </a>
                )}
                {contact.email && (
                  <a href={`mailto:${contact.email}`} style={mobileContactLinkStyle}>
                    ✉️ {contact.email}
                  </a>
                )}
                <div style={{ fontSize: 13, marginTop: 8, color: "#674846" }}>
                  📍 {contact.addressLine1 || SALON_ADDRESS}
                </div>
              </div>
            )}
          </nav>
        </>
      )}
    </>
  );
}

// Styles
const headerStyle = {
  position: "sticky",
  top: 0,
  backgroundColor: "rgba(231, 203, 46, 0.98)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 2px 10px rgba(103, 72, 70, 0.1)",
  zIndex: 100,
  padding: "12px 0"
};

const headerContainerStyle = {
  maxWidth: "1280px",
  margin: "0 auto",
  padding: "0 16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const logoStyle = {
  display: "flex",
  alignItems: "center"
};

const logoImageStyle = {
  height: "50px",
  width: "auto",
  objectFit: "contain",
  borderRadius: "8px"
};

const hamburgerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  cursor: "pointer",
  padding: "8px",
  background: "none",
  border: "none",
  zIndex: 1001,
  WebkitTapHighlightColor: "transparent"
};

const hamburgerLineStyle = (isOpen, index) => {
  const baseStyle = {
    width: "28px",
    height: "3px",
    backgroundColor: "#674846",
    borderRadius: "3px",
    transition: "all 0.3s ease"
  };

  if (isOpen) {
    if (index === 0) {
      return { ...baseStyle, transform: "rotate(45deg) translateY(9px)" };
    } else if (index === 1) {
      return { ...baseStyle, opacity: 0 };
    } else {
      return { ...baseStyle, transform: "rotate(-45deg) translateY(-9px)" };
    }
  }

  return baseStyle;
};

const overlayStyle = (isOpen) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  opacity: isOpen ? 1 : 0,
  pointerEvents: isOpen ? "auto" : "none",
  transition: "opacity 0.3s ease",
  zIndex: 998
});

const mobileMenuStyle = (isOpen) => ({
  position: "fixed",
  top: 0,
  right: isOpen ? 0 : "-100%",
  width: "85%",
  maxWidth: "360px",
  height: "100vh",
  backgroundColor: "rgba(255, 248, 220, 0.98)",
  backdropFilter: "blur(10px)",
  boxShadow: isOpen ? "-5px 0 20px rgba(0, 0, 0, 0.2)" : "none",
  transition: "right 0.3s ease",
  zIndex: 999,
  padding: "20px",
  overflow: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "24px"
});

const mobileMenuHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingBottom: "16px",
  borderBottom: "2px solid rgba(103, 72, 70, 0.2)"
};

const closeButtonStyle = {
  background: "none",
  border: "none",
  fontSize: "28px",
  color: "#674846",
  cursor: "pointer",
  padding: "4px",
  lineHeight: 1,
  WebkitTapHighlightColor: "transparent"
};

const mobileNavLinksStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "4px"
};

const mobileNavLinkStyle = {
  textDecoration: "none",
  color: "#674846",
  fontWeight: 600,
  fontSize: "18px",
  padding: "16px 12px",
  borderRadius: "12px",
  backgroundColor: "rgba(103, 72, 70, 0.05)",
  transition: "all 0.2s",
  display: "block",
  WebkitTapHighlightColor: "transparent"
};

const mobileContactStyle = {
  marginTop: "auto",
  padding: "20px 12px",
  borderTop: "2px solid rgba(103, 72, 70, 0.2)",
  display: "flex",
  flexDirection: "column",
  gap: "12px"
};

const mobileContactLinkStyle = {
  textDecoration: "none",
  color: "#674846",
  fontSize: "15px",
  display: "block"
};

export default Header;