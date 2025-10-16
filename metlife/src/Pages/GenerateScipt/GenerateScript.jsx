import React, { useState } from "react";
import styles from "./GenerateScript.module.css";
import ButtonComp from "../../components/common/Button";
import SelectComp from "../../components/common/select";
import CheckboxComp from "../../components/common/checkbox";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { useNavigate } from "react-router-dom";
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OneFrameHeader from "../../components/common/OneFrameHeader";

const videoTypeOptions = [
  { value: "explainer", label: "Explainer" },
  { value: "promo", label: "Promotional" },
  { value: "tutorial", label: "Tutorial" },
];

const toneOptions = [
  { value: "fun", label: "Fun" },
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
];

const audienceOptions = [
  { value: "general", label: "General Audience" },
  { value: "kids", label: "Kids / Students" },
  { value: "business", label: "Business" },
];

const GenerateScript = () => {
  const navigate = useNavigate();
  const [scriptText, setScriptText] = useState(
    "Create a 90-second explainer video script about photosynthesis for a 5th-grade audience..."
  );

  // selects
  const [videoType, setVideoType] = useState("");
  const [tone, setTone] = useState("");
  const [audience, setAudience] = useState("");

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
    navigate("/generate-visual-page");
  };

  return (
    <Box className={styles.pageWrap}>
      <OneFrameHeader />

      <main className={styles.cardWrap}>
        <div className={styles.card}>
          <div className={styles.headerRow}>
            <h1 className={styles.title}>Generate Script</h1>
          </div>

          <div className={styles.textareaWrap}>
            <textarea
              className={styles.scriptTextarea}
              value={scriptText}
              onChange={(e) => setScriptText(e.target.value)}
              rows={8}
            />
            <div className={styles.bookmarkIcon} aria-hidden />
          </div>

          {/* Accordions */}
          <div className={styles.accordionGroup}>
            <Accordion >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} className={styles.accordion}>
                <Typography className={styles.accordionTitle}>Video Filters</Typography>
              </AccordionSummary>
              <AccordionDetails className={styles.accordionDetails}>
                <div className={styles.filtersGrid}>
                  <div className={styles.fieldItem}>
                    <SelectComp
                      label="Video Type"
                      options={videoTypeOptions}
                      value={videoType}
                      onChange={setVideoType}
                      placeholder="Select Video Type"
                    />
                  </div>

                  <div className={styles.fieldItem}>
                    <SelectComp
                      label="Tone"
                      options={toneOptions}
                      value={tone}
                      onChange={setTone}
                      placeholder="Select Tone"
                    />
                  </div>

                  <div className={styles.fieldItem}>
                    <SelectComp
                      label="Target Audience"
                      options={audienceOptions}
                      value={audience}
                      onChange={setAudience}
                      placeholder="Select Target Audience"
                    />
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion className={styles.accordion}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={styles.accordionTitle}>Data Filters</Typography>
              </AccordionSummary>
              <AccordionDetails className={styles.accordionDetails}>
                <div className={styles.filtersList}>
                  <CheckboxComp
                    label="Include facts from Wikipedia"
                    checked={includeWiki}
                    onChange={setIncludeWiki}
                  />
                  <CheckboxComp
                    label="Use Company Data"
                    checked={useCompanyData}
                    onChange={setUseCompanyData}
                  />
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion className={styles.accordion}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={styles.accordionTitle}>Modal Filters</Typography>
              </AccordionSummary>
              <AccordionDetails className={styles.accordionDetails}>
                {/* Placeholder content — keep minimal as per screenshot */}
                <div className={styles.modalPlaceholder}>
                  <p className={styles.placeholderText}>
                    Additional options (modal / advanced settings) can go here.
                  </p>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>

          {/* Action Area */}
          <div className={styles.actions}>
            <ButtonComp
              label="Generate a Script"
              variant="contained"
              className={styles.btnDark}
              action={handleGenerate}
              icon={<AutoFixHighIcon />}
            />
          </div>
        </div>
      </main>
    </Box>
  );
};

export default GenerateScript;
