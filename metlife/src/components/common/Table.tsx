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
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  Typography,
  Box,
} from "@mui/material";

import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";

import styles from "./Table.module.css";
import AddNewScriptPopup from "../popUps/addScripts";
import { downloadScriptPdf, downloadScriptWord } from "../../utils";
import { showToast } from "../../utils/toast";

import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useLocation, useNavigate, useParams } from "react-router";
import copy from "../../assets/copy.svg";
import reuse from "../../assets/reuse.svg";
import deleteIcon from "../../assets/Group_Delete.svg";

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
import { postSavePrompt } from "../../redux/features/promptSlice";
import {
  getExtractCharacters,
  postDeleteScene,
  postExtractCharacters,
  postPromptSetupCharacters,
} from "../../redux/features/scriptSlice";
import { CharacterCarousel } from "./carousel/CharacterCarousel";

export interface SceneRow {
  id: string | number;
  "Scene No.": number;
  Script: string;
  OST: string;
  Type: string;
  [key: string]: any;
}

export interface DynamicTableProps {
  columns: string[];
  extraDetails?: any;
  showDragAndActions?: boolean;
  pdfId?: string | number | null;
  setMakeChanges?: (val: boolean) => void;
  features?: boolean;
  visualContentTitle?: string;
}

interface RootState {
  SaveTranslatedData: {
    saveLoader: boolean;
    saveTranslatedData: any;
  };
  CreateVisualContent: {
    saveVisualContentLoader: boolean;
  };
  Script: {
    scriptLoader: boolean;
  };
}

type FlowStep = "characters" | "mixed-options" | null;

const DynamicTable: React.FC<DynamicTableProps> = ({
  columns = [],
  extraDetails = {},
  showDragAndActions = true,
  pdfId,
  setMakeChanges = () => {},
  features = true,
  visualContentTitle,
}) => {
  const [tableExtraData, setTableExtraData] = useState<any>({});
  const [rows, setRows] = useState<SceneRow[]>([]);
  const [openPopUp, setOpenPopup] = useState<boolean>(false);
  const [popUpData, setPopUpdata] = useState<any>(null);
  const [popupTitle, setPopupTitle] = useState("Add New Script");
  const [loaderText, setLoaderText] = useState("");
  const [loader, setLoader] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string>("");
  const [showSourceData, setShowSourceData] = useState<any[]>([]);
  const [sceneData, setSceneData] = useState<any>({});
  const dispatch = useDispatch<any>();
  const params = useParams<{ id?: string }>();
  const id: any = params?.id;
  const navigate = useNavigate();
  const { saveLoader, saveTranslatedData } = useSelector(
    (store: RootState) => store.SaveTranslatedData
  );

  const { characterData, promptData, scriptLoader } = useSelector(
    (store) => store.Script
  );
  const { pathname } = useLocation();
  const { saveVisualContentLoader } = useSelector(
    (store: RootState) => store.CreateVisualContent
  );
  // const { scriptLoader } = useSelector((store: RootState) => store.Script);
  const [openDownloadPopup, setOpenDownloadPopup] = useState(false);
  const [openShowPopup, setOpenShowPopup] = useState(false);
  const [openRegeneratePopup, setOpenRegeneratePopup] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [selectedScene, setSelectedScene] = useState<SceneRow | null>(null);
  const [regenerateDisabled, setRegenerateDisabled] = useState(false);
  const [operations, setOperations] = useState(false);
  const [openSavePrompt, setOpenSavePrompt] = useState(false);
  const latestPrompt = tableExtraData?.latest_prompt;
  const [showSourceLoader, setShowSourceLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [openCharacterModal, setOpenCharacterModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [charImageExist, setCharImageExist] = useState(
    extraDetails?.char_image_exist
  );
  const [openFlowDialog, setOpenFlowDialog] = useState(false);

  const [flowStep, setFlowStep] = useState<FlowStep>(null);
  useEffect(() => {
    setTableExtraData(extraDetails ?? {});
  }, [extraDetails]);

  useEffect(() => {
    if (tableExtraData?.scenes && tableExtraData.scenes[0].scenes) {
      settingDataInRows(tableExtraData.scenes[0].scenes);
    } else {
      settingDataInRows(tableExtraData.scenes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableExtraData?.scenes]);

  useEffect(() => {
    if (saveTranslatedData && !saveLoader) {
      setRegenerateDisabled(false);
    }
  }, [saveTranslatedData, saveLoader]);

  useEffect(() => {
    if (tableExtraData?.char_image_exist === true && id) {
      dispatch(getExtractCharacters(id));
    }
  }, [id, dispatch, tableExtraData?.char_image_exist]);

  useEffect(() => {
    if (
      tableExtraData?.video_style === "mixed" &&
      tableExtraData?.char_image_exist
    ) {
      setFlowStep("mixed-options");
      setOpenFlowDialog(true);
    }
  }, [tableExtraData?.char_image_exist]);

  const handleSavePrompt = (prompt: string) => {
    const payload = { prompt };
    dispatch(
      postSavePrompt(
        id ?? "",
        payload,
        () => setOpenSavePrompt(false),
        setOperations
      )
    );
  };

  const filteredLanguages = languages.filter(
    (lang) => lang !== tableExtraData?.language
  );

  const actions = [
    {
      icon: (
        <Tooltip title="Edit" placement="top" arrow>
          <span>
            <img src={copy} />
          </span>
        </Tooltip>
      ),
      onClick: (row: any) => {
        addScene(row);
        setMakeChanges(true);
      },
    },
    {
      icon: (
        <Tooltip
          title={
            regenerateDisabled
              ? "Please save before regenerating again"
              : "Regenerate"
          }
          placement="top"
          arrow
        >
          <span>
            <img
              src={reuse}
              alt="regenerate"
              style={{
                // opacity: regenerateDisabled ? 0.5 : 1,
                // cursor: regenerateDisabled ? "not-allowed" : "pointer",
                opacity:
                  regenerateDisabled || pathname?.startsWith("SCRIPT-")
                    ? 0.5
                    : 1,
                cursor:
                  regenerateDisabled || pathname?.startsWith("SCRIPT-")
                    ? "not-allowed"
                    : "pointer",
              }}
            />
          </span>
        </Tooltip>
      ),
      onClick: (row: any) => {
        if (!regenerateDisabled) {
          setSceneData(row);
          setOpenRegeneratePopup(true);
          setMakeChanges(true);
        }
      },
    },
    {
      icon: (
        <Tooltip title="Delete" placement="top" arrow>
          <span>
            <img src={deleteIcon} alt="icon" />
          </span>
        </Tooltip>
      ),
      onClick: (row: any) => {
        setMakeChanges(true);
        // setSceneData(row);
        handleDeleteScene(row);
      },
    },
  ];

  const settingDataInRows = (data: any[]) => {
    const mapped: SceneRow[] = (data ?? []).map((item: any, idx: number) => ({
      "Scene No.": idx + 1,
      Script: item?.description ?? item?.Script ?? "",
      OST: item?.on_screen_text ?? item?.OST ?? "-",
      Type: item?.scene_type ?? item?.Type ?? "",
      id: item?.scene_id ?? item?.id ?? "",
    }));

    setRows(mapped);
  };

  const addScene = (data?: any) => {
    setPopUpdata(data ?? null);
    setOperations(true);
    setPopupTitle(data?.OST ? "Edit Scene" : "Add New Scene");
    setOpenPopup(true);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    setMakeChanges(true);
    setOperations(true);

    const updated = Array.from(rows);
    const [moved] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, moved);

    const reIndexed = updated.map((item, index) => ({
      ...item,
      "Scene No.": index + 1,
    }));

    setRows(reIndexed);
    showToast.success("Updated Successfully!");
  };

  const handleDownloadType = (type: string) => {
    try {
      if (type === "pdf") {
        downloadScriptPdf({ ...tableExtraData, scenes: rows }, true);
      } else if (type === "word") {
        downloadScriptWord({ ...tableExtraData, scenes: rows });
      }
      setOpenDownloadPopup(false);
    } catch (err) {
      console.error("Error generating file:", err);
    }
    // setMakeChanges(true);
  };

  const handleUpdate = (data: any) => {
    setMakeChanges(true);
    setOperations(true);

    if (data?.fieldData) {
      const updated = rows.map((item) =>
        item.id === data.fieldData.id
          ? {
              "Scene No.": data.fieldData?.["Scene No."],
              Script: data.script,
              OST: data.ost,
              Type: data.type,
              id: data.fieldData?.id,
            }
          : item
      );
      setRows(updated);
    } else {
      const newScene: SceneRow = {
        id: Date.now(),
        "Scene No.": rows.length + 1,
        Script: data.script,
        OST: data.ost,
        Type: data.type,
      };
      setRows((prev) => [...prev, newScene]);
    }

    showToast.success("Scene saved successfully");
    setOpenPopup(false);
  };

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
      console.log(error);
      toast.error("Something went wrong!");
    } finally {
      setShowSourceLoader(false);
    }
    // setMakeChanges(true);
  };

  const handleTranslateScript = async () => {
    if (!pdfId && !id) return;

    setOperations(true);
    setLoader(true);
    setLoaderText("Translating script...");

    const file_id = pdfId ?? id;
    const formData = new FormData();
    formData.append(id ? "script_id" : "file_id", String(file_id));
    formData.append("language", selectedLang);
    formData.append("provider", "azure");
    if (
      tableExtraData?.version !== undefined &&
      tableExtraData?.version !== null
    ) {
      formData.append("source_version", String(tableExtraData.version));
    }

    try {
      const response = await fetch(`${BASE_URL}translate-script-json`, {
        method: "POST",
        body: formData,
      });

      const translated = await response.json();
      if (!response.ok) {
        toast.error(translated?.message || "Error in translating");
        return;
      }

      setTableExtraData(translated?.data);
      toast.success(translated?.message || "Translate successful");
    } catch {
      toast.error("Error in translating!");
    } finally {
      setLoader(false);
      setLoaderText("");
    }

    setMakeChanges(true);
  };

  const handleSetData = (data: any) => {
    setOperations(true);
    setRegenerateDisabled(true);

    if (sceneData?.id) {
      const updated = rows.map((item) =>
        item["Scene No."] === sceneData["Scene No."] ? { ...data } : item
      );
      setTableExtraData({ ...extraDetails, scenes: updated });
    } else {
      setTableExtraData(data);
    }

    setMakeChanges(true);
  };

  const handleSave = () => {
    setOperations(false);
    const { script_status, saved_version, ...rest } = tableExtraData;

    const data = {
      data: {
        ...rest,
        script_id: id,
        title: tableExtraData?.title,
        version: tableExtraData?.version,
      },
      is_save_action: true,
    };
    console.log(data);
    dispatch(
      postTranslatedDataSave(data, (id) => {
        if (pathname === "/translated-script") {
          navigate(`/scenes/${id}`);
        }
      })
    );
    setMakeChanges(false);
  };

  const handleDeleteScene = (scene: SceneRow) => {
    setSelectedScene(scene);
    setOperations(true);
    setOpenDeletePopup(true);
    setMakeChanges(true);
  };

  const editSceneForScript = () => {};

  const confirmDeleteScene = async (scene: SceneRow) => {
    if (!id) return;
    // dispatch(
    //   postDeleteScene(
    //     {
    //       script_id: id,
    //       scene_id: scene.id,
    //       version: tableExtraData?.version,
    //     },
    //     setOpenDeletePopup,
    //     // successDelete
    //   )
    // );

    const payload = {
      script_id: id,
      scene_id: scene.id,
      version: tableExtraData?.version,
    };
    setDeleteLoader(true);

    try {
      await api.post("mongo/delete_scene", payload);
      successDelete(scene);
      setRows((prev) => prev.filter((item) => item.id !== scene.id));
      setOpenDeletePopup(false);
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteLoader(false);
    }
  };

  const successDelete = (scene: SceneRow) => {
    const updated = rows
      .filter((item) => item.id !== scene.id)
      .map((item, idx) => ({
        ...item,
        "Scene No.": idx + 1,
      }));

    setRows(updated);
  };

  const handleOpenFlowDialog = () => {
    // setOpenFlowDialog(true);
    if (tableExtraData?.video_style === "conversational") {
      setFlowStep("characters");
      setOpenFlowDialog(true);
      return;
    }

    // Mixed also requires characters FIRST
    if (tableExtraData?.video_style === "mixed") {
      setFlowStep("characters");
      setOpenFlowDialog(true);
      return;
    }
  };

  const handleCloseFlowDialog = () => {
    setOpenFlowDialog(false);
  };

  const handleCreateVisualContent = (flowType) => {
    const payload = { ...tableExtraData };
    if (tableExtraData?.video_style === "mixed") {
      payload.flow_type = flowType;
    }

    dispatch(postCreateVisualContent(payload));
  };

  const handleVersion = async (versionId?: string) => {
    if (!versionId) return;
    setLoader(true);
    try {
      const result = await api.get(`scripts/${id}?version=${versionId}`);
      setTableExtraData(result?.data);
    } catch (e: any) {
      showToast.error(e?.detail);
    } finally {
      setLoader(false);
    }
  };

  const handleCharacterGenerateImages = (prompts: Record<string, string>) => {
    dispatch(
      postExtractCharacters(id, () => {
        setCharImageExist(true);
      })
    );
  };

  const handleOpenCharacterModal = (index = 0) => {
    setCurrentIndex(index);
    setOpenCharacterModal(true);
  };

  const handleCloseCharacterModal = () => {
    setOpenCharacterModal(false);
  };

  const handleSetupPrompt = () => {
    dispatch(postPromptSetupCharacters(id));
  };

  const handleGenerateImagesFlow = () => {
    if (promptData?.length) {
      handleOpenCharacterModal();
    } else {
      handleSetupPrompt();
    }
  };
  console.log(characterData?.length, "characterdata");
  return (
    <>
      <div className={styles1.header}>
        <h2 className={styles1.title}>
          {tableExtraData?.title ||
            visualContentTitle ||
            tableExtraData?.upload_info?.title ||
            "Your Script"}
        </h2>

        {showDragAndActions && features && (
          <div className={styles1.headerButtons}>
            {/* Backwards Version */}
            <Tooltip
              title={
                !tableExtraData?.previous_version_id
                  ? "Does not have any previous version"
                  : ""
              }
              disableHoverListener={!tableExtraData?.previous_version_id}
              arrow
            >
              <span>
                <Button
                  variant="outlined"
                  className={styles1.outlineBtn}
                  onClick={() =>
                    handleVersion(tableExtraData?.previous_version_id)
                  }
                  disabled={!tableExtraData?.previous_version_id}
                >
                  ← Backward
                </Button>
              </span>
            </Tooltip>

            {/* Forward Version */}
            <Tooltip
              title={
                !tableExtraData?.next_version_id
                  ? "Does not have any next version"
                  : ""
              }
              disableHoverListener={!tableExtraData?.next_version_id}
              arrow
            >
              <span>
                <Button
                  variant="outlined"
                  className={styles1.outlineBtn}
                  onClick={() => handleVersion(tableExtraData?.next_version_id)}
                  disabled={!tableExtraData?.next_version_id}
                >
                  Forward →
                </Button>
              </span>
            </Tooltip>

            {/* Add Scene */}
            <Button
              variant="outlined"
              className={styles1.outlineBtn}
              onClick={() => addScene()}
            >
              + Add Scene
            </Button>

            {/* Show Source */}
            {!id?.startsWith("SCRIPT") && (
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
            )}
            {!id?.startsWith("SCRIPT") && (
              <Button
                variant="contained"
                className={styles1.BtnSavePrompt}
                onClick={() => setOpenSavePrompt(true)}
              >
                Save Prompt
              </Button>
            )}
            <ShowSourcePopup
              open={openShowPopup}
              onClose={() => setOpenShowPopup(false)}
              data={showSourceData}
              loader={showSourceLoader}
            />
            {/* Back Button */}
            <Button
              className={styles1.icon}
              onClick={() => navigate("/generate-script")}
            >
              <IoArrowBackCircleOutline size={30} /> Back
            </Button>
          </div>
        )}
      </div>

      {saveVisualContentLoader && (
        <FullScreenGradientLoader text="loading..." />
      )}
      {saveLoader && <FullScreenGradientLoader text={"Loading..."} />}
      {loader && <FullScreenGradientLoader text={loaderText} />}
      {scriptLoader && <FullScreenGradientLoader text="Loading..." />}

      {/* ---------------- TABLE ---------------- */}
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
                      key={String(row.id)}
                      draggableId={String(row.id)}
                      index={rIdx}
                      isDragDisabled={!showDragAndActions}
                    >
                      {(providedDraggable) => (
                        <TableRow
                          ref={providedDraggable.innerRef}
                          {...providedDraggable.draggableProps}
                          className={styles.bodyRow}
                        >
                          {showDragAndActions && (
                            <TableCell className={styles.bodyCell}>
                              <Tooltip
                                title="Drag & Drop"
                                placement="top"
                                arrow
                              >
                                <span>
                                  <IconButton
                                    {...providedDraggable.dragHandleProps} // ✅ FIXED HERE
                                    size="small"
                                    className={styles.dragHandle}
                                  >
                                    <DragIndicatorIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </TableCell>
                          )}

                          {columns.map((col, cIdx) => (
                            <TableCell key={cIdx} className={styles.bodyCell}>
                              {row[col as keyof SceneRow]}
                            </TableCell>
                          ))}

                          {showDragAndActions && (
                            <TableCell className={styles.bodyCell}>
                              <div className={styles.actionsWrap}>
                                {actions.map((act, aIdx) => (
                                  <IconButton
                                    key={aIdx}
                                    className={styles.iconBtn}
                                    size="small"
                                    onClick={() => act.onClick(row)}
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

                  {/*
                    `provided.placeholder` belongs to Droppable's render-props.
                    We render it below by using the `provided` variable from Droppable.
                  */}
                  {provided.placeholder}
                </TableBody>
              </Table>
            )}
          </Droppable>
        </DragDropContext>
      </TableContainer>

      {/* ---------------- POPUPS ---------------- */}
      <AddNewScriptPopup
        open={openPopUp}
        onClose={() => setOpenPopup(false)}
        fieldData={popUpData}
        title={popupTitle}
        handleUpdate={handleUpdate}
        tableData={tableExtraData}
      />

      <DeleteScenePopup
        open={openDeletePopup}
        onClose={() => setOpenDeletePopup(false)}
        onConfirm={confirmDeleteScene}
        rowData={selectedScene}
        id={id}
        loader={deleteLoader}
      />

      {/* FOOTER BUTTONS */}
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
              <CharacterCarousel
                open={openCharacterModal}
                onClose={handleCloseCharacterModal}
                characterData={characterData}
                promptData={promptData}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                onGenerateImages={handleCharacterGenerateImages}
                tableExtraData={tableExtraData}
                setOpenFlowDialog={setOpenFlowDialog}
              />

              <ButtonComp
                label={loader ? "Translating" : "Translate Script"}
                variant="contained"
                sx={{ backgroundColor: "#239DE0" }}
                action={() => setOpen(true)}
              />

              {/* Language Popup */}
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

          {showDragAndActions && features && (
            <Button
              variant="outlined"
              className={styles.largeOutline}
              disabled={pathname.startsWith("SCRIPT-")}
              onClick={() => {
                setMakeChanges(true);
                setSceneData({});
                setOpenRegeneratePopup(true);
              }}
            >
              Regenerate Script
            </Button>
          )}

          {/* Regenerate Popup */}
          <RegenerateScriptPopup
            open={openRegeneratePopup}
            onClose={() => {
              setOpenRegeneratePopup(false);
              setSceneData({});
            }}
            id={id}
            setTableExtraData={handleSetData}
            sceneId={sceneData}
            tableData={tableExtraData}
          />

          {features && (
            <Button
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
              onClick={() => setOpenDownloadPopup(true)}
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
                    onClick={
                      tableExtraData?.video_style === "conversational" ||
                      tableExtraData?.video_style === "mixed"
                        ? handleOpenFlowDialog
                        : handleCreateVisualContent
                    }
                    variant="contained"
                    className={styles.primaryBtn}
                    disabled={
                      saveTranslatedData === null ||
                      operations ||
                      // saveTranslatedData?.is_save_action === false
                      !saveTranslatedData?.saved_version
                    }
                  >
                    Create Visual Content
                  </Button>
                </span>
              </Tooltip>
              {tableExtraData?.video_style === "conversational" ||
              tableExtraData?.video_style === "mixed" ? (
                <>
                  <Dialog
                    open={openFlowDialog}
                    onClose={handleCloseFlowDialog}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                      sx: { borderRadius: 3, p: 3, textAlign: "center" },
                    }}
                  >
                    {tableExtraData?.video_style === "conversational" ? (
                      <Typography variant="h5" fontWeight={600} mb={1}>
                        Conversational Video Flow
                      </Typography>
                    ) : (
                      <Typography variant="h5" fontWeight={600} mb={1}>
                        Conmbined Video Flow
                      </Typography>
                    )}

                    <Typography color="text.secondary" mb={4}>
                      Choose to proceed:
                    </Typography>

                    <Box display="flex" justifyContent="center" gap={4} mb={4}>
                      {/* {!tableExtraData?.char_image_exist &&
                       ( */}
                      {(!tableExtraData?.char_image_exist ||
                        tableExtraData?.video_style === "conversational") &&
                        !(
                          tableExtraData?.video_style === "mixed" &&
                          characterData?.length > 0
                        ) && (
                          <Box
                            onClick={handleGenerateImagesFlow}
                            sx={{
                              cursor: "pointer",
                              width: 200,
                              p: 2,
                              borderRadius: 2,
                              border: "1px solid #e0e0e0",
                              transition: "0.2s",
                              "&:hover": {
                                boxShadow: 3,
                                transform: "translateY(-2px)",
                              },
                            }}
                          >
                            <Typography fontWeight={600}>
                              {promptData?.length
                                ? "View existing prompts & Images"
                                : "Create/Setup prompts"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Generate character images
                            </Typography>
                          </Box>
                        )}

                      {tableExtraData?.char_image_exist &&
                        tableExtraData?.video_style === "conversational" && (
                          <Box
                            onClick={() => {
                              handleCloseFlowDialog();
                              handleOpenCharacterModal();
                            }}
                            sx={{
                              cursor: "pointer",
                              width: 200,
                              p: 2,
                              borderRadius: 2,
                              border: "1px solid #e0e0e0",
                              transition: "0.2s",
                              "&:hover": {
                                boxShadow: 3,
                                transform: "translateY(-2px)",
                              },
                            }}
                          >
                            <Typography fontWeight={600}>
                              View Existing Images
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Continue conversational flow
                            </Typography>
                          </Box>
                        )}
                      {/* mixed */}
                      {tableExtraData?.video_style === "mixed" && (
                        <>
                          <Box
                            display="flex"
                            justifyContent="center"
                            gap={4}
                            mb={4}
                          >
                            {tableExtraData?.video_style === "mixed" &&
                              characterData?.length > 0 && (
                                <Box
                                  onClick={() =>
                                    handleCreateVisualContent("narrative")
                                  }
                                  sx={{
                                    cursor: "pointer",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    width: 160,
                                    p: 2,
                                    borderRadius: 2,
                                    border: "1px solid #e0e0e0",
                                    transition: "0.2s",
                                    "&:hover": {
                                      boxShadow: 3,
                                      transform: "translateY(-2px)",
                                    },
                                  }}
                                >
                                  <Typography fontWeight={600}>
                                    L3 – Narrative Flow
                                  </Typography>
                                </Box>
                              )}
                            {tableExtraData?.video_style === "mixed" &&
                              characterData?.length > 0 && (
                                <Box
                                  onClick={() =>
                                    handleCreateVisualContent("conversation")
                                  }
                                  sx={{
                                    cursor: "pointer",
                                    width: 160,
                                    p: 2,
                                    borderRadius: 2,
                                    border: "1px solid #e0e0e0",
                                    transition: "0.2s",
                                    "&:hover": {
                                      boxShadow: 3,
                                      transform: "translateY(-2px)",
                                    },
                                  }}
                                >
                                  <Typography fontWeight={600}>
                                    L4 – Conversational Flow
                                  </Typography>
                                </Box>
                              )}
                          </Box>
                        </>
                      )}
                    </Box>

                    <Button
                      onClick={handleCloseFlowDialog}
                      variant="outlined"
                      sx={{ px: 4 }}
                    >
                      Cancel
                    </Button>
                  </Dialog>
                </>
              ) : null}
            </>
          )}
        </Stack>

        <SinglePromptModal
          open={openSavePrompt}
          onClose={() => setOpenSavePrompt(false)}
          prompt={latestPrompt}
          onSave={handleSavePrompt}
          size="md"
          extraDetails={tableExtraData}
          operations={operations}
        />

        <DownloadPopup
          open={openDownloadPopup}
          onClose={() => setOpenDownloadPopup(false)}
          onSelect={handleDownloadType}
        />
      </div>
    </>
  );
};

export default DynamicTable;

// :
//   (tableExtraData?.video_style === "mixed" && promptData?.length > 0) ? (
//   <>
//     <Dialog
//       open={openFlowDialog}
//       onClose={handleCloseFlowDialog}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 3,
//           p: 3,
//           textAlign: "center",
//         },
//       }}
//     >
//       <Typography variant="h5" fontWeight={600} mb={1}>
//         Conmbined Video Flow
//       </Typography>

//       <Typography color="text.secondary" mb={4}>
//         Choose to proceed:
//       </Typography>

//       <Box display="flex" justifyContent="center" gap={4} mb={4}>
//         <Box
//           onClick={handleCreateVisualContent}
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             cursor: "pointer",
//             width: 160,
//             p: 2,
//             borderRadius: 2,
//             border: "1px solid #e0e0e0",
//             transition: "0.2s",
//             "&:hover": {
//               boxShadow: 3,
//               transform: "translateY(-2px)",
//             },
//           }}
//         >
//           <Typography fontWeight={600}>
//             L3 – Narrative Flow
//           </Typography>
//         </Box>
//         <Box
//           sx={{
//             cursor: "pointer",
//             width: 160,
//             p: 2,
//             borderRadius: 2,
//             border: "1px solid #e0e0e0",
//             transition: "0.2s",
//             "&:hover": {
//               boxShadow: 3,
//               transform: "translateY(-2px)",
//             },
//           }}
//         >
//           <Typography fontWeight={600}>
//             L4 – Conversational Flow
//           </Typography>
//         </Box>
//       </Box>

//       <Button
//         onClick={handleCloseFlowDialog}
//         variant="outlined"
//         sx={{ px: 4 }}
//       >
//         Cancel
//       </Button>
//     </Dialog>
//   </>
// )
