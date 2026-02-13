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
  TableRow,
  Avatar,
  Chip,
} from "@mui/material";
import {
  PlayCircle,
  ErrorOutline,
  VideoLibrary,
  EventNote,
} from "@mui/icons-material";
import { FaFileDownload, FaRegPlayCircle } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  getDashboardInfo,
  getUsersList,
} from "../../redux/features/dashBoardSlice";
import { formatRelativeTime } from "../../utils";
import FullScreenGradientLoader from "../../components/common/GradientLoader";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import ButtonComp from "../../components/common/Buton/Button";
import { UploadPopup } from "../../components/common/popup/UploadPopup";
import { FaShareSquare } from "react-icons/fa";
import UsersListPopup from "../../components/common/popup/UsersListPopup";

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
}

type DashboardFilter = "ALL" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

const MyVideosDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedFilter, setSelectedFilter] = useState<DashboardFilter>("ALL");
  const [scriptId, setScriptId] = useState("");
  const [open, setOpen] = React.useState<null | HTMLElement>(null);
  const [menuData, setMenuData] = useState({
    downloadScript: "",
    downloadVideo: "",
  });
  const [openUsersDialog, setOpenUsersDialog] = useState(false);
  const openPopup = Boolean(open);

  const { dashBoardInfo, dashboardLoader, usersList } = useSelector(
    (store: RootState) => store.DashBoard,
  );

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
    if (!item.failed && !item.has_final_video && item.visuals && !item.videos && !item.audio) {
      return item;
    }
  });

  const inprogress_script = dashBoardInfo?.filter((item) => {
    if (!item.failed && !item.has_final_video && !item.visuals && !item.videos && !item.audio) {
      return item;
    }
  });

  const failed_script = dashBoardInfo?.filter(item => {
    if(item.failed === true) {
      return item;
    }
  })

  const total_progress =
    inprogress_video?.length +
    inprogress_visuals?.length +
    inprogress_script?.length;

  const stats = [
    {
      title: "Total Videos",
      value: dashBoardInfo?.length || 0,
      color: "#E3F2FD",
      icon: <VideoLibrary fontSize="large" sx={{ color: "#1976D2" }} />,
      iconColor: "#1976D2",
      filter: "ALL",
    },
    {
      title: "In Progress",
      value: total_progress,
      color: "#FFF8E1",
      icon: <FaRegPlayCircle size={35} color="#F9A825" />,
      iconColor: "#F9A825",
      filter: "IN_PROGRESS",
    },
    {
      title: "Completed Videos",
      value: completed_result?.length,
      color: "#E8F5E9",
      icon: <PlayCircle fontSize="large" sx={{ color: "#2E7D32" }} />,
      iconColor: "#2E7D32",
      filter: "COMPLETED",
    },
    {
      title: "Failed / Error",
      value: failed_script?.length || 0,
      color: "#FDECEA",
      icon: <ErrorOutline fontSize="large" sx={{ color: "#D32F2F" }} />,
      iconColor: "#D32F2F",
      filter: "FAILED",
    },
  ];

  const getStatusChip = (status: DashboardItem) => {
    if (!status) return <Chip label="Unknown" />;
    if (status.failed)
      return <Chip label="Failed" sx={{ bgcolor: "#e53935", color: "#fff" }} />;

    if (status.has_final_video) {
      return (
        <Chip
          label="Completed"
          sx={{
            bgcolor: "#ecfcf2",
            fontWeight: "bold",
            lineHeight: "normal",
            color: "#057647",
            border: "2px solid #aaefc6",
          }}
        />
      );
    }
    if (status.audio && !status.videos)
      return (
        <Chip
          label="Audio Progress"
          sx={{
            bgcolor: "#dde7ffff",
            fontWeight: "bold",
            lineHeight: "normal",
            color: "#0d30aeff",
            border: "2px solid #aab5efff",
          }}
        />
      );

    if (status.visuals)
      return (
        <Chip
          label="Visuals in Progress"
          sx={{
            bgcolor: "#fdf1f9",
            color: "#c01573",
            fontWeight: "bold",
            lineHeight: "normal",
            border: "2px solid #fbceee",
          }}
        />
      );

    if (status.script_id)
      return (
        <Chip
          label="Script Completed"
          sx={{
            bgcolor: "#edf3ff",
            fontWeight: "bold",
            lineHeight: "normal",
            color: "#3537cc",
            border: "2px solid #c6d7fe",
          }}
        />
      );

    if (status.prompt_batch_id)
      return (
        <Chip
          label="Visuals Progress"
          sx={{ bgcolor: "#009688", color: "#fff" }}
        />
      );

    return (
      <Chip label="In Progress" sx={{ bgcolor: "#9E9E9E", color: "#fff" }} />
    );
  };

  const handleClick = () => {
    navigate("/video-frame");
  };

  useEffect(() => {
    dispatch(getDashboardInfo());
  }, [dispatch]);

  const handleView = (video: DashboardItem) => {
    if (video.videos) {
      navigate(`/animation-page/${video.script_id}`);
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
    console.log(item, "check_item")
    return item.failed;
  };
  

  const filteredDashboardInfo = dashBoardInfo.filter((item) => {
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
  });

  const handleDownloadMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    video,
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

  const handleUsers = (video) => {
    setOpenUsersDialog(true);
    setScriptId(video?.script_id);
    dispatch(getUsersList());
  };

  return (
    <>
      <Box sx={{ bgcolor: "#f7f7f7", minHeight: "100vh" }}>
        {dashboardLoader && <FullScreenGradientLoader text="Loading..." />}

        <Box sx={{ p: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h4" fontWeight={600}>
              My Videos Dashboard
            </Typography>
          </Box>

          {/* ===================== STATISTICS ====================== */}
          <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Statistics
            </Typography>

            <Grid
              container
              spacing={3}
              sx={{
                width: "100%",
                m: 0,
                paddingTop: "10px",
                flexWrap: "nowrap",
                overflowX: "auto",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {stats.map((s, idx) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  key={idx}
                  sx={{
                    flex: 1,
                    minWidth: { xs: "200px", md: "auto" },
                    cursor: "pointer",
                  }}
                >
                  <Paper
                    elevation={selectedFilter === s.filter ? 6 : 0}
                    onClick={() => setSelectedFilter(s.filter)}
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      bgcolor: s.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      boxShadow: "none",
                      border:
                        selectedFilter === s.filter
                          ? "2px solid #1976D2"
                          : "2px solid transparent",
                      transition: "0.3s",
                      "&:hover": {
                        transform: "translateY(-3px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        bgcolor: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {s.icon}
                    </Box>

                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="h5">{s.value}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {s.title}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* ===================== VIDEO LIST ====================== */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">Video List</Typography>

            <ButtonComp
              variant="contained"
              colorType="secondary"
              label="+ Create New Video"
              transform="none"
              sx={
                {
                  // bgcolor: "#2f91c7",
                  // borderRadius: "8px",
                }
              }
              onClick={handleClick}
            >
              {" "}
              + Create New Video
            </ButtonComp>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#E3F2FD" }}>
                  <TableCell>S.No</TableCell>
                  {/* <TableCell>Thumbnail</TableCell> */}
                  <TableCell>Video Name</TableCell>
                  <TableCell>Language</TableCell>

                  <TableCell>Duration</TableCell>
                  <TableCell>Last Update</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredDashboardInfo.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography
                        variant="body1"
                        sx={{ py: 4, color: "text.secondary", fontWeight: 500 }}
                      >
                        Data not available
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDashboardInfo?.map((video, i) => (
                    <TableRow key={i}>
                      <TableCell>{i + 1}</TableCell>

                      <TableCell>
                        {/* ${
                          video.language ? "_" + video.language.slice(0, 2) : ""
                        } */}
                        {`${video.title}
                        `}
                      </TableCell>
                      <TableCell>{video?.language}</TableCell>

                      <TableCell>{video?.suggested_duration_minutes}</TableCell>

                      <TableCell>
                        {formatRelativeTime(video?.created_at)}
                      </TableCell>

                      <TableCell>{getStatusChip(video)}</TableCell>

                      <TableCell align="center">
                        <Button onClick={() => handleView(video)}>👁️</Button>
                        {/* <Button onClick={(e) => handleDownloadMenu(e, video)}>
                          <FaFileDownload size={18} />
                        </Button> */}
                        <Button onClick={() => handleUsers(video)}>
                          <FaShareSquare size={18} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <UploadPopup
            open={open}
            openPopup={openPopup}
            handleCloseMenu={handleCloseMenu}
            menuData={menuData}
          />

          <UsersListPopup
            open={openUsersDialog}
            onClose={() => setOpenUsersDialog(false)}
            scriptId={scriptId}
          />
        </Box>
      </Box>
    </>
  );
};

export default MyVideosDashboard;
