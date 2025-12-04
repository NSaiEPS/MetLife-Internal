import React, { useEffect, useState, useRef } from "react";
import { Backdrop, Box, Button, Typography } from "@mui/material";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Loader from "./Loader";
import { useNavigate } from "react-router";
import { IoArrowBackCircleOutline } from "react-icons/io5";

interface TimerProps {
  time: number;             // e.g., 1.5 minutes
  onComplete?: () => void;  // optional callback
}

const Timer: React.FC<TimerProps> = ({ time, onComplete }) => {
  const navigate = useNavigate();
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
      const progress = remaining / TOTAL_TIME;

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
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          marginTop: "30px",
        }}
      >
        {/* Timer Circle */}
        <Box
          sx={{
            position: "relative",
            width: 180,
            height: 180,
            borderRadius: "50%",
            overflow: "hidden",
            background: "linear-gradient(to bottom right, #e5e7eb, #d1d5db)",
            boxShadow: 4,
          }}
        >
          {/* Water rising animation */}
          <motion.div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: heightPercent,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, #60a5fa, #3b82f6, #2563eb)",
              }}
            />

            {/* shimmer effect */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                height: "100%",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                animation: "shimmer 3s infinite",
                filter: "blur(1px)",
              }}
            />
          </motion.div>

          {/* Center small circle */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: "50%",
                height: "50%",
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(4px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: 4,
                border: "2px solid rgba(255,255,255,0.5)",
              }}
            >
              <Typography variant="h6" fontWeight={700} color="#333">
                {minutes}:{seconds}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={600}
                fontSize="12px"
              >
                remaining
              </Typography>
            </Box>
          </Box>

          {/* Ring */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "4px solid rgba(255,255,255,0.3)",
              pointerEvents: "none",
            }}
          />
        </Box>

        <Loader exactMinutes={exactMinutes} exactSeconds={exactSeconds} />

        {/* CSS keyframes */}
        <style>
          {`
          @keyframes shimmer {
            0% { transform: translateX(-100%) skewX(-15deg); }
            100% { transform: translateX(100%) skewX(-15deg); }
          }
        `}
        </style>
      </Box>
    </>
  );
};

export default Timer;
