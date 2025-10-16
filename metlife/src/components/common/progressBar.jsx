// src/components/common/ProgressBar.jsx
import React from "react";
import styles from "./ProgressBar.module.css";

const ProgressBar = ({ progress = 0 }) => {
  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressFill} style={{ width: `${progress}%` }} />
    </div>
  );
};

export default ProgressBar;
