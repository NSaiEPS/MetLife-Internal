import {
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ButtonComp from "../../components/common/Buton/Button";
import { useParams } from "react-router";
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
    animationLabels: AnimationLabels;
    videoAnimationData: VideoItem[];
    generatedVideoData?: { final_video: { url: string } };
    sceneData: SceneData;
  };
}

/* ---------- COMPONENT ---------- */

const AnimationPage: React.FC = () => {
  const [entryAnimation, setEntryAnimation] = useState<string>("fade_in");
  const [exitAnimation, setExitAnimation] = useState<string>("fade_out");
  const [timerDone, setTimerDone] = useState<boolean>(false);
  const [animationData, setAnimationData] = useState<AnimationData[]>([]);
  const [openMissingPopup, setOpenMissingPopup] = useState(false);
  const [missingScenes, setMissingScenes] = useState<number[]>([]);

  const {
    audioAnimationLoader,
    videoAnimationLoader,
    animationLabels,
    videoAnimationData,
    generatedVideoData,
    sceneData,
  } = useSelector((store: RootState) => store.AudioAnimation);

  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<any>();
  const waitingTime = convertToISTParts(
    videoAnimationData?.estimated_completion_at ||
      sceneData?.estimated_completion_at
  );
  const finalTime = Math.ceil(waitingTime / 60);

  // console.log(videoAnimationData, "videoAnimationData");

  // console.log(sceneData, "sceneData");
  // console.log(generatedVideoData, "generatedVideoData");

  // console.log(videoAnimationData, "videoAnimationData");
  // console.log(generatedVideoData?.final_video !== null, "isFinalVideo");

  const finalVideoAsTimeline: VideoData[] = generatedVideoData?.final_video
    ? [
        {
          scene_id: "final_video",
          scene_number: 1,
          ost: "Final Video",
          image_urls: ["/imgs/final-thumbnail.png"], // fallback
          audio_url: "",
          final_video: generatedVideoData?.final_video,
          duration: generatedVideoData?.duration_seconds ?? 0,
          start_transition: "none",
          end_transition: "none",
        },
      ]
    : [];

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
    if (timerDone && sceneData?.video_exists === true && id) {
      dispatch(getVideosList(id));
    }
  }, [timerDone, sceneData?.video_exists, dispatch, id]);

  /* ---------- HANDLERS ---------- */

  const handleAllSubmit = () => {
    // const sceneIds = audioAnimationData?.scenes?.map((item) => item?.scene_id);
    // const sceneIds = sceneData?.scenes?.map((item) => item?.scene_id);
    // const scenesPayload = sceneIds?.map((id) => ({
    //   scene_id: id,
    //   start_transition: entryAnimation,
    //   end_transition: exitAnimation,
    //   // ost: "",
    // }));
    // const payload = {
    //   script_id: id,
    //   scenes: scenesPayload,
    // };
    // dispatch(postGenerateVideoBatch(payload));

    const appliedSceneNumbers = new Set(
      animationData.map((item) => item.scene_number)
    );

    const missingScenes = videoAnimationData
      .filter((video) => !appliedSceneNumbers.has(video.scene_number))
      .map((video) => video.scene_number);

    if (missingScenes.length > 0) {
      // console.log("Missing animation on scenes:", missingScenes);
      setMissingScenes(missingScenes);
      setOpenMissingPopup(true);
      return;
    }

    submitAllAnimations();
  };

  const handleMissingAnimationConfirm = () => {
    setOpenMissingPopup(false);
    submitAllAnimations();
  };

  const submitAllAnimations = () => {
    // console.log("Submitting all animations", animationData);
    // dispatch(postGenerateFullVideo(animationData));
  };

  const handleAlternateSubmit = () => {
    const scenesData = sceneData?.scenes || [];
    const allSceneIds = scenesData.flatMap((scene) => {
      const idsToProcess = [];
      if (scene?.scene_id) {
        idsToProcess.push(scene.scene_id);
      }
      if (scene?.alternative_scene_id) {
        idsToProcess.push(scene.alternative_scene_id);
      }
      return idsToProcess;
    });

    const scenesPayload = allSceneIds.map((id, index) => ({
      scene_id: id,
      start_transition: index % 2 === 0 ? entryAnimation : "none",
      end_transition: index % 2 === 0 ? exitAnimation : "none",
      // ost: "",
    }));

    const payload = {
      script_id: id,
      scenes: scenesPayload,
    };
    dispatch(postGenerateVideoBatch(payload));
  };

  const generateVideo = () => {
    dispatch(postGenerateFullVideo(id));
  };

  // console.log(timerDone);

  return (
    <>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
        <OneFrameHeader />

        {(animationLabels?.entry_transitions ||
          animationLabels?.exit_transitions) &&
        (animationLabels?.entry_transitions?.length > 0 ||
          animationLabels?.exit_transitions?.length > 0) ? (
          <>
            {(audioAnimationLoader || !generatedVideoData) && (
              <FullScreenGradientLoader text="loading..." />
            )}

            <main className={styles.cardWrap}>
              <div className={styles.card}>
                <div className={styles.headerRow}>
                  <h1 className={styles.title}>Animation Toolkit</h1>
                </div>

                {/* animation part */}
                <div className={styles.insideContainer}>
                  {/* Available videos */}
                  {!timerDone && finalTime > 0 && (
                    // {/* { finalTime > 0 && ( */}
                    <Timer
                      time={finalTime}
                      // minutes={finalTime}
                      onComplete={() => setTimerDone(true)}
                    />
                  )}

                  {/* {
                    videoAnimationData?.length > 0 &&
                      sceneData?.video_exists === true && (
                        <>
                          <Typography
                            sx={{ fontSize: "20px", fontWeight: 500, mt: 4 }}
                          >
                            Available Videos
                          </Typography>
                          <Grid container spacing={2} sx={{ mt: 1 }}>
                            {videoAnimationData?.map((scene, idx) => (
                              <Grid
                                item
                                xs={12}
                                md={6}
                                lg={4}
                                key={idx}
                                sx={{ width: "100%" }}
                              >
                                <GeneratedVideoPlayer
                                  data={scene}
                                  image_url={scene?.image_urls[0]}
                                  index={idx}
                                  description={scene?.ost}
                                  s3_url={scene?.final_video?.url}
                                />
                              </Grid>
                            ))}
                          </Grid>
                        </>
                      )
                    //  : (
                    //   <>
                    //     {
                    //       <NoDataMessage
                    //         filter={false}
                    //         loading={!videoAnimationData}
                    //       />
                    //     }

                    //   </>
                    // )
                  } */}
                  {/* {!timerDone && videoAnimationData?.length > 0 && ( */}
                  {videoAnimationData?.length > 0 && (
                    <Grid container>
                      <Typography
                        sx={{ fontSize: "20px", fontWeight: 500, mb: 2 }}
                      >
                        Video Timeline
                      </Typography>
                      <VideoTimeline
                        videosData={videoAnimationData}
                        isFinalVideo={generatedVideoData?.final_video !== null}
                        animationData={animationData}
                        setAnimationData={setAnimationData}
                        handleAllSubmit={handleAllSubmit}
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
                    <>
                      <Typography
                        className={styles.audioSelectionTitle}
                        sx={{
                          fontSize: "22px",
                          fontWeight: "500",
                          marginBottom: "10px",
                          mt: 2,
                        }}
                      >
                        Animation Selection
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
                            <FormControl disabled={videoAnimationData}>
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
                            <FormControl disabled={videoAnimationData}>
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
                                      // label={opt.label}
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
                          sx={{
                            backgroundColor: "#99d539",
                            textTransform: "none",
                          }}
                          action={handleAlternateSubmit}
                          disabled={
                            audioAnimationLoader ||
                            videoAnimationLoader ||
                            generatedVideoData ||
                            videoAnimationData ||
                            sceneData?.video_exists === true
                          }
                        />
                        <ButtonComp
                          label={"Apply To All"}
                          sx={{ textTransform: "none" }}
                          action={handleAllSubmit}
                          disabled={
                            audioAnimationLoader ||
                            videoAnimationLoader ||
                            generatedVideoData ||
                            videoAnimationData ||
                            sceneData?.video_exists === true
                            // false
                          }
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
                            !timerDone
                          }
                        />
                      </div>
                    </>
                  )}

                  {/* Full Video */}
                  {
                    generatedVideoData?.final_video !== null &&
                      sceneData?.video_exists === true && (
                        <>
                          <Typography
                            sx={{
                              fontSize: "20px",
                              fontWeight: 500,
                              mt: 4,
                              mb: 2,
                            }}
                          >
                            Generated Video
                          </Typography>

                          <VideoTimeline
                            type="final-video"
                            videosData={finalVideoAsTimeline}
                            isFinalVideo={
                              generatedVideoData?.final_video !== null
                            }
                            animationData={animationData}
                            setAnimationData={setAnimationData}
                            handleAllSubmit={handleAllSubmit}
                          />

                          {/* <FullVideoPlayer
                            video_url={generatedVideoData?.final_video?.url}
                          /> */}
                        </>
                      )
                    //  : (
                    //   <>
                    //     <NoDataMessage
                    //       filter={false}
                    //       // loading={audioAnimationLoader}
                    //     />
                    //   </>
                    // )
                  }
                </div>
              </div>
            </main>
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

// ///////////////////////
