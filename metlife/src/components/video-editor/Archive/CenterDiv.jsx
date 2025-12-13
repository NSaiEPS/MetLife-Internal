import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  SvgIcon,
} from "@mui/material";
import { motion, useAnimation } from "framer-motion";

const CenterDiv = ({
  progress,
  isActive,
  data,
  duration,
  onTogglePlay,
  isGloballyPlaying,
  onFirstInteraction,
  hasUserInteracted,
  onVideoLoadStatus,
}) => {
  const videoRef = useRef(null);
  const triAnim = useAnimation();
  const iconAnim = useAnimation();

  // Video loading states
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoLoadError, setVideoLoadError] = useState(false);
  const [videoDuration, setVideoDuration] = useState(duration);

  // Track if this specific video has started
  const hasStartedRef = useRef(false);
  const iconTimeoutRef = useRef(null);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 2;

  const toggleVideoPlay = () => {
    const v = videoRef.current;
    if (!v || !isActive || videoLoadError) return;

    // Don't allow play if video is not loaded
    if (!isVideoLoaded && !isVideoLoading) {
      v.load();
      setIsVideoLoading(true);
      return;
    }

    // Mark first user interaction
    if (!hasUserInteracted && onFirstInteraction) {
      onFirstInteraction();
    }

    // Mark this video as started
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
    }

    // Trigger the icon animation
    iconAnim.start({
      opacity: [0, 1, 0.8, 0],
      scale: [0.8, 1.1, 1],
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    });

    // Hide icon after animation
    clearTimeout(iconTimeoutRef.current);
    iconTimeoutRef.current = setTimeout(() => {
      iconAnim.start({ opacity: 0 });
    }, 1200);

    // Toggle the global state
    onTogglePlay(!isGloballyPlaying);
  };

  const handleRetryLoad = (e) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (v) {
      setVideoLoadError(false);
      setIsVideoLoading(true);
      retryCountRef.current = 0;
      v.load();
    }
  };

  // Reset icon when switching videos
  useEffect(() => {
    if (isActive) {
      iconAnim.set({ opacity: 0 });
      hasStartedRef.current = false;
    } else {
      // Ensure inactive videos are paused
      const v = videoRef.current;
      if (v) {
        v.pause();
      }
    }
    triAnim.start(
      isActive
        ? { opacity: 1, scale: 1, transition: { duration: 0.5 } }
        : { opacity: 0, scale: 0.8, transition: { duration: 0.3 } }
    );
  }, [isActive, data, iconAnim]);

  // Video playback effect - CRITICAL FIX: Only play if active
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // CRITICAL: Always pause if not active
    if (!isActive) {
      v.pause();
      return;
    }

    // Only proceed if this is the active video
    if (!isActive) return;

    // Auto-play logic for subsequent videos after first interaction
    const shouldAutoPlay = hasUserInteracted && !hasStartedRef.current;

    // IMPORTANT: Only attempt playback if video is loaded and no error
    if (
      (isGloballyPlaying || shouldAutoPlay) &&
      isVideoLoaded &&
      !videoLoadError &&
      isActive
    ) {
      if (shouldAutoPlay && !isGloballyPlaying) {
        onTogglePlay(true);
        hasStartedRef.current = true;
        return;
      }

      // Set current time based on progress
      if (progress === 0) {
        v.currentTime = 0;
      }

      const playPromise = v.play();

      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Video playback failed:", err);
          hasStartedRef.current = false;
          if (isActive) {
            onTogglePlay(false);
          }
        });
      }
    } else {
      // Pause if not playing OR if video has error OR if video not loaded
      v.pause();
    }
  }, [
    isActive,
    isGloballyPlaying,
    isVideoLoaded,
    videoLoadError,
    hasUserInteracted,
    onTogglePlay,
    progress,
  ]);

  // Report video loading status to parent - ONLY if active
  useEffect(() => {
    if (isActive && onVideoLoadStatus) {
      onVideoLoadStatus(isVideoLoaded, videoLoadError);
    }
  }, [isActive, isVideoLoaded, videoLoadError, onVideoLoadStatus]);

  // Handle video loading events
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const handleLoadedMetadata = () => {
      const actualDuration = v.duration || duration;
      setVideoDuration(actualDuration);
      setIsVideoLoaded(true);
      setIsVideoLoading(false);
      setVideoLoadError(false);
      retryCountRef.current = 0;
    };

    const handleCanPlay = () => {
      setIsVideoLoaded(true);
      setIsVideoLoading(false);
    };

    const handleLoadStart = () => {
      setIsVideoLoading(true);
      setVideoLoadError(false);
    };

    const handleError = (e) => {
      console.error("Video error:", e);

      if (retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current += 1;
        console.log(
          `Retrying video load (${retryCountRef.current}/${MAX_RETRIES})...`
        );

        setTimeout(() => {
          if (v && !isVideoLoaded) {
            v.load();
          }
        }, 1000);
      } else {
        setVideoLoadError(true);
        setIsVideoLoading(false);
        setIsVideoLoaded(false);

        // Ensure video is paused
        v.pause();
      }
    };

    const handleWaiting = () => {
      setIsVideoLoading(true);
    };

    const handlePlaying = () => {
      setIsVideoLoading(false);
    };

    v.addEventListener("loadedmetadata", handleLoadedMetadata);
    v.addEventListener("canplay", handleCanPlay);
    v.addEventListener("loadstart", handleLoadStart);
    v.addEventListener("error", handleError);
    v.addEventListener("waiting", handleWaiting);
    v.addEventListener("playing", handlePlaying);

    // Initial check
    if (v.readyState >= 1) {
      handleLoadedMetadata();
    }

    return () => {
      v.removeEventListener("loadedmetadata", handleLoadedMetadata);
      v.removeEventListener("canplay", handleCanPlay);
      v.removeEventListener("loadstart", handleLoadStart);
      v.removeEventListener("error", handleError);
      v.removeEventListener("waiting", handleWaiting);
      v.removeEventListener("playing", handlePlaying);
    };
  }, [duration]);

  return (
    <Box sx={{ width: "80%", height: "100%", position: "relative" }}>
      {/* VIDEO BOX */}
      <Box
        onClick={toggleVideoPlay}
        sx={{
          position: "relative",
          width: "100%",
          height: "fit-content",
          border: "2px solid rgba(255,255,255,0.2)",
          backgroundColor: "#1f3039",
          cursor: "pointer",
        }}
      >
        <video
          ref={videoRef}
          src={data.final_video.url}
          preload="metadata"
          playsInline
          style={{
            width: "100%",
            // height: "100%",
            objectFit: "cover",
            opacity: 0.75,
            transition: "opacity 0.3s",
          }}
        />

        {isActive && (
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={iconAnim}
          >
            <Box
              sx={{
                position: "relative",
                width: 80,
                height: 80,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Outer pulse animation circle */}
              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                }}
                initial={{ scale: 0.8, opacity: 0.3 }}
                animate={iconAnim}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />

              {/* Dark blur circle */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.6)",
                  borderRadius: "50%",
                  backdropFilter: "blur(4px)",
                }}
              />

              {/* Play / Pause Icon */}
              <Box sx={{ position: "relative", zIndex: 10 }}>
                {isGloballyPlaying ? (
                  <SvgIcon
                    sx={{ width: 28, height: 28, color: "white" }}
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </SvgIcon>
                ) : (
                  <SvgIcon
                    sx={{
                      width: 28,
                      height: 28,
                      color: "white",
                    }}
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </SvgIcon>
                )}
              </Box>
            </Box>
          </motion.div>
        )}

        {/* Loading Overlay */}
        {isActive && isVideoLoading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <CircularProgress size={40} sx={{ color: "#61B2E9", mb: 1 }} />
            <Typography sx={{ color: "#61B2E9", fontSize: "14px" }}>
              Loading video...
            </Typography>
          </Box>
        )}

        {/* Error Overlay */}
        {isActive && videoLoadError && (
          <Box
            onClick={handleRetryLoad}
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              cursor: "pointer",
            }}
          >
            <Typography sx={{ color: "red", mb: 1 }}>
              Failed to load video
            </Typography>
            <Button variant="contained" sx={{ bgcolor: "#61B2E9" }}>
              Retry
            </Button>
          </Box>
        )}

        {/* Top Time Display */}
        <Box sx={{ position: "absolute", top: 0, left: 0, p: 2 }}>
          <Typography sx={{ color: "#61B2E9" }}>
            {isActive
              ? String(Math.floor((progress / 100) * videoDuration)).padStart(
                  2,
                  "0"
                )
              : "00"}
            /{String(videoDuration).padStart(2, "0")}
          </Typography>
        </Box>
      </Box>

      {/* TRIANGLE IMAGES */}
      <motion.img
        src="/imgs/triangle-left-top.png"
        style={{
          position: "absolute",
          top: "-24px",
          left: "-24px",
          width: "60%",
          zIndex: -1,
        }}
        animate={triAnim}
      />

      <motion.img
        src="/imgs/triangle-right-bottom.png"
        style={{
          position: "absolute",
          bottom: "-24px",
          right: "-24px",
          width: "60%",
          zIndex: -1,
        }}
        animate={triAnim}
      />
    </Box>
  );
};

export default CenterDiv;
