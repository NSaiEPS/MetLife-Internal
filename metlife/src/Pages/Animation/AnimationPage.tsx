import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Menu,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Switch,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ButtonComp from "../../components/common/Buton/Button";
import { useNavigate, useParams } from "react-router";
import FullVideoPlayer from "../../components/common/GeneratedVideo/FullVideoPlayer";
import FullScreenGradientLoader from "../../components/common/GradientLoader";
import Footer from "../../components/common/mainFooter";
import { NoDataMessage } from "../../components/common/NoDataMessage";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import Timer from "../../components/common/Timer/Timer";
// import VideoTimeline from "../../components/video-editor/VideoTimeline";
import {
  getMediaTransitions,
  getSceneDetails,
  getVideosList,
  postGenerateFullVideo,
  postGenerateVideoBatch,
} from "../../redux/features/audioAnimationSlice";
import styles from "./animation.module.css";
import { convertToISTParts } from "../../utils";
import VideoTimeline from "../../components/video-editor/VideoTimeline";
import type { VideoData } from "../../utils/types";
import MissingAnimationPopup from "../../components/common/popup/MissingAnimationPopup";
import { toast } from "react-toastify";
import { postTranslatedDataSave } from "../../redux/features/saveSlice";
import { navigateTo } from "../../utils/navigate";
import { IoArrowBackCircleOutline } from "react-icons/io5";
/* ---------- TYPES ---------- */
interface SceneItem {
  scene_id: string;
  alternative_scene_id?: string;
}

interface SceneData {
  video_exists?: boolean;
  scenes?: SceneItem[];
}

interface AnimationLabels {
  entry_transitions?: string[];
  exit_transitions?: string[];
}

interface VideoItem {
  image_urls: string[];
  final_video?: { url: string };
  ost?: string;
}

interface AnimationData {
  scene_number: number;
  scene_id: string;
  start_transition: string;
  end_transition: string;
  ost: string;
}

interface RootState {
  AudioAnimation: {
    audioAnimationLoader: boolean;
    videoAnimationLoader: boolean;
    mediaAPILoader: boolean;
    animationLabels: AnimationLabels;
    videoAnimationData: VideoItem[];
    generatedVideoData?: { final_video: { url: string } };
    sceneData: SceneData;
  };
}

/* ---------- COMPONENT ---------- */

const AnimationPage: React.FC = () => {
  const [entryAnimation, setEntryAnimation] = useState<string>("none");
  const [exitAnimation, setExitAnimation] = useState<string>("none");
  const [timerDone, setTimerDone] = useState<boolean>(false);
  const [animationData, setAnimationData] = useState<AnimationData[]>([]);
  const [openMissingPopup, setOpenMissingPopup] = useState(false);
  const [missingScenes, setMissingScenes] = useState<number[]>([]);
  const {
    audioAnimationLoader,
    videoAnimationLoader,
    mediaAPILoader,
    animationLabels,
    videoAnimationData,
    generatedVideoData,
    // fullVideoGeneration,
    sceneData,
  } = useSelector((store: RootState) => store.AudioAnimation);

  const { saveLoader, saveTranslatedData } = useSelector(
    (store) => store.SaveTranslatedData,
  );

  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [bgMusic, setBgMusic] = useState("on"); // default
  const open = Boolean(anchorEl);

  // console.log(generatedVideoData?.audio_exists, "videoAnimationData");
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<any>();
  const waitingTime = convertToISTParts(
    videoAnimationData?.estimated_completion_at ||
      sceneData?.estimated_completion_at,
  );
  const finalTime = Math.ceil(waitingTime / 60);

  const isWaitingVideoTime = convertToISTParts(
    sceneData?.final_video_estimated_completion_at ||
      generatedVideoData?.estimated_completion_at ||
      videoAnimationData?.estimated_completion_at,
  );
  const finalVideoTime = Math.ceil(isWaitingVideoTime / 60);
  const finalVideoAsTimeline: VideoData[] = generatedVideoData?.final_video
    ? [
        {
          scene_id: "final_video",
          scene_number: 1,
          ost: "Final Video",
          image_urls: ["/imgs/final-thumbnail.png"],
          audio_url: "",
          final_video: generatedVideoData?.final_video,
          duration: generatedVideoData?.duration_seconds ?? 0,
          // duration: generatedVideoData?.estimated_seconds ?? 0,
          start_transition: "none",
          end_transition: "none",
        },
      ]
    : [];

  const showTimeline =
    videoAnimationData?.length > 0 &&
    sceneData?.video_exists === true &&
    generatedVideoData?.final_video === null;

  /* ---------- FETCH DATA ---------- */

  useEffect(() => {
    dispatch(getMediaTransitions());
    if (id) {
      dispatch(getSceneDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (sceneData?.video_exists == true && id) {
      dispatch(getVideosList(id));
    }
  }, [sceneData?.video_exists, dispatch, id]);

  useEffect(() => {
    if (timerDone && id) {
      dispatch(getSceneDetails(id));
    }
  }, [timerDone, dispatch, id]);

  useEffect(() => {
    if (
      ((timerDone && sceneData?.video_exists === true) || isGeneratingVideo) &&
      id
    ) {
      dispatch(getVideosList(id));
    }
  }, [timerDone, sceneData?.video_exists, isGeneratingVideo, dispatch, id]);

  /* ----------To set animationData from videoAnimationData---------- */

  useEffect(() => {
    if (videoAnimationData?.length) {
      setAnimationData((prev) => {
        if (prev.length > 0) return prev;

        return videoAnimationData?.map((scene) => ({
          scene_number: scene.scene_number,
          scene_id: scene.scene_id,
          start_transition: scene.start_transition ?? "none",
          end_transition: scene.end_transition ?? "none",
        }));
      });
    }
  }, [videoAnimationData]);

  /* ---------- HANDLERS ---------- */

  // const handleAllSubmit = () => {
  //   const updated = videoAnimationData?.map((scene) => ({
  //     scene_number: scene.scene_number,
  //     scene_id: scene.scene_id,
  //     start_transition: entryAnimation,
  //     end_transition: exitAnimation,
  //   }));
  //   setAnimationData(updated);
  //   toast.success("Animation applied to all clips");
  // };

  // const handleAlternateSubmit = () => {
  //   setAnimationData((prev) =>
  //     prev.map((scene, index) => {
  //       if (index % 2 === 0) {
  //         return {
  //           ...scene,
  //           start_transition: entryAnimation,
  //           end_transition: exitAnimation,
  //         };
  //       }
  //       return scene;
  //     })
  //   );
  //   toast.success("Animation applied to alternative scenes.");
  // };

  const handleAllSubmit = (entry: string, exit: string) => {
    // console.log({ entry, exit });
    const updated = videoAnimationData?.map((scene) => ({
      scene_number: scene.scene_number,
      scene_id: scene.scene_id,
      start_transition: entry,
      end_transition: exit,
    }));

    setAnimationData(updated);
    toast.success("Animation applied to all clips");
  };

  const handleAlternateSubmit = (entry: string, exit: string) => {
    setAnimationData((prev) =>
      prev.map((scene, index) =>
        index % 2 === 0
          ? {
              ...scene,
              start_transition: entry,
              end_transition: exit,
            }
          : scene,
      ),
    );

    toast.success("Animation applied to alternative scenes.");
  };

  const handleAnimationChanges = () => {
    const missing = animationData
      .filter(
        (scene) =>
          scene.start_transition === "none" && scene.end_transition === "none",
      )
      .map((scene) => scene.scene_number);

    setMissingScenes(missing);
    setOpenMissingPopup(true);
  };

  const handleMissingAnimationConfirm = () => {
    setOpenMissingPopup(false);
    submitAllAnimations();
  };

  const submitAllAnimations = () => {
    const scenes = animationData.map((scene) => ({
      scene_id: scene.scene_id,
      start_transition: scene.start_transition,
      end_transition: scene.end_transition,
    }));
    const data = {
      script_id: generatedVideoData?.script_id,
      scenes,
    };
    dispatch(postGenerateVideoBatch(data));
  };

  // const generateVideo = () => {
  //   if (!id) return;
  //   dispatch(postGenerateFullVideo(id));
  // };

  // const generateVideo = (musicOption) => {
  //   if (!id) return;
  //   console.log(musicOption, "music")
  //     dispatch(postGenerateFullVideo(id, musicOption));
  // };

  const generateVideo = () => {
    if (!id) return;
    dispatch(postGenerateFullVideo(id, bgMusic));
    handleMenuClose();
  };

  const handleSave = () => {
    const { title, ...rest } = sceneData;

    const data = {
      data: {
        ...rest,
        script_id: id,
        title: title,
        page: "video",
      },
      is_save_action: true,
    };
    dispatch(postTranslatedDataSave(data, id));
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // const handleMusicSelect = (value) => {
  //   setBgMusic(value); // store selected value
  //   handleMenuClose();
  //   generateVideo(value); // pass forward
  // };

  return (
    <>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
        {saveLoader && <FullScreenGradientLoader text="loading..." />}
        {(animationLabels?.entry_transitions ||
          animationLabels?.exit_transitions) &&
        (animationLabels?.entry_transitions?.length > 0 ||
          animationLabels?.exit_transitions?.length > 0) ? (
          <>
            {(mediaAPILoader || !generatedVideoData) && (
              <FullScreenGradientLoader text="loading..." />
            )}
            {(audioAnimationLoader || videoAnimationLoader) && (
              <FullScreenGradientLoader text="loading..." />
            )}

            {mediaAPILoader || audioAnimationLoader || videoAnimationLoader ? (
              <FullScreenGradientLoader text="loading..." />
            ) : (
              <>
                <main className={styles.cardWrap}>
                  <Box className={styles.card}>
                    <Box className={styles.headerRow}>
                      {generatedVideoData?.final_video_status ===
                      "completed" ? (
                        <>
                          <Typography variant="h4" className={styles.title}>
                            Final Generated Video
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography variant="h4" className={styles.title}>
                            Animation Toolkit
                          </Typography>
                        </>
                      )}

                      <Button
                        className={styles.icon}
                        onClick={() =>
                          navigate(`/audio-animation-toolkit/${id}`)
                        }
                        disabled={!generatedVideoData?.audio_exists}
                      >
                        <IoArrowBackCircleOutline size={30} /> Back
                      </Button>
                    </Box>

                    <Box className={styles.insideContainer}>
                      {/* Available videos */}
                      {!timerDone &&
                        finalTime > 0 &&
                        !generatedVideoData?.final_video && (
                          <Timer
                            time={finalTime}
                            onComplete={() => setTimerDone(true)}
                          />
                        )}

                      {finalVideoTime > 0 && (
                        <Timer
                          time={finalVideoTime}
                          onComplete={() => setIsGeneratingVideo(true)}
                        />
                      )}

                      {showTimeline && (
                        <Grid container>
                          <Typography
                            sx={{ fontSize: "20px", fontWeight: 500, mb: 2 }}
                          >
                            Video Timeline
                          </Typography>
                          <VideoTimeline
                            videosData={videoAnimationData}
                            isFinalVideo={
                              generatedVideoData?.final_video !== null
                            }
                            animationData={animationData}
                            setAnimationData={setAnimationData}
                            handleAnimationChanges={handleAnimationChanges}
                            handleAllSubmit={handleAllSubmit}
                            finalTime={finalTime}
                            handleAlternateSubmit={handleAlternateSubmit}
                            // handleAnimationChanges={handleAnimationChanges}
                          />
                        </Grid>
                      )}

                      <MissingAnimationPopup
                        open={openMissingPopup}
                        onClose={() => setOpenMissingPopup(false)}
                        onConfirm={handleMissingAnimationConfirm}
                        missingScenes={missingScenes}
                      />

                      {generatedVideoData?.final_video === null && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "end",
                            gap: "1rem",
                            mt: "1rem",
                          }}
                        >
                          <ButtonComp
                            label={"Submit Animation Changes"}
                            sx={{ textTransform: "none" }}
                            action={handleAnimationChanges}
                            disabled={finalTime > 0}
                          />

                          <ButtonComp
                            sx={{ textTransform: "none", width: "200px" }}
                            label={"Generate Final Video"}
                            // action={generateVideo}
                            action={handleMenuOpen}
                            disabled={
                              audioAnimationLoader ||
                              videoAnimationLoader ||
                              !videoAnimationData ||
                              generatedVideoData?.final_video ||
                              finalTime > 0
                            }
                          />

                          {/* <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={() => handleMusicSelect("on")}>
                          Background Music ON
                        </MenuItem>

                        <MenuItem onClick={() => handleMusicSelect("off")}>
                          Background Music OFF
                        </MenuItem>
                      </Menu> */}

                          <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            PaperProps={{ sx: { p: 2, width: 230 } }}
                          >
                            <Box display="flex" flexDirection="column" gap={2}>
                              <Typography variant="primary" fontWeight={600}>
                                Background Music
                              </Typography>

                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={bgMusic}
                                    onChange={(e) =>
                                      setBgMusic(e.target.checked)
                                    }
                                  />
                                }
                                label={bgMusic ? "ON" : "OFF"}
                              />
                              <ButtonComp
                                sx={{ textTransform: "none", width: "200px" }}
                                label={"Generate Final Video"}
                                action={generateVideo}
                                // action={handleMenuOpen}
                                disabled={
                                  audioAnimationLoader ||
                                  videoAnimationLoader ||
                                  !videoAnimationData ||
                                  generatedVideoData?.final_video ||
                                  finalTime > 0
                                }
                              />
                            </Box>
                          </Menu>
                        </Box>
                      )}

                      {/* Full Video */}
                      {generatedVideoData?.final_video !== null &&
                        sceneData?.video_exists === true &&
                        generatedVideoData?.final_video_status ===
                          "completed" && (
                          <>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: "1rem",
                              }}
                            >
                              <Typography
                                variant="h4"
                                sx={{
                                  fontSize: "20px",
                                  fontWeight: 600,
                                  mt: 1,
                                  mb: 2,
                                }}
                              >
                                {generatedVideoData?.title || "Generated Video"}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: "12px",
                                }}
                              >
                                <ButtonComp
                                  variant="outlined"
                                  className={styles.largeOutline}
                                  onClick={() => navigateTo(`/scenes/${id}`)}
                                >
                                  Edit
                                </ButtonComp>

                                <ButtonComp
                                  variant="contained"
                                  onClick={() => handleSave()}
                                  disabled={saveLoader}
                                >
                                  Save
                                </ButtonComp>
                              </Box>
                            </Box>

                            <VideoTimeline
                              type="final-video"
                              videosData={finalVideoAsTimeline}
                              isFinalVideo={
                                generatedVideoData?.final_video !== null
                              }
                              animationData={animationData}
                              setAnimationData={setAnimationData}
                              handleAllSubmit={handleAllSubmit}
                              handleAlternateSubmit={handleAlternateSubmit}
                              finalTime={finalTime}
                              // handleAllSubmitInside={handleAllSubmit}
                              // handleAnimationChanges={handleAnimationChanges}
                            />
                          </>
                        )}
                    </Box>
                  </Box>
                </main>
              </>
            )}
          </>
        ) : (
          <>
            <NoDataMessage filter={false} loading={true} />
          </>
        )}
        <Footer />
      </Box>
    </>
  );
};

export default AnimationPage;

{
  /* {generatedVideoData?.final_video === null && (
                    <>
                      <Typography variant="h5"
                        className={styles.audioSelectionTitle}
                        sx={{
                          fontSize: "22px",
                          // fontWeight: "500",
                          marginBottom: "10px",
                          mt: 2,
                        }}
                      >
                        Or Animation Selection - Method 2
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                          <Typography
                            variant="h6"
                            fontWeight="500"
                            fontSize="16px"
                            mb={1}
                          >
                            Entry
                          </Typography>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 3,
                              border: "1px solid #e0e0e0",
                              borderRadius: 3,
                            }}
                          >
                            <FormControl disabled={finalTime > 0}>
                              <RadioGroup
                                value={entryAnimation}
                                onChange={(e) =>
                                  setEntryAnimation(e.target.value)
                                }
                              >
                                {animationLabels?.entry_transitions?.map(
                                  (opt, index) => (
                                    <FormControlLabel
                                      key={index}
                                      value={opt}
                                      control={<Radio color="primary" />}
                                      label={opt}
                                      sx={{
                                        "& .MuiFormControlLabel-label": {
                                          color: "#555",
                                          fontSize: "0.95rem",
                                        },
                                      }}
                                    />
                                  )
                                )}
                              </RadioGroup>
                            </FormControl>
                          </Paper>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                          <Typography
                            variant="h6"
                            fontWeight="500"
                            fontSize="16px"
                            mb={1}
                          >
                            Exit
                          </Typography>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 3,
                              border: "1px solid #e0e0e0",
                              borderRadius: 3,
                            }}
                          >
                            <FormControl disabled={finalTime > 0}>
                              <RadioGroup
                                value={exitAnimation}
                                onChange={(e) =>
                                  setExitAnimation(e.target.value)
                                }
                              >
                                {animationLabels?.exit_transitions?.map(
                                  (opt, index) => (
                                    <FormControlLabel
                                      key={index}
                                      value={opt}
                                      label={opt}
                                      control={<Radio color="primary" />}
                                      sx={{
                                        "& .MuiFormControlLabel-label": {
                                          color: "#555",
                                          fontSize: "0.95rem",
                                        },
                                      }}
                                    />
                                  )
                                )}
                              </RadioGroup>
                            </FormControl>
                          </Paper>
                        </Grid>
                      </Grid>

                      <div className={styles.actions}>
                        <ButtonComp
                          label={"Alternative Scenes"}
                          colorType="download"
                          // sx={{
                          //   backgroundColor: "#99d539",
                          //   textTransform: "none",
                          // }}
                          action={handleAlternateSubmit}
                          disabled={finalTime > 0}
                        />
                        <ButtonComp
                          label={"Apply To All"}
                          sx={{ textTransform: "none" }}
                          action={handleAllSubmit}
                          disabled={finalTime > 0}
                        />

                        <ButtonComp
                          label={"Submit Animation Changes"}
                          sx={{ textTransform: "none" }}
                          action={handleAnimationChanges}
                          disabled={finalTime > 0}
                        />
                      </div>
                      <div className={styles.actions_second}>
                        <ButtonComp
                          sx={{ textTransform: "none", width: "200px" }}
                          label={"Generate Video"}
                          action={generateVideo}
                          disabled={
                            audioAnimationLoader ||
                            videoAnimationLoader ||
                            !videoAnimationData ||
                            generatedVideoData?.final_video ||
                            finalTime > 0
                          }
                        />
                      </div>
                    </>
                  )} */
}
