import React from "react";
import { styles } from "../styles";

function Footer() {
  return (
    <footer style={styles.footer} id="contact">
      <p>
        © {new Date().getFullYear()} Golden Brows Threading &amp; Beauty
        Studio
      </p>
      <p>California, USA</p>
    </footer>
  );
}

export default Footer;
