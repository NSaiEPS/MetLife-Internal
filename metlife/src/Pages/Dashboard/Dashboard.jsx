import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
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
import OneFrameHeader from "../../components/common/OneFrameHeader";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardInfo } from "../../redux/features/dashBoardSlice";
import { formatRelativeTime } from "../../utils";
import FullScreenGradientLoader from "../../components/common/GradientLoader";

const MyVideosDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { dashBoardInfo, dashboardLoader } = useSelector(
    (store) => store.DashBoard
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

  console.log(inprogress_visuals, "result__check");
  const stats = [
    {
      title: "Total Videos",
      value: dashBoardInfo?.length,
      color: "#E3F2FD",
      icon: <VideoLibrary fontSize="large" color="primary" />,
    },
    {
      title: "Completed Scripts",
      value: completed_result?.length,
      color: "#E8F5E9",
      icon: <FaRegPlayCircle size={35} color="#4CAF50" />,
    },
    {
      title: "In Progress",
      value: total_progress,
      color: "#FFEBEE",
      icon: <PlayCircle fontSize="large" color="error" />,
    },
    {
      title: "Failed / Error",
      value: 0,
      color: "#F3E5F5",
      icon: <ErrorOutline fontSize="large" color="secondary" />,
    },
  ];

  const getStatusChip = (status) => {
    console.log(status?.failed, "status_check");
    if (!status) return <Chip label="Unknown" />;

    // Failed
    if (status.failed)
      return <Chip label="Failed" sx={{ bgcolor: "#F44336", color: "#fff" }} />; // Red

    // All videos done → Completed
    if (status.videos)
      return (
        <Chip label="Completed" sx={{ bgcolor: "#4CAF50", color: "#fff" }} />
      ); // Green

    // Audio progress
    if (status.audio && !status.videos)
      return (
        <Chip
          label="Audio in Progress"
          sx={{ bgcolor: "#2196F3", color: "#fff" }}
        />
      ); // Blue

    // Visuals progress
    if (status.visuals)
      return (
        <Chip
          label="Visuals in Progress"
          sx={{ bgcolor: "#9C27B0", color: "#fff" }}
        />
      ); // Purple

    // Script completed
    if (status.script_id)
      return (
        <Chip
          label="Script Completed"
          sx={{ bgcolor: "#FF9800", color: "#fff" }}
        />
      ); // Orange

    // Prompt batch started (unique color)
    if (status.prompt_batch_id)
      return (
        <Chip
          label="Visuals in Progress"
          sx={{ bgcolor: "#009688", color: "#fff" }}
        />
      ); // Teal

    return (
      <Chip label="In Progress" sx={{ bgcolor: "#9E9E9E", color: "#fff" }} />
    ); // Grey
  };

  const handleClick = () => {
    navigate("/video-frame");
  };
  useEffect(() => {
    dispatch(getDashboardInfo());
  }, []);

  const handleView = (video) => {
    if (video?.videos) {
      console.log("audio founded");
      navigate(`/animation-page/${video?.script_id}`);
      return;
    }
    if (video?.audio) {
      console.log("audio founded");
      navigate(`/audio-animation-toolkit/${video?.script_id}`);
      return;
    } else if (video?.visuals) {
      console.log("visuals founnd");
      navigate(`/generate-visual-page/${video?.script_id}`);
      return;
    } else if (video?.prompt_batch_id) {
      navigate(`/create-visual-content/${video?.prompt_batch_id}`);
      return;
    } else {
      navigate(`/scenes/${video?.script_id}`);
      return;
    }
  };

  return (
    <Box sx={{ bgcolor: "#f7f7f7", minHeight: "100vh" }}>
      <OneFrameHeader />
      {dashboardLoader && <FullScreenGradientLoader text={"Loading..."} />}

      <Box
        sx={{
          p: 4,
        }}
      >
        {/* Header */}
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
          {/* <Button
          variant="contained"
          sx={{
            bgcolor: "#29B6F6",
            borderRadius: "8px",
            textTransform: "none",
            "&:hover": { bgcolor: "#039BE5" },
          }}
        >
          14 October 2025, 11:30 AM
        </Button> */}
        </Box>

        {/* Statistics */}
        <Paper
          elevation={1}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            width: "100%",
            overflow: "hidden",
          }}
        >
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
                    height: "100%",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
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
                      color: s.iconColor,
                    }}
                  >
                    {s.icon}
                  </Box>
                  <Box sx={{ flex: 1, textAlign: "right" }}>
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      color="text.primary"
                    >
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

        {/* Video List */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Video List
          </Typography>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#29B6F6",
              textTransform: "none",
              borderRadius: "8px",
              "&:hover": { bgcolor: "#039BE5" },
            }}
            onClick={handleClick}
          >
            + Create New Video
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#E3F2FD" }}>
                <TableCell>Thumbnail</TableCell>
                <TableCell>Video Name</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Last Update</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dashBoardInfo.map((video, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Avatar
                      src={video.thumbnail}
                      variant="rounded"
                      sx={{ width: 60, height: 60 }}
                    />
                  </TableCell>
                  <TableCell>{video.title}</TableCell>
                  <TableCell>{video.suggested_duration_minutes}</TableCell>
                  <TableCell>{formatRelativeTime(video.created_at)}</TableCell>
                  <TableCell>
                    {/* {getStatusChip(video.status ?? "Script Completed")} */}
                    {getStatusChip(video)}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="text"
                      sx={{ minWidth: 0, p: 1 }}
                      onClick={() => handleView(video)}
                    >
                      👁️
                    </Button>
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
