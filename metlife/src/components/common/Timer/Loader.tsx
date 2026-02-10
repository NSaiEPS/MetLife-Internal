import React from "react";
import { Box, Typography } from "@mui/material";

interface LoaderProps {
  exactMinutes: number;
  exactSeconds: number;
}

const Loader: React.FC<LoaderProps> = ({ exactMinutes, exactSeconds }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column", // Dots on top, time below
        alignItems: "center",
        justifyContent: "center",
        marginTop: "10px",
      }}
    >
      {/* Dots Row */}
      <Box
        sx={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ ...dotStyle, background: "#0a1dbf", animationDelay: "0s" }} />
        <Box sx={{ ...dotStyle, background: "#2e98a3", animationDelay: "0.1s" }} />
        <Box sx={{ ...dotStyle, background: "#7ecedf", animationDelay: "0.2s" }} />
        <Box sx={{ ...dotStyle, background: "#f8a538", animationDelay: "0.3s" }} />
      </Box>

      {/* Time BELOW dots */}
      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        fontWeight={600}
        fontSize="25px"
        sx={{ marginTop: "8px" }}
      >
        <span>Total Time</span> – {exactMinutes} :{" "}
        {String(exactSeconds).padStart(2, "0")}
      </Typography>

      {/* Keyframes */}
      <style>
        {`
          @keyframes bounce {
            0% { transform: translateY(0); opacity: 1; }
            50% { transform: translateY(-10px); opacity: 0.6; }
            100% { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};

const dotStyle: React.CSSProperties = {
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  animation: "bounce 0.6s infinite ease-in-out",
};

export default Loader;
