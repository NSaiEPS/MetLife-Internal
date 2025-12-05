import React, { useEffect, useState } from "react";
import styles from "./audioAnimation.module.css";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import { Box, Typography, Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router";
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
  setSceneData,
  setVideoAnimationData,
  setGeneratedVideoData,
} from "../../redux/features/audioAnimationSlice";
import { showToast } from "../../utils/toast";
import VoicePlayer from "../../components/common/VoicePlayer/VoicePlayer";
import SelectWithAudio from "../../components/common/VoicePlayer/SelectWIthAudio";
import { navigateTo } from "../../utils/navigate";
import { NoDataMessage } from "../../components/common/NoDataMessage";

import voice1 from "../../assets/voice_preview_en-US-DavisNeural.wav";
import voice2 from "../../assets/voice_preview_en-US-JennyNeural.wav";
import voice3 from "../../assets/voice_preview_en-US-GuyNeural.wav";
import voice4 from "../../assets/voice_preview_en-US-SaraNeural (1).wav";
import voice5 from "../../assets/voice_preview_en-US-AriaNeural.wav";
import voice6 from "../../assets/voice_preview_es-MX-JorgeNeural.wav";
import voice7 from "../../assets/voice_preview_es-MX-DaliaNeural.wav";
import voice8 from "../../assets/voice_preview_es-ES-ElviraNeural.wav";
import voice9 from "../../assets/voice_preview_es-ES-ArnauNeural.wav";
import voice10 from "../../assets/voice_preview_es-ES-AlvaroNeural.wav";
import voice11 from "../../assets/voice_preview_es-ES-AbrilNeural.wav";
import voice12 from "../../assets/d0081a4a-4922-4fbd-b1a6-0af564cf810a.mp3";
import voice13 from "../../assets/3b043e5b-c661-4546-84d0-21148addc39b.mp3";

interface VoiceOption {
  label: string;
  value: string;
  s3_url: string;
  disabled?: boolean;
}

interface NarrationSelectionType {
  [key: string]: string;
}

interface VoiceSelectionsType {
  [key: string]: string;
}

interface AudioAnimationState {
  audioAnimationLoader: boolean;
  audioAnimationData: any;
  labels: string[];
}

const narrationVoiceOptions = [
  { label: "Azure", value: "azure" },
  { label: "Speechify", value: "speechify" },
  { label: "Voicemaker", value: "voicemaker" },
];

const allVoiceOptions = {
  azure: {
    english: [
      {
        label: "EN-US Jenny Neural",
        value: "en-US-JennyNeural",
        s3_url: voice2,
      },
      {
        label: "EN-US Aria Neural",
        value: "en-US-AriaNeural",
        s3_url: voice5,
      },
      {
        label: "EN-US Sara Neural",
        value: "en-US-SaraNeural",
        s3_url: voice4,
      },
      {
        label: "EN-US Guy Neural",
        value: "en-US-GuyNeural",
        s3_url: voice3,
      },
      {
        label: "EN-US Davis Neural",
        value: "en-US-DavisNeural",
        s3_url: voice1,
      },
    ],
    spanish: [
      {
        label: "Spanish Voice Options",
        disabled: true, // prevents clicking
      },
      {
        label: "es-MX-JorgeNeural",
        value: "es-MX-JorgeNeural",
        s3_url: voice6,
      },
      {
        label: "es-MX-DaliaNeural",
        value: "es-MX-DaliaNeural",
        s3_url: voice7,
      },
      {
        label: "es-ES-ElviraNeural",
        value: "es-ES-ElviraNeural",
        s3_url: voice8,
      },
      {
        label: "es-ES-ArnauNeural",
        value: "es-ES-ArnauNeural",
        s3_url: voice9,
      },
      {
        label: "es-ES-AlvaroNeural",
        value: "es-ES-AlvaroNeural",
        s3_url: voice10,
      },
      {
        label: "es-ES-AbrilNeural",
        value: "es-ES-AbrilNeural",
        s3_url: voice11,
      },
    ],
  },
  speechify: {
    english: [
      {
        label: "Oliver",
        value: "oliver",
        s3_url: voice3,
      },
      {
        label: "Emily",
        value: "emily",
        s3_url: voice5,
      },
    ],
    spanish: [
      {
        label: "Spanish Voice Options",
        disabled: true, // prevents clicking
      },
      {
        label: "Alejandro",
        value: "alejandro",
        s3_url: voice12,
      },
      {
        label: "Celia",
        value: "celia",
        s3_url: voice13,
      },
    ],
  },
  voicemaker: {
    english: [
      {
        label: "AI2-Stacy",
        value: "ai2-Stacy",
        s3_url: voice4,
      },
      {
        label: "AI3-Jony",
        value: "ai3-Jony",
        s3_url: voice1,
      },
    ],
    spanish: [
      {
        label: "Spanish Voice Options",
        disabled: true, // prevents clicking
      },
      {
        label: "AI3-ES-ES-Alvaro",
        value: "ai3-es-ES-Alvaro",
        // s3_url: voice12,
      },
      {
        label: "AI3-ES-ES-Elvira",
        value: "AI3-ES-ES-Elvira",
        // s3_url: voice13,
      },
    ],
  },
};

const voiceOptions = [
  {
    label: "EN-US Jenny Neural",
    value: "en-US-JennyNeural",
    s3_url: voice2,
  },
  {
    label: "EN-US Aria Neural",
    value: "en-US-AriaNeural",
    s3_url: voice5,
  },
  {
    label: "EN-US Sara Neural",
    value: "en-US-SaraNeural",
    s3_url: voice4,
  },
  {
    label: "EN-US Guy Neural",
    value: "en-US-GuyNeural",
    s3_url: voice3,
  },
  {
    label: "EN-US Davis Neural",
    value: "en-US-DavisNeural",
    s3_url: voice1,
  },
  {
    label: "Spanish Voice Options",
    disabled: true, // prevents clicking
  },
  {
    label: "es-MX-JorgeNeural",
    value: "es-MX-JorgeNeural",
    s3_url: voice6,
  },
  {
    label: "es-MX-DaliaNeural",
    value: "es-MX-DaliaNeural",
    s3_url: voice7,
  },
  {
    label: "es-ES-ElviraNeural",
    value: "es-ES-ElviraNeural",
    s3_url: voice8,
  },
  {
    label: "es-ES-ArnauNeural",
    value: "es-ES-ArnauNeural",
    s3_url: voice9,
  },
  {
    label: "es-ES-AlvaroNeural",
    value: "es-ES-AlvaroNeural",
    s3_url: voice10,
  },
  {
    label: "es-ES-AbrilNeural",
    value: "es-ES-AbrilNeural",
    s3_url: voice11,
  },
];

// const voiceOptions: VoiceOption[] = [
//   { label: "EN-US Jenny Neural", value: "en-US-JennyNeural", s3_url: voice1 },
//   { label: "EN-US Aria Neural", value: "en-US-AriaNeural", s3_url: voice2 },
//   { label: "EN-US Sara Neural", value: "en-US-SaraNeural", s3_url: voice3 },
//   { label: "EN-US Guy Neural", value: "en-US-GuyNeural", s3_url: voice4 },
//   { label: "EN-US Davis Neural", value: "en-US-DavisNeural", s3_url: voice5 },
// ];

const AudioAnimationPage: React.FC = () => {
  const [narrationSelections, setNarrationSelections] =
    useState<NarrationSelectionType>({
      Narrator: "azure",
      Alex: "azure",
      Taylor: "azure",
    });

  const [voiceSelections, setVoiceSelections] = useState<VoiceSelectionsType>(
    {}
  );

  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<any>();

  const { audioAnimationLoader, audioAnimationData, labels } = useSelector(
    (store: { AudioAnimation: AudioAnimationState }) => store.AudioAnimation
  );

  const characters =
    audioAnimationData?.voice_map?.characters ||
    audioAnimationData?.Characters ||
    Object.keys(audioAnimationData?.custom_voice_map || {});
  let sortedLabels: string[] = [];

  if (characters && characters.length > 0) {
    sortedLabels = [
      "Narrator",
      ...characters.filter((c: string) => c !== "Narrator"),
    ];
  }

  useEffect(() => {
    if (id) {
      // dispatch(getLabels(id));
      dispatch(getAudioDetails(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (audioAnimationData?.custom_voice_map) {
      setVoiceSelections(audioAnimationData.custom_voice_map);
    } else {
      setVoiceSelections({});
    }
  }, [audioAnimationData]);

  const handleNarrationChange = (charName: string, value: any) => {
    setNarrationSelections((prev) => ({
      ...prev,
      [charName]: value,
    }));
  };

  const handleVoiceChange = (charName: string, selected: string) => {
    setVoiceSelections((prev) => ({
      ...prev,
      [charName]: selected,
    }));
  };

  // const getPreviewUrl = (voiceName: string): string => {
  //   return voiceOptions.find((v) => v.value === voiceName)?.s3_url || "";
  // };

  // const getPreviewUrl = (voiceName: string) => {
  //   // const opt = voiceOptions.find((v) => v.value === voiceName);
  //   // return opt?.s3_url || "";

  //   const all = Object.values(allVoiceOptions).flat();
  //   const opt = all.find((v) => v.value === voiceName);
  //   return opt?.s3_url || "";
  // };

  const getPreviewUrl = (voiceName: string, options = []) => {
    // const opt = voiceOptions.find((v) => v.value === voiceName);
    // return opt?.s3_url || "";

    const all = options;
    const opt = all.find((v) => v.value === voiceName);
    return opt?.s3_url || "";
  };

  const handleSubmit = () => {
    if (!narrationSelections.Narrator) {
      showToast.error("Please select a Narrator");
      return;
    }
    if (!voiceSelections.Narrator) {
      showToast.error("Please select a narrator voice");
      return;
    }
    apiCall();
  };

  const apiCall = () => {
    const custom_voice_map: VoiceSelectionsType = {};

    Object.keys(voiceSelections).forEach((char) => {
      if (voiceSelections[char]) {
        custom_voice_map[char] = voiceSelections[char];
      }
    });

    const payload = {
      script_id: id,
      custom_voice_map,
    };

    dispatch(postGenerateVoiceAndAudio(payload));
  };

  const handleCreateTransition = () => {
    dispatch(setSceneData({}));
    dispatch(setVideoAnimationData(null));
    dispatch(setGeneratedVideoData(null));
    navigateTo(`/animation-page/${id}`);
  };

  return (
    <>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
        <OneFrameHeader />
        {sortedLabels && sortedLabels?.length > 0 ? (
          <>
            {audioAnimationLoader && (
              <FullScreenGradientLoader text="loading..." />
            )}
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

                  {
                    // sortedLabels &&
                    //   sortedLabels?.length > 0 &&
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
                            // options={
                            //   audioAnimationData?.scenes === null
                            //     ? voiceOptions
                            //     : voiceOptions.map((opt) => ({
                            //         ...opt,
                            //         disabled:
                            //           voiceSelections[charName] !== opt.value,
                            //       }))
                            // }
                            options={
                              audioAnimationData?.scenes === null
                                ? allVoiceOptions[narrationSelections[charName]]
                                    ?.english
                                : allVoiceOptions[
                                    narrationSelections[charName]
                                  ]?.english?.map((opt) => ({
                                    ...opt,
                                    disabled:
                                      voiceSelections[charName] !== opt.value,
                                  }))
                            }
                            placeholder="Select Voice"
                            value={voiceSelections[charName] || ""}
                            onChange={(value) =>
                              handleVoiceChange(charName, value)
                            }
                            style={true}
                            // getPreviewUrl={(voice) => getPreviewUrl(voice)}
                            getPreviewUrl={(voice) =>
                              getPreviewUrl(
                                voice,
                                allVoiceOptions[narrationSelections[charName]]
                                  ?.english
                              )
                            }
                            customOption
                          />
                        </Grid>
                      </Grid>
                    ))
                  }
                  {audioAnimationData?.scenes &&
                  audioAnimationData?.scenes?.length > 0 ? (
                    <>
                      <Typography
                        sx={{ fontSize: "20px", fontWeight: 500, mt: 4 }}
                      >
                        Available Voices
                      </Typography>
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        {audioAnimationData?.scenes?.map(
                          (scene: any, idx: number) => (
                            <Grid
                              item
                              xs={12}
                              md={6}
                              lg={4}
                              key={idx}
                              sx={{ width: "100%" }}
                            >
                              <VoicePlayer
                                index={idx}
                                description={scene.description}
                                s3_url={scene.final_audio_s3_url}
                              />
                            </Grid>
                          )
                        )}
                      </Grid>
                    </>
                  ) : (
                    audioAnimationData?.scenes?.length > 0 && (
                      <>
                        <NoDataMessage
                          filter={false}
                          loading={audioAnimationLoader}
                        />
                      </>
                    )
                  )}

                  <div className={styles.actions}>
                    <ButtonComp
                      disabled={
                        !audioAnimationData?.scenes &&
                        !audioAnimationData?.scenes?.length > 0
                      }
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

export default AudioAnimationPage;

// ////////////////////////
