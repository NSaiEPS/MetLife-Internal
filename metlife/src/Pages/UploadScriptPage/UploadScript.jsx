// src/pages/UploadScript/UploadScript.jsx
import React ,{useState} from "react";
import styles from "./UploadScript.module.css";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import ButtonComp from "../../components/common/Button";
import UploadIcon from "@mui/icons-material/Upload";
import { useNavigate } from "react-router-dom";
import PopupModal from "../../components/common/popup"

const UploadScript = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(null);

  const languages = ["Hindi", "English", "French", "German", "Italian", "Japanese"];


  return (
    <>
      <OneFrameHeader />

      <div className={styles.uploadPageContainer}>
        <div className={styles.uploadCard}>
          <h2 className={styles.uploadTitle}>Upload Script</h2>

          <div className={styles.uploadBox}>
            <UploadIcon className={styles.uploadIcon} />
            <p className={styles.uploadText}>Browse Files</p>
          </div>

          <div className={styles.buttonRow}>
            <ButtonComp
              label="Translate Script"
              variant="contained"
                 sx={{ backgroundColor: "#938d8d12 ", "&:hover": { backgroundColor: "#938d8d12" } }}
               action={() => setOpen(true)}
            />

            <ButtonComp
              label="Continue & Generate Video"
              variant="contained"
                  sx={{ backgroundColor: "#333", "&:hover": { backgroundColor: "#000" } }}
              action={() => navigate("/generate-script")}
            />
          </div>

          <PopupModal open={open} onClose={() => setOpen(false)} title="Select Language">
        <div className={styles.languageList}>
          {languages.map((lang, index) => (
            <div
              key={index}
              className={`${styles.languageItem} ${
                selectedLang === lang ? styles.activeLang : ""
              }`}
              onClick={() => setSelectedLang(lang)}
            >
              {lang}
            </div>
          ))}
        </div>

        <div className={styles.popupButtonRow}>
          <ButtonComp
            label="Translate & Download Script"
            variant="contained"
           sx={{ backgroundColor: "#333", "&:hover": { backgroundColor: "#000" } }}
            action={() => {
              console.log("Selected Language:", selectedLang);
              setOpen(false);
            }}
          />
        </div>
      </PopupModal>
        </div>
      </div>
    </>
  );
};

export default UploadScript;
