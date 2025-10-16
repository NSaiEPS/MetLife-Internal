import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import styles from "./popup.module.css";

const PopupModal = ({
  open,
  onClose,
  title,
  children,
  width = "450px",
  padding = "20px",
  borderRadius = "16px",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          width,
          padding,
          borderRadius,
        },
      }}
    >
      {title && <DialogTitle className={styles.title}>{title}</DialogTitle>}
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

export default PopupModal;
