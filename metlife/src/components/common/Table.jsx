import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Stack,
  Button,
} from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import styles from "./Table.module.css";
import AddNewScriptPopup from "../popUps/addScripts";
import { downloadScriptPdf, downloadScriptWord } from "../../utils";
import { showToast } from "../../utils/toast";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router";
import copy from "../../assets/copy.svg";
import reuse from "../../assets/reuse.svg";
import styles1 from "../../Pages/AddNewScriptPage/AddNewScript.module.css";
import DownloadPopup from "./popup/DownloadPopup";
import ShowSourcePopup from "./popup/ShowSourcePopup";
import RegenerateScriptPopup from "./popup/RegenerateScriptPopup";
import ButtonComp from "./Buton/Button";
import PopupModal from "../popUps/LanguagePopup";
import { toast } from "react-toastify";
import { BASE_URL } from "../../api/axios";
import FullScreenGradientLoader from "./GradientLoader";

/**
 * props:
 *  - columns: array of column header strings
 *  - data: array of row objects where keys match column names
 *  - actions: array of { icon: ReactNode, onClick: (row) => void }
 */
function DynamicTable({
  columns = [],
  data = [],
  // actions = [],
  extraDetails = {},
  showDragAndActions = true,
  pdfId,
}) {
  // console.log(extraDetails, "extraDetails");
  const { id } = useParams();
  // console.log(id, "idCheck")

  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [openPopUp, setOpenPopup] = useState(false);
  const [popUpData, setPopUpdata] = useState();
  const [popupTitle, setPopupTitle] = useState("Add New Script");
  const [loaderText, setLoaderText] = useState("");

  const [open, setOpen] = useState(false);
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
  const [loader, setLoader] = useState(false);
  const [selectedLang, setSelectedLang] = useState(null);
  const [showSourceData, setShowSourceData] = useState([]);
  const actions = [
    { icon: <img src={copy} />, onClick: (row) => addScene(row) },
    {
      icon: <img src={reuse} />,
      onClick: (row) => alert(`Delete ${row["Scene No."]}`),
    },
  ];
  const [openDownloadPopup, setOpenDownloadPopup] = useState(false);
  const [openShowPopup, setOpenShowPopup] = useState(false);
  const [openRegenerateePopup, setOpenRegeneratePopup] = useState(false);

  // console.log(rows, data);
  useEffect(() => {
    settingDataInRows(extraDetails?.scenes);
  }, [extraDetails?.scenes]);

  const settingDataInRows = (reqData) => {
    let newdata = reqData?.map((item, index) => {
      let data = {
        // "Scene No.": item?.scene_number,
        "Scene No.": index + 1,
        Script: item?.description,
        OST: item?.on_screen_text ?? "-",
        Type: item?.scene_type,
        id: item?.scene_id,
      };
      return data;
    });
    setRows(newdata);
  };

  const addScene = (data) => {
    setPopUpdata(data);
    if (data && data.OST) {
      setPopupTitle("Edit Script");
    } else {
      setPopupTitle("Add New Script");
    }
    setOpenPopup(true);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const updated = Array.from(rows);
    const [moved] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, moved);

    // Reassign scene numbers based on new order
    const reIndexed = updated.map((item, index) => ({
      ...item,
      "Scene No.": index + 1,
    }));
    setRows(reIndexed);
    showToast.success("Updated Successfully!");
  };

  const handleDownloadScript = () => {
    setOpenDownloadPopup(true);
  };
  const [showSourceLoader, setShowSourceLoader] = useState(false);
  const handleShowSource = async () => {
    setOpenShowPopup(true);
    setShowSourceLoader(true);
    try {
      const response = await fetch(`${BASE_URL}show-source/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        // console.log(data?.documents, "check")
        setShowSourceData(data?.documents);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    } finally {
      setShowSourceLoader(false);
    }
  };

  const handleDownloadType = (type) => {
    try {
      if (type === "pdf") {
        downloadScriptPdf({ ...extraDetails, scenes: rows });
      } else if (type === "word") {
        downloadScriptWord({ ...extraDetails, scenes: rows });
      }
      setOpenDownloadPopup(false);
    } catch (err) {
      console.error("Error generating file:", err);
    }
  };

  const handleUpdate = (data) => {
    // setSceneData({...sceneData,sceneData:})
    console.log(data, "check-data");
    // // // edit
    if (data?.fieldData) {
      let newData = rows.map((item) => {
        console.log(item);
        let child = { ...item };
        if (item?.id === data?.fieldData.id) {
          child = {
            "Scene No.": data.fieldData?.["Scene No."],
            Script: data?.script,
            OST: data?.ost,
            Type: data?.type,
            id: data.fieldData?.id,
          };
        }
        return child;
      });
      setRows(newData);
      console.log(newData);
      // setRows((prev) => [
      //   prev.map((scene) => (scene.id === data?.fieldData.id ? data : scene)),
      // ]);
    } else {
      // adding new row
      const newScene = {
        id: Date.now(),
        "Scene No.": (rows?.length || 0) + 1,
        ...data,
        Script: data?.script,
        OST: data?.ost,
        Type: data?.type,
      };

      setRows((prev) => [...prev, newScene]);
    }

    showToast.success("Scene saved successfully");
    setOpenPopup(false);
  };

  const handleTranslateScript = async () => {
    const file_id = pdfId || id;
    // const data = {
    //   file_id: file_id,
    //   language: selectedLang,
    //   provider: 'azure'
    // };
    if (!file_id) return;
    const formData = new FormData();
    if (id) {
      formData.append("script_id", file_id);
      formData.append("language", selectedLang);
      formData.append("provider", "azure");
    } else {
      formData.append("file_id", file_id);
      formData.append("language", selectedLang);
      formData.append("provider", "azure");
    }

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
      if (!response.ok) {
        toast.error(translatedData?.message || "Error in translating");
        return;
      }
      const translatedData = await response.json();
      console.log(translatedData);
      settingDataInRows(translatedData?.data?.scenes);
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

  return (
    <>
      <div className={styles1.header}>
        <h2 className={styles1.title}>Your Script</h2>
        {showDragAndActions && (
          <div className={styles1.headerButtons}>
            <Button
              variant="outlined"
              className={styles1.outlineBtn}
              onClick={() => addScene()}
            >
              + Add Scene
            </Button>
            <Button
              variant="contained"
              className={styles1.primaryBtn}
              onClick={handleShowSource}
              disabled={extraDetails?.data_source == "openai"}
            >
              Show Source
            </Button>
            <ShowSourcePopup
              open={openShowPopup}
              onClose={() => setOpenShowPopup(false)}
              data={showSourceData}
              loader={showSourceLoader}
            />
            <Button
              className={styles1.icon}
              onClick={() => {
                navigate("/generate-script");
              }}
            >
              <IoArrowBackCircleOutline
                size={30}
                // onClick={() => navigate("/generate-script")}
              />{" "}
              Back
            </Button>
          </div>
        )}
      </div>
      {loader && <FullScreenGradientLoader text={loaderText} />}
      <TableContainer component={Paper} className={styles.tablePaper}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="table" isDropDisabled={!showDragAndActions}>
            {(provided) => (
              <Table
                className={styles.tableRoot}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <TableHead>
                  <TableRow className={styles.headRow}>
                    {/* Drag handle header cell */}
                    {/* <TableCell className={styles.headCell}></TableCell> */}
                    {showDragAndActions && (
                      <TableCell className={styles.headCell}></TableCell>
                    )}

                    {columns.map((col, idx) => (
                      <TableCell key={idx} className={styles.headCell}>
                        {col}
                      </TableCell>
                    ))}

                    {showDragAndActions && actions?.length > 0 && (
                      <TableCell className={styles.headCell}>Action</TableCell>
                    )}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rows.map((row, rIdx) => (
                    <Draggable
                      key={row.id || rIdx}
                      draggableId={String(row.id || rIdx)}
                      index={rIdx}
                      isDragDisabled={!showDragAndActions}
                    >
                      {(provided) => (
                        <TableRow
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={styles.bodyRow}
                        >
                          {/* Drag handle cell */}
                          {showDragAndActions && (
                            <TableCell className={styles.bodyCell}>
                              <IconButton
                                {...provided.dragHandleProps}
                                size="small"
                                className={styles.dragHandle}
                              >
                                <DragIndicatorIcon />
                              </IconButton>
                            </TableCell>
                          )}
                          {/* <TableCell className={styles.bodyCell}>
                            <IconButton
                              {...provided.dragHandleProps}
                              size="small"
                              className={styles.dragHandle}
                            >
                              <DragIndicatorIcon />
                            </IconButton>
                          </TableCell> */}

                          {/* Data cells */}
                          {columns.map((col, cIdx) => (
                            <TableCell key={cIdx} className={styles.bodyCell}>
                              {/* {cIdx == 0 ? rIdx + 1 : row[col]} */}
                              {row[col]}
                            </TableCell>
                          ))}

                          {/* Action icons */}
                          {showDragAndActions && actions?.length > 0 && (
                            <TableCell className={styles.bodyCell}>
                              <div className={styles.actionsWrap}>
                                {actions.map((act, aIdx) => (
                                  <IconButton
                                    key={aIdx}
                                    className={styles.iconBtn}
                                    size="small"
                                    onClick={() => {
                                      act.onClick(row);
                                    }}
                                  >
                                    {act.icon}
                                  </IconButton>
                                ))}
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableBody>
              </Table>
            )}
          </Droppable>
        </DragDropContext>
      </TableContainer>

      <AddNewScriptPopup
        open={openPopUp}
        onClose={() => setOpenPopup(false)}
        fieldData={popUpData}
        title={popupTitle}
        handleUpdate={handleUpdate}
      />

      <div className={styles.footerButtons}>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
          className={styles.stack}
        >
          <ButtonComp
            label={loader ? "Translating" : "Translate Script"}
            variant="contained"
            sx={{
              backgroundColor: "#239DE0",
              "&:hover": { backgroundColor: "#7fbcddff" },
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
                  handleTranslateScript();
                  setOpen(false);
                }}
              />
            </div>
          </PopupModal>
          {showDragAndActions && (
            <>
              <Button
                variant="outlined"
                className={styles.largeOutline}
                onClick={() => setOpenRegeneratePopup(true)}
              >
                Regenerate Script
              </Button>
              <RegenerateScriptPopup
                open={openRegenerateePopup}
                onClose={() => setOpenRegeneratePopup(false)}
                // data={showSourceData}
              />
            </>
          )}

          {!showDragAndActions && (
            <Button variant="outlined" className={styles.largeOutline}>
              Save
            </Button>
          )}

          <Button
            variant="contained"
            className={styles.successBtn}
            onClick={handleDownloadScript}
          >
            Download Script
          </Button>
          {showDragAndActions && (
            <Button variant="contained" className={styles.primaryBtn}>
              Create Visual Content
            </Button>
          )}
        </Stack>

        <DownloadPopup
          open={openDownloadPopup}
          onClose={() => setOpenDownloadPopup(false)}
          onSelect={handleDownloadType}
        />
      </div>
    </>
  );
}

export default DynamicTable;
