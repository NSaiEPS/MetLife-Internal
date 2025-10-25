import React, { useState, useEffect } from "react";
import Toast from "./ToastBox";
import styles from "./ToastBox.module.css";

const ToastBox = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initialize global toast functions once
  useEffect(() => {
    window.toast = {
      success: (msg) => showToast(msg, "success"),
      error: (msg) => showToast(msg, "error"),
    };
  }, []);

  return (
    <div className={styles.toastContainer}>
      {toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          onClose={() => removeToast(t.id)}
        />
      ))}
    </div>
  );
};

export default ToastBox;
