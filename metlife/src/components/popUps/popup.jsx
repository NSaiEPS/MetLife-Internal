import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import styles from "./popup.module.css";

const PopupModal = ({
  open,
  onClose,
  title,
  children,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className={styles.selectLangParent}
      PaperProps={{
    sx: {
      width: "523px",   // ✅ modal width
      maxWidth: "none", // ❗ important (warna MUI default 500px limit karega)
      borderRadius: "16px",
    },
  }}

    >
      {title && <div className={styles.title}>{title}</div>}
      <DialogContent className={styles.languageItem}>{children}</DialogContent>
    </Dialog>
  );
};

export default PopupModal;
