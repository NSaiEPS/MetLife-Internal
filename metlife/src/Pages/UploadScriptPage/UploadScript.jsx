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
import jsPDF from "jspdf";
import "jspdf-autotable";
import Input from "../../components/common/Input";
import { showToast } from "../../utils/toast";

const UploadScript = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedLang, setSelectedLang] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [scriptData, setScriptData] = useState(null);
  const [loader, setLoader] = useState(false);
  const [loaderText, setLoaderText] = useState("");
  const languages = [
    "Spanish",
    "Hindi",
    "Arabic",
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

  const isDisabled = !title.trim() || !uploadSuccess;
  const handleClick = () => {
    fileInputRef.current.click();
    console.log(fileInputRef, "fileInputref_check");
  };

  // const handleFileChange = (e) => {
  //   if(!title) {
  //     showToast.error("Please give title");
  //   } else if(!selectedFile) {
  //     showToast.error("Please select file")
  //   } else {
  //     apiCall();
  //   }
  // }

  console.log(selectedFile, "Selected_file");

  const handleFileChange = async (e) => {
    const files = e.target.files;
    // if (!files || files.length === 0) return;
    if (!files || files.length === 0) {
      showToast.error("Please select a file");
      return;
    }

    if (!title) {
      showToast.error("Please give title");
      return;
    }
    const file = files[0];
    setSelectedFile(file);
    setLoader(true);
    setUploadSuccess(false);
    setLoaderText("Uploading script...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("pdf_url", "");
      formData.append("title", title);
      const response = await fetch(`${BASE_URL}upload-script`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        toast.error("Error in script uploading");
        return;
      }
      const data = await response.json();
      setScriptData(data?.data);
      localStorage.setItem("file_name", data?.data?.filename);
      console.log("upload successful", data);
      toast.success("Script uploaded successfully");
      setUploadSuccess(true);
      setLoader(false);
    } catch (error) {
      console.log(error);
      toast.error("Error in script uploading!");
    } finally {
      setLoader(false);
      setLoaderText("");
    }
  };

  console.log(scriptData, "scriptData");

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
    setLoaderText("Translating script...");

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
      // downloadScriptWord(translatedData?.data, true);
      // navigate("/translated-script", { state: translatedData });
      setLoader(false);
      toast.success(translatedData?.message || "Translate successful");
    } catch (error) {
      console.log(error);
      toast.error("Error in translating!");
      return;
    } finally {
      setLoader(false);
      setLoaderText("");
    }
  };

  // sample pdf function for downloading
  const handleDownload = () => {
    console.log("clicked");
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Sample Script", 14, 20);

    // Table data
    const tableColumn = ["Scene No.", "Script", "OST", "Type"];
    const tableRows = [
      ["01", "Create a 90-second explainer", "Dummy text", "Narration"],
      [
        "02",
        "Create a 90-second explainer video script about photosynthesis",
        "Dummy text",
        "Monologue",
      ],
      ["03", "Create a 90-second video", "Dummy text", "Conversation"],
      [
        "04",
        "Create a 90-second explainer video script about photosynthesis",
        "Dummy text",
        "Monologue",
      ],
      ["05", "Create a 90-second video", "Dummy text", "Narration"],
    ];

    // Add table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: "grid",
      headStyles: { fillColor: [100, 149, 237] },
    });

    // Save PDF
    doc.save("Sample_Script.pdf");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name == "title") {
      setTitle(value);
    }
  };

  return (
    <>
      <OneFrameHeader />
      {loader && <FullScreenGradientLoader text={loaderText} />}
      <div className={styles.uploadPageContainer}>
        <div className={styles.uploadCard}>
          <h2 className={styles.uploadTitle}>Upload Script</h2>
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
              accept=".pdf"
              // multiple
            />
          </div>

          <div className={styles.buttonRow}>
            <ButtonComp
              // label={loader ? "Generating" : "Continue & Generate Video"}
              label="Submit"
              variant="contained"
              sx={{
                backgroundColor: "#99D538",
                "&:hover": { backgroundColor: "#c8ef88ff" },
              }}
              disabled={isDisabled}
              action={() =>
                navigate("/translated-script", {
                  state: { data: scriptData, pdf: false },
                })
              }
              // action={() => navigate("/generate-script")}
            />
            <ButtonComp
              label="Sample PDF"
              variant="contained"
              action={handleDownload}
              sx={{
                backgroundColor: "#239DE0",
                "&:hover": { backgroundColor: "#7fbcddff" },
              }}
              // disabled={!uploadSuccess || loader}
            />
            {/* may use later */}
            {/*
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
            /> */}
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
                label="Translate Script"
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
