import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import logo from "../../assets/mainImage.svg";
import styles from "./OneFrameHeader.module.css";
import { useNavigate } from "react-router";

const OneFrameHeader = ({
  setMakeChanges,
  makeChanges,
  sceneHandle = false,
}) => {
  const navigate = useNavigate();

  // const handleImageClick = () => {
  //   setMakeChanges(true);
  //   navigate("/");
  // };

  const handleImageClick = (e) => {
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
