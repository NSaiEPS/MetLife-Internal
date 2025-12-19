import DownloadIcon from "@mui/icons-material/Download";
import {
  Box,
  Button,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { VideoData } from "../../utils/types";
import { downloadVideoWithUrl } from "../../redux/features/audioAnimationSlice";
import { useDispatch } from "react-redux";

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

interface BottomProps {
  videosData: VideoData[];
  animationData: ModalState[];
  setAnimationData: (data: ModalState[]) => void;
  handleAllSubmit: () => void;
  active: number;
  progress: number;
  onSelect: (index: number) => void;
  videoHasError?: boolean;
}

interface ModalState {
  scene_number: number;
  scene_id: string;
  ost: string;
  start_transition: string;
  end_transition: string;
}

export default function Bottom({
  videosData,
  animationData,
  setAnimationData,
  handleAllSubmit,
  active,
  progress,
  onSelect,
  videoHasError = false,
}: BottomProps) {
  const dispatch = useDispatch();
  // const [sceneData, setSceneData] = useState<VideoData[]>(videosData);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [modalState, setModalState] = useState<ModalState>({
    scene_number: 0,
    scene_id: "",
    start_transition: "",
    end_transition: "",
    ost: "",
  });

  const downloadVideo = (s3_url: string, name: string) => {
    // const link = document.createElement("a");
    // link.href = s3_url;
    // link.setAttribute("download", ${name});
    // link.setAttribute("target", "_blank");
    // document.body.appendChild(link);
    // link.click();
    // link.remove();
    dispatch(downloadVideoWithUrl(s3_url, name));
  };

  const buttonClickHandler = (i: number) => {
    const elem = videosData?.[i];
    if (!elem) return;

    setModalIndex(i);
    setModalState({
      scene_number: elem.scene_number,
      scene_id: elem.scene_id,
      start_transition: elem.start_transition,
      end_transition: elem.end_transition,
      ost: elem.ost,
    });
  };

  // const handleFinalSubmit = () => {
  //   const missingIndexes = videosData
  //     .map((v, i) => (!v.applied_animation ? i + 1 : null))
  //     .filter(Boolean);

  //   if (missingIndexes.length > 0) {
  //     toast.error(
  //       `Index-${missingIndexes.join(
  //         ","
  //       )} videosData are not having any animation applied`
  //     );
  //     return;
  //   }

  //   // ✅ ALL GOOD → FINAL API
  //   const payload = videosData.map((v) => ({
  //     scene_id: v.scene_id,
  //     entry: v.applied_animation?.entry,
  //     exit: v.applied_animation?.exit,
  //   }));

  //   console.log("FINAL SUBMIT PAYLOAD", payload);
  //   // await api.finalSubmit(payload);

  //   toast.success("All animations submitted successfully");
  // };

  // console.log(videosData);

  const handleModalSubmit = async () => {
    if (modalIndex === null) return;

    try {
      setAnimationData((prev: ModalState[]) => [...prev, modalState]);
      setModalIndex(null);
    } catch (err) {
      console.error("Animation apply failed", err);
    }
  };

  // const handleModalSubmit = async () => {
  //   if (modalIndex === null) return;
  //   const row = videosData?.[modalIndex];

  //   const payload = {
  //     scene_id: row.scene_id,
  //     entry_animation: entryAnimation,
  //     exit_animation: exitAnimation,
  //   };

  //   try {
  //     console.log("API Payload", payload);

  //     // // ✅ Modal close
  //     setModalIndex(null);
  //   } catch (err) {
  //     console.error("Animation apply failed", err);
  //   }
  // };

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
        {videosData?.map((row, i) => {
          const isActive = i === active;

          return (
            <Box
              key={i}
              onClick={() => !isActive && onSelect(i)}
              ref={(el: HTMLDivElement | null) => {
                itemRefs.current[i] = el;
              }}
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
                    e.stopPropagation();
                    if (row?.final_video?.url) {
                      downloadVideo(
                        row.final_video.url,
                        `${row?.ost || "video"}.mp4`
                      );
                    }
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

                {videosData?.length > 1 && (
                  <Button
                    sx={{
                      position: "absolute",
                      top: 4,
                      left: 4,
                      minWidth: "auto",
                      p: "1px 8px",
                      color: "#fff",
                      backgroundColor: "#38a4ecff",
                      fontSize: "12px",
                      fontWeight: "bold",
                      cursor: "auto",
                    }}
                  >
                    {row?.scene_number}
                  </Button>
                )}
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
                      {row?.ost}
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
              {isActive && videosData?.length > 1 && (
                <Button onClick={() => buttonClickHandler(i)}>
                  Add Animation
                </Button>
              )}
              {/* 
              {row.start_transition !== "none" && (
                <Typography fontSize={10} color="green">
                  Animation Applied
                </Typography>
              )} */}
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
                    {modalState?.ost}
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
                      value={modalState?.start_transition}
                      onChange={(e) =>
                        setModalState({
                          ...modalState,
                          start_transition: e.target.value,
                        })
                      }
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
                      value={modalState?.end_transition}
                      onChange={(e) =>
                        setModalState({
                          ...modalState,
                          end_transition: e.target.value,
                        })
                      }
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

      {videosData?.length > 1 && (
        <Button
          variant="contained"
          color="primary"
          sx={{ textTransform: "none" }}
          onClick={handleAllSubmit}
        >
          Submit Animation Changes
        </Button>
      )}
    </Box>
  );
}
