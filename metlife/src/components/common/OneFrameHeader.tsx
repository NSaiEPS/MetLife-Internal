import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
// import logo from "../../assets/mainImage.svg";
import logo from "../../assets/logo.jpeg";
import styles from "./OneFrameHeader.module.css";
import { useNavigate, useLocation } from "react-router";
import { navigateTo } from "../../utils/navigate";
import secureLocalStorage from "react-secure-storage";

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

  return (
    <>
      <AppBar position="static" className={styles.appBar}>
        <Box className={styles.appBarBox}>
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
            <div>
              <Button
                disableRipple
                disableTouchRipple
                onClick={() => navigateTo("/dashboard")}
                sx={{
                  fontSize: "24px",
                  lineHeight: "30px",
                  color: "#000000",
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
                        bgcolor: "#1976d2",
                        fontSize: "18px",
                        fontWeight: 600,
                        paddingTop: "0.3rem",
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
        </Box>
      </AppBar>
    </>
  );
};

export default OneFrameHeader;
