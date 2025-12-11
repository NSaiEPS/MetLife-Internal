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
import VideoTimeline from "../../components/video-editor/VideoTimeline.jsx";
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
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const waitingTime = convertToISTParts(
    videoAnimationData?.estimated_completion_at ||
      sceneData?.estimated_completion_at
  );
  const finalTime = Math.ceil(waitingTime / 60);

  /* ---------- FETCH DATA ---------- */

  useEffect(() => {
    dispatch(getMediaTransitions());
    dispatch(getSceneDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (sceneData?.video_exists == true) {
      dispatch(getVideosList(id));
    }
  }, [sceneData?.video_exists, dispatch, id]);

  useEffect(() => {
    if (timerDone) {
      dispatch(getSceneDetails(id));
    }
  }, [timerDone, dispatch, id]);

  useEffect(() => {
    if (timerDone && sceneData?.video_exists === true) {
      dispatch(getVideosList(id));
    }
  }, [timerDone, sceneData?.video_exists, dispatch, id]);

  /* ---------- HANDLERS ---------- */

  const handleAllSubmit = () => {
    // const sceneIds = audioAnimationData?.scenes?.map((item) => item?.scene_id);
    const sceneIds = sceneData?.scenes?.map((item) => item?.scene_id);
    const scenesPayload = sceneIds?.map((id) => ({
      scene_id: id,
      start_transition: entryAnimation,
      end_transition: exitAnimation,
      // ost: "",
    }));
    const payload = {
      script_id: id,
      scenes: scenesPayload,
    };
    dispatch(postGenerateVideoBatch(payload));
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

  console.log(videoAnimationLoader, "check__video_animaiton__loader");

  const videos = [
    {
      scene_id: "432dd138-b7a8-46bc-89b2-4989512408a7",
      scene_number: 1,
      duration: 10,
      prompt_id: "6748e97c-9476-47e8-affe-b31cb69c7277",
      image_urls: [
        "https://surfai-oneframe.s3.amazonaws.com/images/c0aa94d0-39b7-4a29-b515-d91df0139897_scene_432dd138-b7a8-46bc-89b2-4989512408a7_4a1f49f6-878b-44e6-a954-0cd75610a077.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIASKVBYMSEZLSHJLPJ%2F20251210%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251210T063305Z&X-Amz-Expires=432000&X-Amz-SignedHeaders=host&X-Amz-Signature=0f3018953cd4f3e2c40d7568eb8a6e40dc16841198b298298b843bd919ceed43",
      ],
      audio_url:
        "https://surfai-oneframe.s3.amazonaws.com/audio/c0aa94d0-39b7-4a29-b515-d91df0139897_scene_1_432dd138-b7a8-46bc-89b2-4989512408a7_final.wav?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIASKVBYMSEZLSHJLPJ%2F20251210%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251210T063453Z&X-Amz-Expires=518400&X-Amz-SignedHeaders=host&X-Amz-Signature=6468881e3c37556ef321bf216459cb87188222fdf7295171bed03ca94f1ff631",
      start_transition: "fade_in",
      end_transition: "fade_out",
      ost: "Embrace the Future of Insurance",
      final_video: {
        url: "https://surfai-oneframe.s3.amazonaws.com/videos/9c46325a-e801-409a-9ac8-4b67af642f52.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIASKVBYMSEZLSHJLPJ%2F20251210%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251210T063923Z&X-Amz-Expires=518400&X-Amz-SignedHeaders=host&X-Amz-Signature=8de88c59e0d41991b31054c47eb0ead13404368bf8bc47d1461a7cf467b4a01d",
        s3_key: "videos/9c46325a-e801-409a-9ac8-4b67af642f52.mp4",
        created_at: "2025-12-10T06:39:23.951000",
      },
    },
    {
      scene_id: "eb3e6283-6fde-409e-b68c-fee95bc755a0",
      scene_number: 2,
      duration: 23,
      prompt_id: "fc9d51b2-6beb-4fae-b039-e07f3db087e2",
      image_urls: [
        "https://surfai-oneframe.s3.amazonaws.com/images/c0aa94d0-39b7-4a29-b515-d91df0139897_scene_eb3e6283-6fde-409e-b68c-fee95bc755a0_5a03a186-9029-4103-93b4-1551e7b9814b.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIASKVBYMSEZLSHJLPJ%2F20251210%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251210T063306Z&X-Amz-Expires=432000&X-Amz-SignedHeaders=host&X-Amz-Signature=256bb4bb8cf2372c76a25a7bc089624679ad35808af32deead6870601b2929c1",
      ],
      audio_url:
        "https://surfai-oneframe.s3.amazonaws.com/audio/c0aa94d0-39b7-4a29-b515-d91df0139897_scene_2_eb3e6283-6fde-409e-b68c-fee95bc755a0_final.wav?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIASKVBYMSEZLSHJLPJ%2F20251210%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251210T063454Z&X-Amz-Expires=518400&X-Amz-SignedHeaders=host&X-Amz-Signature=99fde2da29ae830ab60713e6e4d54bc20a4b66d93b8150d84463deb4c66ec7cf",
      start_transition: "fade_in",
      end_transition: "fade_out",
      ost: "Connect with Clients Online",
      final_video: {
        url: "https://surfai-oneframe.s3.amazonaws.com/videos/0c2cd794-3747-41b0-ae98-96b2e55900af.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIASKVBYMSEZLSHJLPJ%2F20251210%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251210T063928Z&X-Amz-Expires=518400&X-Amz-SignedHeaders=host&X-Amz-Signature=56a1fc3f7c53e57c7184e4edf75f225f6476080c5c4609d589b1e52082d5beba",
        s3_key: "videos/0c2cd794-3747-41b0-ae98-96b2e55900af.mp4",
        created_at: "2025-12-10T06:39:28.533000",
      },
    },
    {
      scene_id: "432dd138-b7a8-46bc-89b2-4989512408a7",
      scene_number: 1,
      duration: 5,
      prompt_id: "6748e97c-9476-47e8-affe-b31cb69c7277",
      image_urls: [
        "https://surfai-oneframe.s3.amazonaws.com/images/c0aa94d0-39b7-4a29-b515-d91df0139897_scene_432dd138-b7a8-46bc-89b2-4989512408a7_4a1f49f6-878b-44e6-a954-0cd75610a077.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIASKVBYMSEZLSHJLPJ%2F20251210%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251210T063305Z&X-Amz-Expires=432000&X-Amz-SignedHeaders=host&X-Amz-Signature=0f3018953cd4f3e2c40d7568eb8a6e40dc16841198b298298b843bd919ceed43",
      ],
      audio_url:
        "https://surfai-oneframe.s3.amazonaws.com/audio/c0aa94d0-39b7-4a29-b515-d91df0139897_scene_1_432dd138-b7a8-46bc-89b2-4989512408a7_final.wav?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIASKVBYMSEZLSHJLPJ%2F20251210%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251210T063453Z&X-Amz-Expires=518400&X-Amz-SignedHeaders=host&X-Amz-Signature=6468881e3c37556ef321bf216459cb87188222fdf7295171bed03ca94f1ff631",
      start_transition: "fade_in",
      end_transition: "fade_out",
      ost: "Embrace the Future of Insurance",
      final_video: {
        url: "https://surfai-oneframe.s3.amazonaws.com/videos/9c46325a-e801-409a-9ac8-4b67af642f52.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIASKVBYMSEZLSHJLPJ%2F20251210%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251210T063923Z&X-Amz-Expires=518400&X-Amz-SignedHeaders=host&X-Amz-Signature=8de88c59e0d41991b31054c47eb0ead13404368bf8bc47d1461a7cf467b4a01d",
        s3_key: "videos/9c46325a-e801-409a-9ac8-4b67af642f52.mp4",
        created_at: "2025-12-10T06:39:23.951000",
      },
    },
    {
      scene_id: "eb3e6283-6fde-409e-b68c-fee95bc755a0",
      scene_number: 2,
      duration: 23,
      prompt_id: "fc9d51b2-6beb-4fae-b039-e07f3db087e2",
      image_urls: [
        "https://surfai-oneframe.s3.amazonaws.com/images/c0aa94d0-39b7-4a29-b515-d91df0139897_scene_eb3e6283-6fde-409e-b68c-fee95bc755a0_5a03a186-9029-4103-93b4-1551e7b9814b.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIASKVBYMSEZLSHJLPJ%2F20251210%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251210T063306Z&X-Amz-Expires=432000&X-Amz-SignedHeaders=host&X-Amz-Signature=256bb4bb8cf2372c76a25a7bc089624679ad35808af32deead6870601b2929c1",
      ],
      audio_url:
        "https://surfai-oneframe.s3.amazonaws.com/audio/c0aa94d0-39b7-4a29-b515-d91df0139897_scene_2_eb3e6283-6fde-409e-b68c-fee95bc755a0_final.wav?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIASKVBYMSEZLSHJLPJ%2F20251210%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251210T063454Z&X-Amz-Expires=518400&X-Amz-SignedHeaders=host&X-Amz-Signature=99fde2da29ae830ab60713e6e4d54bc20a4b66d93b8150d84463deb4c66ec7cf",
      start_transition: "fade_in",
      end_transition: "fade_out",
      ost: "Connect with Clients Online",
      final_video: {
        url: "https://surfai-oneframe.s3.amazonaws.com/videos/0c2cd794-3747-41b0-ae98-96b2e55900af.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIASKVBYMSEZLSHJLPJ%2F20251210%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251210T063928Z&X-Amz-Expires=518400&X-Amz-SignedHeaders=host&X-Amz-Signature=56a1fc3f7c53e57c7184e4edf75f225f6476080c5c4609d589b1e52082d5beba",
        s3_key: "videos/0c2cd794-3747-41b0-ae98-96b2e55900af.mp4",
        created_at: "2025-12-10T06:39:28.533000",
      },
    },
    {
      scene_id: "432dd138-b7a8-46bc-89b2-4989512408a7",
      scene_number: 1,
      duration: 23,
      prompt_id: "6748e97c-9476-47e8-affe-b31cb69c7277",
      image_urls: [
        "https://surfai-oneframe.s3.amazonaws.com/images/c0aa94d0-39b7-4a29-b515-d91df0139897_scene_432dd138-b7a8-46bc-89b2-4989512408a7_4a1f49f6-878b-44e6-a954-0cd75610a077.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIASKVBYMSEZLSHJLPJ%2F20251210%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251210T063305Z&X-Amz-Expires=432000&X-Amz-SignedHeaders=host&X-Amz-Signature=0f3018953cd4f3e2c40d7568eb8a6e40dc16841198b298298b843bd919ceed43",
      ],
      audio_url:
        "https://surfai-oneframe.s3.amazonaws.com/audio/c0aa94d0-39b7-4a29-b515-d91df0139897_scene_1_432dd138-b7a8-46bc-89b2-4989512408a7_final.wav?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIASKVBYMSEZLSHJLPJ%2F20251210%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251210T063453Z&X-Amz-Expires=518400&X-Amz-SignedHeaders=host&X-Amz-Signature=6468881e3c37556ef321bf216459cb87188222fdf7295171bed03ca94f1ff631",
      start_transition: "fade_in",
      end_transition: "fade_out",
      ost: "Embrace the Future of Insurance",
      final_video: {
        url: "https://surfai-oneframe.s3.amazonaws.com/videos/9c46325a-e801-409a-9ac8-4b67af642f52.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIASKVBYMSEZLSHJLPJ%2F20251210%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251210T063923Z&X-Amz-Expires=518400&X-Amz-SignedHeaders=host&X-Amz-Signature=8de88c59e0d41991b31054c47eb0ead13404368bf8bc47d1461a7cf467b4a01d",
        s3_key: "videos/9c46325a-e801-409a-9ac8-4b67af642f52.mp4",
        created_at: "2025-12-10T06:39:23.951000",
      },
    },
  ];
  return (
    <>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
        <OneFrameHeader />

        {(animationLabels?.entry_transitions ||
          animationLabels?.exit_transitions) &&
        (animationLabels?.entry_transitions?.length > 0 ||
          animationLabels?.exit_transitions?.length > 0) ? (
          <>
            {(audioAnimationLoader || videoAnimationLoader) && (
              <FullScreenGradientLoader text="loading..." />
            )}

            <main className={styles.cardWrap}>
              <div className={styles.card}>
                <div className={styles.headerRow}>
                  <h1 className={styles.title}>Animation Toolkit</h1>
                </div>

                {/* animation part */}
                <div className={styles.insideContainer}>
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
                            onChange={(e) => setEntryAnimation(e.target.value)}
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
                    // {/* { finalTime > 0 && ( */}
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
                  <Grid container sx={{ mt: 4 }}>
                    <Typography
                      sx={{ fontSize: "20px", fontWeight: 500, mt: 4 }}
                    >
                      Video Timeline
                    </Typography>
                    <VideoTimeline videos={videos} />
                  </Grid>

                  {/* Full Video */}
                  {
                    generatedVideoData && sceneData?.video_exists === true && (
                      <>
                        <Typography
                          sx={{ fontSize: "20px", fontWeight: 500, mt: 4 }}
                        >
                          Generated Video
                        </Typography>

                        <FullVideoPlayer video_url={generatedVideoData?.url} />
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
