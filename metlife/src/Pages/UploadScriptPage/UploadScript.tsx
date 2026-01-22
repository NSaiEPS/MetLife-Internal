// src/pages/UploadScript/UploadScript.jsx
import { useRef, useState } from "react";
import styles from "./UploadScript.module.css";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import ButtonComp from "../../components/common/Buton/Button";
import UploadIcon from "../../assets/UploadCloudIcon.svg";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/common/mainFooter";
import { BASE_URL } from "../../api/axios";
import { toast } from "react-toastify";
import FullScreenGradientLoader from "../../components/common/GradientLoader";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Input from "../../components/common/Input";
import { showToast } from "../../utils/toast";
import DownloadPopup from "../../components/common/popup/DownloadPopup";

import "jspdf-autotable"; // <-- important for TypeScript to register autoTable
// import { IoArrowBackCircleOutline } from "react-icons/io5";
import BackButton from "../../components/common/Buton/BackButton";
import { Typography } from "@mui/material";
// import { Button, Typography } from "@mui/material";
// import { color } from "framer-motion";

// import { IoMdDownload } from "react-icons/io";

const UploadScript = () => {
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [scriptData, setScriptData] = useState(null);
  const [loader, setLoader] = useState(false);
  const [openDownloadPopup, setOpenDownloadPopup] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef<any>(null);
  const isDisabled = !title.trim() || !uploadSuccess;
  const handleClick = () => {
    fileInputRef?.current?.click();
  };

  const handleFileChange = async (e: any) => {
    const files = e.target.files;
    const doc = new jsPDF();
    if (!files || files.length === 0) {
      showToast.error("Please give input first");
      return;
    }
    const file = files[0];

    if (file && file.type !== "application/pdf") {
      showToast.error("Only PDF files are allowed");
      e.target.value = null;
      return;
    }
    if (
      selectedFile &&
      file.name === selectedFile?.name &&
      file.size === selectedFile?.size
    ) {
      showToast.error("You have already uploaded this file.");
      return;
    }

    if (!title.trim()) {
      showToast.error("Please give a title before uploading");
      e.target.value = "";
      return;
    }

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

  type DownloadType = "pdf" | "word";

  const handleDownloadType = async (type: DownloadType) => {
    try {
      if (type === "pdf") {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text("Sample Script", 14, 20);

        // Table data
        const tableColumn = ["Scene No.", "Script", "OST", "Type"];
        const tableRows: string[][] = [
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
        (doc as any).autoTable({
          head: [tableColumn],
          body: tableRows,
          startY: 30,
          theme: "grid",
          headStyles: { fillColor: [100, 149, 237] },
        });

        // Save PDF
        doc.save("Sample_Script.pdf");
      } else if (type === "word") {
        // Lazy import docx (TypeScript supported)
        const {
          Document,
          Packer,
          Paragraph,
          Table,
          TableCell,
          TableRow,
          TextRun,
        } = await import("docx");

        const doc = new Document({
          sections: [
            {
              children: [
                // Title
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Sample Script",
                      bold: true,
                      size: 32,
                    }),
                  ],
                  spacing: { after: 300 },
                }),

                // Table
                new Table({
                  rows: [
                    // Header Row
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [new Paragraph("Scene No.")],
                        }),
                        new TableCell({ children: [new Paragraph("Script")] }),
                        new TableCell({ children: [new Paragraph("OST")] }),
                        new TableCell({ children: [new Paragraph("Type")] }),
                      ],
                    }),

                    // Data rows
                    ...[
                      [
                        "01",
                        "Create a 90-second explainer",
                        "Dummy text",
                        "Narration",
                      ],
                      [
                        "02",
                        "Create a 90-second explainer video script about photosynthesis",
                        "Dummy text",
                        "Monologue",
                      ],
                      [
                        "03",
                        "Create a 90-second video",
                        "Dummy text",
                        "Conversation",
                      ],
                      [
                        "04",
                        "Create a 90-second explainer video script about photosynthesis",
                        "Dummy text",
                        "Monologue",
                      ],
                      [
                        "05",
                        "Create a 90-second video",
                        "Dummy text",
                        "Narration",
                      ],
                    ].map(
                      (row) =>
                        new TableRow({
                          children: row.map(
                            (cell) =>
                              new TableCell({ children: [new Paragraph(cell)] })
                          ),
                        })
                    ),
                  ],
                }),
              ],
            },
          ],
        });

        // Download Word File
        const blob = await Packer.toBlob(doc);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Sample_Script.docx";
        a.click();
      }

      setOpenDownloadPopup(false);
    } catch (err) {
      console.error("Error generating file:", err);
    }
  };

  const handleDownloadScript = () => {
    setOpenDownloadPopup(true);
    // setMakeChanges(true);
  };
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    if (name == "title") {
      setTitle(value);
    }
  };

  return (
    <>
      <OneFrameHeader />
      {loader && <FullScreenGradientLoader text="Uploading Script..." />}
      <div className={styles.uploadPageContainer}>
        <div className={styles.uploadCard}>
          <div
            style={{
              // display: "flex",
              // justifyContent: "space-between",
              // alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <BackButton route="/video-frame" />
            
            <Typography variant="h4">Upload Script</Typography>
            {/* <Button
              className={styles.icon}
              onClick={() => navigate("/video-frame")}
            >
              {" "}
              <IoArrowBackCircleOutline size={30} /> Back{" "}
            </Button>  */}
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

          <div className={styles.uploadBox} onClick={handleClick}>
            <img src={UploadIcon} className={styles.uploadIcon} />
            <p className={styles.uploadText}>
              {selectedFile ? selectedFile?.name : "Browse Files"}
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
            {/* <ButtonComp
              label={loader ? "Submitting" : "Submit"}
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
            >
              {loader ? "Submitting" : "Submit"}
            </ButtonComp> */}
            <ButtonComp
              label="Sample Download"
              colorType="secondary"
              variant="contained"
              action={handleDownloadScript}
              sx={
                {
                  // backgroundColor: "#239DE0",
                  // "&:hover": { backgroundColor: "#7fbcddff" },
                }
              }
            >
              Sample Download
            </ButtonComp>
            <ButtonComp
              label={loader ? "Uploading" : "Upload"}
              variant="contained"
              sx={{
                color:"#ffffff",

                "&.Mui-disabled": {
                  color: "#ffffff",
                  backgroundColor: "#adadad", 
                },
                "& img": {
                  filter: "brightness(0) invert(1)", 
                },
                // display: "flex",
                // alignItems: "center",
                gap: "8px",
                // textTransform: "none",
              }}
              disabled={isDisabled}
              action={() =>
                navigate("/translated-script", {
                  state: { data: scriptData, pdf: false },
                })
              }
            >
              {!loader && (
                <img
                  src={UploadIcon}
                  alt="upload"
                  className={styles.uploadIcon}
                />
              )}
              {loader ? "Uploading" : "Upload a Script"}
            </ButtonComp>
          </div>
        </div>
        <DownloadPopup
          open={openDownloadPopup}
          onClose={() => setOpenDownloadPopup(false)}
          onSelect={handleDownloadType}
        />
      </div>
      <Footer />
    </>
  );
};

export default UploadScript;
