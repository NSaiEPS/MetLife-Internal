import React from "react";
import styles from "./Login.module.css";
import MetLife from "../../assets/MetLife.png"

const Footer = () => {
  return (
    <footer className={styles.footer}>
      {/* Top Gradient Bar */}
      <div className={styles.gradientBar}>
        <div className={styles.strip_first}></div>
        <div className={styles.strip_two}></div>
        <div className={styles.strip_three}></div>
      </div>

      {/* Links Section */}
      <div className={styles.linksSection}>
        <snap><a href="#">Privacy Policy</a> | <a href="#">Terms of Use</a></snap>
      </div>

      {/* Bottom Row */}
      <div className={styles.bottomRow}>
        <div className={styles.brand}>
          <img src={MetLife}alt="MetLife" className={styles.footer_logo} />
          <span>© 2025 MetLife Services and Solutions, LLC</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
