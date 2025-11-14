import { useEffect, useState } from "react";
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
  Tooltip,
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
import deleteIcon from "../../assets/delete.svg";
import styles1 from "../../Pages/AddNewScriptPage/AddNewScript.module.css";
import DownloadPopup from "./popup/DownloadPopup";
import ShowSourcePopup from "./popup/ShowSourcePopup";
import RegenerateScriptPopup from "./popup/RegenerateScriptPopup";
import ButtonComp from "./Buton/Button";
import PopupModal from "../popUps/LanguagePopup";
import { toast } from "react-toastify";
import api, { BASE_URL } from "../../api/axios";
import FullScreenGradientLoader from "./GradientLoader";
import { MdDone } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { postTranslatedDataSave } from "../../redux/features/saveSlice";
import DeleteScenePopup from "./popup/DeleteScenePopup";
import { postCreateVisualContent } from "../../redux/features/createVisualSlice";
import { languages } from "../../utils/languageOptions";
import SinglePromptModal from "./SinglePromptModal";

function DynamicTable({
  columns = [],

  extraDetails = {},
  showDragAndActions = true,
  pdfId,
  setMakeChanges,
  features = true,
  visualContentTitle,
}) {
  const [tableExtraData, setTableExtraData] = useState({});
  useEffect(() => {
    setTableExtraData(extraDetails);
  }, [extraDetails]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [openPopUp, setOpenPopup] = useState(false);
  const [popUpData, setPopUpdata] = useState();
  const [popupTitle, setPopupTitle] = useState("Add New Script");
  const [loaderText, setLoaderText] = useState("");
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [selectedLang, setSelectedLang] = useState("");
  const [showSourceData, setShowSourceData] = useState([]);
  const [sceneData, setSceneData] = useState({});
  const dispatch = useDispatch();
  const { saveLoader, saveTranslatedData } = useSelector(
    (store) => store.SaveTranslatedData
  );
  const [openDownloadPopup, setOpenDownloadPopup] = useState(false);
  const [openShowPopup, setOpenShowPopup] = useState(false);
  const [openRegeneratePopup, setOpenRegeneratePopup] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [selectedScene, setSelectedScene] = useState(null);
  const [regenerateDisabled, setRegenerateDisabled] = useState(false);
  const [operations, setOperations] = useState(false);
  const [openSavePrompt, setOpenSavePrompt] = useState(false);

  const handleSavePrompt = (prompt) => {
    console.log("Saving prompt:", prompt);
    // your saving logic here
  };
  const filteredLanguages = languages.filter(
    (lang) => lang !== tableExtraData?.language
  );
  const { saveVisualContentLoader } = useSelector(
    (store) => store.CreateVisualContent
  );
  const { scriptLoader } = useSelector((store) => store.Script);

  const actions = [
    {
      icon: <img src={copy} />,
      onClick: (row) => {
        addScene(row);
        setMakeChanges(true);
      },
    },
    {
      icon: (
        <Tooltip
          title={
            regenerateDisabled ? "Please save before regenerating again" : ""
          }
          placement="top"
          arrow
        >
          <span>
            <img
              src={reuse}
              alt="regenerate"
              style={{
                opacity: regenerateDisabled ? 0.5 : 1,
                cursor: regenerateDisabled ? "not-allowed" : "pointer",
              }}
            />
          </span>
        </Tooltip>
      ),
      onClick: (row) => {
        if (!regenerateDisabled) {
          setSceneData(row);
          setOpenRegeneratePopup(true);
          setMakeChanges(true);
        }
      },
    },
    {
      icon: <img src={deleteIcon} alt="icon" />,
      onClick: (row) => {
        setMakeChanges(true);
        // setSceneData(row);
        handleDeleteScene(row);
      },
    },
  ];

  useEffect(() => {
    if (tableExtraData?.scenes) {
      settingDataInRows(tableExtraData?.scenes);
    }
  }, [tableExtraData?.scenes]);

  useEffect(() => {
    if (saveTranslatedData && !saveLoader) {
      setRegenerateDisabled(false);
    }
  }, [saveTranslatedData, saveLoader]);

  const settingDataInRows = (reqData) => {
    let newdata = reqData?.map((item, index) => {
      let data = {
        // "Scene No.": item?.scene_number,
        "Scene No.": index + 1,
        Script: item?.description ?? item?.Script ?? "",
        OST: item?.on_screen_text ?? item?.OST ?? "-",
        Type: item?.scene_type ?? item?.Type ?? "",
        id: item?.scene_id ?? item?.id ?? "",
      };
      return data;
    });
    setRows(newdata);
  };

  const addScene = (data) => {
    setPopUpdata(data);
    setOperations(true);
    if (data && data.OST) {
      setPopupTitle("Edit Scene");
    } else {
      setPopupTitle("Add New Scene");
    }
    setOpenPopup(true);
  };

  const handleDragEnd = (result) => {
    setMakeChanges(true);
    setOperations(true);
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
    // setMakeChanges(true);
  };
  const [showSourceLoader, setShowSourceLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);

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
        // setShowSourceData(data?.documents);
        setShowSourceData(data);
      }
    } catch (error) {
      // console.log(error);
      toast.error("Something went wrong!");
    } finally {
      setShowSourceLoader(false);
    }
    // setMakeChanges(true);
  };

  const handleDownloadType = (type) => {
    try {
      if (type === "pdf") {
        downloadScriptPdf({ ...tableExtraData, scenes: rows });
      } else if (type === "word") {
        downloadScriptWord({ ...tableExtraData, scenes: rows });
      }
      setOpenDownloadPopup(false);
    } catch (err) {
      console.error("Error generating file:", err);
    }
    // setMakeChanges(true);
  };

  const handleUpdate = (data) => {
    setMakeChanges(true);
    setOperations(true);
    // // // edit
    if (data?.fieldData) {
      let newData = rows.map((item) => {
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
    setOperations(true);
    const file_id = pdfId || id;
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
        body: formData,
      });
      if (!response.ok) {
        toast.error(translatedData?.message || "Error in translating");
        return;
      }
      const translatedData = await response.json();
      setTableExtraData(translatedData?.data);
      // settingDataInRows(translatedData?.data?.scenes);
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
    setMakeChanges(true);
  };

  const handleSetData = (data) => {
    setOperations(true);
    // setActionsDisabled(true);
    setRegenerateDisabled(true);

    if (sceneData?.id) {
      let scenes = [...rows]?.map((item) => {
        if (item?.["Scene No."] == sceneData?.["Scene No."]) {
          let new_data = {
            ...data,
          };
          return new_data;
        } else {
          return item;
        }
      });
      setTableExtraData({ ...extraDetails, scenes: scenes });
    } else {
      setTableExtraData(data);
    }
    setMakeChanges(true);
  };

  const handleDeleteScene = (scene) => {
    setSelectedScene(scene);
    setOperations(true);
    setOpenDeletePopup(true);
    setMakeChanges(true);
  };

  const confirmDeleteScene = async (scene) => {
    setOperations(true);
    const payload = {
      script_id: id,
      scene_id: scene.id,
    };
    setDeleteLoader(true);
    try {
      await api.post("mongo/delete_scene", payload);
      successDelete(scene);
      setRows((prev) => prev.filter((item) => item.id !== scene.id));
      setOpenDeletePopup(false);
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteLoader(false);
    }
  };

  const successDelete = (scene) => {
    let updatedRows = [...rows].filter((item) => item.id !== scene.id);

    let Updated_rows = updatedRows.map((item, index) => {
      let data = { ...item };

      data["Scene No."] = index + 1;
      return data;
    });
    setRows(Updated_rows);
  };

  const handleSave = () => {
    setOperations(false);
    const data = {
      data: {
        ...tableExtraData,
      },
    };
    // const dataForAudio = {
    //   ...tableExtraData,
    // };
    // console.log(data, dataForAudio, "check_data_For_Both");
    dispatch(postTranslatedDataSave(data));
    // .then((success) => {
    //   if (success) {
    //     dispatch(postAudioAnimationData(dataForAudio));
    //   }
    // });

    setMakeChanges(false);
  };

  const handleCreateVisualContent = () => {
    dispatch(postCreateVisualContent(tableExtraData));
  };

  return (
    <>
      <div className={styles1.header}>
        <h2 className={styles1.title}>
          {tableExtraData?.title || visualContentTitle || "Your Script"}
        </h2>
        {showDragAndActions && features && (
          <div className={styles1.headerButtons}>
            <Button
              variant="outlined"
              className={styles1.outlineBtn}
              onClick={() => addScene()}
            >
              + Add Scene
            </Button>
            <Tooltip
              title={
                tableExtraData?.data_source === "openai"
                  ? "OpenAI does not have any source"
                  : ""
              }
              disableHoverListener={tableExtraData?.data_source !== "openai"}
              arrow
            >
              <span>
                <Button
                  variant="contained"
                  className={styles1.primaryBtn}
                  onClick={handleShowSource}
                  disabled={tableExtraData?.data_source == "openai"}
                >
                  Show Source
                </Button>
              </span>
            </Tooltip>

            <Button
              variant="contained"
              className={styles1.BtnSavePrompt}
              onClick={() => setOpenSavePrompt(true)}
            >
              Save Prompt
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
      {saveVisualContentLoader && (
        <FullScreenGradientLoader text="loading..." />
      )}
      {saveLoader && <FullScreenGradientLoader text={"Loading..."} />}
      {loader && <FullScreenGradientLoader text={loaderText} />}
      {scriptLoader && <FullScreenGradientLoader text="Deleting..." />}
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

      <DeleteScenePopup
        open={openDeletePopup}
        onClose={() => setOpenDeletePopup(false)}
        onConfirm={confirmDeleteScene}
        rowData={selectedScene}
        id={id}
        loader={deleteLoader}
      />

      <div className={styles.footerButtons}>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
          className={styles.stack}
        >
          {features && (
            <>
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
                  {filteredLanguages.map((lang, index) => (
                    <div
                      key={index}
                      className={`${styles.languageItem} ${
                        selectedLang === lang ? styles.activeLang : ""
                      }`}
                      onClick={() => {
                        setSelectedLang(lang);
                        setMakeChanges(true);
                      }}
                    >
                      {selectedLang === lang && (
                        <MdDone size={20} className={styles.tickIcon} />
                      )}
                      <span>{lang}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.popupButtonRow}>
                  <ButtonComp
                    label="Translate Script"
                    variant="contained"
                    className={styles.downloadBtn}
                    action={() => {
                      handleTranslateScript();
                      setOpen(false);
                    }}
                  />
                </div>
              </PopupModal>
            </>
          )}

          {showDragAndActions && (
            <>
              {features && (
                <Button
                  variant="outlined"
                  className={styles.largeOutline}
                  onClick={() => {
                    setMakeChanges(true);
                    setSceneData({});
                    setOpenRegeneratePopup(true);
                  }}
                >
                  Regenerate Script
                </Button>
              )}

              <RegenerateScriptPopup
                open={openRegeneratePopup}
                onClose={() => {
                  setOpenRegeneratePopup(false);
                  setSceneData({});
                }}
                id={id}
                // setTableExtraData={setTableExtraData}
                setTableExtraData={(data) => handleSetData(data)}
                sceneId={sceneData}
                tableData={tableExtraData}
                // data={showSourceData}
              />
            </>
          )}
          {features && (
            <Button
              label={saveLoader ? "Saving" : "Save"}
              variant="outlined"
              className={styles.largeOutline}
              onClick={handleSave}
              disabled={saveLoader}
            >
              Save
            </Button>
          )}
          {features && (
            <Button
              variant="contained"
              className={styles.successBtn}
              onClick={handleDownloadScript}
            >
              Download Script
            </Button>
          )}

          {showDragAndActions && features && (
            <>
              <Tooltip
                title={
                  !saveTranslatedData
                    ? "Please save before creating visual content."
                    : ""
                }
                placement="top"
                arrow
              >
                <span>
                  <Button
                    onClick={() => {
                      handleCreateVisualContent();
                    }}
                    variant="contained"
                    className={styles.primaryBtn}
                    // disabled={saveTranslatedData === null }
                    disabled={saveTranslatedData === null || operations}
                  >
                    Create Visual Content
                  </Button>
                </span>
              </Tooltip>
            </>
          )}
        </Stack>
        <SinglePromptModal
          open={openSavePrompt}
          onClose={() => setOpenSavePrompt(false)}
          prompt="Write an SEO optimized article about modern React architecture."
          onSave={handleSavePrompt}
          size="md"
        />

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
