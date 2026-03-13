import React, { useEffect, useState, useRef } from "react";
import { Backdrop, Box, Button, Typography } from "@mui/material";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Loader from "./Loader";
import { useNavigate } from "react-router";
import { IoArrowBackCircleOutline } from "react-icons/io5";

interface TimerProps {
  time: number;
  onComplete?: () => void;
}

const Timer: React.FC<TimerProps> = ({ time, onComplete, label }) => {
  const [open, setOpen] = useState(true);

  // Convert time to seconds
  const exactMinutes = Math.floor(time);
  const exactSeconds = Math.round((time - exactMinutes) * 60);
  const TOTAL_TIME = exactMinutes * 60 + exactSeconds;

  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_TIME);
  const animationRef = useRef<number | null>(null);

  // Framer Motion animation
  const rawHeight = useMotionValue(100);
  const smoothHeight = useSpring(rawHeight, {
    stiffness: 70,
    damping: 25,
  });

  const heightPercent = useTransform(smoothHeight, (v) => `${Math.max(0, v)}%`);

  useEffect(() => {
    const startTime = performance.now();

    const updateAnimation = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;
      const remaining = Math.max(0, TOTAL_TIME - elapsed);
      // const progress = remaining / TOTAL_TIME;
      // rawHeight.set(progress * 100);
      const progress = 1 - remaining / TOTAL_TIME;
      rawHeight.set(progress * 100);
      setTimeLeft(Math.ceil(remaining));

      if (remaining > 0) {
        animationRef.current = requestAnimationFrame(updateAnimation);
      } else {
        setOpen(false);
        onComplete?.();
      }
    };

    animationRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [TOTAL_TIME, onComplete, rawHeight]);

  // Format time
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <Box
      sx={{
        maxWidth: "100%",
        mx: "auto",
        my: 4,
        p: 3,
        borderRadius: 2,
        border: "1px solid #cfe3f5",
        backgroundColor: "#fff",
        boxShadow: "0 0 0 1px #e3f2fd",
      }}
    >
      {/* Title */}
      <Typography fontSize={18} variant="h5" mb={2}>
        {label || "Video Generation in Progress"}
      </Typography>

      {/* Progress Bar */}
      <Box
        sx={{
          position: "relative",
          height: 10,
          borderRadius: 999,
          backgroundColor: "#e6f0fa",
          overflow: "hidden",
          mb: 2,
        }}
      >
        <motion.div
          style={{
            height: "100%",
            backgroundColor: "#4da3ff",
            width: useTransform(smoothHeight, (v) => `${Math.max(0, v)}%`),
          }}
        />
      </Box>

      {/* Labels */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          color: "#6b7280",
          fontSize: 14,
        }}
      >
        <Typography>
          Time Remaining – {minutes}:{seconds}
        </Typography>
        <Typography>
          Total Time – {exactMinutes}:{String(exactSeconds).padStart(2, "0")}
        </Typography>
      </Box>
    </Box>
  );
};

export default Timer;
