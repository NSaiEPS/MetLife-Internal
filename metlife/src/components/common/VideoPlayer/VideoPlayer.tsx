import { Box, Typography } from "@mui/material";

const VideoPlayer = ({ videoUrl }) => {
  if (!videoUrl) {
    return (
      <Typography
        variant="body2"
        sx={{ textAlign: "center", color: "gray", mt: 2 }}
      >
        No video available.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        width: 1200, // same as image carousel
        height: "auto",
        margin: "0 auto",
        position: "relative",
        borderRadius: 2,
        backgroundColor: "#f4f4f4",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        p: 1,
      }}
    >
      <video
        src={videoUrl}
        controls
        style={{
          width: "100%",
          height: "auto",
          borderRadius: 8,
          objectFit: "cover",
        }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.outerHTML =
            "<p style='color:red;text-align:center;'>Unable to load video</p>";
        }}
      />
    </Box>
  );
};

export default VideoPlayer;
