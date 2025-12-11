import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Box } from "@mui/material";
import HeroSection from "./HeroSection";
import Bottom from "./Bottom";
import Cursor from "./Cursor";

const TICK = 100;

const normalizeDuration = (duration) => {
  if (!duration) return 10_000;
  return duration * 1000;
};

const VideoTimeline = ({ videos }) => {
  const [playing, setPlaying] = useState(true);

  const timer = useRef(null);
  const timerEnd = useRef(null);

  const [active, setActive] = useState(0);
  const [progress, setProg] = useState(0);

  const heroRef = useRef(null);

  const rawDuration = videos?.[active]?.duration;
  const slideTime = normalizeDuration(rawDuration);
  const total = videos?.length;

  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorInHero, setCursorInHero] = useState(false);

  console.log(playing);

  const moveCursor = useCallback((e) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;

    if (clientX == null) return;

    setCursorPos({
      x: clientX - rect.left,
      y: clientY - rect.top,
    });
  }, []);

  /* helpers */
  const goto = useCallback(
    (idx) => {
      setProg(0);
      setActive((idx + total) % total);
    },
    [total]
  );

  const next = useCallback(() => goto(active + 1), [goto, active]);
  const prev = useCallback(() => goto(active - 1), [goto, active]);

  /* timeline play/pause logic */
  useEffect(() => {
    if (!slideTime || slideTime <= 0) {
      setProg(0);
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
  }, [active, next, slideTime, playing]);

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        width: "100%",
        color: "white",
        backgroundColor: "#1f3039",
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Box
        ref={heroRef}
        onMouseEnter={() => setCursorInHero(true)}
        onMouseLeave={() => setCursorInHero(false)}
        onMouseMove={moveCursor}
        onTouchStart={(e) => {
          setCursorInHero(true);
          moveCursor(e);
        }}
        onTouchMove={moveCursor}
        onTouchEnd={() => setCursorInHero(false)}
        sx={{
          position: "relative",
          width: "90%",
          height: "fit-content",
          mt: "10vh",
        }}
      >
        <HeroSection
          homeData={videos}
          progress={progress}
          active={active}
          next={next}
          prev={prev}
          onTogglePlay={setPlaying}
        />

        <Cursor pos={cursorPos} isActive={cursorInHero} />
      </Box>

      <Bottom
        active={active}
        homeData={videos}
        progress={progress}
        onSelect={goto}
      />
    </Box>
  );
};

export default VideoTimeline;
