import React, { useEffect, useRef } from "react";
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
}) {
  const total = homeData.length;
  const startX = useRef(null);

  /* pointer handlers */
  const down = (e) => (startX.current = e.clientX || e.touches?.[0]?.clientX);

  const up = (e) => {
    if (startX.current == null) return;

    const endX = e.clientX || e.changedTouches?.[0]?.clientX;
    const dx = endX - startX.current;
    const TH = 50;

    if (dx > TH) prev(); // swipe → right
    if (dx < -TH) next(); // swipe → left

    startX.current = null;
  };

  const far = Math.floor(homeData.length / 2);

  return (
    <Box
      component="section"
      onPointerDown={down}
      onPointerUp={up}
      onTouchStart={down}
      onTouchEnd={up}
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: "50vh", md: "45vh" },
      }}
    >
      {homeData.map((item, i) => {
        const off = offset(i, active, total);
        const xvw = off * STEP;
        const isActive = i === active;

        const opa = isActive ? 1 : Math.abs(off) === far ? 0 : 0.9;

        return (
          <Box
            key={i}
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transform: `translateX(${xvw}vw)`,
              opacity: opa,
              transition: "transform .7s ease, opacity .5s ease",
            }}
          >
            <CenterDiv
              isActive={isActive}
              data={item}
              duration={item.duration ? item.duration : 10}
              progress={progress}
              onTogglePlay={onTogglePlay}
            />
          </Box>
        );
      })}
    </Box>
  );
}
