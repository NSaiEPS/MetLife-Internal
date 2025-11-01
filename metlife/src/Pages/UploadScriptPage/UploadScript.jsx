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
import { IoMdDownload } from "react-icons/io";

const UploadScript = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [scriptData, setScriptData] = useState(null);
  const [loader, setLoader] = useState(false);
  const isDisabled = !title.trim() || !uploadSuccess;
  const handleClick = () => {
    fileInputRef.current.click();
    console.log(fileInputRef, "fileInputref_check");
  };

  console.log(selectedFile, "Selected_file");

  const handleFileChange = async (e) => {
    const files = e.target.files;
    console.log(files);
    if (!files || files.length === 0) {
      showToast.error("Please give input first");
      return;
    }
    const file = files[0];

    if (file.type !== "application/pdf") {
      showToast.error("Only PDF files are allowed");
      e.target.value = null;
      return;
    }
    if (
      selectedFile &&
      file.name === selectedFile.name &&
      file.size === selectedFile.size
    ) {
      showToast.error("You have already uploaded this file.");
      return;
    }
    // if (!files || files.length === 0) {
    //   showToast.error("Please select a file");
    //   return;
    // }

    if (!title.trim()) {
      showToast.error("Please give a title before uploading");
      e.target.value = "";
      return;
    }
    // const file = files[0];
    setSelectedFile(file);
    setLoader(true);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("pdf_url", "");
      formData.append("title", title);
      const response = await fetch(`${BASE_URL}upload-script`, {
        method: "POST",
        body: formData,
      });

      if (response.status !== 200) {
        toast.error("Error in script uploading");
        return;
      }
      const data = await response.json();
      if (!data || !data.data) {
        showToast.error("Invalid response from server");
        return;
      }
      setScriptData(data?.data);
      console.log("upload successful", data);
      toast.success("Script uploaded successfully");
      setUploadSuccess(true);
    } catch (error) {
      console.log(error);
      toast.error("Error in script uploading!");
    } finally {
      setLoader(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  console.log(scriptData, "scriptData");

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

  const downloadSvg = `data:image/svg+xml;utf8,
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'>
  <path d='M5 20h14v-2H5v2zm7-18v12l4-4h-3V2h-2v8H8l4 4z'/>
</svg>`;

  return (
    <>
      <OneFrameHeader />
      {loader && <FullScreenGradientLoader text="Uploading Script..." />}
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
              label={loader ? "Submitting" : "Submit"}
              // label="Submit"
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
            />
            <ButtonComp
              label="Sample PDF Download"
              variant="contained"
              action={handleDownload}
              sx={{
                backgroundColor: "#239DE0",
                "&:hover": { backgroundColor: "#7fbcddff" },
              }}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UploadScript;
