import React, { useRef } from "react";
import { Box } from "@mui/material";
import CenterDiv from "./CenterDiv";

/* helper: shortest circular offset */
const offset = (i, active, total) => {
  let diff = i - active;
  const half = Math.floor(total / 2);
  if (diff > half) diff -= total;
  if (diff < -half) diff += total;
  return diff; // -2 … +2
};

/* constants for layout */
const SLIDE_W = 75;
const PEEK = 8;
const STEP = SLIDE_W - (1 - PEEK);

export default function HeroSection({
  homeData,
  active,
  progress,
  next,
  prev,
  onTogglePlay,
  isGloballyPlaying,
  onFirstInteraction,
  hasUserInteracted,
  onVideoLoadStatus,
}) {
  const total = homeData?.length;
  const startX = useRef(null);
  const far = Math.floor(total / 2);

  /* pointer handlers */
  const handleDown = (e) => {
    startX.current = e.clientX || e.touches?.[0]?.clientX;
  };

  const handleUp = (e) => {
    if (startX.current == null) return;

    const endX = e.clientX || e.changedTouches?.[0]?.clientX;
    const dx = endX - startX.current;
    const TH = 50;

    if (dx > TH) prev();
    if (dx < -TH) next();

    startX.current = null;
  };

  return (
    <Box
      onPointerDown={handleDown}
      onPointerUp={handleUp}
      onTouchStart={handleDown}
      onTouchEnd={handleUp}
      sx={{
        position: "relative",
        width: "100%",
        height: "70vh",

        // height: { xs: "50vh", md: "45vh" },
      }}
    >
      {homeData?.map((item, i) => {
        const off = offset(i, active, total);
        const xvw = off * STEP;
        const isActive = i === active;

        const opacity = isActive ? 1 : Math.abs(off) === far ? 0 : 0.9;

        return (
          <Box
            key={i}
            sx={{
              position: "absolute",
              inset: 0,
              // width: "100%",
              height: "fit-content",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transform: `translateX(${xvw}vw)`,
              opacity: opacity,
              transition: "transform .7s ease, opacity .5s ease",
              pointerEvents: isActive ? "auto" : "none",
            }}
          >
            <CenterDiv
              isActive={isActive}
              data={item}
              duration={item.duration || 10}
              progress={progress}
              onTogglePlay={onTogglePlay}
              isGloballyPlaying={isGloballyPlaying}
              onFirstInteraction={onFirstInteraction}
              hasUserInteracted={hasUserInteracted}
              onVideoLoadStatus={isActive ? onVideoLoadStatus : undefined}
            />
          </Box>
        );
      })}
    </Box>
  );
}
