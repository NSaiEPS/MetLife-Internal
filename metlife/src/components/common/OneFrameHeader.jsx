import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import logo from "../../assets/mainImage.svg";
import styles from "./OneFrameHeader.module.css";
import { useNavigate } from "react-router";

const OneFrameHeader = () => {
  const navigate = useNavigate();

  const handleImageClick = () => {
    navigate("/video-frame");
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
