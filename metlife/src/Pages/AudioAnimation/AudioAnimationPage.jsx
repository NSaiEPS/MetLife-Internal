import React, { useEffect, useState } from "react";
import styles from "./audioAnimation.module.css";
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
import { useNavigate, useParams } from "react-router";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import Input from "../../components/common/Input";
import FullScreenGradientLoader from "../../components/common/GradientLoader";
import Footer from "../../components/common/mainFooter";
import SelectComp from "../../components/common/select";
import ButtonComp from "../../components/common/Buton/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  getAudioDetails,
  getPreviewVoices,
  postGenerateVoiceAndAudio,
} from "../../redux/features/audioAnimationSlice";
import { showToast } from "../../utils/toast";
import VoicePlayer from "../../components/common/VoicePlayer/VoicePlayer";
import SelectWithAudio from "../../components/common/VoicePlayer/SelectWIthAudio";

const narrationVoiceOptions = [
  { label: "Azure", value: "azure" },
  // { label: "Azure", value: "azure" },
];

const voiceOptions = [
  { label: "EN-US Jenny Neural", value: "en-US-JennyNeural" },
  { label: "EN-US Aria Neural", value: "en-US-AriaNeural" },
  { label: "EN-US Sara Neural", value: "en-US-SaraNeural" },
  { label: "EN-US Guy Neural", value: "en-US-GuyNeural" },
  { label: "EN-US Davis Neural", value: "en-US-DavisNeural" },
];

// const animationOptions = [
//   { label: "Fade In", value: "fadeIn" },
//   { label: "Fade Out", value: "fadeOut" },
//   { label: "Zoom In", value: "zoomIn" },
//   { label: "Zoom Out", value: "zoomOut" },
// ];

const AudioAnimationPage = () => {
  // const [narration, setNarration] = useState("azure");
  // const [narrationSelections, setNarrationSelections] = useState({});
  const [narrationSelections, setNarrationSelections] = useState({
  Narrator: "azure",
  Alex: "azure",
  Taylor: "azure",
});
  const [voiceSelections, setVoiceSelections] = useState({});
  // const [entryAnimation, setEntryAnimation] = useState("fadeOut");
  // const [exitAnimation, setExitAnimation] = useState("fadeOut");
  const { id } = useParams();
  const dispatch = useDispatch();
  const { audioAnimationLoader, audioAnimationData, audioPreviewData } =
    useSelector((store) => store.AudioAnimation);
  const characters =
    audioAnimationData?.characters ||
    audioAnimationData?.voice_map?.characters ||
    [];
  const sortedLabels = [
    "Narrator",
    ...characters.filter((c) => c !== "Narrator"),
  ];

  useEffect(() => {
    dispatch(getAudioDetails(id));
    dispatch(getPreviewVoices());
  }, [id, dispatch]);

  const handleNarrationChange = (charName, value) => {
    setNarrationSelections((prev) => ({
      ...prev,
      [charName]: value,
    }));
  };

  const handleVoiceChange = (charName, selected) => {
    setVoiceSelections((prev) => ({
      ...prev,
      [charName]: selected,
    }));
  };

  const handleSubmit = () => {
    if (!narrationSelections.Narrator) {
      showToast.error("Please select a Narrator");
    } else if (!voiceSelections.Narrator) {
      showToast.error("Please select a narrator voice");
    } else if (!narrationSelections.Alex) {
      showToast.error("Please select a Alex");
    } else if (!voiceSelections.Alex) {
      showToast.error("Please select a alex voice");
    } else if (!narrationSelections.Taylor) {
      showToast.error("Please select a Taylor");
    } else if (!voiceSelections.Taylor) {
      showToast.error("Please select a taylor voice");
    } else {
      apiCall();
    }
  };

  const apiCall = () => {
    const payload = {
      script_id: id,
      custom_voice_map: {
        Alex: voiceSelections.Alex,
        Taylor: voiceSelections.Taylor,
        Narrator: voiceSelections.Narrator,
      },
    };
    dispatch(postGenerateVoiceAndAudio(payload));
  };

  const previewVoices = audioPreviewData?.voices;
  const getPreviewUrl = (voiceName) => {
    return previewVoices?.find((v) => v.name === voiceName)?.s3_url || "";
  };

  console.log(audioAnimationData, "checkaudioAnimation");

  return (
    <>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
        <OneFrameHeader />
        {audioAnimationLoader && <FullScreenGradientLoader text="loading..." />}
        <main className={styles.cardWrap}>
          <div className={styles.card}>
            <div className={styles.headerRow}>
              <h1 className={styles.title}>Audio & Animation Toolkit</h1>
              {/* <Button
                className={styles.icon}
                onClick={() => navigate("/video-frame")}
              >
                <IoArrowBackCircleOutline size={30} /> Back
              </Button> */}
            </div>

            <div className={styles.insideContainer}>
              <Typography
                className={styles.audioSelectionTitle}
                sx={{ fontSize: "22px", fontWeight: "500" }}
              >
                Audio Selection
              </Typography>

              {sortedLabels.map((charName, index) => (
                <Grid
                  container
                  spacing={2}
                  alignItems="flex-end"
                  sx={{ mt: 2, mb: 2 }}
                  key={index}
                >
                  <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                    <SelectComp
                      label={charName}
                      options={narrationVoiceOptions}
                      value={narrationSelections[charName]}
                      onChange={(value) =>
                        handleNarrationChange(charName, value)
                      }
                      placeholder="Select Tool"
                      style={true}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                    <SelectWithAudio
                      options={voiceOptions}
                      placeholder="Select Voice"
                      value={voiceSelections[charName] || ""}
                      onChange={(value) => handleVoiceChange(charName, value)}
                      style={true}
                      getPreviewUrl={(voice) => getPreviewUrl(voice)}
                      customOption
                    />
                  </Grid>
                </Grid>
              ))}
              {audioAnimationData?.scenes &&
                audioAnimationData?.scenes?.length > 0 && (
                  <>
                    <Typography
                      sx={{ fontSize: "20px", fontWeight: 500, mt: 4 }}
                    >
                      Available Voices
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      {audioAnimationData?.scenes?.map((scene, idx) => (
                        <Grid
                          item
                          xs={12}
                          md={6}
                          lg={4}
                          key={idx}
                          sx={{ width: "100%" }}
                        >
                          <VoicePlayer
                            description={scene.description}
                            s3_url={scene.final_audio_s3_url}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}

              <div className={styles.actions}>
                <ButtonComp
                  // disabled={audioAnimationLoader}
                  // label={audioAnimationLoader ? "Submit" : "Submitting"}
                  label={"Submit"}
                  className={styles.submitBtn}
                  action={handleSubmit}
                />
              </div>
            </div>
            {/* audio and animation part */}
            {/* <div className={styles.insideContainer}>
              <Typography
                className={styles.audioSelectionTitle}
                sx={{ fontSize: "22px", fontWeight: "500", marginBottom: "10px" }}
              >
                Animation Selection
              </Typography>
              <Grid container spacing={3}>

                <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                  <Typography variant="h6" fontWeight="400" mb={1}>
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
                        {animationOptions.map((opt) => (
                          <FormControlLabel
                            key={opt.value}
                            value={opt.value}
                            control={<Radio color="primary" />}
                            label={opt.label}
                            sx={{
                              "& .MuiFormControlLabel-label": {
                                color: "#555",
                                fontSize: "0.95rem",
                              },
                            }}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                  <Typography variant="h6" fontWeight="400" mb={1}>
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
                        {animationOptions.map((opt) => (
                          <FormControlLabel
                            key={opt.value}
                            value={opt.value}
                            control={<Radio color="primary" />}
                            label={opt.label}
                            sx={{
                              "& .MuiFormControlLabel-label": {
                                color: "#555",
                                fontSize: "0.95rem",
                              },
                            }}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </Paper>
                </Grid>
              </Grid>
            </div> */}
          </div>
        </main>
        <Footer />
      </Box>
    </>
  );
};

export default AudioAnimationPage;
