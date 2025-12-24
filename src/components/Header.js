// src/components/Header.js
// ✅ FIXED: Navigation wraps and stays visible!

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { API_BASE } from "../apiConfig";
import { styles } from "../styles";

const SALON_ADDRESS = "15733 Downey Ave, Paramount, CA, 90723";

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

  const handleSectionClick = (e, sectionId) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    } else {
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
        {/* Container that won't overflow */}
        <div style={containerStyle}>
          
          {/* LEFT: Business Name + Address */}
          <div style={leftSectionStyle}>
            <Link 
              to="/" 
              style={{ textDecoration: "none", color: "#000000ff" }}
              onClick={closeMobileMenu}
            >
              <div style={businessNameStyle}>
                {salonName}
              </div>
              <div style={businessAddressStyle}>
                {contact?.addressLine1 || SALON_ADDRESS}
              </div>
            </Link>
          </div>

          {/* RIGHT: Desktop Navigation (wraps if needed!) */}
          {!isMobile && (
            <nav style={rightNavStyle}>
              <Link to="/services" style={navLinkStyle}>Services</Link>
              <Link 
                to="/services" 
                style={navLinkStyle}
                onClick={() => {
                  if (window.gtag) {
                    window.gtag('event', 'book_now_click', {
                      event_category: 'engagement',
                      event_label: 'Header Book Now Button',
                      value: 1
                    });
                  }
                }}
              >
                Book Now
              </Link>
              <Link to="/gallery" style={navLinkStyle}>Gallery</Link>
              <Link to="/reviews" style={navLinkStyle}>Reviews</Link>
              <Link to="/faq" style={navLinkStyle}>FAQ</Link>
              <Link to="/promotions" style={navLinkStyle}>Promotions</Link>
              <Link to="/pricing" style={navLinkStyle}>Pricing</Link>
              <Link to="/blog" style={navLinkStyle}>Blog</Link>
              <a 
                href="/#team" 
                onClick={(e) => handleSectionClick(e, "team")}
                style={navLinkStyle}
              >
                Our Team
              </a>
            </nav>
          )}

          {/* MOBILE: Hamburger Button */}
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

      {/* Mobile Menu */}
      {isMobile && (
        <>
          <div style={overlayStyle(isMobileMenuOpen)} onClick={closeMobileMenu} />
          
          <nav style={mobileMenuStyle(isMobileMenuOpen)}>
            <div style={mobileMenuHeaderStyle}>
              <h3 style={{ color: "#674846", margin: 0 }}>Menu</h3>
              <button onClick={closeMobileMenu} style={closeButtonStyle} aria-label="Close menu">
                ✕
              </button>
            </div>

            <div style={mobileNavLinksStyle}>
              <Link to="/services" style={mobileNavLinkStyle} onClick={closeMobileMenu}>
                🛍️ Services
              </Link>
              <Link
                to="/services"
                style={mobileNavLinkStyle}
                onClick={() => {
                  closeMobileMenu();
                  if (window.gtag) {
                    window.gtag('event', 'book_now_click', {
                      event_category: 'engagement',
                      event_label: 'Mobile Menu Book Now Button',
                      value: 1
                    });
                  }
                }}
              >
                📅 Book Now
              </Link>
              <Link to="/gallery" style={mobileNavLinkStyle} onClick={closeMobileMenu}>
                📸 Gallery
              </Link>
              <Link to="/reviews" style={mobileNavLinkStyle} onClick={closeMobileMenu}>
                ⭐ Reviews
              </Link>
              <Link to="/promotions" style={mobileNavLinkStyle} onClick={closeMobileMenu}>
                🎁 Promotions
              </Link>
              <Link to="/pricing" style={mobileNavLinkStyle} onClick={closeMobileMenu}>
                💰 Pricing
              </Link>
              <Link to="/faq" style={mobileNavLinkStyle} onClick={closeMobileMenu}>
                ❓ FAQ
              </Link>
              <Link to="/blog" style={mobileNavLinkStyle} onClick={closeMobileMenu}>
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

            {contact && (
              <div style={mobileContactStyle}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#674846" }}>
                  Contact Us
                </div>
                {contact.phone && (
                  <a 
                    href={`tel:${contact.phone}`} 
                    style={mobileContactLinkStyle}
                    onClick={() => {
                      if (window.gtag) {
                        window.gtag('event', 'contact_click', {
                          event_category: 'engagement',
                          event_label: 'phone',
                          value: 1
                        });
                      }
                    }}
                  >
                    📞 {contact.phone}
                  </a>
                )}
                {contact.email && (
                  <a 
                    href={`mailto:${contact.email}`} 
                    style={mobileContactLinkStyle}
                    onClick={() => {
                      if (window.gtag) {
                        window.gtag('event', 'contact_click', {
                          event_category: 'engagement',
                          event_label: 'email',
                          value: 1
                        });
                      }
                    }}
                  >
                    ✉️ {contact.email}
                  </a>
                )}
                <div style={{ fontSize: 15, marginTop: 8, color: "#000000ff" }}>
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

// ============================================
// STYLES
// ============================================

const headerStyle = {
  position: "sticky",
  top: 0,
  backgroundColor: "rgba(162, 245, 238, 0.98)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 2px 10px rgba(103, 72, 70, 0.1)",
  zIndex: 100,
  padding: "8px 0", // Reduced padding for more space
  width: "100%"
};

// ✅ FIX: Container with proper spacing
const containerStyle = {
  maxWidth: "100%",
  padding: "0 16px", // Balanced padding
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px"
};

// LEFT: Business name + address
const leftSectionStyle = {
  flex: "0 0 auto",
  minWidth: "200px"
};

const businessNameStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "3px",
  color: "#e713cbff",
  lineHeight: 1.2
};

const businessAddressStyle = {
  fontSize: "16px",
  color: "#ee11eedc",
  opacity: 0.9,
  lineHeight: 1.3
};

// ✅ FIX: Navigation that wraps and stays visible
const rightNavStyle = {
  display: "flex",
  flexWrap: "wrap", // Allow wrapping!
  gap: "8px", // Smaller gap to fit more
  alignItems: "center",
  justifyContent: "flex-end",
  flex: "1 1 auto",
  maxWidth: "70%" // Prevent taking too much space
};

// ✅ FIX: Smaller nav links
const navLinkStyle = {
  ...styles.navLink,
  padding: "5px 10px", // Smaller padding
  fontSize: "14px", // Smaller font
  whiteSpace: "nowrap" // Don't break words
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
    backgroundColor: "#050505ff",
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
  backgroundColor: "rgba(239, 225, 243, 0.22)",
  backdropFilter: "blur(10px)",
  boxShadow: isOpen ? "-5px 0 20px rgba(201, 75, 233, 1)" : "none",
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
  borderBottom: "2px solid rgba(189, 60, 51, 1)"
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
  backgroundColor: "rgba(255, 255, 255, 0.77)",
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