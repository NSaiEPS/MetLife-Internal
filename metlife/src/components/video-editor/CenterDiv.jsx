import React, { useEffect, useRef, useState, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { motion, useAnimation } from "framer-motion";

const CenterDiv = ({
  progress,
  isActive,
  data,
  duration = 10,
  onTogglePlay,
}) => {
  const videoRef = useRef(null);
  const triAnim = useAnimation();

  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  const toggleVideoPlay = () => {
    const v = videoRef.current;
    if (!v) return;

    if (isVideoPlaying) {
      v.pause();
      setIsVideoPlaying(false);
      onTogglePlay(false);
    } else {
      v.play();
      setIsVideoPlaying(true);
      onTogglePlay(true);
    }
  };

  const isDesktop = useMemo(() => window.innerWidth >= 768, []);

  useEffect(() => {
    triAnim.start(
      isActive
        ? { opacity: 1, scale: 1, transition: { duration: 0.5 } }
        : { opacity: 0, scale: 0.8, transition: { duration: 0.3 } }
    );
  }, [isActive, triAnim]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (isActive) {
      onTogglePlay(true);
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [isActive]);

  return (
    <Box
      sx={{
        width: { xs: "70%", md: "75vw" },
        height: "100%",
        position: "relative",
        userSelect: "none",
      }}
    >
      <Box
        onClick={toggleVideoPlay}
        sx={{
          position: "relative",
          zIndex: 20,
          height: "100%",
          width: "100%",
          border: "2px solid rgba(255,255,255,0.2)",
          backgroundColor: "#1f3039",
          overflow: "hidden",
        }}
      >
        <video
          ref={videoRef}
          style={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
            opacity: 0.75,
          }}
          src={data.final_video.url}
          autoPlay={false}
          loop
          // muted
        />

        {/* TIMER */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            px: { xs: 2, md: 3 },
            py: 2,
          }}
        >
          <Typography sx={{ fontSize: "1.125rem", color: "#61B2E9" }}>
            {isActive ? (
              <span>
                {String(Math.floor((progress / 100) * duration)).padStart(
                  2,
                  "0"
                )}
              </span>
            ) : (
              <span>00</span>
            )}
            /{String(duration).padStart(2, "0")}
          </Typography>
        </Box>
      </Box>

      {/* FRAMER TRIANGLES */}
      <motion.img
        src="/imgs/triangle-left-top.png"
        style={{
          position: "absolute",
          top: "-24px",
          left: "-24px",
          width: "36%",
          zIndex: 10,
        }}
        animate={triAnim}
        initial={{ opacity: 0, scale: 0.8 }}
      />

      <motion.img
        src="/imgs/triangle-right-bottom.png"
        style={{
          position: "absolute",
          bottom: "-24px",
          right: "-24px",
          width: "36%",
          zIndex: 10,
        }}
        animate={triAnim}
        initial={{ opacity: 0, scale: 0.8 }}
      />
    </Box>
  );
};

export default CenterDiv;
