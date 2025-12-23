import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import HeroSection from "./HeroSection";
import Bottom from "./Bottom";
import type { VideoData } from "../../utils/types";

const TICK = 100;

const normalizeDuration = (duration?: number) => {
  if (!duration) return 6000;
  return duration * 1000;
};

interface AnimationData {
  scene_number: number;
  scene_id: string;
  start_transition: string;
  end_transition: string;
  ost: string;
}

interface VideoTimelineProps {
  type?: string;
  videosData: VideoData[];
  isFinalVideo: boolean;
  animationData: AnimationData[];
  setAnimationData: (data: AnimationData[]) => void;
  handleAllSubmit: () => void;
}

const VideoTimeline: React.FC<VideoTimelineProps> = ({
  type,
  videosData,
  isFinalVideo,
  animationData,
  setAnimationData,
  handleAllSubmit,
}) => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false);

  // console.log(videosData);

  const [activeVideoLoaded, setActiveVideoLoaded] = useState<boolean>(false);
  const [activeVideoHasError, setActiveVideoHasError] =
    useState<boolean>(false);

  const timer = useRef<number | null>(null);
  const timerEnd = useRef<number | null>(null);

  const [active, setActive] = useState<number>(0);
  const [progress, setProg] = useState<number>(0);

  const heroRef = useRef<HTMLDivElement | null>(null);

  const rawDuration = videosData?.[active]?.duration;
  const slideTime = normalizeDuration(rawDuration);

  const total = videosData?.length;

  const goto = useCallback(
    (idx: number) => {
      const newIdx = (idx + total) % total;

      if (newIdx !== active) {
        setProg(0);
        setActive(newIdx);

        setActiveVideoLoaded(false);
        setActiveVideoHasError(false);

        setPlaying(false);
      }
    },
    [total, active]
  );

  const next = useCallback(() => {
    // 🔥 SINGLE VIDEO CASE
    if (total === 1) {
      // Reset progress & restart
      setProg(0);
      setPlaying(false);

      // Small delay so CenterDiv can reset video.currentTime
      setTimeout(() => {
        setPlaying(true);
      }, 50);

      return;
    }

    goto(active + 1);
  }, [goto, active, total]);

  const prev = useCallback(() => goto(active - 1), [goto, active]);

  // ------------------ TIMELINE EFFECT ------------------
  useEffect(() => {
    if (
      !slideTime ||
      slideTime <= 0 ||
      !activeVideoLoaded ||
      activeVideoHasError
    ) {
      setProg(0);
      if (timer.current) clearInterval(timer.current);
      if (timerEnd.current) clearTimeout(timerEnd.current);
      return;
    }

    if (!playing) {
      if (timer.current) clearInterval(timer.current);
      if (timerEnd.current) clearTimeout(timerEnd.current);
      return;
    }

    const start = Date.now() - (progress / 100) * slideTime;

    if (timer.current) clearInterval(timer.current);
    if (timerEnd.current) clearTimeout(timerEnd.current);

    timer.current = window.setInterval(() => {
      const pct = ((Date.now() - start) / slideTime) * 100;
      setProg(pct > 100 ? 100 : pct);
    }, TICK);

    const remaining = Math.max(0, slideTime * (1 - progress / 100));

    timerEnd.current = window.setTimeout(() => {
      setProg(100);
      next();
    }, remaining);

    return () => {
      if (timer.current) clearInterval(timer.current);
      if (timerEnd.current) clearTimeout(timerEnd.current);
    };
  }, [
    active,
    next,
    slideTime,
    playing,
    // progress,
    activeVideoLoaded,
    activeVideoHasError,
  ]);

  // ------------------ AUTO-PLAY ON VIDEO CHANGE ------------------
  useEffect(() => {
    if (
      hasUserInteracted &&
      !playing &&
      activeVideoLoaded &&
      !activeVideoHasError
    ) {
      setPlaying(true);
    } else if (activeVideoHasError) {
      setPlaying(false);
    }
  }, [active, hasUserInteracted, activeVideoLoaded, activeVideoHasError]);

  // ------------------ VIDEO LOAD STATUS HANDLER ------------------
  const handleVideoLoadStatus = useCallback(
    (loaded: boolean, hasError: boolean) => {
      setActiveVideoLoaded(loaded);
      setActiveVideoHasError(hasError);

      if (hasError) {
        setPlaying(false);
      }
    },
    []
  );

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        backgroundColor: "#1f3039",
        color: "white",
        display: "flex",
        gap: "2vh",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: { xs: "center" },
        overflow: "hidden",
      }}
    >
      {/* TOP SECTION */}
      <Box
        ref={heroRef}
        sx={{
          position: "relative",
          height: "fit-content",
          // mt: "10vh",
        }}
      >
        <HeroSection
          videosData={videosData}
          progress={progress}
          active={active}
          next={next}
          prev={prev}
          onTogglePlay={setPlaying}
          isGloballyPlaying={playing}
          onFirstInteraction={() => setHasUserInteracted(true)}
          hasUserInteracted={hasUserInteracted}
          onVideoLoadStatus={handleVideoLoadStatus}
        />
      </Box>

      {/* BOTTOM BAR */}
      <Bottom
        active={active}
        type={type}
        isFinalVideo={isFinalVideo}
        videosData={videosData}
        animationData={animationData}
        setAnimationData={setAnimationData}
        handleAllSubmit={handleAllSubmit}
        progress={progress}
        onSelect={goto}
        videoHasError={activeVideoHasError}
      />
    </Box>
  );
};

export default VideoTimeline;
