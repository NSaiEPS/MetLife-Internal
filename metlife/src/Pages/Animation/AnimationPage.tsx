import React, { useEffect, useState } from "react";
import styles from "./animation.module.css";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import {
  Box,
  Typography,
  Grid,
  Paper,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import Footer from "../../components/common/mainFooter";
import ButtonComp from "../../components/common/Buton/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  getAudioDetails,
  getMediaTransitions,
  getSceneDetails,
  getVideosList,
  postGenerateFullVideo,
  postGenerateVideoBatch,
} from "../../redux/features/audioAnimationSlice";
import { NoDataMessage } from "../../components/common/NoDataMessage";
import { useParams } from "react-router";
import FullScreenGradientLoader from "../../components/common/GradientLoader";
import GeneratedVideoPlayer from "../../components/common/GeneratedVideo/GeneratedVideoPlayer";
import FullVideoPlayer from "../../components/common/GeneratedVideo/FullVideoPlayer";
import { convertToISTParts } from "../../utils";
import Timer from "../../components/common/Timer/Timer";

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

interface RootState {
  AudioAnimation: {
    audioAnimationLoader: boolean;
    videoAnimationLoader: boolean;
    animationLabels: AnimationLabels;
    videoAnimationData: VideoItem[];
    generatedVideoData?: { url: string };
    sceneData: SceneData;
  };
}

/* ---------- COMPONENT ---------- */

const AnimationPage: React.FC = () => {
  const [entryAnimation, setEntryAnimation] = useState<string>("fade_in");
  const [exitAnimation, setExitAnimation] = useState<string>("fade_out");
  const [timerDone, setTimerDone] = useState<boolean>(false);

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
    videoAnimationData?.[0]?.final_video?.url ? "" : ""
  );
  const finalTime = Math.ceil(waitingTime / 60);

  /* ---------- FETCH DATA ---------- */

  useEffect(() => {
    if (!id) return;
    dispatch(getMediaTransitions());
    dispatch(getSceneDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (sceneData?.video_exists) {
      dispatch(getVideosList(id!));
    }
  }, [sceneData?.video_exists, dispatch, id]);

  useEffect(() => {
    if (timerDone) dispatch(getSceneDetails(id!));
  }, [timerDone, dispatch, id]);

  useEffect(() => {
    if (timerDone && sceneData?.video_exists) {
      dispatch(getVideosList(id!));
    }
  }, [timerDone, sceneData?.video_exists, dispatch, id]);

  /* ---------- HANDLERS ---------- */

  const handleAllSubmit = () => {
    const sceneIds = sceneData?.scenes?.map((s) => s.scene_id) || [];

    const scenesPayload = sceneIds.map((scene_id) => ({
      scene_id,
      start_transition: entryAnimation,
      end_transition: exitAnimation,
    }));

    dispatch(
      postGenerateVideoBatch({
        script_id: id,
        scenes: scenesPayload,
      })
    );
  };

  const handleAlternateSubmit = () => {
    const allSceneIds =
      sceneData?.scenes?.flatMap((s) => {
        const ids: string[] = [];
        if (s.scene_id) ids.push(s.scene_id);
        if (s.alternative_scene_id) ids.push(s.alternative_scene_id);
        return ids;
      }) || [];

    const scenesPayload = allSceneIds.map((scene_id, index) => ({
      scene_id,
      start_transition: index % 2 === 0 ? entryAnimation : "none",
      end_transition: index % 2 === 0 ? exitAnimation : "none",
    }));

    dispatch(
      postGenerateVideoBatch({
        script_id: id,
        scenes: scenesPayload,
      })
    );
  };

  const generateVideo = () => {
    dispatch(postGenerateFullVideo(id!));
  };

  return (
    <>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
        <OneFrameHeader />

        {(animationLabels?.entry_transitions ||
          animationLabels?.exit_transitions) &&
        ((animationLabels?.entry_transitions?.length &&animationLabels?.entry_transitions?.length > 0 )||
          (animationLabels?.exit_transitions?.length  && animationLabels?.exit_transitions?.length > 0))  ? (
          <>
            {(audioAnimationLoader || videoAnimationLoader) && (
              <FullScreenGradientLoader text="loading..." />
            )}

            <main className={styles.cardWrap}>
              <div className={styles.card}>
                <div className={styles.headerRow}>
                  <h1 className={styles.title}>Animation Toolkit</h1>
                </div>

                <div className={styles.insideContainer}>
                  {/* ---------------- Animation Selection ---------------- */}
                      <Typography
                    className={styles.audioSelectionTitle}
                    sx={{
                      fontSize: "22px",
                      fontWeight: "500",
                      marginBottom: "10px",
                    }}
                  >
                    Animation Selection
                  </Typography>

                  <Grid container spacing={3}>
                    {/* ENTRY */}
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
                        <FormControl disabled={!!videoAnimationData?.length}>
                          <RadioGroup
                            value={entryAnimation}
                            onChange={(e) => setEntryAnimation(e.target.value)}
                          >
                            {animationLabels?.entry_transitions?.map((opt, i) => (
                              <FormControlLabel
                                key={i}
                                value={opt}
                                control={<Radio />}
                                label={opt}
                              />
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </Paper>
                    </Grid>

                    {/* EXIT */}
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
                            onChange={(e) => setExitAnimation(e.target.value)}
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
                  {/* Available videos */}
                  {!timerDone && finalTime > 0 && (
                    <Timer
                      time={finalTime}
                      // minutes={finalTime}
                      onComplete={() => setTimerDone(true)}
                    />
                  )}
                  {
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
                  }

                  {/* Full Video */}
                  {
                    generatedVideoData && sceneData?.video_exists === true && (
                      <>
                        <Typography
                          sx={{ fontSize: "20px", fontWeight: 500, mt: 4 }}
                        >
                          Generated Video
                        </Typography>

                        <FullVideoPlayer
                        
                         video_url={generatedVideoData?.url} />
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

                  <div className={styles.actions}>
                    <ButtonComp
                      label={"Alternative Scenes"}
                      sx={{ backgroundColor: "#99d539", textTransform: "none" }}
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
                      generatedVideoData
                    }
                  />
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



