import React, { useEffect, useState } from "react";
import styles from "./translateScript.module.css";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import Footer from "../../components/common/mainFooter";
import { NoDataMessage } from "../../components/common/NoDataMessage";
import { useLocation } from "react-router";
import DynamicTable from "../../components/common/Table";
import { BASE_URL } from "../../api/axios";
import PopupModal from "../../components/popUps/LanguagePopup";
import ButtonComp from "../../components/common/Buton/Button";
import { toast } from "react-toastify";
import FullScreenGradientLoader from "../../components/common/GradientLoader";

const TranslatedScript = () => {
  //   const [loading, setLoading] = useState(false);
  const { state } = useLocation();
  // const [open, setOpen] = useState(false);
  // const languages = [
  //   "Spanish",
  //   "Hindi",
  //   "Arabic",
  //   "Nepali",
  //   "Portuguese",
  //   "Romanian",
  //   "Ukrainian",
  //   "Bangla",
  //   // "English",
  //   // "French",
  //   // "German",
  //   // "Italian",
  //   // "Japanese",
  // ];
  // const [loader, setLoader] = useState(false);
  // const [selectedLang, setSelectedLang] = useState(null);
  const [pdfViewData, setPdfViewData] = useState([]);

  // console.log(location, "state_check")
  // const translatedData = state?.data;
  // const data = state?.data;
  // const optionCheck = state?.pdf;

  const [columns] = useState(["Scene No.", "Script", "OST", "Type"]);

  useEffect(() => {
    const fileUploadData = async () => {
      try {
        const fileId = state?.data?.file_id;
        const response = await fetch(`${BASE_URL}get-upload/${fileId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status !== 200) {
          toast.error("Something went wrong!");
          return;
        }
        const data = await response.json();
        console.log(data?.data?.scenes, "response_data_check");
        setPdfViewData(data?.data?.scenes[0]);
      } catch (error) {
        console.log(error);
      }
    };

    fileUploadData();
  }, [state?.data?.file_id]);

  console.log(pdfViewData, "pdfViewData");
  // const handleTranslateScript = async () => {
  //     const { file_id } = scriptData;
  //     console.log(file_id);
  //     // const data = {
  //     //   file_id: file_id,
  //     //   language: selectedLang,
  //     //   provider: 'azure'
  //     // };
  //     if (!file_id) return;
  //     const formData = new FormData();
  //     formData.append("file_id", file_id);
  //     formData.append("language", selectedLang);
  //     // formData.append("provider", "azure");
  //     setLoader(true);
  //     setLoaderText("Translating script...");

  //     try {
  //       const response = await fetch(`${BASE_URL}translate-script-json`, {
  //         method: "POST",
  //         // headers: {
  //         //   "Content-Type": "application/json",
  //         // },
  //         body: formData,
  //       });

  //       const translatedData = await response.json();

  //       if (!response.ok) {
  //         toast.error(translatedData?.message || "Error in translating");
  //         return;
  //       }
  //       console.log(translatedData);
  //       // downloadScriptPdf(translatedData?.data,true);
  //       // downloadScriptWord(translatedData?.data, true);
  //       // navigate("/translated-script", { state: translatedData });
  //       setLoader(false);
  //       toast.success(translatedData?.message || "Translate successful");
  //     } catch (error) {
  //       console.log(error);
  //       toast.error("Error in translating!");
  //       return;
  //     } finally {
  //       setLoader(false);
  //       setLoaderText("");
  //     }
  //   };

  console.log(pdfViewData, "pdfViewData")

  return (
    <>
      <div className={styles.container}>
        
        <OneFrameHeader />
        <div className={styles.tableContainer}>
          {pdfViewData?.scenes?.length > 0 ? (
            <>
              <DynamicTable
                columns={columns}
                // data={data}
                // actions={actions}
                extraDetails={pdfViewData}
                showDragAndActions={false}
                pdfId={state?.data?.file_id}
              />

              {/* For later use */}
              {/* <ButtonComp
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
              // disabled={!uploadSuccess || loader}
            />
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
                      // handleTranslateScript();
                      setOpen(false);
                    }}
                  />
                </div>
              </PopupModal> */}
            </>
          ) : (
            <FullScreenGradientLoader  text="Fetching details" />
          
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default TranslatedScript;
