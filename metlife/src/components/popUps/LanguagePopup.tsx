import React from "react";
import type { ReactNode } from "react"
import { Dialog, DialogContent } from "@mui/material";
import styles from "./LanguagePopup.module.css";

interface PopupModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const PopupModal: React.FC<PopupModalProps> = ({
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
          width: "523px",
          maxWidth: "none",
          borderRadius: "16px",
        },
      }}
    >
      {title && <div className={styles.title}>{title}</div>}

      <DialogContent className={styles.languageItem}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default PopupModal;
