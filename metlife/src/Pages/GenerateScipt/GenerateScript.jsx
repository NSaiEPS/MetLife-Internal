import React, { useState } from "react";
import styles from "./GenerateScript.module.css";
import ButtonComp from "../../components/common/Button";
import SelectComp from "../../components/common/select";
import CheckboxComp from "../../components/common/checkbox";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { useNavigate } from "react-router-dom";

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
    // currently just logs; replace with API call
    console.log({
      scriptText,
      videoType,
      tone,
      audience,
      includeWiki,
      useCompanyData,
    });
    // e.g., navigate('/preview') or call generation
    navigate("/generate-visual-page"); // optional
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}> {/* header area - you likely replace with OneFrameHeader */}
        <div className={styles.brand}>OneFrame</div>
      </header>

      <main className={styles.cardWrap}>
        <div className={styles.card}>
          <h1 className={styles.title}>Generate Script</h1>

          <textarea
            className={styles.scriptTextarea}
            value={scriptText}
            onChange={(e) => setScriptText(e.target.value)}
          />

          <div className={styles.row}>
            <div className={styles.col}>
              <SelectComp
                label="Video Type"
                options={videoTypeOptions}
                value={videoType}
                onChange={setVideoType}
                placeholder="Select Video Type"
              />
            </div>

            <div className={styles.col}>
              <SelectComp
                label="Tone"
                options={toneOptions}
                value={tone}
                onChange={setTone}
                placeholder="Select Tone"
              />
            </div>

            <div className={styles.col}>
              <SelectComp
                label="Target Audience"
                options={audienceOptions}
                value={audience}
                onChange={setAudience}
                placeholder="Select Target Audience"
              />
            </div>
          </div>

          <div className={styles.filters}>
            <div className={styles.filtersLeft}>
              <div className={styles.filtersLabel}>Source Data Filters</div>
              <div className={styles.filterItems}>
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
            </div>

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
        </div>
      </main>
    </div>
  );
};

export default GenerateScript;
