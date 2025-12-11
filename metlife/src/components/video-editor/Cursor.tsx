import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import gsap from "gsap";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

interface CursorProps {
  pos: { x: number; y: number };
  isActive: boolean;
}

const Cursor: React.FC<CursorProps> = ({ pos, isActive }) => {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const scaleTween = useRef<gsap.core.Tween | null>(null);
  const setLeft = useRef<((v: number) => void) | null>(null);
  const setTop = useRef<((v: number) => void) | null>(null);

  /* mount: quickSetter + initial style */
  useEffect(() => {
    if (!dotRef.current) return;

    setLeft.current = gsap.quickSetter(dotRef.current, "left", "px");
    setTop.current = gsap.quickSetter(dotRef.current, "top", "px");

    gsap.set(dotRef.current, {
      xPercent: -50,
      yPercent: -50,
      scale: 0,
    });
  }, []);

  /* follow pointer */
  useEffect(() => {
    if (setLeft.current && setTop.current) {
      setLeft.current(pos.x);
      setTop.current(pos.y);
    }
  }, [pos]);

  /* scale in/out animation */
  useEffect(() => {
    if (!dotRef.current) return;
    scaleTween.current?.kill();

    scaleTween.current = gsap.to(dotRef.current, {
      scale: isActive ? 1 : 0,
      duration: 0.25,
      ease: "power3.out",
    });
  }, [isActive]);

  return (
    <Box
      ref={dotRef}
      sx={{
        position: "absolute",
        pointerEvents: "none",
        zIndex: 40,
        display: { xs: "none", md: "flex" },
        height: "15vh",
        width: "15vh",
        borderRadius: "50%",
        border: "2px solid rgba(255,255,255,0.2)",
        backdropFilter: "blur(4px)",
        backgroundColor: "rgba(255,255,255,0.1)",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* center logo */}
      <Box
        component="img"
        src="/imgs/cursor-logo.png"
        sx={{ height: "40px", objectFit: "cover" }}
      />

      {/* left arrow */}
      <RiArrowLeftSLine
        style={{
          position: "absolute",
          top: "50%",
          left: "-24px",
          transform: "translateY(-50%)",
          fontSize: "22px",
          color: "rgba(255,255,255,0.8)",
        }}
      />

      {/* right arrow */}
      <RiArrowRightSLine
        style={{
          position: "absolute",
          top: "50%",
          right: "-24px",
          transform: "translateY(-50%)",
          fontSize: "22px",
          color: "rgba(255,255,255,0.8)",
        }}
      />
    </Box>
  );
};

export default Cursor;
