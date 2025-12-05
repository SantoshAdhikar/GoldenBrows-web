// src/components/Header.js
import React from "react";
import { Link } from "react-router-dom";
import { styles } from "../styles";

const SALON_ADDRESS = "12345 Some Street, City, CA 90000"; // 🔁 put your real address here

function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <Link to="/" style={{ textDecoration: "none", color: "#f9fafb" }}>
          <div style={styles.logoTitle}>
            Golden Brows Threading &amp; Beauty Studio
          </div>
          <div style={styles.logoSubline}>{SALON_ADDRESS}</div>
        </Link>
      </div>

      <nav style={styles.nav}>
        <Link to="/services" style={styles.navLink}>
          Services
        </Link>
        <Link to="/services" style={styles.navLink}>
          Book Now
        </Link>
        <Link to="/blog" style={styles.navLink}>
          Blog
        </Link>
        <Link to="/#team" style={styles.navLink}>
          Our Team
        </Link>
      </nav>
    </header>
  );
}

export default Header;
