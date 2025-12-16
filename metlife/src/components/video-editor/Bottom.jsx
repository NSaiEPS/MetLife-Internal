import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { motion } from "framer-motion";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  color: "#ffffff",
  bgcolor: "#000000",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export default function Bottom({
  homeData,
  active,
  progress,
  onSelect,
  videoHasError = false,
}) {
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const [modalIndex, setModalIndex] = useState(null);
  const [modalOST, setModalOST] = useState("");
  const [entryAnimation, setEntryAnimation] = useState("fade_in");
  const [exitAnimation, setExitAnimation] = useState("fade_out");

  const buttonClickHandler = (i) => {
    const elem = homeData[i];
    setModalIndex(i);
    setModalOST(elem?.ost);
    setEntryAnimation(elem?.applied_animation?.entry || "fade_in");
    setExitAnimation(elem?.applied_animation?.exit || "fade_out");
  };

  const handleModalSubmit = async () => {
    const row = homeData[modalIndex];

    const payload = {
      scene_id: row.scene_id,
      entry_animation: entryAnimation,
      exit_animation: exitAnimation,
    };

    try {
      console.log("API Payload", payload);

      // 🔗 API CALL
      // await fetch("/api/scene/apply-animation", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(payload),
      // });

      // // ✅ Modal close
      setModalIndex(null);
    } catch (err) {
      console.error("Animation apply failed", err);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    const activeItem = itemRefs.current[active];

    if (!container || !activeItem) return;

    const containerRect = container.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();

    const containerCenter = containerRect.width / 2;
    const itemCenter = itemRect.left - containerRect.left + itemRect.width / 2;

    const scrollLeft = container.scrollLeft + (itemCenter - containerCenter);

    container.scrollTo({
      left: scrollLeft,
      behavior: "smooth",
    });
  }, [active]);

  const downloadVideo = (s3_url, name) => {
    const link = document.createElement("a");
    link.href = s3_url;
    link.setAttribute("download", `${name}`);
    link.setAttribute("target", "_blank");

    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        borderTop: "1px solid rgba(255,255,255,0.2)",
      }}
    >
      {/* Error Message */}
      {videoHasError && (
        <Box sx={{ mb: 1, px: 2, textAlign: "center" }}>
          <Typography sx={{ color: "red", fontSize: "14px" }}>
            ⚠️ Video failed to load. Click to retry.
          </Typography>
        </Box>
      )}

      <Box
        ref={containerRef}
        sx={{
          padding: "2vw 4vw",
          display: "flex",
          gap: "5vw",
          width: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": { display: "none" },
          // overscrollBehavior: "contain", // ⬅️ prevents parent scroll chaining
        }}
      >
        {homeData.map((row, i) => {
          const isActive = i === active;

          return (
            <Box
              key={i}
              onClick={() => !isActive && onSelect(i)}
              ref={(el) => (itemRefs.current[i] = el)}
              sx={{
                position: "relative",
                flex: "0 0 auto",
                display: "flex",
                width: "20vw",
                gap: 1,
                flexDirection: "column",
                justifyContent: "start",
                cursor: isActive ? "default" : "pointer",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  position: "relative",
                  overflow: "hidden",
                  opacity: isActive ? 1 : 0.6,
                }}
              >
                <Box
                  component="img"
                  src={row.image_urls[0]}
                  alt=""
                  sx={{
                    height: "17vh",
                    width: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    transition: "opacity 0.3s ease",
                    display: "block",
                  }}
                />

                <Button
                  onClick={(e) => {
                    e.stopPropagation(); // 🔥 parent click se bachao
                    downloadVideo(row?.final_video?.url, `${row?.ost}.mp4`);
                  }}
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    minWidth: "auto",
                    p: "2px",
                    backgroundColor: "rgba(0,0,0,0.4)",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.6)",
                    },
                  }}
                >
                  <DownloadIcon sx={{ color: "#fff", fontSize: 18 }} />
                </Button>
              </Box>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  userSelect: "none",
                  borderTop: "1px solid rgba(255,255,255,0.2)",
                  background: isActive
                    ? "linear-gradient(to bottom, #284f68d5, transparent)"
                    : "transparent",
                }}
              >
                {/* Bar */}
                <Box
                  sx={{
                    width: "100%",
                    height: "8px",
                    display: "flex",
                    position: "relative",
                    background: isActive
                      ? videoHasError
                        ? "rgba(255,0,0,0.5)"
                        : "#fff"
                      : "linear-gradient(to right, #203D4F, #4A8BB5)",
                  }}
                >
                  <img
                    src="/imgs/strip.png"
                    style={{ height: "100%" }}
                    alt=""
                  />
                </Box>

                {/* Label */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    my: "4px",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        transform: "rotate(45deg)",
                        background: isActive
                          ? videoHasError
                            ? "red"
                            : "#FE4A09"
                          : "#C7DCFF",
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: isActive
                          ? videoHasError
                            ? "red"
                            : "#FE4A09"
                          : "#fff",
                      }}
                    >
                      {row.ost}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      transform: "rotate(45deg)",
                      background: isActive
                        ? videoHasError
                          ? "red"
                          : "#FE4A09"
                        : "#C7DCFF",
                    }}
                  />
                </Box>

                {/* Error Icon */}
                {isActive && videoHasError && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "-24px",
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  >
                    <svg width="20" height="20" fill="red" viewBox="0 0 24 24">
                      <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </Box>
                )}
              </Box>
              {/* Timer */}
              {isActive && !videoHasError && (
                <motion.img
                  src="/imgs/timer.png"
                  initial={{ left: 0 }}
                  animate={{ left: `${progress}%` }}
                  transition={{ ease: "linear", duration: 0.1 }}
                  style={{
                    position: "absolute",
                    top: "-18px",
                    width: 21,
                    transform: "translateX(-50%)",
                  }}
                />
              )}
              {isActive && (
                <Button onClick={() => buttonClickHandler(i)}>
                  Add Animation
                </Button>
              )}
            </Box>
          );
        })}

        {modalIndex !== null && (
          <Modal open onClose={() => setModalIndex(null)}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 700,
                bgcolor: "#f5fbff",
                borderRadius: 3,
                boxShadow: 24,
                p: 3,
              }}
            >
              {/* Title */}
              <Typography variant="h5" fontWeight={600} mb={2}>
                Animation Toolkit
              </Typography>

              {/* Card */}
              <Box
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  p: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography fontWeight={600} mb={2}>
                    OST :
                  </Typography>
                  <Typography fontWeight={600} mb={2}>
                    {modalOST}
                  </Typography>
                </Box>

                <Box display="flex" gap={3}>
                  {/* Entry */}
                  <Box
                    sx={{
                      flex: 1,
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    <Typography fontWeight={500} mb={1}>
                      Entry
                    </Typography>

                    <RadioGroup
                      value={entryAnimation}
                      onChange={(e) => setEntryAnimation(e.target.value)}
                    >
                      <FormControlLabel
                        value="none"
                        control={<Radio />}
                        label="none"
                      />
                      <FormControlLabel
                        value="fade_in"
                        control={<Radio />}
                        label="fade_in"
                      />
                      <FormControlLabel
                        value="zoom_in"
                        control={<Radio />}
                        label="zoom_in"
                      />
                      <FormControlLabel
                        value="pan_in"
                        control={<Radio />}
                        label="pan_in"
                      />
                    </RadioGroup>
                  </Box>

                  {/* Exit */}
                  <Box
                    sx={{
                      flex: 1,
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    <Typography fontWeight={500} mb={1}>
                      Exit
                    </Typography>

                    <RadioGroup
                      value={exitAnimation}
                      onChange={(e) => setExitAnimation(e.target.value)}
                    >
                      <FormControlLabel
                        value="none"
                        control={<Radio />}
                        label="none"
                      />
                      <FormControlLabel
                        value="fade_out"
                        control={<Radio />}
                        label="fade_out"
                      />
                      <FormControlLabel
                        value="zoom_out"
                        control={<Radio />}
                        label="zoom_out"
                      />
                      <FormControlLabel
                        value="pan_out"
                        control={<Radio />}
                        label="pan_out"
                      />
                    </RadioGroup>
                  </Box>
                </Box>

                {/* Actions */}
                <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                  <Button onClick={() => setModalIndex(null)}>Cancel</Button>
                  <Button onClick={handleModalSubmit} variant="contained">
                    Apply
                  </Button>
                </Box>
              </Box>
            </Box>
          </Modal>
        )}
      </Box>
    </Box>
  );
}
