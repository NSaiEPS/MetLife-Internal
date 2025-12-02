import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import logo from "../../assets/mainImage.svg";
import styles from "./OneFrameHeader.module.css";
import { useNavigate } from "react-router";

interface OneFrameHeaderProps {
  setMakeChanges?: (value: boolean) => void;
  makeChanges?: boolean;
  sceneHandle?: boolean;
}

const OneFrameHeader: React.FC<OneFrameHeaderProps> = ({
  setMakeChanges,
  makeChanges = false,
  sceneHandle = false,
}) => {
  const navigate = useNavigate();

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (sceneHandle && makeChanges) {
      const confirmLeave = window.confirm(
        "⚠️ You have unsaved changes. Are you sure you want to leave this page?"
      );

      if (!confirmLeave) {
        e.preventDefault();
        return;
      }
    }

    // ✅ Either no unsaved changes, or user confirmed
    // setMakeChanges?.(true); // optional call if needed
    navigate("/");
  };

  return (
    <AppBar position="static" className={styles.appBar}>
      <Toolbar className={styles.toolbar}>
        {/* Left spacer to keep title centered */}
        <Typography variant="h6" className={styles.title}>
          OneFrame
        </Typography>

        <img
          src={logo}
          alt="MetLife logo"
          onClick={handleImageClick}
          className={styles.logo}
        />
      </Toolbar>
    </AppBar>
  );
};

export default OneFrameHeader;
