import React from "react";
import styles from "./mainFooter.module.css";
import footerImage from "../../assets/SurfAI_white.png"

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <img src={footerImage} className={styles.image}/>
      <p className={styles.text}>Powered by SurfAI solutions</p>
    </footer>
  );
};

export default Footer;
