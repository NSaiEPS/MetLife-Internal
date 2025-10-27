import { Box, Typography, Backdrop } from "@mui/material";

const FullScreenGradientLoader = ({ open = true, text = "Generating..." }) => {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 9999,
        backgroundColor: "rgba(0, 0, 0, 0.15)",
      }}
      open={open}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            border: "6px solid",
            borderColor: "transparent transparent #1976d2 #42a5f5",
            animation: "spin 1s linear infinite",
            "@keyframes spin": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(360deg)" },
            },
          }}
        />
        <Typography
          variant="h6"
          sx={{ color: "white", fontWeight: 500, letterSpacing: 0.5 }}
        >
          {text}
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default FullScreenGradientLoader;
