import React, { useEffect, useRef, useState } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import styles from "./audioAnimation.module.css";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import FullScreenGradientLoader from "../../components/common/GradientLoader";
import Footer from "../../components/common/mainFooter";
import SelectComp from "../../components/common/select";
import ButtonComp from "../../components/common/Buton/Button";
import { Box, Typography, Grid, IconButton, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  getAudioDetails,
  postGenerateVoiceAndAudio,
  setSceneData,
  setVideoAnimationData,
  setGeneratedVideoData,
  postGenerateVideoBatch,
  postPreviewAzureVoices,
  getSceneDetails,
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
// arabic male and female voice optios
import voice12 from "../../assets/voice_preview_azure_ar-SA-ZariyahNeural.wav";
import voice13 from "../../assets/voice_preview_azure_ar-SA-HamedNeural.wav";
import voice14 from "../../assets/voice_preview_azure_ar-EG-SalmaNeural.wav";
import voice15 from "../../assets/voice_preview_azure_ar-EG-ShakirNeural.wav";
// Hindi male and female voice optios
import voice16 from "../../assets/voice_preview_azure_hi-IN-SwaraNeural.wav";
import voice17 from "../../assets/voice_preview_azure_hi-IN-MadhurNeural.wav";
// Nepali male and Female voices
import voice18 from "../../assets/voice_preview_azure_ne-NP-HemkalaNeural.wav";
import voice19 from "../../assets/voice_preview_azure_ne-NP-SagarNeural.wav";
// Portuguese male and Female voices
import voice20 from "../../assets/voice_preview_azure_pt-PT-RaquelNeural.wav";
import voice21 from "../../assets/voice_preview_azure_pt-PT-DuarteNeural.wav";
import voice22 from "../../assets/voice_preview_azure_pt-BR-FranciscaNeural.wav";
import voice23 from "../../assets/voice_preview_azure_pt-BR-AntonioNeural.wav";
// Romanian male and Female voices
import voice24 from "../../assets/voice_preview_azure_ro-RO-AlinaNeural.wav";
import voice25 from "../../assets/voice_preview_azure_ro-RO-EmilNeural.wav";
// Ukrainian
import voice26 from "../../assets/voice_preview_azure_uk-UA-PolinaNeural.wav";
import voice27 from "../../assets/voice_preview_azure_uk-UA-OstapNeural.wav";
// Bangla
import voice28 from "../../assets/voice_preview_azure_bn-IN-TanishaaNeural.wav";
import voice29 from "../../assets/voice_preview_azure_bn-IN-BashkarNeural.wav";
import voice30 from "../../assets/voice_preview_azure_bn-BD-NabanitaNeural.wav";
import voice31 from "../../assets/voice_preview_azure_bn-BD-PradeepNeural.wav";
// VoiceMaker Voices - English
import voiceMaker1 from "../../assets/voice_preview_voicemaker_ai2-Stacy.wav";
import voiceMaker2 from "../../assets/voice_preview_voicemaker_ai3-Jony.wav";
//VoiceMaker voices bangla
import voiceMakerBangla1 from "../../assets/voice_preview_voicemaker_ai2-bn-IN-Binod.wav";
import voiceMakerBangla2 from "../../assets/voice_preview_voicemaker_ai2-bn-IN-Charu.wav";
//VoiceMaker voices ukrainian
import voiceMakerUkrainian from "../../assets/voice_preview_voicemaker_ai2-uk-UA-Aleksandra.wav";
//VoiceMaker voices romannian
import voiceMakerRomanian from "../../assets/voice_preview_voicemaker_ai2-ro-RO-Corina.wav";
//VoiceMaker voices portugal
import voiceMakerPortugal1 from "../../assets/voice_preview_voicemaker_ai2-pt-PT-Diogo.wav";
import voiceMakerPortugal2 from "../../assets/voice_preview_voicemaker_ai2-pt-PT-Margarida.wav";
//VoiceMaker voices hindi
import voiceMakerHindi1 from "../../assets/voice_preview_voicemaker_ai2-hi-IN-Nikhil.wav";
import voiceMakerHindi2 from "../../assets/voice_preview_voicemaker_ai2-hi-IN-Zoya.wav";
import voiceMakerArabic1 from "../../assets/voice_preview_voicemaker_ai2-ar-XA-Nadir.wav";
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
// Speechify options hindi
import speechifyHindi1 from "../../assets/voice_preview_speechify_hemant.wav";
import speechifyHindi2 from "../../assets/voice_preview_speechify_priya.wav";
// Speechify options banngla
import speechifyBangla1 from "../../assets/voice_preview_speechify_avik.wav";
import speechifyBangla2 from "../../assets/voice_preview_speechify_brishti.wav";
// Speechify options nepali
import speechifyNepali1 from "../../assets/voice_preview_speechify_suman.wav";
import speechifyNepali2 from "../../assets/voice_preview_speechify_anita.wav";
// portuguese
import speechifyPortuguese1 from "../../assets/voice_preview_speechify_joao.wav";
import { postTranslatedDataSave } from "../../redux/features/saveSlice";
import {
  IoArrowBackCircleOutline,
  IoArrowForwardCircleOutline,
} from "react-icons/io5";

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

type CustomVoiceMapPayload = {
  [charName: string]: {
    voice: string;
    voice_tool: string;
  };
};

const narrationVoiceOptions = [
  { label: "Azure", value: "azure" },
  { label: "Speechify", value: "speechify" },
  { label: "Voicemaker", value: "voicemaker" },
];

// const genderOptions = [
//   { label: "Male", value: "male" },
//   { label: "Female", value: "female" },
// ];

const VOICE_GENDER_MAP: Record<string, "male" | "female"> = {
  //  Azure
  "en-US-JennyNeural": "female",
  "en-US-AriaNeural": "female",
  "en-US-SaraNeural": "female",
  "en-US-GuyNeural": "male",
  "en-US-DavisNeural": "male",
  "hi-IN-SwaraNeural": "female",
  "hi-IN-MadhurNeural": "male",
  "es-MX-JorgeNeural": "male",
  "es-MX-DaliaNeural": "female",
  "es-ES-ElviraNeural": "female",
  "es-ES-ArnauNeural": "male",
  "es-ES-AlvaroNeural": "male",
  "es-ES-AbrilNeural": "female",
  "ar-SA-ZariyahNeural": "female",
  "ar-SA-HamedNeural": "male",
  "ar-EG-SalmaNeural": "female",
  "ar-EG-ShakirNeural": "male",
  "ne-NP-HemkalaNeural": "female",
  "ne-NP-SagarNeural": "male",
  "pt-PT-RaquelNeural": "female",
  "pt-PT-DuarteNeural": "male",
  "pt-BR-FranciscaNeural": "female",
  "pt-BR-AntonioNeural": "male",

  "ro-RO-AlinaNeural": "female",
  "ro-RO-EmilNeural": "male",
  "uk-UA-PolinaNeural": "female",
  "uk-UA-OstapNeural": "male",

  "bn-IN-TanishaaNeural": "female",
  "bn-IN-BashkarNeural": "male",
  "bn-BD-NabanitaNeural": "female",
  "bn-BD-PradeepNeural": "male",
  // spanish options
  // "es-MX-JorgeNeural": "male",
  // "es-MX-DaliaNeural": "female",
  // "es-ES-ElviraNeural": "female",
  // "es-ES-ArnauNeural": "male",
  // "es-ES-AlvaroNeural": "male",
  // "es-ES-AbrilNeural": "female",

  //  Speechify
  oliver: "male",
  emily: "female",
  henry: "male",
  joao: "male",
  hemant: "male",
  priya: "female",
  avik: "male",
  brishti: "female",
  suman: "male",
  anita: "female",
  alejandro: "male",
  celia: "female",

  //  Voicemaker
  "ai2-Stacy": "female",
  "ai3-Jony": "male",

  "ai3-es-ES-Alvaro": "male",
  "AI3-ES-ES-Elvira": "female",

  "ai2-bn-IN-Binod": "male",
  "ai2-bn-IN-Charu": "female",

  "ai2-uk-UA-Aleksandra": "female",
  "ai2-ro-RO-Corina": "female",

  "ai2-pt-PT-Diogo": "male",
  "ai2-pt-PT-Margarida": "female",

  "ai2-hi-IN-Nikhil": "male",
  "ai2-hi-IN-Zoya": "female",

  "ai2-ar-XA-Nadir": "male",
};

const allVoiceOptions = {
  azure: {
    english: [
      {
        label: "EN-US Jenny Neural",
        value: "en-US-JennyNeural",
        gender: "female",
        s3_url: voice2,
      },
      {
        label: "EN-US Aria Neural",
        value: "en-US-AriaNeural",
        gender: "female",
        s3_url: voice5,
      },
      {
        label: "EN-US Sara Neural",
        value: "en-US-SaraNeural",
        gender: "female",
        s3_url: voice4,
      },
      {
        label: "EN-US Guy Neural",
        value: "en-US-GuyNeural",
        gender: "male",
        s3_url: voice3,
      },
      {
        label: "EN-US Davis Neural",
        value: "en-US-DavisNeural",
        gender: "male",
        s3_url: voice1,
      },
    ],

    spanish: [
      {
        label: "Spanish Voice Options",
        disabled: true,
      },
      {
        label: "es-MX-JorgeNeural",
        value: "es-MX-JorgeNeural",
        gender: "male",
        s3_url: voice6,
      },
      {
        label: "es-MX-DaliaNeural",
        value: "es-MX-DaliaNeural",
        gender: "female",
        s3_url: voice7,
      },
      {
        label: "es-ES-ElviraNeural",
        value: "es-ES-ElviraNeural",
        gender: "female",
        s3_url: voice8,
      },
      {
        label: "es-ES-ArnauNeural",
        value: "es-ES-ArnauNeural",
        gender: "male",
        s3_url: voice9,
      },
      {
        label: "es-ES-AlvaroNeural",
        value: "es-ES-AlvaroNeural",
        gender: "male",
        s3_url: voice10,
      },
      {
        label: "es-ES-AbrilNeural",
        value: "es-ES-AbrilNeural",
        gender: "male",
        s3_url: voice11,
      },
    ],

    arabic: [
      {
        label: "Arabic Voice Options",
        disabled: true,
      },
      {
        label: "AR-SA Zariyah Neural",
        value: "ar-SA-ZariyahNeural",
        gender: "female",
        s3_url: voice12,
      },
      {
        label: "AR-SA Hamed Neural",
        value: "ar-SA-HamedNeural",
        gender: "male",
        s3_url: voice13,
      },
      {
        label: "AR-EG Salma Neural",
        value: "ar-EG-SalmaNeural",
        gender: "female",
        s3_url: voice14,
      },
      {
        label: "AR-EG Shakir Neural",
        value: "ar-EG-ShakirNeural",
        gender: "male",
        s3_url: voice15,
      },
    ],

    hindi: [
      {
        label: "Hindi Voice Options",
        disabled: true,
      },
      {
        label: "HI-IN Swara Neural",
        value: "hi-IN-SwaraNeural",
        gender: "female",
        s3_url: voice16,
      },
      {
        label: "HI-IN Madhur Neural",
        value: "hi-IN-MadhurNeural",
        gender: "male",
        s3_url: voice17,
      },
    ],

    nepali: [
      {
        label: "Nepali Voice Options",
        disabled: true,
      },
      {
        label: "NE-NP Hemkala Neural",
        value: "ne-NP-HemkalaNeural",
        gender: "female",
        s3_url: voice18,
      },
      {
        label: "NE-NP Sagar Neural",
        value: "ne-NP-SagarNeural",
        gender: "male",
        s3_url: voice19,
      },
    ],

    portuguese: [
      {
        label: "Portuguese Voice Options",
        disabled: true,
      },
      {
        label: "PT-PT Raquel Neural",
        value: "pt-PT-RaquelNeural",
        gender: "female",
        s3_url: voice20,
      },
      {
        label: "PT-PT Duarte Neural",
        value: "pt-PT-DuarteNeural",
        gender: "male",

        s3_url: voice21,
      },
      {
        label: "PT-BR Francisca Neural",
        value: "pt-BR-FranciscaNeural",
        gender: "female",

        s3_url: voice22,
      },
      {
        label: "PT-BR Antonio Neural",
        value: "pt-BR-AntonioNeural",
        gender: "male",

        s3_url: voice23,
      },
    ],

    romanian: [
      {
        label: "Romanian Voice Options",
        disabled: true,
      },
      {
        label: "RO-RO Alina Neural",
        value: "ro-RO-AlinaNeural",
        gender: "female",

        s3_url: voice24,
      },
      {
        label: "RO-RO Emil Neural",
        value: "ro-RO-EmilNeural",
        gender: "male",
        s3_url: voice25,
      },
    ],

    ukrainian: [
      {
        label: "Ukrainian Voice Options",
        disabled: true,
      },
      {
        label: "UK-UA Polina Neural",
        value: "uk-UA-PolinaNeural",
        s3_url: voice26,
        gender: "female",
      },
      {
        label: "UK-UA Ostap Neural",
        value: "uk-UA-OstapNeural",
        gender: "male",

        s3_url: voice27,
      },
    ],

    bangla: [
      {
        label: "Bangla Voice Options",
        disabled: true,
      },
      {
        label: "BN-IN Tanishaa Neural",
        value: "bn-IN-TanishaaNeural",
        gender: "female",
        s3_url: voice28,
      },
      {
        label: "BN-IN Bashkar Neural",
        value: "bn-IN-BashkarNeural",
        gender: "male",
        s3_url: voice29,
      },
      {
        label: "BN-BD Nabanita Neural",
        value: "bn-BD-NabanitaNeural",
        gender: "female",
        s3_url: voice30,
      },
      {
        label: "BN-BD Pradeep Neural",
        value: "bn-BD-PradeepNeural",
        gender: "male",
        s3_url: voice31,
      },
    ],
  },
  speechify: {
    english: [
      {
        label: "Oliver",
        value: "oliver",
        s3_url: speechify1,
        gender: "male",
      },
      {
        label: "Emily",
        value: "emily",
        s3_url: speechify2,
        gender: "female",
      },
      {
        label: "Henry",
        value: "henry",
        s3_url: speechify3,
        gender: "male",
      },
    ],
    portuguese: [
      {
        label: "Joao",
        value: "joao",
        s3_url: speechifyPortuguese1,
        gender: "male",
      },
    ],
    hindi: [
      {
        label: "Hemant",
        value: "hemant",
        gender: "male",
        s3_url: speechifyHindi1,
      },
      {
        label: "Priya",
        value: "priya",
        gender: "female",
        s3_url: speechifyHindi2,
      },
    ],
    bangla: [
      {
        label: "Avik",
        value: "avik",
        s3_url: speechifyBangla1,
        gender: "male",
      },
      {
        label: "Brishti",
        value: "brishti",
        gender: "female",

        s3_url: speechifyBangla2,
      },
    ],
    nepali: [
      {
        label: "Suman",
        value: "suman",
        s3_url: speechifyNepali1,
        gender: "female",
      },
      {
        label: "Anita",
        value: "anita",
        gender: "female",
        s3_url: speechifyNepali2,
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
        gender: "male",
        s3_url: speechifySpanish1,
      },
      {
        label: "Celia",
        value: "celia",
        gender: "female",
        s3_url: speechifySpanish2,
      },
    ],
  },
  voicemaker: {
    english: [
      {
        label: "AI2-Stacy",
        value: "ai2-Stacy",
        gender: "female",
        s3_url: voiceMaker1,
      },
      {
        label: "AI3-Jony",
        value: "ai3-Jony",
        gender: "male",
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
        gender: "male",
        s3_url: voiceMakerSpanish1,
      },
      {
        label: "AI3-ES-ES-Elvira",
        value: "AI3-ES-ES-Elvira",
        gender: "female",
        s3_url: voiceMakerSpanish2,
      },
    ],
    bangla: [
      {
        label: "Spanish Voice Options",
        disabled: true,
      },
      {
        label: "AI2-BN-IN-Binod",
        value: "ai2-bn-IN-Binod",
        gender: "male",

        s3_url: voiceMakerBangla1,
      },
      {
        label: "AI2-BN-IN-Charu",
        value: "ai2-bn-IN-Charu",
        gender: "female",

        s3_url: voiceMakerBangla2,
      },
    ],
    ukrainian: [
      {
        label: "Spanish Voice Options",
        disabled: true,
      },
      {
        label: "AI2-UK-UA-Aleksandra",
        value: "ai2-uk-UA-Aleksandra",
        gender: "female",
        s3_url: voiceMakerUkrainian,
      },
    ],
    romanian: [
      {
        label: "Spanish Voice Options",
        disabled: true,
      },
      {
        label: "AI2-uk-RO-Corina",
        value: "ai2-ro-RO-Corina",
        gender: "female",
        s3_url: voiceMakerRomanian,
      },
    ],
    portuguese: [
      {
        label: "Spanish Voice Options",
        disabled: true,
      },
      {
        label: "AI2-pt-PT-Diogo",
        value: "ai2-pt-PT-Diogo",
        s3_url: voiceMakerPortugal1,
        gender: "male",
      },
      {
        label: "AI2-pt-PT-Margarida",
        value: "ai2-pt-PT-Margarida",
        s3_url: voiceMakerPortugal2,
        gender: "female",
      },
    ],
    hindi: [
      {
        label: "Spanish Voice Options",
        disabled: true,
      },
      {
        label: "AI2-hi-IN-Nikhil",
        value: "ai2-hi-IN-Nikhil",
        gender: "male",
        s3_url: voiceMakerHindi1,
      },
      {
        label: "AI2-HI-IN-Zoya",
        value: "ai2-hi-IN-Zoya",
        gender: "female",
        s3_url: voiceMakerHindi2,
      },
    ],
    arabic: [
      {
        label: "Spanish Voice Options",
        disabled: true,
      },
      {
        label: "AI2-ar-XA-Nadir",
        value: "ai2-ar-XA-Nadir",
        s3_url: voiceMakerArabic1,
        gender: "male",
      },
    ],
  },
};

const voiceToneOptions = [
  { label: "Neutral", value: "neutral" },
  { label: "Cheerful", value: "cheerful" },
  { label: "Calm", value: "calm" },
  { label: "Professional", value: "professional" },
  { label: "Empathetic", value: "empathetic" },
  { label: "Serious", value: "serious" },
  { label: "Excited", value: "excited" },
  { label: "Friendly", value: "friendly" },
];

const voiceSpeedOptions = [
  { label: "0.5x", value: 0.5 },
  { label: "0.75x", value: 0.75 },
  { label: "1x", value: 1 },
  { label: "1.25x", value: 1.25 },
  // { label: "1.5x", value: 1.5 },
  // { label: "1.75x", value: 1.75 },
  // { label: "2x", value: 2 },
];

const LANGUAGE_MAP: Record<string, string> = {
  English: "english",
  Hindi: "hindi",
  Arabic: "arabic",
  Spanish: "spanish",
  Bangla: "bangla",
  Nepali: "nepali",
  Portuguese: "portuguese",
  Romanian: "romanian",
  Ukrainian: "ukrainian",
};

const AudioAnimationPage: React.FC = () => {
  const [narrationSelections, setNarrationSelections] =
    useState<NarrationSelectionType>({
      Narrator: "azure",
      Alex: "azure",
      Taylor: "azure",
    });

  const [voiceSelections, setVoiceSelections] = useState<VoiceSelectionsType>(
    {},
  );
  const [genderSelections, setGenderSelections] = useState<
    Record<string, string>
  >({});

  // const languageOptions = [
  //   { label: "English", value: "english" },
  //   { label: "Hindi", value: "hindi" },
  //   { label: "Arabic", value: "arabic" },
  //   { label: "Nepali", value: "nepali" },
  //   { label: "Bangla", value: "bangla" },
  //   { label: "Spanish", value: "spanish" },
  //   { label: "Portuguese", value: "portuguese" },
  //   { label: "Romanian", value: "romanian" },
  //   { label: "Ukrainian", value: "ukrainian" },
  // ];

  const [languageSelections, setLanguageSelections] = useState<
    Record<string, "english" | "spanish">
  >({});

  const [voiceToneSelections, setVoiceToneSelections] = useState<
    Record<string, string>
  >({});

  const [voiceSpeedSelections, setVoiceSpeedSelections] = useState<
    Record<string, number>
  >({});

  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const {
    audioAnimationLoader,
    audioAnimationData,
    videoAnimationLoader,
    labels,
    audioAzurePreviewData,
    sceneData,
  } = useSelector(
    (store: { AudioAnimation: AudioAnimationState }) => store.AudioAnimation,
  );

  const { saveLoader, saveTranslatedData } = useSelector(
    (store) => store.SaveTranslatedData,
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoExists = sceneData?.video_exists;
  const language = sceneData?.language;
  // console.log(language, "check_language")
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

  // const [voiceSpeedSelections, setVoiceSpeedSelections] = useState<
  //   Record<string, number>
  // >(() => {
  //   const initial: Record<string, number> = {};
  //   characters.forEach((char) => {
  //     initial[char.name] = 1;
  //   });
  //   return initial;
  // });

  useEffect(() => {
    if (audioAzurePreviewData?.s3_url) {
      if (audioRef.current) {
        audioRef.current.src = audioAzurePreviewData.s3_url;
        audioRef.current.play().catch((err) => {
          console.error("Audio play failed:", err);
        });
      }
    }
  }, [audioAzurePreviewData?.s3_url]);

  useEffect(() => {
    if (id) {
      // dispatch(getLabels(id));
      dispatch(getSceneDetails(id));
      dispatch(getAudioDetails(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (!audioAnimationData?.custom_voice_map) {
      setVoiceSelections({});
      return;
    }

    const sanitized: Record<string, string> = {};
    const language = getVoiceLanguage();

    Object.entries(audioAnimationData.custom_voice_map).forEach(
      ([charName, voice]) => {
        const narrationType = narrationSelections[charName];
        // const language = languageSelections[charName] || "english";

        const validOptions = allVoiceOptions?.[narrationType]?.[language] || [];

        const exists = validOptions.some((v: any) => v.value === voice);

        sanitized[charName] = exists ? (voice as string) : "";
      },
    );

    setVoiceSelections(sanitized);
  }, [audioAnimationData, narrationSelections, sceneData?.language]);

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

  const enrichVoicesWithGender = (voices = []) =>
    voices
      .filter((v) => !v.disabled)
      .map((v) => ({
        ...v,
        gender: VOICE_GENDER_MAP[v.value],
      }));

  // const getVoiceLanguage = () => {
  //   const raw = sceneData?.language;
  //   return raw ? LANGUAGE_MAP[raw] : undefined;
  // };

  const getVoiceLanguage = () => {
    const raw = sceneData?.language;
    return LANGUAGE_MAP[raw] || "english";
  };

  const getGenderOptions = (charName: string) => {
    const narrationType = narrationSelections[charName];
    const language = getVoiceLanguage();
    const voices = allVoiceOptions?.[narrationType]?.[language] || [];

    const hasMale = voices.some((v) => VOICE_GENDER_MAP[v.value] === "male");

    const hasFemale = voices.some(
      (v) => VOICE_GENDER_MAP[v.value] === "female",
    );

    return [
      {
        label: "Male",
        value: "male",
        disabled: !hasMale,
      },
      {
        label: "Female",
        value: "female",
        disabled: !hasFemale,
      },
    ];
  };

  // const handleLanguageChange = (
  //   charName: string,
  //   value: "english" | "spanish",
  //   // option: { label: string; value: "english" | "spanish" }
  // ) => {
  //   setLanguageSelections((prev) => ({
  //     ...prev,
  //     [charName]: value,
  //   }));

  //   setVoiceSelections((prev) => ({
  //     ...prev,
  //     [charName]: "",
  //   }));
  // };

  // const handleGenderChange = (
  //   charName: string,
  //   value: string,
  //   // option: { label: string; value: "male" | "female" }
  // ) => {
  //   const gender = value;
  //   setGenderSelections((prevGender) => {
  //     const updatedGender = {
  //       ...prevGender,
  //       [charName]: gender,
  //     };

  //     setVoiceSelections((prevVoice) => {
  //       const currentVoice = prevVoice[charName];
  //       if (!currentVoice) return prevVoice;

  //       const narrationType = narrationSelections[charName];
  //       // const language = languageSelections[charName] || "english";
  //       const language = getVoiceLanguage();

  //       const voices = allVoiceOptions?.[narrationType]?.[language] || [];

  //       const validVoices = voices.filter(
  //         (v) => v.value && !v.disabled && VOICE_GENDER_MAP[v.value] === gender,
  //       );

  //       const stillValid = validVoices.some((v) => v.value === currentVoice);

  //       if (stillValid) return prevVoice;

  //       return {
  //         ...prevVoice,
  //         [charName]: "",
  //       };
  //     });

  //     return updatedGender;
  //   });
  // };

  const handleGenderChange = (charName: string, gender: "male" | "female") => {
    setGenderSelections((prevGender) => ({
      ...prevGender,
      [charName]: gender,
    }));

    setVoiceSelections((prevVoice) => {
      const currentVoice = prevVoice[charName];
      if (!currentVoice) return prevVoice;

      const narrationType = narrationSelections[charName];
      const language = getVoiceLanguage();

      const voices = allVoiceOptions?.[narrationType]?.[language] || [];

      const isStillValid = voices.some(
        (v) => v.value === currentVoice && VOICE_GENDER_MAP[v.value] === gender,
      );

      if (isStillValid) return prevVoice;

      return {
        ...prevVoice,
        [charName]: "",
      };
    });
  };

  // const getFilteredVoiceOptions = (charName: string) => {
  //   const narrationType = narrationSelections[charName];
  //   if (!narrationType) return [];
  //   const gender = genderSelections[charName];
  //   // const language = languageSelections[charName] || "english";
  //   const language = getVoiceLanguage();

  //   if (!language) return [];

  //   const voices = allVoiceOptions?.[narrationType]?.[language] || [];

  //   // remove disabled items
  //   const selectableVoices = voices.filter((v) => v.value && !v.disabled);

  //   if (!gender) return selectableVoices;

  //   return selectableVoices.filter(
  //     (voice) => VOICE_GENDER_MAP[voice.value] === gender,
  //   );
  // };
  // const getFilteredVoiceOptions = (charName: string) => {
  //   const narrationType = narrationSelections[charName];
  //   const language = getVoiceLanguage();
  //   const gender = genderSelections[charName];

  //   // let voices = allVoiceOptions?.[narrationType]?.[language] || [];

  //   // if (gender) {
  //   //   voices = voices.filter((v) => VOICE_GENDER_MAP[v.value] === gender);
  //   // }

  //   if (gender) {
  //     voices = voices.filter(
  //       (v) =>
  //         VOICE_GENDER_MAP[v.value] === gender ||
  //         VOICE_GENDER_MAP[v.value] === undefined, // 👈 KEY FIX
  //     );
  //   }

  //   return voices;
  // };

  const getFilteredVoiceOptions = (charName: string) => {
    const narrationType = narrationSelections[charName];
    const language = getVoiceLanguage();
    const gender = genderSelections[charName];

    const rawVoices = allVoiceOptions?.[narrationType]?.[language] || [];
    const voices = enrichVoicesWithGender(rawVoices);

    return gender ? voices.filter((v) => v.gender === gender) : voices;
  };

  const handleNarrationChange = (
    charName: string,
    value: any,
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

  // Voice notes
  const handleVoiceToneChange = (charName: string, tone: string) => {
    setVoiceToneSelections((prev) => ({
      ...prev,
      [charName]: tone,
    }));
  };

  const handleVoiceSpeedChange = (charName: string, value: number) => {
    setVoiceSpeedSelections((prev) => ({
      ...prev,
      [charName]: value,
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
    // ** Old functionality **
    // const custom_voice_map: VoiceSelectionsType = {};
    // Object.keys(voiceSelections).forEach((char) => {
    //   if (voiceSelections[char]) {
    //     custom_voice_map[char] = voiceSelections[char];
    //   }
    // });

    // const payload = {
    //   script_id: id,
    //   custom_voice_map,
    //   voice_tool: narrationSelections?.Narrator,
    // };
    // console.log(payload, "payload");

    const custom_voice_map: CustomVoiceMapPayload = {};
    Object.keys(voiceSelections).forEach((charName) => {
      const voice = voiceSelections[charName];
      const voiceTool = narrationSelections[charName];
      const voiceTone = voiceToneSelections?.[charName];
      const voiceSpeed = voiceSpeedSelections?.[charName];

      if (voice && voiceTool) {
        custom_voice_map[charName] = {
          voice,
          voice_tool: voiceTool,
          ...(voiceTool === "azure" && voiceTone
            ? { voice_tone: voiceTone }
            : {}),
          ...(voiceTool === "azure" && typeof voiceSpeed !== undefined
            ? { voice_speed: voiceSpeed }
            : {}),
        };
      }
    });
    const payload = {
      script_id: id,
      custom_voice_map,
    };
    // console.log("FINAL_PAYLOAD", payload);

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

  const handleSave = () => {
    const { title, ...rest } = audioAnimationData;

    const data = {
      data: {
        ...rest,
        script_id: id,
        title: title,
        page: "audio",
      },
      is_save_action: true,
    };
    dispatch(postTranslatedDataSave(data, id));
  };

  const handlePreview = (charName: string) => {
    const selectedVoice = voiceSelections?.[charName];
    const selectedTone = voiceToneSelections?.[charName];
    const selectedSpeed = voiceSpeedSelections?.[charName] ?? 1;

    if (!selectedTone) {
      showToast.error("Please select a voice tone");
      return;
    }

    if (selectedSpeed === undefined || selectedSpeed === null) {
      showToast.error("Please select voice speed");
      return;
    }

    if (!selectedVoice) {
      showToast.error("Please select a voice first");
      return;
    }

    const payload = {
      voice: voiceSelections?.[charName], // "en-US-GuyNeural"
      voice_tone: voiceToneSelections?.[charName], // "calm"
      voice_speed: voiceSpeedSelections?.[charName],
      text: "This is a preview of selected tone",
    };

    if (!payload.voice) {
      console.warn("Voice not selected for", charName);
      return;
    }

    dispatch(postPreviewAzureVoices(payload));
  };

  return (
    <>
      {saveLoader && <FullScreenGradientLoader text="loading..." />}
      <audio ref={audioRef} />
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
        {sortedLabels && sortedLabels?.length > 0 ? (
          <>
            {(audioAnimationLoader || videoAnimationLoader) && (
              <FullScreenGradientLoader text="loading..." />
            )}
            <main className={styles.cardWrap}>
              <div className={styles.card}>
                <div className={styles.headerRow}>
                  {/* <h1 className={styles.title}>Audio & Animation Toolkit</h1> */}
                  <Typography variant="h3">
                    Audio & Animation Toolkit
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      className={styles.icon}
                      onClick={() => navigate(`/generate-visual-page/${id}`)}
                    >
                      <IoArrowBackCircleOutline size={30} /> Back
                    </Button>
                    <Button
                      className={styles.icon}
                      disabled={!videoExists}
                      onClick={() => navigate(`/animation-page/${id}`)}
                    >
                      Next <IoArrowForwardCircleOutline size={30} />
                    </Button>
                  </Box>
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
                        {/* <Grid size={{ xs: 12, md: 6, lg: 2 }}>
                          <SelectComp
                            label="Language"
                            options={languageOptions}
                            value={languageSelections[charName] || language}
                            onChange={(value) =>
                              handleLanguageChange(
                                charName,
                                value as "english" | "spanish",
                              )
                            }
                            disabled={true}
                            placeholder="Select Language"
                            style={true}
                          />
                        </Grid> */}

                        {/* Gender */}
                        <Grid size={{ xs: 12, md: 6, lg: 2 }}>
                          <SelectComp
                            label="Gender"
                            // options={genderOptions}
                            options={getGenderOptions(charName)}
                            // value={genderSelections[charName] || ""}
                            value={genderSelections[charName] || ""}
                            onChange={(value) =>
                              handleGenderChange(
                                charName,
                                value as "male" | "female",
                              )
                            }
                            placeholder="Select Gender"
                            style={true}
                          />
                        </Grid>

                        {/* Voice tone */}
                        <Grid size={{ xs: 12, md: 6, lg: 2 }}>
                          <SelectComp
                            label="Voice Tone"
                            options={voiceToneOptions}
                            value={voiceToneSelections[charName] || ""}
                            onChange={(value) =>
                              handleVoiceToneChange(charName, value as string)
                            }
                            placeholder="Select Voice Tone"
                            style={true}
                            disabled={
                              narrationSelections?.[charName] !== "azure"
                            }
                          />
                        </Grid>

                        {/* Voice speed */}
                        <Grid size={{ xs: 12, md: 6, lg: 1 }}>
                          <SelectComp
                            label="Voice Speed"
                            options={voiceSpeedOptions}
                            value={voiceSpeedSelections[charName] ?? "1"}
                            onChange={(value) =>
                              handleVoiceSpeedChange(charName, value as number)
                            }
                            placeholder="Select Voice Speed"
                            style={true}
                            disabled={
                              narrationSelections?.[charName] !== "azure"
                            }
                          />
                        </Grid>

                        {/* Voice options */}
                        <Grid size={{ xs: 12, md: 6, lg: 2.5 }}>
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
                            // disabled={
                            //   !languageSelections[charName] ||
                            //   !narrationSelections[charName]
                            // }
                            disabled={
                              !sceneData?.language ||
                              !narrationSelections[charName] ||
                              !genderSelections[charName]
                            }
                            label="Voice Options/Voice Name"
                            options={
                              Array.isArray(audioAnimationData?.scenes) &&
                              audioAnimationData.scenes.length > 0
                                ? getFilteredVoiceOptions(charName).map(
                                    (opt) => ({
                                      ...opt,
                                      disabled: false,
                                    }),
                                  )
                                : getFilteredVoiceOptions(charName)
                            }
                            // options={
                            //   Array.isArray(audioAnimationData?.scenes) &&
                            //   audioAnimationData.scenes.length > 0
                            //     ? getFilteredVoiceOptions(charName).map(
                            //         (opt) => ({
                            //           ...opt,
                            //           disabled:
                            //             voiceSelections[charName] !== opt.value,
                            //         }),
                            //       )
                            //     : getFilteredVoiceOptions(charName)
                            // }
                            placeholder="Select Voice"
                            value={voiceSelections[charName] || ""}
                            onChange={(value) =>
                              handleVoiceChange(charName, value)
                            }
                            style={true}
                            getPreviewUrl={(voice) =>
                              getPreviewUrl(
                                voice,
                                getFilteredVoiceOptions(charName),
                              )
                            }
                            customOption
                          />
                        </Grid>

                        {/* Voice  */}
                        <Grid size={{ xs: 12, md: 6, lg: 0 }}>
                          <IconButton
                            onClick={() => handlePreview(charName)}
                            sx={{
                              transition: "transform 0.2s",
                              "&:hover": {
                                transform: "scale(1.1)",
                              },
                              marginBottom: "5px",
                            }}
                            disabled={
                              narrationSelections?.[charName] !== "azure"
                            }
                          >
                            <PlayArrowIcon />
                            {/* <PlayCircleOutlineIcon /> */}
                          </IconButton>
                        </Grid>
                      </Grid>
                    ))}
                  {/* {audioAnimationData?.scenes &&
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
                          ),
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
                  )} */}

                  {/* {audioAnimationData?.scenes &&
                  audioAnimationData?.scenes?.length > 0 ? (
                    <>
                      <Typography
                        sx={{ fontSize: "20px", fontWeight: 500, mt: 4 }}
                      >
                        Available Voices
                      </Typography>

                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        {(() => {
                          const scenes = audioAnimationData.scenes;

                          // Create scene lookup
                          const sceneMap = new Map(
                            scenes.map((scene: any) => [
                              scene.scene_number,
                              scene,
                            ]),
                          );

                          // Find max scene number
                          const maxScene = Math.max(
                            ...scenes.map((s: any) => s.scene_number),
                          );

                          return Array.from({ length: maxScene }, (_, i) => {
                            const sceneNumber = i + 1;
                            const scene = sceneMap.get(sceneNumber);

                            return (
                              <Grid
                                item
                                xs={12}
                                md={6}
                                lg={4}
                                key={sceneNumber}
                                sx={{ width: "100%" }}
                              >
                                {scene ? (
                                  <VoicePlayer
                                    index={sceneNumber - 1}
                                    description={scene.description}
                                    s3_url={scene.final_audio_s3_url}
                                  />
                                ) : (
                                  <Box
                                    sx={{
                                      p: 2,
                                      borderRadius: 2,
                                      border: "1px dashed #ccc",
                                      opacity: 0.6,
                                      pointerEvents: "none",
                                    }}
                                  >
                                    <Typography fontWeight={600}>
                                      Scene {sceneNumber} Audio
                                    </Typography>

                                    <Typography variant="body2">
                                      Scene not available
                                    </Typography>
                                  </Box>
                                )}
                              </Grid>
                            );
                          });
                        })()}
                      </Grid>
                    </>
                  ) : (
                    <NoDataMessage
                      filter={false}
                      loading={audioAnimationLoader}
                    />
                  )} */}

                  {audioAnimationData?.scenes &&
                  audioAnimationData?.scenes?.length > 0 ? (
                    <>
                      <Typography
                        sx={{ fontSize: "20px", fontWeight: 500, mt: 4 }}
                      >
                        Available Voices
                      </Typography>

                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        {audioAnimationData.scenes.map(
                          (scene: any, idx: number) => {
                            const isDisabled = !scene.final_audio_s3_url;

                            return (
                              <Grid
                                item
                                xs={12}
                                md={6}
                                lg={4}
                                key={idx}
                                sx={{ width: "100%" }}
                              >
                                {!isDisabled ? (
                                  <VoicePlayer
                                    index={idx}
                                    description={scene.description}
                                    s3_url={scene.final_audio_s3_url}
                                  />
                                ) : (
                                  <Box
                                    sx={{
                                      p: 2,
                                      borderRadius: 2,
                                      border: "1px dashed #ccc",
                                      opacity: 0.6,
                                      pointerEvents: "none",
                                    }}
                                  >
                                    <Typography fontWeight={600}>
                                      Scene {scene.scene_number} Audio
                                    </Typography>

                                    <Typography variant="body2">
                                      Audio for this scene is not available
                                    </Typography>
                                  </Box>
                                )}
                              </Grid>
                            );
                          },
                        )}
                      </Grid>
                    </>
                  ) : (
                    <NoDataMessage
                      filter={false}
                      loading={audioAnimationLoader}
                    />
                  )}

                  <div className={styles.actions}>
                    <ButtonComp
                      variant="outlined"
                      className={styles.largeOutline}
                      onClick={handleSave}
                      disabled={
                        audioAnimationData?.scenes === null || saveLoader
                      }
                    >
                      Save
                    </ButtonComp>
                    <ButtonComp
                      disabled={
                        (!audioAnimationData?.scenes &&
                          !audioAnimationData?.scenes?.length > 0) ||
                        audioAnimationLoader ||
                        videoAnimationLoader
                      }
                      label={"Create Transition"}
                      // className={styles.createBtn}
                      action={handleCreateTransition}
                    >
                      Create Transition
                    </ButtonComp>

                    <ButtonComp
                      label={"Submit"}
                      // sx={{ textTransform: "none" }}
                      // className={styles.submitBtn}
                      action={handleSubmit}
                      disabled={
                        audioAnimationData?.scenes?.length > 0 ||
                        audioAnimationLoader
                      }
                    >
                      Submit
                    </ButtonComp>
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
