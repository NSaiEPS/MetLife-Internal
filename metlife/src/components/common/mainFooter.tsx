import React from "react";
import styles from "./mainFooter.module.css";
import footerImage from "../../assets/edwsurf_dark_logo.svg";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <img src={footerImage} className={styles.image} /> &nbsp; &nbsp;{" "}
      <p className={styles.text}>Powered by SurfAI </p>
    </footer>
  );
};

export default Footer;
