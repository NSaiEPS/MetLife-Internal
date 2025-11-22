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
  getLabels,
  postGenerateVoiceAndAudio,
} from "../../redux/features/audioAnimationSlice";
import { showToast } from "../../utils/toast";
import VoicePlayer from "../../components/common/VoicePlayer/VoicePlayer";
import SelectWithAudio from "../../components/common/VoicePlayer/SelectWIthAudio";
import { navigateTo } from "../../utils/navigate";
const narrationVoiceOptions = [{ label: "Azure", value: "azure" }];
const voiceOptions = [
  {
    label: "EN-US Jenny Neural",
    value: "en-US-JennyNeural",
    s3_url:
      "https://surfai-oneframe.s3.amazonaws.com/audio/previews/voice_preview_en-US-JennyNeural.wav?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIASKVBYMSEZLSHJLPJ%2F20251119%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251119T085917Z&X-Amz-Expires=518400&X-Amz-SignedHeaders=host&X-Amz-Signature=0bef7d38b32a70d6f814e2cff7d670e14770a62ddff951b567c810636b0ad7a6",
  },
  {
    label: "EN-US Aria Neural",
    value: "en-US-AriaNeural",
    s3_url:
      "https://surfai-oneframe.s3.amazonaws.com/audio/previews/voice_preview_en-US-AriaNeural.wav?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIASKVBYMSEZLSHJLPJ%2F20251119%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251119T085917Z&X-Amz-Expires=518400&X-Amz-SignedHeaders=host&X-Amz-Signature=95ed5ffe514efd3ff03b85b5d86815005155cff2d87c81948526111c61734398",
  },
  {
    label: "EN-US Sara Neural",
    value: "en-US-SaraNeural",
    s3_url:
      "https://surfai-oneframe.s3.amazonaws.com/audio/previews/voice_preview_en-US-SaraNeural.wav?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIASKVBYMSEZLSHJLPJ%2F20251119%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251119T085917Z&X-Amz-Expires=518400&X-Amz-SignedHeaders=host&X-Amz-Signature=c176b51459777608daa17cd698f0f6fbde7c9cc4fb261eca15e2c635ba6235ec",
  },
  {
    label: "EN-US Guy Neural",
    value: "en-US-GuyNeural",
    s3_url:
      "https://surfai-oneframe.s3.amazonaws.com/audio/previews/voice_preview_en-US-GuyNeural.wav?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIASKVBYMSEZLSHJLPJ%2F20251119%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251119T085917Z&X-Amz-Expires=518400&X-Amz-SignedHeaders=host&X-Amz-Signature=fb45dcc46e012322dc245811ec4bf925108adcc9caaf715d9332f68512aed73a",
  },
  {
    label: "EN-US Davis Neural",
    value: "en-US-DavisNeural",
    s3_url:
      "https://surfai-oneframe.s3.amazonaws.com/audio/previews/voice_preview_en-US-DavisNeural.wav?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIASKVBYMSEZLSHJLPJ%2F20251119%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251119T085918Z&X-Amz-Expires=518400&X-Amz-SignedHeaders=host&X-Amz-Signature=1039ba4cf86c3809db5fc91a619a4189e6ba9e228b2a7c46e28aaccc586caeec",
  },
];
const AudioAnimationPage = () => {
  const [narrationSelections, setNarrationSelections] = useState({
    Narrator: "azure",
    Alex: "azure",
    Taylor: "azure",
  });
  const [voiceSelections, setVoiceSelections] = useState({});
  const { id } = useParams();
  const dispatch = useDispatch();
  const { audioAnimationLoader, audioAnimationData, labels } =
    useSelector((store) => store.AudioAnimation);
  const characters = audioAnimationData?.voice_map?.characters || labels;
  let sortedLabels = [];
  if (characters && characters.length > 0) {
    sortedLabels = ["Narrator", ...characters.filter((c) => c !== "Narrator")];
  }

  useEffect(() => {
    dispatch(getLabels(id));
    dispatch(getAudioDetails(id));
    // dispatch(getPreviewVoices());
  }, [id, dispatch]);

  useEffect(() => {
    if (audioAnimationData?.custom_voice_map) {
      setVoiceSelections(audioAnimationData.custom_voice_map);
    } else {
      setVoiceSelections({});
    }
  }, [audioAnimationData]);

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
    }
    //  else if (!voiceSelections.Narrator) {
    //   showToast.error("Please select a narrator voice");
    // } else if (!narrationSelections.Alex) {
    //   showToast.error("Please select a Alex");
    // } else if (!voiceSelections.Alex) {
    //   showToast.error("Please select a alex voice");
    // } else if (!narrationSelections.Taylor) {
    //   showToast.error("Please select a Taylor");
    // } else if (!voiceSelections.Taylor) {
    //   showToast.error("Please select a taylor voice");
    // }
    else {
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

  // const previewVoices = audioPreviewData?.voices;
  // const getPreviewUrl = (voiceName) => {
  //   return previewVoices?.find((v) => v.name === voiceName)?.s3_url || "";
  // };

  const getPreviewUrl = (voiceName) => {
    const opt = voiceOptions.find((v) => v.value === voiceName);
    return opt?.s3_url || "";
  };

  const handleCreateTransition = () => {
    // navigate("/animation-page")
    navigateTo(`/animation-page/${id}`);
  };

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

              {sortedLabels &&
                sortedLabels?.length > 0 &&
                sortedLabels?.map((charName, index) => (
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
                        // options={voiceOptions}
                        // options={voiceOptions.map((opt) => ({
                        //   ...opt,
                        //   disabled: voiceSelections[charName] !== opt.value,
                        // }))}
                        options={
                          audioAnimationData?.scenes === null
                            ? voiceOptions // First time → all options enabled
                            : voiceOptions.map((opt) => ({
                                ...opt,
                                disabled:
                                  voiceSelections[charName] !== opt.value,
                              }))
                        }
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
                  disabled={
                    !audioAnimationData?.scenes &&
                    !audioAnimationData?.scenes?.length > 0
                  }
                  // label={audioAnimationLoader ? "Submit" : "Submitting"}
                  label={"Create Transition"}
                  sx={{ textTransform: "none", backgroundColor: "#99d539" }}
                  className={styles.createBtn}
                  action={handleCreateTransition}
                />

                <ButtonComp
                  // disabled={audioAnimationLoader}
                  // label={audioAnimationLoader ? "Submit" : "Submitting"}
                  label={"Submit"}
                  sx={{ textTransform: "none" }}
                  className={styles.submitBtn}
                  action={handleSubmit}
                  disabled={audioAnimationData?.scenes?.length > 0}
                />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </Box>
    </>
  );
};

export default AudioAnimationPage;
