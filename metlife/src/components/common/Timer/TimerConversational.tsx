import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

interface TimerProps {
  time: number;
  onComplete?: () => void;
}

const STORAGE_KEY = "video_stitch_start";

const TimerConversational: React.FC<TimerProps> = ({ time, onComplete }) => {
  const animationRef = useRef<number | null>(null);

  const minutes = Math.floor(time);
  const seconds = Math.round((time - minutes) * 60);
  const TOTAL_TIME = minutes * 60 + seconds;

  const getStartTime = () => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) return Number(saved);

    const now = Date.now();
    localStorage.setItem(STORAGE_KEY, now.toString());
    return now;
  };

  const startTime = getStartTime();

  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const remaining = Math.max(TOTAL_TIME - elapsed, 0);

  const [timeLeft, setTimeLeft] = useState<number>(remaining);
  const [progress, setProgress] = useState<number>(
    ((TOTAL_TIME - remaining) / TOTAL_TIME) * 100
  );

  useEffect(() => {
    const update = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(TOTAL_TIME - elapsed, 0);

      const progress = ((TOTAL_TIME - remaining) / TOTAL_TIME) * 100;

      setProgress(progress);
      setTimeLeft(Math.ceil(remaining));

      if (remaining > 0) {
        animationRef.current = requestAnimationFrame(update);
      } else {
        localStorage.removeItem(STORAGE_KEY);
        onComplete?.();
      }
    };

    animationRef.current = requestAnimationFrame(update);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        mt: 4,
        border: "1px solid #cfe3f5",
        backgroundColor: "#fff",
      }}
    >
      <Typography fontSize={18} mb={2}>
        Video Generation in Progress
      </Typography>

      <Box
        sx={{
          height: 10,
          borderRadius: 20,
          background: "#e6f0fa",
          overflow: "hidden",
          mb: 2,
        }}
      >
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear", duration: 0.2 }}
          style={{
            height: "100%",
            background: "#4da3ff",
          }}
        />
      </Box>

      <Box display="flex" justifyContent="space-between">
        <Typography>Time Remaining – {mm}:{ss}</Typography>
        <Typography>Total Time – {minutes}:{String(seconds).padStart(2,"0")}</Typography>
      </Box>
    </Box>
  );
};

export default TimerConversational;