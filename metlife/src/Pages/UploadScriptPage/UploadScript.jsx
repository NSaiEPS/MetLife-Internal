// src/pages/UploadScript/UploadScript.jsx
import React, { useRef, useState } from "react";
import styles from "./UploadScript.module.css";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import ButtonComp from "../../components/common/Buton/Button";
import UploadIcon from "../../assets/UploadCloudIcon.svg";
import { useNavigate } from "react-router-dom";
import PopupModal from "../../components/popUps/LanguagePopup";
import { Padding } from "@mui/icons-material";
import Footer from "../../components/common/mainFooter";
import { BASE_URL } from "../../api/axios";
import { toast } from "react-toastify";
import FullScreenGradientLoader from "../../components/common/GradientLoader";
import { saveAs } from "file-saver";
import { downloadScriptPdf, downloadScriptWord } from "../../utils";

const UploadScript = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const [open, setOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [scriptData, setScriptData] = useState(null);
  const [loader, setLoader] = useState(false);
  const [loaderText, setLoaderText] = useState("");
  const languages = [
    "Hindi",
    "Arabic",
    "Spanish",
    "Nepali",
    "Portuguese",
    "Romanian",
    "Ukrainian",
    "Bangla",
    // "English",
    // "French",
    // "German",
    // "Italian",
    // "Japanese",
  ];

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setSelectedFile(file);
    setLoader(true);
    setUploadSuccess(false);
    setLoaderText("Uploading script...")

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("pdf_url", "");
      const response = await fetch(`${BASE_URL}upload-script`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error("Error in script uploading");
      }
      setScriptData(data?.data);
      console.log("upload successful", data);
      toast.success("Script uploaded successfully");
      setUploadSuccess(true);
      setLoader(false);
    } catch (error) {
      console.log(error);
      toast.error("Error in script uploading!");
    } finally {
      setLoader(false);
      setLoaderText("")
    }
  };

  console.log(scriptData?.file_id, "scriptData");

  const handleTranslateScript = async () => {
    const { file_id } = scriptData;
    console.log(file_id);
    // const data = {
    //   file_id: file_id,
    //   language: selectedLang,
    //   provider: 'azure'
    // };
    if (!file_id) return;
    const formData = new FormData();
    formData.append("file_id", file_id);
    formData.append("language", selectedLang);
    // formData.append("provider", "azure");
    setLoader(true);
    setLoaderText("Translating script...")

    try {
      const response = await fetch(`${BASE_URL}translate-script-json`, {
        method: "POST",
        // headers: {
        //   "Content-Type": "application/json",
        // },
        body: formData,
      });

      const translatedData = await response.json();

      if (!response.ok) {
        toast.error(translatedData?.message || "Error in translating");
        return;
      }
      console.log(translatedData);
      // downloadScriptPdf(translatedData?.data,true);
      downloadScriptWord(translatedData?.data, true);
      setLoader(false);
      toast.success(translatedData?.message || "Translate successful");
    } catch (error) {
      console.log(error);
      toast.error("Error in translating!");
      return
    } finally {
      setLoader(false);
      setLoaderText("");
    }
  };

  return (
    <>
      <OneFrameHeader />
      {loader && <FullScreenGradientLoader text={loaderText} />}
      <div className={styles.uploadPageContainer}>
        <div className={styles.uploadCard}>
          <h2 className={styles.uploadTitle}>Upload Script</h2>

          <div className={styles.uploadBox} onClick={handleClick}>
            <img src={UploadIcon} className={styles.uploadIcon} />
            <p className={styles.uploadText}>
              {selectedFile ? selectedFile.name : "Browse Files"}
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              accept="txt.,.pdf,.docx"
              // multiple
            />
          </div>
          {/* {uploading && <p className={styles.uploadStatus}>Uploading...</p>}
          {uploadStatus && (
            <p className={styles.uploadStatus}>{uploadStatus}</p>
          )} */}

          <div className={styles.buttonRow}>
            <ButtonComp
              label={loader ? "Translating" : "Translate Script"}
              variant="contained"
              sx={{
                backgroundColor: "#99D538",
                "&:hover": { backgroundColor: "#c8ef88ff" },
                fontFamily: "normal normal bold 16px/20px ",
              }}
              action={() => {
                setOpen(true);
              }}
              disabled={!uploadSuccess || loader}
            />

            <ButtonComp
              // label={loader ? "Generating" : "Continue & Generate Video"}
              label="Continue & Generate Video"
              variant="contained"
              sx={{
                backgroundColor: "#239DE0",
                "&:hover": { backgroundColor: "#7fbcddff" },
              }}
              action={() => navigate("/generate-script")}
              disabled={!uploadSuccess || loader}
            />
          </div>

          <PopupModal
            open={open}
            onClose={() => setOpen(false)}
            title="Select Language"
          >
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
                className={styles.downloadBtn}
                action={() => {
                  // console.log("Selected Language:", selectedLang);
                  handleTranslateScript();
                  setOpen(false);
                }}
              />
            </div>
          </PopupModal>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UploadScript;
