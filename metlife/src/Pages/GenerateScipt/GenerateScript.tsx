import React, { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import styles from "./GenerateScript.module.css";
import ButtonComp from "../../components/common/Buton/Button";
import SelectComp from "../../components/common/select";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  // Button,
  Tooltip,
} from "@mui/material";
// import { IoArrowBackCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getPromptsList } from "../../redux/features/promptSlice";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import Footer from "../../components/common/mainFooter";
import api from "../../api/axios";
import FullScreenGradientLoader from "../../components/common/GradientLoader";
import SavedPromptsModal from "../../components/common/SavedPromptsModal";
import DataFilters from "../../components/Data Filters/DataFilters";
import Input from "../../components/common/Input";
import type { RootState } from "../../redux/store"; // import your store type
import { showToast } from "../../utils/toast";
import CharacterParent from "../../components/Conversationaly_Character/CharacterParent";
import AutoFixHighIcon from "../../assets/wizardMagic.svg";
import type { CharacterType, PromptItem } from "../../utils/types";
import BackButton from "../../components/common/Buton/BackButton";

// ---------- Options ----------
const videoTypeOptions = [
  { value: "narrator", label: "Narrator" },
  { value: "monologue", label: "Monologue" },
  { value: "conversational", label: "Conversational" },
  { value: "mixed", label: "Combined" },
];

const languageOptions = [
  { value: "English", label: "English" },
  { value: "Spanish", label: "Spanish" },
  { value: "Romanian", label: "Romanian" },
  { value: "Ukranian", label: "Ukranian" },
  { value: "Bangla", label: "Bangla" },
  { value: "Portugese", label: "Portugese" },
  { value: "Hindi", label: "Hindi" },
  { value: "Nepali", label: "Nepali" },
];

const toneOptions = [
  { value: "fun", label: "Fun" },
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
];

const topNOptions = [
  { value: "5", label: "5" },
  { value: "10", label: "10" },
  { value: "15", label: "15" },
  { value: "20", label: "20" },
];

const modelOptions = [
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "gpt-4o-mini", label: "GPT-4o-mini" },
  { value: "gpt-4.1", label: "GPT-4.1" },
];

const dataSourceOptions = [
  { value: "metlife", label: "MetLife" },
  { value: "openai", label: "OpenAI" },
  { value: "metlife+openai", label: "Both" },
];

const durationOptions = [
  { value: "2 minutes", label: "2 mins" },
  { value: "3 minutes", label: "3 mins" },
  { value: "4 minutes", label: "4 mins" },
  { value: "5 minutes", label: "5 mins" },
  { value: "6 minutes", label: "6 mins" },
];

// ---------- Types ----------
interface DataFiltersType {
  channel: string[];
  language: string[];
  domain: string[];
  category: string[];
  roles: string[];
  source_type: string[];
  core_skill: string[];
  sub_skill: string[];
  proficiency_level: string[];
  sub_category: string[];
  microsegment: string[];
  skill_domain: string[];
}

interface VideoPrompt {
  id: string;
  title: string;
  script: string;
}

export type InputType = "prompt" | "image";

/* ================= CONSTANT ================= */

export const emptyCharacter: CharacterType = {
  name: "",
  role: "",
  img: "",
  inputType: "prompt",
  age: 30,
  gender: "",
  skin_tone: "Light-medium",
  hair: "Short, neatly combed black hair",
  face: "Clean-shaven, calm professional expression",
  build: "Average",
  wardrobe: "Light blue dress shirt, navy blazer, no tie",
  accessories: "Simple watch, no flashy items",
  personality: "Curious, thoughtful, professional",
  origin: "Spanish / Latin America",
};
// ---------- Component ----------
const GenerateScript: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const [characters, setCharacters] = useState<CharacterType[]>([
    emptyCharacter,
  ]);
  // States
  const [scriptText, setScriptText] = useState<string>("");
  const [data_filters, setDataFilters] = useState<DataFiltersType>({
    channel: ["all"],
    language: ["all"],
    domain: ["all"],
    category: ["all"],
    roles: ["all"],
    source_type: ["all"],
    core_skill: ["all"],
    sub_skill: ["all"],
    proficiency_level: ["all"],
    sub_category: [],
    microsegment: [],
    skill_domain: [],
  });

  const [videoType, setVideoType] = useState<string | number>("narrator");
  const [audience, setAudience] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [language, setLanguage] = useState<string | number>("English");
  const [duration, setDuration] = useState<string | number>("2 minutes");
  const [topn, setTopn] = useState<string | null>("5");
  const [model, setModel] = useState<string | number>("gpt-4o-mini");
  const [datasource, setDatasource] = useState<string | number>("");
  const [loader, setLoader] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const disableTopN = !datasource || datasource === "openai";
  const isMetlife = datasource === "metlife" || datasource === "metlife+openai";

  const { promptData, promtLoader } = useSelector(
    (store: RootState) => store.Prompts,
  );

  // Fetch prompts list
  useEffect(() => {
    dispatch(getPromptsList());
  }, [dispatch]);

  useEffect(() => {
    if (datasource === "openai") {
      setTopn("");
    } else if (datasource === "metlife") {
      setTopn("5");
    }
  }, [datasource]);

  // ---------- Handlers ----------
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    switch (name) {
      case "duration":
        setDuration(value);
        break;
      case "audience":
        setAudience(value);
        break;
      case "title":
        setTitle(value);
        break;
      default:
        break;
    }
  };

  const apiCall = async (success) => {
    const characterPayload = buildCharacterPayload(characters);
    // console.log("Character Payload:", characterPayload);
    const new_payload: any = {
      title,
      brief: scriptText,
      suggested_duration: duration,
      language,
      target_audience: audience,
      video_style: videoType === "narrator" ? "narrative" : videoType,
      model,
      top_n: Number(topn),
      data_source: datasource,
      filters: data_filters,
      characters: characterPayload.characters,
    };

    if (datasource === "openai") delete new_payload.top_n;
    setLoader(true);
    try {
      const result = await api.post("generate-script", new_payload);
      if (result?.status === 200) {
        if (result?.data?.scenes && result?.data?.status === true) {
          toast.success("Script generated successfully!");
          navigate(`/scenes/${result?.data?.script_id}`);
        } else {
          toast.error(result?.data?.detail || "Insufficient Internal Data!");
        }

        if (success) {
          // console.log(result?.data?.script_id, "check");
          successCallback(result?.data?.script_id);
        }
      } else {
        showToast.error("Some Issue In Generating");
      }
    } catch (err) {
      console.error("Video creation failed:", err);
      showToast.error("Some Issue In Generating");
    } finally {
      setLoader(false);
    }
  };

  const handleGenerate = () => {
    if (!language) showToast.error("Please select Language in Video Filters");
    else if (!videoType)
      showToast.error("Please select Video Type in Video Filters");
    else if (!audience)
      showToast.error("Please enter Target Audience in Video Filters");
    else if (!duration)
      showToast.error("Please select Duration in Video Filters");
    else if (!model) showToast.error("Please select Model in Model Filters");
    else if (!datasource)
      showToast.error("Please select Data Source in Model Filters");
    else if (!title) showToast.error("Please give title!");
    else if (videoType === "conversational" || videoType === "mixed") {
      const validCharacters = characters.filter((char) => {
        const hasBasicInfo = char.name.trim() && char.role.trim();
        const hasValidInput =
          char.inputType === "image"
            ? !!char.img
            : Boolean(
                char.age ||
                char.gender ||
                char.skin_tone ||
                char.hair ||
                char.face ||
                char.build ||
                char.wardrobe ||
                char.accessories ||
                char.personality ||
                char.origin,
              );

        return Boolean(hasBasicInfo && hasValidInput);
      });
      if (validCharacters.length === 0) {
        showToast.error("Please add at least one valid character!");
        return;
      } else {
        apiCall(successCallback);
      }
    } else apiCall(successCallback);
  };

  const successCallback = async (id: string) => {
    try {
      setLoader(true);
      const imageCharacters = characters.filter(
        (c) => c.inputType === "image" && c.img,
      );

      for (const char of imageCharacters) {
        const formData = new FormData();
        // formData.append("script_id", id);
        // formData.append("character_name", char.name);
        formData.append("file", char.img);

        await api.post("characters/upload-character-image", formData, {
          params: {
            script_id: id,
            character_name: char.name,
            role: char.role,
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };
  // const buildCharacterPayload = (characters: CharacterType[] = []) => {
  //   return {
  //     characters: characters?.map((c: CharacterType) => ({
  //       name: c.name || "",
  //       role: c.role || "",
  //       gender: c.gender || "",
  //       age: String(c.age || ""),
  //       skin_tone: c.skin_tone || "",
  //       hair: c.hair || "",
  //       face: c.face || "",
  //       build: c.build || "",
  //       wardrobe: c.wardrobe || "",
  //       accessories: c.accessories || "",
  //       personality: c.personality || "",
  //       origin: c.origin || "",
  //       image_upload: c.img ? true : false,
  //     })),
  //   };
  // };

  const buildCharacterPayload = (characters: CharacterType[] = []) => {
    return {
      characters: characters.map((c: CharacterType) => {
        if (c.inputType === "image") {
          return {
            name: c.name || "",
            role: c.role || "",
            file: c.img,
          };
        }

        return {
          name: c.name || "",
          role: c.role || "",
          gender: c.gender || "",
          age: String(c.age || ""),
          skin_tone: c.skin_tone || "",
          hair: c.hair || "",
          face: c.face || "",
          build: c.build || "",
          wardrobe: c.wardrobe || "",
          accessories: c.accessories || "",
          personality: c.personality || "",
          origin: c.origin || "",
        };
      }),
    };
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <OneFrameHeader />
      {loader && <FullScreenGradientLoader />}
      <main className={styles.cardWrap}>
        <div className={styles.card}>
          <div className={styles.headerRow}>
            {/* <Button
              className={styles.icon}
              onClick={() => navigate("/video-frame")}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                paddingX: 0,
              }}
            >
              <IoArrowBackCircleOutline size={30} />
              <span style={{ lineHeight: "normal" }}>Back</span>
            </Button> */}

            {/* <h1 className={styles.title}>Generate Script</h1> */}
            <BackButton route="/video-frame" />
            <Typography variant="h4" my={1}>
              Generate Script
            </Typography>
          </div>
          <div>
            <Input
              label="Title:"
              type="text"
              name="title"
              placeholder="Enter the title to generate script"
              className={styles.input}
              value={title}
              handleChange={handleInputChange}
            />
          </div>

          <div className={styles.textareaContainer}>
            <textarea
              className={styles.scriptTextarea}
              placeholder="Create a 90-second explainer video script about photosynthesis for a 5th-grade audience. The tone should be fun and engaging, with three distinct scenes: Introduction, The Process and Why It's Important."
              value={scriptText}
              onChange={(e) => setScriptText(e.target.value)}
              rows={8}
            />

            {/* <img src={path} alt="Bookmark" className={styles.bookmarkIcon} /> */}
            {/* <button
              className={styles.savedBtn}
              onClick={() => {
                setOpen(true);
              }}
            >
              Saved Prompts
            </button> */}

            <button
              className={styles.savedBtn}
              onClick={() => {
                setOpen(true);
              }}
            >
              Saved Prompts
            </button>
          </div>
          {/* Accordions */}
          <div className={styles.accordionGroup}>
            <Accordion
              sx={{
                border: "none",
                borderRadius: "10px",
                boxShadow: "none",
                "&::before": {
                  display: "none",
                },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body1" className={styles.accordionTitle}>
                  Video Filters
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={styles.accordionDetails}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                    <SelectComp
                      label="Language"
                      options={languageOptions}
                      value={language}
                      onChange={setLanguage}
                      placeholder="Select Language"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                    <SelectComp
                      label="Video Type"
                      options={videoTypeOptions}
                      value={videoType}
                      onChange={setVideoType}
                      placeholder="Select Video Type"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                    <SelectComp
                      label="Duration"
                      options={durationOptions}
                      value={duration}
                      onChange={setDuration}
                      placeholder="Select Duration"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                    <Input
                      label="Target Audience"
                      type="text"
                      name="audience"
                      placeholder="Enter Target Audience"
                      className={styles.input}
                      value={audience}
                      handleChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
                {(videoType == "conversational" || videoType == "mixed") && (
                  <CharacterParent
                    setCharacters={setCharacters}
                    characters={characters}
                  />
                )}
              </AccordionDetails>
            </Accordion>
            <Accordion
              sx={{
                border: "none",
                borderRadius: "10px",
                boxShadow: "none",
                "&::before": {
                  display: "none", // removes divider line
                },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body1" className={styles.accordionTitle}>
                  Model Filters
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={styles.accordionDetails}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                    <SelectComp
                      label="Data Source"
                      options={dataSourceOptions}
                      value={datasource}
                      onChange={setDatasource}
                      placeholder="Select Data Source"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                    <SelectComp
                      label="Model"
                      options={modelOptions}
                      value={model}
                      onChange={setModel}
                      placeholder="Select Model"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                    <Tooltip
                      title={
                        !datasource
                          ? "Please select Data Source first"
                          : datasource === "openai"
                            ? "Filter not available for openai!"
                            : ""
                      }
                      placement="left"
                      arrow
                      disableHoverListener={!disableTopN}
                    >
                      <span style={{ width: "100%" }}>
                        <SelectComp
                          label="Top N"
                          options={topNOptions}
                          value={topn}
                          // onChange={setTopn}
                          onChange={(value) => setTopn(value.toString())}
                          placeholder="Select Top N"
                          disabled={disableTopN}
                        />
                      </span>
                    </Tooltip>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion
              disabled={!isMetlife} // disables interaction
              sx={{
                border: "none",
                borderRadius: "10px",
                boxShadow: "none",
                "&::before": {
                  display: "none",
                },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body1" className={styles.accordionTitle}>
                  Data Filters
                </Typography>
              </AccordionSummary>
              {!isMetlife ? (
                <AccordionDetails>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    textAlign={"center"}
                  >
                    Data Filters are only available when Data Source is MetLife
                    or Both.
                  </Typography>
                </AccordionDetails>
              ) : (
                <AccordionDetails>
                  <DataFilters
                    setFilter={setDataFilters}
                    filter={data_filters}
                  />
                </AccordionDetails>
              )}
            </Accordion>
          </div>
          {/* Action Area */}
          <div className={styles.actions}>
            <div className={styles.actions}>
              <ButtonComp
                disabled={loader}
                icon={AutoFixHighIcon}
                label={loader ? "Generating..." : "Generate Script"}
                // className={styles.generateBtn}
                action={handleGenerate}
              >
                {loader ? "Generating..." : "Generate Script"}
              </ButtonComp>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <SavedPromptsModal
        open={open}
        onClose={(text: string) => {
          setOpen(false);
          setScriptText(text);
        }}
        prompts={promptData}
      />
    </Box>
  );
};

export default GenerateScript;
