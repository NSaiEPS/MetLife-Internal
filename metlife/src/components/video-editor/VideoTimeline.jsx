import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import HeroSection from "./HeroSection";
import Bottom from "./Bottom";

const TICK = 100;

const normalizeDuration = (duration) => {
  if (!duration) return 10_000;
  return duration * 1000;
};

const VideoTimeline = ({ videos }) => {
  const [playing, setPlaying] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const [activeVideoLoaded, setActiveVideoLoaded] = useState(false);
  const [activeVideoHasError, setActiveVideoHasError] = useState(false);

  const timer = useRef(null);
  const timerEnd = useRef(null);

  const [active, setActive] = useState(0);
  const [progress, setProg] = useState(0);

  const heroRef = useRef(null);

  const rawDuration = videos?.[active]?.duration;
  const slideTime = normalizeDuration(rawDuration);

  const total = videos?.length;

  const goto = useCallback(
    (idx) => {
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

  const next = useCallback(() => goto(active + 1), [goto, active]);
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
      clearInterval(timer.current);
      clearTimeout(timerEnd.current);
      return;
    }

    if (!playing) {
      clearInterval(timer.current);
      clearTimeout(timerEnd.current);
      return;
    }

    const start = Date.now() - (progress / 100) * slideTime;

    clearInterval(timer.current);
    clearTimeout(timerEnd.current);

    timer.current = setInterval(() => {
      const pct = ((Date.now() - start) / slideTime) * 100;
      setProg(pct > 100 ? 100 : pct);
    }, TICK);

    const remaining = Math.max(0, slideTime * (1 - progress / 100));

    timerEnd.current = setTimeout(() => {
      setProg(100);
      next();
    }, remaining);

    return () => {
      clearInterval(timer.current);
      clearTimeout(timerEnd.current);
    };
  }, [
    active,
    next,
    slideTime,
    playing,
    progress,
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
  const handleVideoLoadStatus = useCallback((loaded, hasError) => {
    setActiveVideoLoaded(loaded);
    setActiveVideoHasError(hasError);

    if (hasError) {
      setPlaying(false);
    }
  }, []);

  return (
    <Box
      sx={{
        height: "100%",
        // height: "fit-content",
        width: "100%",
        paddingTop: 8,
        backgroundColor: "#1f3039",
        color: "white",

        // alignItems: "center",
        // justifyContent: { xs: "center" },
        overflow: "hidden",
        gap: 2,
      }}
    >
      {/* LEFT SECTION */}
      {/* <Box
        ref={heroRef}
        sx={{
          position: "relative",
          // height: "fit-content",
          height: "100%",
          mt: "10vh",
        }}
      >
        <Bottom
          active={active}
          homeData={videos}
          progress={progress}
          onSelect={goto}
          videoHasError={activeVideoHasError}
        />
      </Box> */}
      <HeroSection
        homeData={videos}
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
      <Bottom
        active={active}
        homeData={videos}
        progress={progress}
        onSelect={goto}
        videoHasError={activeVideoHasError}
      />
      {/* BOTTOM BAR */}
    </Box>
  );
};

export default VideoTimeline;
