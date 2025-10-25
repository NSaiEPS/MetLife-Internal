import React, { useEffect, useState } from "react";
import styles from "./ToastBox.module.css"; // Using CSS modules

const Toast = ({ message, type = "success", duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div
      className={`${styles.toast} ${
        type === "success" ? styles.success : styles.error
      }`}
    >
      <div className={styles.icon}>{type === "success" ? "✅" : "❌"}</div>
      <div className={styles.message}>{message}</div>
    </div>
  );
};

export default Toast;
