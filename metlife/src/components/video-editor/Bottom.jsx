import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function Bottom({ homeData, active, progress, onSelect }) {
  const total = homeData.length;

  const [desktop, setDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const cb = () => setDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", cb);
    return () => window.removeEventListener("resize", cb);
  }, []);

  // const total = homeData.length;

  // dynamic card width (percentage)
  const cardWidth = 100 / total;
  const cardHeight = 40;
  // shift based on active index
  const shiftXPerc = -((active * cardWidth * 3) / 4);
  const shiftYPerc = (active < 3 ? 1 : -(active - 3)) * cardHeight;

  // const shiftPerc = desktop
  //   ? 0
  //   : -(active === total - 1 ? (total - 2) * cardWidth : active * cardWidth);

  return (
    <Box
      sx={{
        width: "100%",
        maxHeight: "30vh",
        borderTop: "1px solid rgba(255,255,255,0.2)",

        position: "absolute",
        bottom: "30px",
        left: 0,
        display: "flex",
        flexDirection: "column",
        // background: "red",
        overflow: "hidden",
      }}
    >
      <motion.div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "fit-content",
        }}
        className="md:w-full"
        animate={{ x: `${shiftXPerc}%`, y: `${shiftYPerc}px` }}
        transition={{ ease: "easeOut", duration: 0.35 }}
      >
        {homeData.map((row, i) => {
          const isActive = i === active;

          return (
            <Box
              key={i}
              sx={{
                width: "120%",
                height: "40px",
                borderTop: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                flexDirection: "column",
                // justifyContent: "center",
                background: isActive
                  ? "linear-gradient(to bottom, #284f68d5, transparent)"
                  : "transparent",
                paddingLeft: desktop
                  ? `${i === 0 ? 5 : i * 21 + 4}vw`
                  : `${i === 0 ? 3 : i * 51 + 3}vw`,
              }}
            >
              {/* body */}
              <Box
                sx={{
                  position: "relative",
                  width: { xs: "50vw", md: "17vw" },
                  userSelect: "none",
                  cursor: isActive ? "default" : "pointer",
                }}
                onClick={() => !isActive && onSelect(i)}
              >
                {/* bar */}
                <Box
                  sx={{
                    width: "100%",
                    height: "8px",
                    background: isActive
                      ? "#fff"
                      : "linear-gradient(to right, #203D4F, #4A8BB5)",
                    // justifyContent: "center",
                    display: "flex",
                  }}
                >
                  <img src="/imgs/strip.png" alt="" style={{ height: "8px" }} />
                </Box>

                {/* label */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mt: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {/* left dot */}
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        transform: "rotate(45deg)",
                        backgroundColor: isActive ? "#FE4A09" : "#C7DCFF",
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: isActive ? "#FE4A09" : "#fff",
                      }}
                    >
                      {row.ost}
                    </Typography>
                  </Box>

                  {/* right dot */}
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      transform: "rotate(45deg)",
                      backgroundColor: isActive ? "#FE4A09" : "#C7DCFF",
                    }}
                  />
                </Box>

                {/* timer icon */}
                {isActive && (
                  <motion.img
                    src="/imgs/timer.png"
                    alt=""
                    style={{
                      position: "absolute",
                      top: "-24px",
                      width: "20px",
                      left: 0,
                      transform: "translateX(-50%)",
                    }}
                    initial={{ left: 0 }}
                    animate={{ left: `${progress}%` }}
                    transition={{ ease: "linear", duration: 0.1 }}
                  />
                )}
              </Box>
            </Box>
          );
        })}
      </motion.div>
    </Box>
  );
}
