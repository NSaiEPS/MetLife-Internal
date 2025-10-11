import React from "react";
import styles from "./Login.module.css";
import MetLife from "../../assets/MetLife.png"

const Header = () => {
  return (
    <header className={styles.header}>
      <img
        src={MetLife}  // replace path if needed
        alt="MetLife logo"
        className={styles.logo}
      />
    </header>
  );
};

export default Header;
