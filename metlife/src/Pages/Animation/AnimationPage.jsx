import React, { useEffect, useState } from "react";
import styles from "./animation.module.css";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  Button,
  InputBase,
  Tooltip,
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
  postGenerateVideoBatch,
} from "../../redux/features/audioAnimationSlice";
import { NoDataMessage } from "../../components/common/NoDataMessage";
import { useParams } from "react-router";
import FullScreenGradientLoader from "../../components/common/GradientLoader";

const animationOptions = [
  { label: "Fade In", value: "fadeIn" },
  { label: "Fade Out", value: "fadeOut" },
  { label: "Zoom In", value: "zoomIn" },
  { label: "Zoom Out", value: "zoomOut" },
];
const AnimationPage = () => {
  const [entryAnimation, setEntryAnimation] = useState("fade_in");
  const [exitAnimation, setExitAnimation] = useState("fade_out");
  const { audioAnimationLoader, audioAnimationData, animationLabels } =
    useSelector((store) => store.AudioAnimation);
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMediaTransitions());
    dispatch(getAudioDetails(id));
  }, [dispatch, id]);
//   console.log(audioAnimationData "check_audio_animation_data");
console.log(animationLabels, 'check_animation_lables')

  const handleAllSubmit = () => {
    const sceneIds = audioAnimationData?.scenes?.map((item) => item?.scene_id);
    const scenesPayload = sceneIds.map((id) => ({
      scene_id: id,
      start_transition: entryAnimation,
      end_transition: exitAnimation,
      ost: "",
    }));
    const payload = {
      script_id: id,
      scenes: scenesPayload,
    };
    // console.log(payload, "check_payload");
    dispatch(postGenerateVideoBatch(payload));
  };

  const handleAlternateSubmit = () => {
    const scenesData = audioAnimationData?.scenes || [];
    const selectedPrimaryScenes = scenesData.filter(
      (_, index) => index % 2 === 0
    );

    const allSceneIds = selectedPrimaryScenes.flatMap((scene) => {
      const idsToProcess = [];
      if (scene?.scene_id) {
        idsToProcess.push(scene.scene_id);
      }
      if (scene?.alternative_scene_id) {
        idsToProcess.push(scene.alternative_scene_id);
      }

      return idsToProcess;
    });

    const scenesPayload = allSceneIds.map((id) => ({
      scene_id: id,
      start_transition: entryAnimation,
      end_transition: exitAnimation,
      ost: "",
    }));

    const payload = {
      script_id: id,
      scenes: scenesPayload,
    };

    console.log(payload, "check_payload");
    dispatch(postGenerateVideoBatch(payload))
  };

  return (
    <>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
        <OneFrameHeader />
        {audioAnimationLoader && <FullScreenGradientLoader />}
        {(animationLabels?.entry_transitions ||
          animationLabels?.exit_transitions) &&
        (animationLabels?.entry_transitions?.length > 0 ||
          animationLabels?.exit_transitions?.length > 0) ? (
          <>
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
                        <FormControl>
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
                        <FormControl>
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
                  <div className={styles.actions}>
                    <ButtonComp
                      label={"Alternative Scenes"}
                      sx={{ backgroundColor: "#99d539", textTransform: "none" }}
                      action={handleAlternateSubmit}
                      disabled={audioAnimationLoader}
                    />
                    <ButtonComp
                      label={"Apply To All"}
                      sx={{ textTransform: "none" }}
                      action={handleAllSubmit}
                      disabled={audioAnimationLoader}
                    />
                  </div>
                </div>
                <div className={styles.actions_second}>
                  <ButtonComp
                    sx={{ textTransform: "none", width: "200px" }}
                    label={"Generate Video"}
                  />
                </div>
              </div>
            </main>
          </>
        ) : (
          <>
            <NoDataMessage filter={false} loading={audioAnimationLoader} />
          </>
        )}

        <Footer />
      </Box>
    </>
  );
};

export default AnimationPage;
