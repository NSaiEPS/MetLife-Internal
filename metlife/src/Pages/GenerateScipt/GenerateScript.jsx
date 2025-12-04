import { useEffect, useState } from "react";
import styles from "./GenerateScript.module.css";
import ButtonComp from "../../components/common/Buton/Button";
import SelectComp from "../../components/common/select";
import { useNavigate, useSearchParams } from "react-router-dom";
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
} from "@mui/material";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { showToast } from "../../utils/toast";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getPromptsList } from "../../redux/features/promptSlice";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import Footer from "../../components/common/mainFooter";
import path from "../../assets/copy_icon.svg";
import Input from "../../components/common/Input";
import api from "../../api/axios";
import GradientLoader from "../../components/common/GradientLoader";
import FullScreenGradientLoader from "../../components/common/GradientLoader";
import SavedPromptsModal from "../../components/common/SavedPromptsModal";
import DataFilters from "../../components/Data Filters/DataFilters";
import CharacterParent from "../../components/Conversationaly Character/CharacterParent";

const videoTypeOptions = [
  { value: "narrator", label: "Narrator" },
  { value: "monologue", label: "Monologue" },
  { value: "conversational", label: "Conversational" },
  { value: "mixed", label: "Combined" },
];

const languageOptions = [
  { value: "English", label: "English" },
  { value: "Spanish", label: "Spanish" },
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

const GenerateScript = () => {
  const navigate = useNavigate();
  const [scriptText, setScriptText] = useState();
  const [data_filters, setDataFilters] = useState({
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
  // selects
  const [videoType, setVideoType] = useState("narrator");
  const [audience, setAudience] = useState("");
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("English");
  const [duration, setDuration] = useState("2 minutes");
  const [topn, setTopn] = useState("5");
  const [model, setModel] = useState("gpt-4o-mini");
  const [datasource, setDatasource] = useState("");
  const [loader, setLoader] = useState(false);
  const disableTopN = !datasource || datasource === "openai";
  const dispatch = useDispatch();

  const { promptData, promtLoader } = useSelector((store) => store.Prompts);
  useEffect(() => {
    dispatch(getPromptsList());
  }, [dispatch]);

  useEffect(() => {
    if (datasource === "openai") {
      setTopn("");
    }
  }, [datasource]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name == "duration") {
      setDuration(value);
    } else if (name == "audience") {
      setAudience(value);
    } else if (name == "title") {
      setTitle(value);
    }
  };

  const handleGenerate = () => {
    if (!language) {
      showToast.error("Please select Language in Video Filters");
    } else if (!videoType) {
      showToast.error("Please select Video Type in Video Filters");
    } else if (!audience) {
      showToast.error("Please enter Target Audience in Video Filters");
    } else if (!duration) {
      showToast.error("Please select Duration in Video Filters");
    }
    // else if (!topn) {
    //   showToast.error("Please select Top N in Model Filters");
    // }
    else if (!model) {
      showToast.error("Please select Model in Model Filters");
    } else if (!datasource) {
      showToast.error("Please select Data Source in Model Filters");
    } else if (!title) {
      showToast.error("Please give title!");
    } else {
      // showToast.info("Generating video...");
      apiCall();
    }
  };

  const apiCall = async () => {
    setLoader(true);

    const new_payload = {
      title: title,
      brief: scriptText,
      suggested_duration: duration,
      language: language,
      target_audience: audience,
      // scene_length_style: "short_form",
      video_style: videoType === "narrator" ? "narrative" : videoType,
      model: model,
      top_n: Number(topn),
      data_source: datasource,
      filters: data_filters,
    };
    if (datasource === "openai") {
      // delete new_payload.filters;
      delete new_payload.top_n;
    }

    try {
      const result = await api.post("generate-script", new_payload);
      if (result?.status == 200) {
        if (result?.data?.scenes && result?.data?.status === true) {
          toast.success("Script generated successfully!");
          navigate(`/scenes/${result?.data?.script_id}`);
        } else {
          toast.error(
            result?.data?.detail || "Something went wrong while generating!"
          );
        }
      } else {
        showToast?.error("Some Issue In Generating");
      }
    } catch (err) {
      showToast?.error("Some Issue In Generating");
      console.error("Video creation failed:", err);
    } finally {
      setLoader(false);
    }
  };

  const [open, setOpen] = useState(false);
  const isMetlife = datasource === "metlife" || datasource === "metlife+openai";

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <OneFrameHeader />
      {loader && <FullScreenGradientLoader />}
      <main className={styles.cardWrap}>
        <div className={styles.card}>
          <div className={styles.headerRow}>
            <h1 className={styles.title}>Generate Script</h1>
            <Button
              className={styles.icon}
              onClick={() => navigate("/video-frame")}
            >
              <IoArrowBackCircleOutline size={30} /> Back
            </Button>
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
                  display: "none", // removes divider line
                },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={styles.accordionTitle}>
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
                  <CharacterParent />
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
                <Typography className={styles.accordionTitle}>
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
                          onChange={setTopn}
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
                <Typography className={styles.accordionTitle}>
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
                label={loader ? "Generating..." : "Generate Script"}
                className={styles.generateBtn}
                action={handleGenerate}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <SavedPromptsModal
        open={open}
        onClose={(text) => {
          setOpen(false);
          setScriptText(text);
        }}
        prompts={promptData}
      />
    </Box>
  );
};

export default GenerateScript;
