import React, { useState } from "react";
import styles from "./GenerateScript.module.css";
import ButtonComp from "../../components/common/Buton/Button";
import SelectComp from "../../components/common/select";
import CheckboxComp from "../../components/common//Checkbox/checkbox";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import Footer from "../../components/common/mainFooter";
import path from "../../assets/path.svg";

const videoTypeOptions = [
  { value: "narrator", label: "Narrator" },
  { value: "monologue", label: "Monologue" },
  { value: "conversational", label: "Conversational" },
  { value: "combined", label: "Combined" },
];

const languageOptions = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
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
  { value: "GPT-4o", label: "GPT-4o" },
  { value: "GPT-4o-mini", label: "GPT-4o-mini" },
  { value: "GPT-4.1", label: "GPT-4.1" },
];
const dataSourceOptions = [
  { value: "MetLife", label: "MetLife" },
  { value: "OpenAI", label: "OpenAI" },
  { value: "both", label: "Both" },
];
const audienceOptions = [
  { value: "general", label: "General Audience" },
  { value: "kids", label: "Kids / Students" },
  { value: "business", label: "Business" },
];

const durationOptions = [
  { value: "2", label: "2 mins" },
  { value: "3", label: "3 mins" },
  { value: "4", label: "4 mins" },
];

const GenerateScript = () => {
  const navigate = useNavigate();
  const [scriptText, setScriptText] = useState();

  // selects
  const [videoType, setVideoType] = useState("");
  const [tone, setTone] = useState("");
  const [audience, setAudience] = useState("");
  const [language, setLanguage] = useState("");
  const [duration, setDuration] = useState("");
  const [topn, setTopn] = useState("");
  const [model, setModel] = useState("");
  const [datasource, setDatasource] = useState("");

  // source filters (checkboxes)
  const [includeWiki, setIncludeWiki] = useState(false);
  const [useCompanyData, setUseCompanyData] = useState(true);

  // handlers
  const handleGenerate = () => {
    // keep original behavior (UI-only change)
    console.log({
      scriptText,
      videoType,
      tone,
      audience,
      includeWiki,
      useCompanyData,
    });
    navigate("/scenes");
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <OneFrameHeader />

      <main className={styles.cardWrap}>
        <div className={styles.card}>
          <div className={styles.headerRow}>
            <h1 className={styles.title}>Generate Script</h1>
          </div>

          <div className={styles.textareaContainer}>
            <textarea
              className={styles.scriptTextarea}
              placeholder="Create a 90-second explainer video script about photosynthesis for a 5th-grade audience. The tone should be fun and engaging, with three distinct scenes: Introduction, The Process and Why It's Important."
              value={scriptText}
              onChange={(e) => setScriptText(e.target.value)}
              rows={8}
            />

            <img src={path} alt="Bookmark" className={styles.bookmarkIcon} />
            <button className={styles.savedBtn}>Saved Prompts</button>
          </div>
          {/* Accordions */}
          <div className={styles.accordionGroup}>
            <Accordion
              sx={{
                borderRadius: "10px",
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={styles.accordionTitle}>
                  Video Filters
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={styles.accordionDetails}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <SelectComp
                      label="Language"
                      options={languageOptions}
                      value={language}
                      onChange={setLanguage}
                      placeholder="Select Language"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <SelectComp
                      label="Video Type"
                      options={videoTypeOptions}
                      value={videoType}
                      onChange={setVideoType}
                      placeholder="Select Video Type"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <SelectComp
                      label="Duration"
                      options={durationOptions}
                      value={duration}
                      onChange={setDuration}
                      placeholder="Select Duration"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <SelectComp
                      label="Target Audience"
                      options={audienceOptions}
                      value={audience}
                      onChange={setAudience}
                      placeholder="Select Target Audience"
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion
              sx={{
                border: "none",
                borderRadius: "10px",
                boxShadow: "none",
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={styles.accordionTitle}>
                  Data Filters
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={styles.accordionDetails}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <SelectComp
                      label="channel"
                      options={languageOptions}
                      value={language}
                      onChange={setLanguage}
                      placeholder="Select channel"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <SelectComp
                      label="Field 1"
                      options={toneOptions}
                      value={tone}
                      onChange={setTone}
                      placeholder="Select Field 1"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <SelectComp
                      label="Field 2"
                      options={toneOptions}
                      value={tone}
                      onChange={setTone}
                      placeholder="Select Field 2"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <SelectComp
                      label="Field 3"
                      options={toneOptions}
                      value={tone}
                      onChange={setTone}
                      placeholder="Select Select Field 3"
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion
              sx={{
                border: "none",
                borderRadius: "10px",
                boxShadow: "none",
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={styles.accordionTitle}>
                  Model Filters
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={styles.accordionDetails}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <SelectComp
                      label="Top N"
                      options={topNOptions}
                      value={topn}
                      onChange={setTopn}
                      placeholder="Select Top N"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <SelectComp
                      label="Model"
                      options={modelOptions}
                      value={model}
                      onChange={setModel}
                      placeholder="Select Model"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <SelectComp
                      label="Data Source"
                      options={dataSourceOptions}
                      value={datasource}
                      onChange={setDatasource}
                      placeholder="Select Data Source"
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </div>

          {/* Action Area */}
          <div className={styles.actions}>
            <div className={styles.actions}>
              <ButtonComp
                label="Generate Script"
                className={styles.generateBtn}
                action={handleGenerate}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </Box>
  );
};

export default GenerateScript;
