import { Box } from "@mui/material";

const GradientLoader = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "60vh",
    }}
  >
    <Box
      sx={{
        width: 64,
        height: 64,
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
  </Box>
);

export default GradientLoader;
