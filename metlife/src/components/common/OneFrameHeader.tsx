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
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import styles from "./OneFrameHeader.module.css";
import { useNavigate, useLocation } from "react-router";
import { navigateTo } from "../../utils/navigate";
import secureLocalStorage from "react-secure-storage";

interface OneFrameHeaderProps {
  makeChanges?: boolean;
  sceneHandle?: boolean;
}

const navLinks = [
  { title: "Dashboard", path: "/dashboard" },
  { title: "Projects", path: "/projects" },
  { title: "Help", path: "#" },
];

const OneFrameHeader: React.FC<OneFrameHeaderProps> = ({
  makeChanges = false,
  sceneHandle = false,
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const token = secureLocalStorage.getItem("token") as string | null;
  const userDetails = secureLocalStorage.getItem("userDetails") as any;
  const username = userDetails?.username || "Guest";

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const mode = theme.palette.mode;
  console.log(pathname.startsWith("/dashboard"), "pathname");

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (path?: string) => {
    setAnchorElNav(null);
    if (path && path !== "#") {
      navigate(path);
    }
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLElement>) => {
    if (sceneHandle && makeChanges) {
      const confirmLeave = window.confirm(
        "⚠️ You have unsaved changes. Are you sure you want to leave this page?"
      );

      if (!confirmLeave) {
        e.preventDefault();
        return;
      }
    }

    navigate("/");
  };

  const handleLogout = () => {
    secureLocalStorage.clear();
    navigate("/login");
  };

  return (
    <AppBar position="static" className={styles.appBar} color="transparent" elevation={0} sx={{ borderBottom: "1px solid var(--border-dark, #1f2d44)", background: "var(--bg-card-dark, #111827)" }}>
      <Toolbar disableGutters sx={{ px: { xs: 2, md: 4 }, height: "var(--nav-h, 60px)", minHeight: "var(--nav-h, 60px) !important", display: "flex", justifyContent: "space-between" }}>

        {/* Left: Logo Section */}
        <div className={styles.logo} onClick={handleLogoClick}>
          <div className={styles.logoIcon}>🎬</div>
          <div className={styles.logoText}>Ed<span>Wave</span><span className={styles.logoBadge}>Content Studio</span></div>
        </div>

        {/* Center: Desktop Navigation Links (Hidden on Dashboard) */}
        {!pathname.startsWith("/dashboard") && (
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, justifyContent: "center" }}>
            <div className={styles.navLinks}>
              {navLinks.map((link) => (
                <div
                  key={link.title}
                  className={styles.navLink}
                  onClick={() => handleCloseNavMenu(link.path)}
                >
                  {link.title}
                </div>
              ))}
            </div>
          </Box>
        )}
        {/* {pathname.startsWith("/dashboard") && (
          <div className={styles.searchBox}>
            <span style={{ fontSize: "14px" }}>🔍</span> <input type="text" placeholder="Search projects, scripts...
" />
          </div>
        )} */}
        {/* Right: User / Mobile Menu */}
        <div className={styles.navRight}>

          {pathname.startsWith("/dashboard") && (
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: "12px", alignItems: "center" }}>


              <div className={styles.iconBtn}>
                🔔
                {/* <div className={styles.badge}>3</div> */}
              </div>
              <div className={styles.helpBtn}>
                ❓
              </div>
            </Box>
          )}

          {/* Mobile Menu Icon */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: "var(--text-light, #f0f4ff)" }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorElNav)}
              onClose={() => handleCloseNavMenu()}
              sx={{
                display: { xs: "block", md: "none" },
                "& .MuiPaper-root": { bgcolor: "var(--bg-card-dark, #111827)" }
              }}
            >
              {navLinks.map((link) => (
                <MenuItem key={link.title} onClick={() => handleCloseNavMenu(link.path)}>
                  <Typography textAlign="center" sx={{ color: "var(--text-light, #f0f4ff)" }}>
                    {link.title}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* User Avatar */}
          {token && (
            <Box>
              <div className={styles.avatar} onClick={handleOpenUserMenu}>
                {username.charAt(0).toUpperCase()}
              </div>
              <Menu
                sx={{
                  mt: "45px",
                  "& .MuiPaper-root": {
                    bgcolor: "var(--bg-card-dark, #111827)",
                    color: "var(--text-light, #f0f4ff)",
                    border: "1px solid var(--border-dark, #1f2d44)",
                  }
                }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem disabled>
                  <Typography textAlign="center" sx={{ color: "var(--text-secondary-dark, #8899bb)" }}>
                    {username}
                  </Typography>
                </MenuItem>
                <Divider sx={{ borderColor: "var(--border-dark, #1f2d44)" }} />
                <MenuItem onClick={handleLogout}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}

        </div>
      </Toolbar>
    </AppBar>
  );
};

export default OneFrameHeader;
