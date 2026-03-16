import Grid from "@mui/material/Grid";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  alpha,
  IconButton,
  Drawer,
  List,
  TableRow,
  Chip,
} from "@mui/material";
import {
  PlayCircle,
  ErrorOutline,
  VideoLibrary,
  Speed as DashboardIcon,
  FolderCopy,
  AutoFixHigh as GenerateScriptIcon,
  MovieCreation as AnimationToolkitIcon,
  Language as LocalizationIcon,
  Inventory2 as AssetsIcon,
  Assessment as AnalyticsIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { FaFileDownload, FaRegPlayCircle, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  getDashboardInfo,
  getUsersList,
  setSearchQuery,
  setSelectedFilter,
} from "../../redux/features/dashBoardSlice";
import { formatRelativeTime } from "../../utils";
import FullScreenGradientLoader from "../../components/common/GradientLoader";
import ButtonComp from "../../components/common/Buton/Button";
import { UploadPopup } from "../../components/common/popup/UploadPopup";

import UsersListPopup from "../../components/common/popup/UsersListPopup";
import { IoSearchCircleOutline } from "react-icons/io5";

export interface DashboardStatus {
  failed?: boolean;
  videos?: boolean;
  audio?: boolean;
  visuals?: boolean;
  script_id?: string;
  prompt_batch_id?: string;
}

export interface DashboardItem {
  thumbnail: string;
  title: string;
  suggested_duration_minutes: number;
  created_at: string;
  script_id?: string;
  prompt_batch_id?: string;
  videos?: boolean;
  audio?: boolean;
  visuals?: boolean;
  failed?: boolean;
  has_final_video?: boolean;
  stitched_video_exists?: boolean;
  final_video?: { url: string };
  language?: string;
}

// type DashboardFilter = "ALL" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

const MyVideosDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  // const [selectedFilter, setSelectedFilter] = useState<DashboardFilter>("ALL");
  // const theme = useTheme();
  // const mode = theme.palette.mode;
  const [scriptId, setScriptId] = useState("");
  const [open, setOpen] = React.useState<null | HTMLElement>(null);
  const [menuData, setMenuData] = useState({
    downloadScript: "",
    downloadVideo: "",
  });
  const [openUsersDialog, setOpenUsersDialog] = useState(false);
  const openPopup = Boolean(open);

  const {
    dashBoardInfo,
    dashboardLoader,
    usersList,
    selectedFilter,
    searchQuery,
  } = useSelector((store: RootState) => store.DashBoard);

  // count length for statistics
  const completed_result = dashBoardInfo?.filter((item) => {
    // if (item.videos) {
    if (item.has_final_video) {
      return item;
    }
  });

  const inprogress_video = dashBoardInfo?.filter((item) => {
    if (!item.failed && !item.has_final_video && item.audio && !item.videos) {
      return item;
    }
  });

  const inprogress_visuals = dashBoardInfo?.filter((item) => {
    // if (!item.failed && !item.has_final_video && item.visuals && !item.videos && !item.audio) {
    if (!item.failed && !item.has_final_video && item.visuals && !item.videos) {
      return item;
    }
  });



  const inprogress_script = dashBoardInfo?.filter((item) => {
    if (
      !item.failed &&
      !item.has_final_video &&
      !item.visuals &&
      !item.videos &&
      !item.audio
    ) {
      return item;
    }
  });

  const failed_script = dashBoardInfo?.filter((item) => {
    if (item.failed === true) {
      return item;
    }
  });

  const total_progress =
    inprogress_video?.length +
    inprogress_visuals?.length +
    inprogress_script?.length;

  const stats = [
    {
      title: "Total Projects",
      value: dashBoardInfo?.length || 0,
      icon: <FolderCopy sx={{ color: "#fff" }} />,
      bgColor: "#1a2233",
      iconBg: "#2d3a54",
      filter: "ALL",
    },
    {
      title: "In Progress",
      value: total_progress || 0,
      icon: <FaRegPlayCircle size={24} color="#f5a623" />,
      bgColor: "#1a2233",
      iconBg: "#332a1a",
      filter: "IN_PROGRESS",
    },
    {
      title: "Completed",
      value: completed_result?.length || 0,
      icon: <PlayCircle sx={{ color: "#4caf50" }} />,
      bgColor: "#1a2233",
      iconBg: "#1a3326",
      filter: "COMPLETED",
    },
    {
      title: "Failed",
      value: failed_script?.length || 0,
      icon: <ErrorOutline sx={{ color: "#f44336" }} />,
      bgColor: "#1a2233",
      iconBg: "#331a1a",
      filter: "FAILED",
    },
  ];

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard", active: true },
    { text: "Projects", icon: <FolderCopy />, path: "/dashboard" },
    { text: "Generate Script", icon: <GenerateScriptIcon />, path: "/generate-script" },
    { text: "Animation Toolkit", icon: <AnimationToolkitIcon />, path: "#" },
    { text: "Localization", icon: <LocalizationIcon />, path: "#" },
    { text: "Assets", icon: <AssetsIcon />, path: "#" },
    { text: "Analytics", icon: <AnalyticsIcon />, path: "#" },
    { text: "Settings", icon: <SettingsIcon />, path: "#" },
  ];

  const quickActions = [
    { title: "Generate Script", desc: "Start with an idea", icon: <GenerateScriptIcon sx={{ color: "#f5a623" }} /> },
    { title: "Animation Toolkit", desc: "Create visuals & scenes", icon: <AnimationToolkitIcon sx={{ color: "#a855f7" }} /> },
    { title: "Localization", desc: "Translate & dub", icon: <LocalizationIcon sx={{ color: "#3b82f6" }} /> },
    { title: "Project Library", desc: "Manage assets", icon: <FolderCopy sx={{ color: "#14b8a6" }} /> },
  ];

  // showing in table column
  // const getStatusChip = (status: DashboardItem) => {
  //   if (!status) return <Chip label="Unknown" />;
  //   if (status.failed)
  //     return (
  //       <Chip
  //         label="Failed"
  //         sx={{
  //           bgcolor: "#fcecec2d",
  //           fontWeight: "bold",
  //           lineHeight: "normal",
  //           color: "#760505ff",
  //           border: "2px solid #efaaaaff",
  //         }}
  //       />
  //     );

  //   if (status.has_final_video) {
  //     return (
  //       <Chip
  //         label="Completed"
  //         sx={{
  //           bgcolor: "#ecfcf2",
  //           fontWeight: "bold",
  //           lineHeight: "normal",
  //           color: "#057647",
  //           border: "2px solid #aaefc6",
  //         }}
  //       />
  //     );
  //   }
  //   if (status.audio && !status.videos)
  //     return (
  //       <Chip
  //         label="Audio Progress"
  //         sx={{
  //           bgcolor: "#ddf5ffff",
  //           fontWeight: "bold",
  //           lineHeight: "normal",
  //           color: "#2c51d5ff",
  //           border: "2px solid #b0b9e9ff",
  //         }}
  //       />
  //     );

  //   if (status.visuals)
  //     return (
  //       <Chip
  //         label="Visuals in Progress"
  //         sx={{
  //           bgcolor: "#fdf1f9",
  //           color: "#c01573",
  //           fontWeight: "bold",
  //           lineHeight: "normal",
  //           border: "2px solid #fbceee",
  //         }}
  //       />
  //     );

  //   if (status.script_id)
  //     return (
  //       <Chip
  //         label="Script Completed"
  //         sx={{
  //           bgcolor: "#edf3ff",
  //           fontWeight: "bold",
  //           lineHeight: "normal",
  //           color: "#3537cc",
  //           border: "2px solid #c6d7fe",
  //         }}
  //       />
  //     );

  //   if (status.prompt_batch_id)
  //     return (
  //       <Chip
  //         label="Visuals Progress"
  //         sx={{ bgcolor: "#009688", color: "#fff" }}
  //       />
  //     );

  //   return (
  //     <Chip label="In Progress" sx={{ bgcolor: "#9E9E9E", color: "#fff" }} />
  //   );
  // };

  const StatusDot = ({ color }: { color: string }) => (
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: color,
        display: "inline-block",
      }}
    />
  );

  const getStatusChip = (status: DashboardItem) => {
    const baseStyle = {
      fontWeight: 600,
      borderRadius: "20px",
      px: 1,
      height: "26px",
      fontSize: "12px",
    };

    if (!status) return <Chip label="Unknown" />;

    if (status.failed)
      return (
        <Chip
          icon={<StatusDot color="#ef4444" />}
          label="Failed"
          sx={{
            ...baseStyle,
            bgcolor: "rgba(239,68,68,0.15)",
            color: "#ef4444",
          }}
        />
      );

    if (status.has_final_video)
      return (
        <Chip
          icon={<StatusDot color="#22c55e" />}
          label="Completed"
          sx={{
            ...baseStyle,
            bgcolor: "rgba(34,197,94,0.15)",
            color: "#22c55e",
          }}
        />
      );

    if (status.script_id)
      return (
        <Chip
          icon={<StatusDot color="#3b82f6" />}
          label="Script Completed"
          sx={{
            ...baseStyle,
            bgcolor: "rgba(59,130,246,0.15)",
            color: "#3b82f6",
          }}
        />
      );

    if (status.audio && !status.videos)
      return (
        <Chip
          icon={<StatusDot color="#f59e0b" />}
          label="In Progress"
          sx={{
            ...baseStyle,
            bgcolor: "rgba(245,158,11,0.15)",
            color: "#f59e0b",
          }}
        />
      );

    if (status.visuals)
      return (
        <Chip
          icon={<StatusDot color="#f59e0b" />}
          label="In Progress"
          sx={{
            ...baseStyle,
            bgcolor: "rgba(245,158,11,0.15)",
            color: "#f59e0b",
          }}
        />
      );

    return (
      <Chip
        icon={<StatusDot color="#f59e0b" />}
        label="In Progress"
        sx={{
          ...baseStyle,
          bgcolor: "rgba(245,158,11,0.15)",
          color: "#f59e0b",
        }}
      />
    );
  };

  const getStatusLabel = (status: DashboardItem): string => {
    if (!status) return "Unknown";
    if (status.failed) return "Failed";
    if (status.has_final_video) return "Completed";
    if (status.audio && !status.videos) return "Audio Progress";
    if (status.visuals) return "Visuals in Progress";
    if (status.script_id) return "Script Completed";
    if (status.prompt_batch_id) return "Visuals Progress";
    return "In Progress";
  };

  const handleClick = () => {
    navigate("/video-frame");
  };

  useEffect(() => {
    dispatch(getDashboardInfo());
  }, [dispatch]);

  const handleView = (video: DashboardItem) => {
    // if (video.videos) {
    if (video?.final_video?.url && !video?.stitched_video_exists) {
      navigate(`/animation-page/${video.script_id}`);
      return;
    }
    // For conversational
    if (video?.stitched_video_exists) {
      navigate(`/upload-conversational-clips/${video.script_id}`);
      return;
    }
    if (video.audio) {
      navigate(`/audio-animation-toolkit/${video.script_id}`);
      return;
    }
    if (video.visuals) {
      navigate(`/generate-visual-page/${video.script_id}`);
      return;
    }
    if (video.prompt_batch_id) {
      navigate(`/create-visual-content/${video.prompt_batch_id}`);
      return;
    }
    navigate(`/scenes/${video.script_id}`);
  };

  const isCompleted = (item: DashboardItem) =>
    item.has_final_video === true || Boolean(item.final_video);

  const isInProgress = (item: DashboardItem) => {
    if (item.failed) return false;
    if (item.has_final_video) return false;
    if (item.audio && !item.videos) return true;
    if (item.visuals && !item.videos && !item.audio) return true;
    if (!item.visuals && !item.videos && !item.audio) return true;
    return false;
  };

  const isFailed = (item: DashboardItem) => {
    console.log(item, "check_item");
    return item.failed;
  };

  // main function logic which filters the table based on status
  const filteredDashboardInfo = dashBoardInfo
    ?.filter((item) => {
      switch (selectedFilter) {
        case "COMPLETED":
          return isCompleted(item);

        case "IN_PROGRESS":
          return isInProgress(item);

        case "FAILED":
          return isFailed(item);

        default:
          return true;
      }
    })
    ?.filter((item) => {
      if (!searchQuery) return true;
      return (
        item?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item?.language?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item?.suggested_duration_minutes
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item?.created_at?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getStatusLabel(item)?.toLowerCase()?.includes(searchQuery.toLowerCase())
      );
    });

  const handleDownloadMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    video: DashboardItem,
  ) => {
    event.stopPropagation();
    setOpen(event.currentTarget);
    console.log(video?.final_video, video?.title, "finalVidieop");
    setMenuData((prev) => {
      return {
        ...prev,
        downloadVideo: video,
        downloadScript: video,
      };
    });
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleUsers = (video: DashboardItem) => {
    setOpenUsersDialog(true);
    setScriptId(video?.script_id || "");
    dispatch(getUsersList());
  };

  const username = "K"; // Fallback or dynamic username

  return (
    <Box sx={{ display: "flex", maxHeight: "calc(100vh - 80px)", overflow: "auto" }}>
      {/* Sidebar Drawer */}
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
            marginTop: "80px"
          },
        }}
      >
        <Box >
          {/* Logo Area */}


          <List sx={{ px: 2 }}>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => item.path !== "#" && navigate(item.path)}
                  sx={{
                    borderRadius: "10px",
                    px: 2,
                    py: 1.2,
                    bgcolor: item.active ? alpha("#f5a623", 0.1) : "transparent",
                    color: item.active ? "#f5a623" : "#8899bb",
                    "&:hover": {
                      bgcolor: alpha("#fff", 0.05),
                      color: "#fff",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "inherit",
                      minWidth: "36px",
                    },
                  }}
                >
                  <ListItemIcon sx={{ fontSize: "20px" }}>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: "13.5px",
                      fontWeight: item.active ? 600 : 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Upgrade Plan Card */}
        <Box sx={{ px: 2 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: "16px",
              bgcolor: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              textAlign: "left",
            }}
          >
            <Typography variant="subtitle2" fontWeight={700} sx={{ color: "#fff", mb: 0.5 }}>
              Upgrade Plan
            </Typography>
            <Typography variant="caption" sx={{ color: "#8899bb", display: "block", mb: 1.5 }}>
              Unlock all features and generate unlimited content.
            </Typography>
            <Box
              sx={{
                width: 30,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                bgcolor: "var(--gold)",
                boxShadow: "0 0 10px rgba(245, 166, 35, 0.5)",
              }}
            >
              <ArrowRightAltIcon sx={{ color: "#fff" }} />
            </Box>
          </Box>
        </Box>
      </Drawer>

      {/* Main Content & Right Column Wrapper */}
      <Box sx={{ flexGrow: 1, p: 0, display: "flex", flexDirection: "column" }}>
        {dashboardLoader && <FullScreenGradientLoader text="Loading..." />}
        <Box sx={{ p: 4 }}>
          {/* Welcome Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4 }}>
            <Box>
              <Typography variant="h5" fontWeight={700} sx={{ color: "#fff", mb: 0.5 }}>
                Welcome back, {username} 👋
              </Typography>
              <Typography variant="body2" sx={{ color: "#8899bb" }}>
                Let's create something amazing today.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <ButtonComp transform="none" onClick={() => navigate("/create-project")}>
                + Create New Project
              </ButtonComp>
              <ButtonComp transform="none" colorType="outlined" onClick={() => navigate("/generate-script")}>
                ✨ Generate Script
              </ButtonComp>
            </Box>
          </Box>

          {/* Statistics Grid */}
          <Grid container spacing={2} >
            {stats?.map((s, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }} key={idx}>
                <Box
                  onClick={() => dispatch(setSelectedFilter(s.filter))}
                  sx={{
                    p: 2.5,
                    width: "100%",
                    borderRadius: "16px",
                    bgcolor: s.bgColor,
                    border: selectedFilter === s.filter ? "2px solid #f5a623" : "1px solid rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    cursor: "pointer",
                    transition: "0.2s",
                    "&:hover": { transform: "translateY(-2px)", bgcolor: "var(--bg-card-dark)" },
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "12px",
                      bgcolor: s.iconBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {s.icon}
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700 }}>{s.value}</Typography>
                    <Typography variant="caption" sx={{ color: "#8899bb" }}>{s.title}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
        {/* Middle Content area */}
        <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>

          <Box sx={{ flexGrow: 1, p: 4, pt: 0 }}>


            {/* Table Header Section */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" fontWeight={700} sx={{ color: "#fff" }}>Recent Projects</Typography>
              <Typography variant="caption" sx={{ color: "#f5a623", cursor: "pointer", display: "flex", alignItems: "center", gap: 0.5, fontWeight: 600 }}>
                View All <FaChevronRight size={10} />
              </Typography>
            </Box>

            {/* Projects Table */}
            <TableContainer component={Paper} sx={{ overflow: "auto", height: "100%", maxHeight: "calc(100vh - 450px)", bgcolor: "var(--bg-card-dark)", borderRadius: "16px", border: "1px solid var(--border-dark)", boxShadow: "none" }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ "& .MuiTableCell-root": { color: "#4b5563", borderBottom: "1px solid rgba(255,255,255,0.05)", py: 1.5, fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 } }}>
                    <TableCell>Project Name</TableCell>
                    <TableCell>Language</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Updated</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ overflow: "auto", height: "100%", maxHeight: "200px" }}>
                  {filteredDashboardInfo.map((video, idx) => (
                    <TableRow key={idx} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02)" }, "& .MuiTableCell-root": { borderBottom: "1px solid rgba(255,255,255,0.03)", py: 2, color: "#9ca3af", fontSize: "13px" } }}>
                      <TableCell sx={{ color: "#fff !important", fontWeight: 500 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Box sx={{ width: 32, height: 32, borderRadius: "8px", bgcolor: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🎥</Box>
                          {video.title}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <span style={{ fontSize: "16px" }}>🇺🇸</span> {video.language || "English"}
                        </Box>
                      </TableCell>
                      <TableCell>{video.suggested_duration_minutes || "2"} min</TableCell>
                      <TableCell>{getStatusChip(video)}</TableCell>
                      <TableCell>{formatRelativeTime(video.created_at)}</TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={() => handleView(video)} sx={{ color: "#8899bb", "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.1)" } }}>
                          <PlayCircle fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Right Sidebar Column */}
          <Box
            sx={{
              minwidth: 320,
              width: { xs: "100%", md: "20%" },
              flexShrink: 0,
              borderLeft: "1px solid rgba(255,255,255,0.05)",
              display: { xs: "none", lg: "block" },
              overflowY: "auto",
              marginRight: "28px"
            }}
          >
            {/* Quick Actions */}
            <Typography variant="subtitle2" fontWeight={700} sx={{ color: "#fff", mb: 3 }}>Quick Actions</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
              {quickActions.map((action, i) => (
                <Box
                  key={i}
                  sx={{
                    p: 1,
                    width: "100%",
                    borderRadius: "12px",
                    bgcolor: "var(--bg-card2)",
                    border: "1px solid var(--border-dark)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "0.2s",
                    "&:hover": { bgcolor: "var(--bg-card2)", borderColor: alpha("#f5a623", 0.3) },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{ minWidth: "24px" }}>{action.icon}</Box>
                    <Box>
                      <Typography variant="body2" fontWeight={600} sx={{ color: "#fff" }}>{action.title}</Typography>
                      <Typography variant="caption" sx={{ color: "#4b5563" }}>{action.desc}</Typography>
                    </Box>
                  </Box>
                  <FaChevronRight size={10} color="#4b5563" />
                </Box>
              ))}
            </Box>

            {/* Monthly Usage */}
            <Typography variant="subtitle2" fontWeight={700} sx={{ color: "#fff", mb: 1 }}>Monthly Usage</Typography>
            <div style={{ width: "100%", margin: "0 auto" }}>
              <Box sx={{ p: 2, borderRadius: "20px", bgcolor: "var(--bg-card2)", border: "1px solid var(--border-dark)", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" sx={{ color: "#8899bb", mb: 1, fontSize: "13px" }}>20/25 videos created</Typography>
                    <Box sx={{ height: 8, bgcolor: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden", position: "relative" }}>
                      <Box sx={{ width: "78%", height: "100%", bgcolor: "#f5a623", borderRadius: 4 }} />
                    </Box>
                  </Box>
                  <Box sx={{ position: "relative", display: "inline-flex" }}>
                    <svg width="64" height="64" viewBox="0 0 64 64">
                      <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="#f5a623"
                        strokeWidth="6"
                        strokeDasharray="176"
                        strokeDashoffset={176 - (176 * 78) / 100}
                        strokeLinecap="round"
                        transform="rotate(-90 32 32)"
                        style={{ transition: "stroke-dashoffset 0.5s ease" }}
                      />
                    </svg>
                    <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Typography variant="h5" fontWeight={700} sx={{ color: "#fff", fontSize: "14px" }}>78%</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <ButtonComp
                fullWidth
                transform="none"
                colorType="secondary"
              >
                View Details
              </ButtonComp>
            </div>


          </Box>
        </Box>

      </Box>

      {/* Popups (Keep logic as is) */}
      <UploadPopup open={open} openPopup={openPopup} handleCloseMenu={handleCloseMenu} menuData={menuData} />
      <UsersListPopup open={openUsersDialog} onClose={() => setOpenUsersDialog(false)} scriptId={scriptId} />
    </Box >
  );
};

export default MyVideosDashboard;
