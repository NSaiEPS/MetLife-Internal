import React, { useRef } from "react";
import { Box, Button } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CenterDiv from "./CenterDiv";
import type { VideoData } from "../../utils/types";

/* helper: shortest circular offset */
const offset = (i: number, active: number, total: number) => {
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

interface HeroSectionProps {
  homeData: VideoData[];
  active: number;
  progress: number;
  next: () => void;
  prev: () => void;
  onTogglePlay: (val: boolean) => void;
  isGloballyPlaying: boolean;
  onFirstInteraction?: () => void;
  hasUserInteracted: boolean;
  onVideoLoadStatus?: (loaded: boolean, hasError: boolean) => void;
}

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
}: HeroSectionProps) {
  const total = homeData?.length;
  const startX = useRef<number | null>(null);
  const far = Math.floor(total / 2);

  /* pointer handlers */
  const handleDown = (
    e: React.PointerEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    if ("touches" in e) {
      startX.current = e.touches[0].clientX;
    } else {
      startX.current = e.clientX;
    }
  };

  const handleUp = (
    e: React.PointerEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    if (startX.current == null) return;

    let endX: number;
    if ("changedTouches" in e) {
      endX = e.changedTouches[0].clientX;
    } else {
      endX = e.clientX;
    }

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
        width: "80vw",

        // height: "fit-content",
        // background: "red",
        height: "70vh",
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
      <Button
        onClick={() => prev()}
        sx={{
          position: "absolute",
          left: "0",
          top: "50%",
          transform: "translate(0,-50%)",
        }}
      >
        <ArrowBackIosNewIcon fontSize="large" />
      </Button>
      <Button
        onClick={() => next()}
        sx={{
          position: "absolute",
          right: "0",
          top: "50%",
          transform: "translate(0,-50%)",
        }}
      >
        <ArrowForwardIosIcon fontSize="large" />
      </Button>
    </Box>
  );
}
