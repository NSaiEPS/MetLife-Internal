import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
// import logo from "../../assets/mainImage.svg";
import logo from "../../assets/logo.jpeg";
import styles from "./OneFrameHeader.module.css";
import { useNavigate, useLocation } from "react-router";
import { navigateTo } from "../../utils/navigate";
import secureLocalStorage from "react-secure-storage";
import footerImage from "../../assets/edwsurf_light_logo.svg";
import footerdarkImage from "../../assets/edwsurf_dark_logo.svg";

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
  const token = secureLocalStorage.getItem("token") as string | null;
  const { username } = secureLocalStorage.getItem("userDetails") as
    | string
    | null;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const mode = theme.palette.mode;


  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (sceneHandle && makeChanges) {
      const confirmLeave = window.confirm(
        "⚠️ You have unsaved changes. Are you sure you want to leave this page?",
      );

      if (!confirmLeave) {
        // ❌ User canceled — stay on the same page
        e.preventDefault();
        return;
      }
    }

    // ✅ Either no unsaved changes, or user confirmed
    // setMakeChanges(true); // or false, depending on when you want to mark changes
    // if (pathname === "/dashboard" || pathname === "/") return;
    navigate("/");
  };

  const handleLogout = () => {
    secureLocalStorage.clear();
    // window.location.href = "/login";
    navigate("/login");
  };

  console.log(mode, "mode");


  return (
    <>
      <AppBar position="static" className={`${styles.appBar}`}>
        <Toolbar className={styles.toolbar}>
          {/* Left spacer to keep title centered */}
          <img
            src={mode === "dark" ? footerdarkImage : footerImage}
            alt="MetLife logo"
            onClick={handleImageClick}
            className={styles.logo}
          />
          <Typography variant="h6" className={`${styles.title} ${mode === "dark" ? styles.dark_text : styles.light_text}`}>
            EdwSurf AI Studio
          </Typography>
          <div style={{ marginRight: "35px" }}>
            <Button
              disableRipple
              disableTouchRipple
              onClick={() => navigateTo("/dashboard")}
              sx={{
                fontSize: "24px",
                lineHeight: "30px",
                color: `${mode === "light" ? "#333333" : "#ffffff"}`,
                fontWeight: 600,
                padding: "11px",
                marginBottom: "-9px",
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
            {token && (
              <>
                <IconButton onClick={handleOpen}>
                  <Avatar
                    sx={{
                      bgcolor: "var(--primary-color)", // Use CSS variable for avatar background
                      fontSize: "18px",
                      fontWeight: 600,
                      paddingTop: "0.3rem",
                      color: "#fff",
                      // lineHeight: 1,
                      // fontFamily: "Inter, Roboto, sans-serif",
                    }}
                  >
                    {username.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem disabled>
                    <Typography variant="subtitle2">{username}</Typography>
                  </MenuItem>

                  <Divider />

                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default OneFrameHeader;
