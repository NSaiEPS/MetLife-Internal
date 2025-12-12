import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function Bottom({
  homeData,
  active,
  progress,
  onSelect,
  videoHasError = false,
}) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        // position: "absolute",
        bottom: 16,
        left: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Error Message */}
      {videoHasError && (
        <Box sx={{ mb: 1, px: 2, textAlign: "center" }}>
          <Typography sx={{ color: "red", fontSize: "14px" }}>
            ⚠️ Video failed to load. Click to retry.
          </Typography>
        </Box>
      )}

      <motion.div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          overflow: "auto",
        }}
        transition={{ ease: "easeOut", duration: 0.35 }}
      >
        {homeData?.map((row, i) => {
          const isActive = i === active;

          return (
            <Box
              key={i}
              sx={{
                width: "100%",
                borderTop: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                background: isActive
                  ? "linear-gradient(to bottom, #284f68d5, transparent)"
                  : "transparent",
                pl: `${i === 0 ? 4 : i * 19 + 4}vw`,
              }}
            >
              <Box
                onClick={() => !isActive && onSelect(i)}
                sx={{
                  position: "relative",
                  width: { xs: "50vw", md: "17vw" },
                  userSelect: "none",
                  cursor: isActive ? "default" : "pointer",
                }}
              >
                {/* Bar */}
                <Box
                  sx={{
                    width: "100%",
                    background: isActive
                      ? videoHasError
                        ? "rgba(255,0,0,0.5)"
                        : "#fff"
                      : "linear-gradient(to right, #203D4F, #4A8BB5)",
                  }}
                >
                  <img
                    src="/imgs/strip.png"
                    style={{ height: "10px" }}
                    alt=""
                  />
                </Box>

                {/* Label */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    my: "4px",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        transform: "rotate(45deg)",
                        background: isActive
                          ? videoHasError
                            ? "red"
                            : "#FE4A09"
                          : "#C7DCFF",
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: isActive
                          ? videoHasError
                            ? "red"
                            : "#FE4A09"
                          : "#fff",
                      }}
                    >
                      {row.ost}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      transform: "rotate(45deg)",
                      background: isActive
                        ? videoHasError
                          ? "red"
                          : "#FE4A09"
                        : "#C7DCFF",
                    }}
                  />
                </Box>

                {/* Timer Icon */}
                {isActive && !videoHasError && (
                  <motion.img
                    src="/imgs/timer.png"
                    alt=""
                    initial={{ left: 0 }}
                    animate={{ left: `${progress}%` }}
                    transition={{ ease: "linear", duration: 0.1 }}
                    style={{
                      position: "absolute",
                      top: "-24px",
                      width: "20px",
                      left: 0,
                      transform: "translateX(-50%)",
                    }}
                  />
                )}

                {/* Error Icon */}
                {isActive && videoHasError && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "-24px",
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  >
                    <svg width="20" height="20" fill="red" viewBox="0 0 24 24">
                      <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </Box>
                )}
              </Box>
            </Box>
          );
        })}
      </motion.div>
    </Box>
  );
}
