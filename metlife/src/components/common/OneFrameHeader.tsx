import React from "react";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import logo from "../../assets/mainImage.svg";
import styles from "./OneFrameHeader.module.css";
import { useNavigate, useLocation } from "react-router";
import { navigateTo } from "../../utils/navigate";

interface OneFrameHeaderProps {
  // setMakeChanges?: (value: boolean) => void;
  makeChanges?: boolean;
  sceneHandle?: boolean;
}

const OneFrameHeader: React.FC<OneFrameHeaderProps> = ({
  // setMakeChanges,
  makeChanges = false,
  sceneHandle = false,
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (sceneHandle && makeChanges) {
      const confirmLeave = window.confirm(
        "⚠️ You have unsaved changes. Are you sure you want to leave this page?"
      );

      if (!confirmLeave) {
        // ❌ User canceled — stay on the same page
        e.preventDefault();
        return;
      }
    }

    // ✅ Either no unsaved changes, or user confirmed
    // setMakeChanges(true); // or false, depending on when you want to mark changes
    if (pathname === "/dashboard" || pathname === "/") return;
    navigate("/");
  };

  return (
    <AppBar position="static" className={styles.appBar}>
      <Toolbar className={styles.toolbar}>
        {/* Left spacer to keep title centered */}
        <img
          src={logo}
          alt="MetLife logo"
          onClick={handleImageClick}
          className={styles.logo}
        />
        <Typography variant="h6" className={styles.title}>
          OneFrame
        </Typography>

        <Button
          disableRipple
          disableTouchRipple
          onClick={() => navigateTo("/dashboard")}
          sx={{
            fontSize: "24px",
            lineHeight: "30px",
            color: "#000000",
            fontWeight: 600,
            padding: 0,
            borderRadius: 0,
            textTransform: "none",
            borderBottom: "4px solid transparent",
            minWidth: "auto",

            ":hover": {
              borderBottom: "4px solid #0079bb",
              backgroundColor: "transparent",
            },

            ":active": {
              backgroundColor: "transparent",
            },
          }}
        >
          Dashboard
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default OneFrameHeader;
