import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function Bottom({
  homeData,
  active,
  progress,
  onSelect,
  videoHasError = false,
}) {
  const containerRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    const activeItem = itemRefs.current[active];

    if (!container || !activeItem) return;

    const containerRect = container.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();

    const containerCenter = containerRect.width / 2;
    const itemCenter = itemRect.left - containerRect.left + itemRect.width / 2;

    const scrollLeft = container.scrollLeft + (itemCenter - containerCenter);

    container.scrollTo({
      left: scrollLeft,
      behavior: "smooth",
    });
  }, [active]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        borderTop: "1px solid rgba(255,255,255,0.2)",
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

      <Box
        ref={containerRef}
        sx={{
          padding: "4vw",
          display: "flex",
          gap: "5vw",
          width: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": { display: "none" },
          overscrollBehavior: "contain", // ⬅️ prevents parent scroll chaining
        }}
      >
        {homeData?.map((row, i) => {
          const isActive = i === active;

          return (
            <Box
              key={i}
              ref={(el) => (itemRefs.current[i] = el)}
              sx={{
                flex: "0 0 auto",
                borderTop: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                background: isActive
                  ? "linear-gradient(to bottom, #284f68d5, transparent)"
                  : "transparent",
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
                    height: "8px",
                    background: isActive
                      ? videoHasError
                        ? "rgba(255,0,0,0.5)"
                        : "#fff"
                      : "linear-gradient(to right, #203D4F, #4A8BB5)",
                    // position: "relative",
                    // top: "-14px",
                    // left: "50%",
                  }}
                >
                  <img
                    src="/imgs/strip.png"
                    style={{ height: "100%" }}
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

                {/* Timer */}
                {isActive && !videoHasError && (
                  <motion.img
                    src="/imgs/timer.png"
                    initial={{ left: 0 }}
                    animate={{ left: `${progress}%` }}
                    transition={{ ease: "linear", duration: 0.1 }}
                    style={{
                      position: "absolute",
                      top: "-50px",
                      width: 20,
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
      </Box>
    </Box>
  );
}
