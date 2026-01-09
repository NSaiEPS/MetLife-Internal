import React, { useEffect, useState } from "react";
import styles from "./audioAnimation.module.css";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import FullScreenGradientLoader from "../../components/common/GradientLoader";
import Footer from "../../components/common/mainFooter";
import SelectComp from "../../components/common/select";
import ButtonComp from "../../components/common/Buton/Button";
import { Box, Typography, Grid } from "@mui/material";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  getAudioDetails,
  postGenerateVoiceAndAudio,
  setSceneData,
  setVideoAnimationData,
  setGeneratedVideoData,
  postGenerateVideoBatch,
} from "../../redux/features/audioAnimationSlice";
import { showToast } from "../../utils/toast";
import { navigateTo } from "../../utils/navigate";
import { NoDataMessage } from "../../components/common/NoDataMessage";
import VoicePlayer from "../../components/common/VoicePlayer/VoicePlayer";
import SelectWithAudio from "../../components/common/VoicePlayer/SelectWIthAudio";
// azure voices (English and Spanish)
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
// VoiceMaker Voices - English
import voiceMaker1 from "../../assets/voice_preview_voicemaker_ai2-Stacy.wav";
import voiceMaker2 from "../../assets/voice_preview_voicemaker_ai3-Jony.wav";
//Speechify voices - English
import speechify1 from "../../assets/voice_preview_speechify_oliver.wav";
import speechify2 from "../../assets/voice_preview_speechify_emily.wav";
import speechify3 from "../../assets/voice_preview_speechify_henry.wav";
//Spanish voice options for voicemaker
import voiceMakerSpanish1 from "../../assets/voice_preview_voicemaker_ai3-es-ES-Alvaro.wav";
import voiceMakerSpanish2 from "../../assets/voice_preview_voicemaker_ai3-es-ES-Elvira.wav";
//Spanish voice options for speechify
import speechifySpanish1 from "../../assets/voice_preview_speechify_alejandro.wav";
import speechifySpanish2 from "../../assets/voice_preview_speechify_celia.wav";

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

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

const VOICE_GENDER_MAP: Record<string, "male" | "female"> = {
  //  Azure
  "en-US-JennyNeural": "female",
  "en-US-AriaNeural": "female",
  "en-US-SaraNeural": "female",
  "en-US-GuyNeural": "male",
  "en-US-DavisNeural": "male",
  // spanish options
  "es-MX-JorgeNeural": "male",
  "es-MX-DaliaNeural": "female",
  "es-ES-ElviraNeural": "female",
  "es-ES-ArnauNeural": "male",
  "es-ES-AlvaroNeural": "male",
  "es-ES-AbrilNeural": "female",

  //  Speechify
  oliver: "male",
  henry: "male",
  emily: "female",
  alejandro: "male",
  celia: "female",

  //  Voicemaker
  "ai2-Stacy": "female",
  "ai3-Jony": "male",
  "ai3-es-ES-Alvaro": "male",
  "AI3-ES-ES-Elvira": "female",
};

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
        s3_url: speechify1,
      },
      {
        label: "Emily",
        value: "emily",
        s3_url: speechify2,
      },
      {
        label: "Henry",
        value: "henry",
        s3_url: speechify3,
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
        s3_url: speechifySpanish1,
      },
      {
        label: "Celia",
        value: "celia",
        s3_url: speechifySpanish2,
      },
    ],
  },
  voicemaker: {
    english: [
      {
        label: "AI2-Stacy",
        value: "ai2-Stacy",
        s3_url: voiceMaker1,
      },
      {
        label: "AI3-Jony",
        value: "ai3-Jony",
        s3_url: voiceMaker2,
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
        s3_url: voiceMakerSpanish1,
      },
      {
        label: "AI3-ES-ES-Elvira",
        value: "AI3-ES-ES-Elvira",
        s3_url: voiceMakerSpanish2,
      },
    ],
  },
};

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
  const [genderSelections, setGenderSelections] = useState<
    Record<string, string>
  >({});

  const languageOptions = [
    { label: "English", value: "english" },
    { label: "Spanish", value: "spanish" },
  ];

  const [languageSelections, setLanguageSelections] = useState<
    Record<string, "english" | "spanish">
  >({});

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

  console.log(sortedLabels, "check")

  useEffect(() => {
    if (id) {
      // dispatch(getLabels(id));
      dispatch(getAudioDetails(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (!audioAnimationData?.custom_voice_map) {
      setVoiceSelections({});
      return;
    }

    const sanitized: Record<string, string> = {};

    Object.entries(audioAnimationData.custom_voice_map).forEach(
      ([charName, voice]) => {
        const narrationType = narrationSelections[charName];
        const language = languageSelections[charName] || "english";

        const validOptions = allVoiceOptions?.[narrationType]?.[language] || [];

        const exists = validOptions.some((v: any) => v.value === voice);

        sanitized[charName] = exists ? (voice as string) : "";
      }
    );

    setVoiceSelections(sanitized);
  }, [audioAnimationData, narrationSelections, languageSelections]);

  useEffect(() => {
    if (!sortedLabels.length) return;

    setLanguageSelections((prev) => {
      let changed = false;
      const updated = { ...prev };

      sortedLabels.forEach((char) => {
        if (!updated[char]) {
          updated[char] = "english";
          changed = true;
        }
      });

      return changed ? updated : prev;
    });
  }, [sortedLabels]);

  const handleLanguageChange = (
    charName: string,
    value: "english" | "spanish"
    // option: { label: string; value: "english" | "spanish" }
  ) => {
    setLanguageSelections((prev) => ({
      ...prev,
      [charName]: value,
    }));

    setVoiceSelections((prev) => ({
      ...prev,
      [charName]: "",
    }));
  };

  const handleGenderChange = (
    charName: string,
    value: string
    // option: { label: string; value: "male" | "female" }
  ) => {
    const gender = value;
    setGenderSelections((prevGender) => {
      const updatedGender = {
        ...prevGender,
        [charName]: gender,
      };

      setVoiceSelections((prevVoice) => {
        const currentVoice = prevVoice[charName];
        if (!currentVoice) return prevVoice;

        const narrationType = narrationSelections[charName];
        const language = languageSelections[charName] || "english";

        const voices = allVoiceOptions?.[narrationType]?.[language] || [];

        const validVoices = voices.filter(
          (v) => v.value && !v.disabled && VOICE_GENDER_MAP[v.value] === gender
        );

        const stillValid = validVoices.some((v) => v.value === currentVoice);

        if (stillValid) return prevVoice;

        return {
          ...prevVoice,
          [charName]: "",
        };
      });

      return updatedGender;
    });
  };

  const getFilteredVoiceOptions = (charName: string) => {
    const narrationType = narrationSelections[charName];
    if (!narrationType) return [];
    const gender = genderSelections[charName];
    const language = languageSelections[charName] || "english";

    const voices = allVoiceOptions?.[narrationType]?.[language] || [];

    // remove disabled items
    const selectableVoices = voices.filter((v) => v.value && !v.disabled);

    if (!gender) return selectableVoices;

    return selectableVoices.filter(
      (voice) => VOICE_GENDER_MAP[voice.value] === gender
    );
  };

  const handleNarrationChange = (
    charName: string,
    value: any
    // option: { label: string; value: string }
  ) => {
    setNarrationSelections((prev) => ({
      ...prev,
      [charName]: value,
    }));

    // reset voice because narration source changed
    setVoiceSelections((prev) => ({
      ...prev,
      [charName]: "",
    }));
  };

  const handleVoiceChange = (charName: string, selected: string) => {
    setVoiceSelections((prev) => ({
      ...prev,
      [charName]: selected,
    }));
  };

  const getPreviewUrl = (voiceName: string, options = []) => {
    const all = options;
    const opt = all.find((v) => v.value === voiceName);
    return opt?.s3_url || "";
  };

  // Submit
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
      voice_tool: narrationSelections?.Narrator,
    };

    dispatch(postGenerateVoiceAndAudio(payload));
  };

  // Create transitionn
  const handleCreateTransition = () => {
    dispatch(setSceneData({}));
    dispatch(setVideoAnimationData(null));
    dispatch(setGeneratedVideoData(null));
    const scenesPayload = audioAnimationData?.scenes.map((scene, index) => ({
      scene_id: scene.scene_id,
      start_transition: "none",
      end_transition: "none",
    }));

    const payload = {
      script_id: id,
      scenes: scenesPayload,
    };
    dispatch(postGenerateVideoBatch(payload, successCallBack));
  };

  const successCallBack = () => {
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
                        {/* Script Type */}
                        <Grid size={{ xs: 12, md: 6, lg: 2 }}>
                          <SelectComp
                            label="Character"
                            options={sortedLabels}
                            value={charName}
                              disabled={true}
                          
                            style={true}
                          />
                        </Grid>
                        {/* Slect Tool */}
                        <Grid size={{ xs: 12, md: 6, lg: 2 }}>
                          <SelectComp
                            label="Tool"
                            options={narrationVoiceOptions}
                            value={narrationSelections[charName] || ""}
                            onChange={(value) =>
                              handleNarrationChange(charName, value)
                            }
                            placeholder="Select Tool"
                            style={true}
                          />
                        </Grid>

                        {/* Language */}
                        <Grid size={{ xs: 12, md: 6, lg: 2 }}>
                          <SelectComp
                            label="Language"
                            options={languageOptions}
                            value={languageSelections[charName] || "english"}
                            onChange={(value) =>
                              handleLanguageChange(
                                charName,
                                value as "english" | "spanish"
                              )
                            }
                            placeholder="Select Language"
                            style={true}
                          />
                        </Grid>

                        {/* Gender */}
                        <Grid size={{ xs: 12, md: 6, lg: 2 }}>
                          <SelectComp
                            label="Gender"
                            options={genderOptions}
                            value={genderSelections[charName] || ""}
                            onChange={(value) =>
                              handleGenderChange(
                                charName,
                                value as "male" | "female"
                              )
                            }
                            placeholder="Select Gender"
                            style={true}
                          />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                          <Typography
                            sx={{
                              fontSize: "1rem",
                              fontWeight: 400,
                              mb: "8px",
                              lineHeight: "1.5",
                            }}
                          >
                            Voice options
                          </Typography>
                          <SelectWithAudio
                            disabled={
                              !languageSelections[charName] ||
                              !narrationSelections[charName]
                            }
                            label="Voice Options/Voice Name"
                            options={
                              Array.isArray(audioAnimationData?.scenes) &&
                              audioAnimationData.scenes.length > 0
                                ? getFilteredVoiceOptions(charName).map(
                                    (opt) => ({
                                      ...opt,
                                      disabled:
                                        voiceSelections[charName] !== opt.value,
                                    })
                                  )
                                : getFilteredVoiceOptions(charName)
                            }
                            placeholder="Select Voice"
                            value={voiceSelections[charName] || ""}
                            onChange={(value) =>
                              handleVoiceChange(charName, value)
                            }
                            style={true}
                            getPreviewUrl={(voice) =>
                              getPreviewUrl(
                                voice,
                                getFilteredVoiceOptions(charName)
                              )
                            }
                            customOption
                          />
                        </Grid>
                      </Grid>
                    ))}
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
                        (!audioAnimationData?.scenes &&
                          !audioAnimationData?.scenes?.length > 0) ||
                        audioAnimationLoader
                      }
                      label={"Create Transition"}
                      sx={{ textTransform: "none", backgroundColor: "#99d539" }}
                      className={styles.createBtn}
                      action={handleCreateTransition}
                    >Create Transition</ButtonComp>

                    <ButtonComp
                      label={"Submit"}
                      sx={{ textTransform: "none" }}
                      className={styles.submitBtn}
                      action={handleSubmit}
                      disabled={audioAnimationData?.scenes?.length > 0}
                    >Submit</ButtonComp>
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
