import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Popover,
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
  const [anchorElBell, setAnchorElBell] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const mode = theme.palette.mode;
  console.log(pathname.startsWith("/dashboard"), "pathname");

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleOpenBellPopover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElBell(event.currentTarget);
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
  const handleCloseBellPopover = () => {
    setAnchorElBell(null);
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

  const [notifications, setNotifications] = useState([
    { id: 1, text: "Your project 'Spring Sale' has been approved.", time: "2 hours ago", active: true },
    { id: 2, text: "New comment on 'Script 01'.", time: "5 hours ago", active: true },
    { id: 3, text: "Weekly report is ready for download.", time: "1 day ago", active: false },
  ]);

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, active: false } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, active: false })));
  };

  const activeCount = notifications.filter(n => n.active).length;

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


              <div className={styles.iconBtn} onClick={handleOpenBellPopover}>
                🔔
                {activeCount > 0 && <div className={styles.badge}>{activeCount}</div>}
              </div>

              <Popover
                open={Boolean(anchorElBell)}
                anchorEl={anchorElBell}
                onClose={handleCloseBellPopover}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                sx={{
                  "& .MuiPaper-root": {
                    bgcolor: "var(--bg-card-dark, #111827)",
                    color: "var(--text-light, #f0f4ff)",
                    border: "1px solid var(--border-dark, #1f2d44)",
                    width: "300px",
                    mt: "10px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                    borderRadius: "12px",
                  }
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "var(--text-light, #f0f4ff)" }}>
                      Notifications
                    </Typography>
                    {activeCount > 0 && (
                      <Button
                        size="small"
                        onClick={handleMarkAllAsRead}
                        sx={{
                          fontSize: "11px",
                          textTransform: "none",
                          color: "var(--gold, #ffd700)",
                          "&:hover": { background: "rgba(255, 215, 0, 0.1)" }
                        }}
                      >
                        Mark all as read
                      </Button>
                    )}
                  </Box>
                  <Divider sx={{ borderColor: "var(--border-dark, #1f2d44)", mb: 1 }} />
                  {notifications.length > 0 ? (
                    <List sx={{ p: 0 }}>
                      {notifications.map((notif) => (
                        <ListItem
                          key={notif.id}
                          onClick={() => handleMarkAsRead(notif.id)}
                          sx={{
                            px: 1,
                            py: 1,
                            cursor: "pointer",
                            borderRadius: "8px",
                            mb: 0.5,
                            borderBottom: "1px solid var(--border-dark, #1f2d44)",
                            "&:last-child": { borderBottom: "none" },
                            background: notif.active ? "rgba(255, 255, 255, 0.03)" : "transparent",
                            "&:hover": { background: "rgba(255, 255, 255, 0.05)" }
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                {notif.text}
                                {notif.active && <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#ff4d4f" }} />}
                              </Box>
                            }
                            secondary={notif.time}
                            primaryTypographyProps={{ fontSize: "13px", color: "var(--text-light, #f0f4ff)", fontWeight: notif.active ? 600 : 400 }}
                            secondaryTypographyProps={{ fontSize: "11px", color: "var(--text-secondary-dark, #8899bb)", mt: 0.5 }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" sx={{ color: "var(--text-secondary-dark, #8899bb)", py: 3, textAlign: "center" }}>
                      No new notifications
                    </Typography>
                  )}
                </Box>
              </Popover>

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
