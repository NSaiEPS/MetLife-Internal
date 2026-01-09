import Grid from "@mui/material/Grid";
import React, { useEffect } from "react";
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
import { PlayCircle, ErrorOutline, VideoLibrary } from "@mui/icons-material";
import { FaRegPlayCircle } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { getDashboardInfo } from "../../redux/features/dashBoardSlice";
import { formatRelativeTime } from "../../utils";
import FullScreenGradientLoader from "../../components/common/GradientLoader";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import ButtonComp from "../../components/common/Buton/Button";

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
}

const MyVideosDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { dashBoardInfo, dashboardLoader } = useSelector(
    (store: RootState) => store.DashBoard
  );

  const completed_result = dashBoardInfo.filter((item) => {
    if (item.videos) {
      return item;
    }
  });

  const inprogress_video = dashBoardInfo.filter((item) => {
    if (item.audio && !item.videos) {
      return item;
    }
  });

  const inprogress_visuals = dashBoardInfo.filter((item) => {
    if (item.visuals && !item.videos && !item.audio) {
      return item;
    }
  });

  const inprogress_script = dashBoardInfo.filter((item) => {
    if (!item.visuals && !item.videos && !item.audio) {
      return item;
    }
  });

  const total_progress =
    inprogress_video?.length +
    inprogress_visuals?.length +
    inprogress_script?.length;

  const stats = [
    {
      title: "Total Videos",
      value: dashBoardInfo?.length || 0,
      color: "#E3F2FD", // Soft Blue (info / neutral)
      icon: <VideoLibrary fontSize="large" sx={{ color: "#1976D2" }} />,
      iconColor: "#1976D2",
    },
    {
      title: "In Progress",
      value: total_progress,
      color: "#FFF8E1", // Warm Yellow (processing / ongoing)
      icon: <FaRegPlayCircle size={35} color="#F9A825" />,
      iconColor: "#F9A825",
    },
    {
      title: "Completed Videos",
      value: completed_result?.length,
      color: "#E8F5E9", // Soft Green (success)
      icon: <PlayCircle fontSize="large" sx={{ color: "#2E7D32" }} />,
      iconColor: "#2E7D32",
    },
    {
      title: "Failed / Error",
      value: 0,
      color: "#FDECEA", // Light Red (error / danger)
      icon: <ErrorOutline fontSize="large" sx={{ color: "#D32F2F" }} />,
      iconColor: "#D32F2F",
    },
  ];

  const getStatusChip = (status: DashboardItem) => {
    if (!status) return <Chip label="Unknown" />;

    if (status.failed)
      return <Chip label="Failed" sx={{ bgcolor: "#F44336", color: "#fff" }} />;

    if (status.videos)
      return (
        <Chip label="Completed" sx={{ bgcolor: "#4CAF50", color: "#fff" }} />
      );

    if (status.audio && !status.videos)
      return (
        <Chip
          label="Audio Progress"
          sx={{ bgcolor: "#2196F3", color: "#fff" }}
        />
      );

    if (status.visuals)
      return (
        <Chip
          label="Visuals in Progress"
          sx={{ bgcolor: "#9C27B0", color: "#fff" }}
        />
      );

    if (status.script_id)
      return (
        <Chip
          label="Script Completed"
          sx={{ bgcolor: "#FF9800", color: "#fff" }}
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

  return (
    <Box sx={{ bgcolor: "#f7f7f7", minHeight: "100vh" }}>
      <OneFrameHeader />
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
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    bgcolor: s.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "0.3s",
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
                    <Typography variant="h5" fontWeight={700}>
                      {s.value}
                    </Typography>
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
          <Typography variant="h6" fontWeight={600}>
            Video List
          </Typography>

          <ButtonComp
            variant="contained"
            colorType="secondary"
            label="+ Create New Video"
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
                <TableCell>Thumbnail</TableCell>
                <TableCell>Video Name</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Last Update</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {dashBoardInfo.map((video: any, i: number) => (
                <TableRow key={i}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>
                    <Avatar
                      src={video.thumbnail}
                      variant="rounded"
                      sx={{ width: 60, height: 60 }}
                    />
                  </TableCell>
                  <TableCell>{`${
                    video.language === null
                      ? ""
                      : video.language.slice(0, 2) + "_"
                  }${video.title}`}</TableCell>
                  <TableCell>{video.suggested_duration_minutes}</TableCell>
                  <TableCell>{formatRelativeTime(video.created_at)}</TableCell>
                  <TableCell>{getStatusChip(video)}</TableCell>
                  <TableCell align="center">
                    <Button onClick={() => handleView(video)}>👁️</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default MyVideosDashboard;
