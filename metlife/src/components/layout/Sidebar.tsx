import {
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  alpha,
} from "@mui/material";
import {
  Speed as DashboardIcon,
  FolderCopy as ProjectsIcon,
  AutoFixHigh as GenerateScriptIcon,
  Psychology as AIInstructionalIcon,
  MovieCreation as AnimationToolkitIcon,
  QueryStats as VisualConsistencyIcon,
  MenuBook as PromptLibraryIcon,
  Source as TemplatesIcon,
  Person as AIPresenterIcon,
  Description as DocToVideoIcon,
  LineWeight as StoryboardIcon,
  Science as ConceptVisualizerIcon,
  Hub as GraphBuilderIcon,
  Palette as BrandKitIcon,
  Translate as LocalizationIcon,
  Assessment as AnalyticsIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { useNavigate, useLocation } from "react-router";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Projects", icon: <ProjectsIcon />, path: "/projects" },
    { text: "Generate Script", icon: <GenerateScriptIcon />, path: "/generate-script" },
    { text: "AI Instructional Designer", icon: <AIInstructionalIcon />, path: "/instructional-designer" },
    { text: "Animation Toolkit", icon: <AnimationToolkitIcon />, path: "#" },
    { text: "Visual Consistency", icon: <VisualConsistencyIcon />, path: "#", isNew: true },
    { text: "Prompt Library", icon: <PromptLibraryIcon />, path: "#", isNew: true },
    { text: "Templates", icon: <TemplatesIcon />, path: "#", isNew: true },
    { text: "AI Presenter", icon: <AIPresenterIcon />, path: "#", isNew: true },
    { text: "Doc-to-Video", icon: <DocToVideoIcon />, path: "#", isNew: true },
    { text: "Storyboard", icon: <StoryboardIcon />, path: "#", isNew: true },
    { text: "Concept Visualizer", icon: <ConceptVisualizerIcon />, path: "#", isNew: true },
    { text: "Graph Builder", icon: <GraphBuilderIcon />, path: "#", isNew: true },
    { text: "Brand Kit", icon: <BrandKitIcon />, path: "#" },
    { text: "Localization", icon: <LocalizationIcon />, path: "#" },
    { text: "Analytics", icon: <AnalyticsIcon />, path: "#" },
    { text: "Settings", icon: <SettingsIcon />, path: "#" },
  ];

  const isActive = (path: string) => {
    if (path === "#") return false;
    // Current path matches exactly or is a subpath (except for /dashboard)
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 260,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 260,
          maxHeight: "calc(100vh - 80px)",
          boxSizing: "border-box",
          bgcolor: "#0f1521",
          borderRight: "1px solid rgba(255, 255, 255, 0.05)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          pb: 2,
          marginTop: "80px",
          px: 1.5,

          overflowX: "hidden"
        },
      }}
    >
      <Box sx={{
        py: 1, "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "10px",
        },
        overflow: "auto",
        height: "calc(100vh - 80px)",
      }}>
        <List sx={{ px: 0 }}>
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => item.path !== "#" && navigate(item.path)}
                  sx={{
                    borderRadius: "12px",
                    px: 2,
                    py: 1,
                    bgcolor: active ? "rgba(43, 34, 25, 1)" : "transparent", // Dark brown bg
                    color: active ? "#f5a623" : "#8899bb", // Orange text if active
                    transition: "0.2s",
                    "&:hover": {
                      bgcolor: active ? "rgba(43, 34, 25, 1)" : alpha("#fff", 0.03),
                      "& .MuiListItemIcon-root": {
                        transform: "scale(1.1)",
                      },
                    },
                    "& .MuiListItemIcon-root": {
                      color: "inherit",
                      minWidth: "36px",
                      fontSize: "20px",
                      transition: "0.2s",
                    },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: "14px",
                      fontWeight: active ? 600 : 500,
                      letterSpacing: "0.2px"
                    }}
                  />
                  {item.isNew && (
                    <Box
                      sx={{
                        bgcolor: "rgba(34, 197, 94, 0.15)",
                        color: "#22c55e",
                        px: 1,
                        py: 0.2,
                        borderRadius: "6px",
                        fontSize: "10px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        ml: 1
                      }}
                    >
                      New
                    </Box>
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Upgrade Plan Card */}
      <Box sx={{ px: 0.5, mt: 4 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: "16px",
            bgcolor: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            textAlign: "left",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <Typography variant="subtitle2" fontWeight={700} sx={{ color: "#fff", mb: 0.5 }}>
            Upgrade Plan
          </Typography>
          <Typography variant="caption" sx={{ color: "#8899bb", display: "block", mb: 1.5, lineHeight: 1.4 }}>
            Unlock all features and generate unlimited content.
          </Typography>
          <Box
            sx={{
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "10px",
              bgcolor: "rgba(245, 166, 35, 1)",
              boxShadow: "0 4px 12px rgba(245, 166, 35, 0.3)",
              cursor: "pointer",
              transition: "0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 16px rgba(245, 166, 35, 0.4)",
              }
            }}
          >
            <ArrowRightAltIcon sx={{ color: "#fff" }} />
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
