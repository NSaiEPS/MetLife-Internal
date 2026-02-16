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
  FormControl,
  Select,
} from "@mui/material";

import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";

import styles from "./Table.module.css";
import AddNewScriptPopup from "../../popUps/addScripts";
import { downloadScriptPdf, downloadScriptWord } from "../../../utils";
import { showToast } from "../../../utils/toast";

import {
  IoArrowBackCircleOutline,
  IoArrowForwardCircleOutline,
} from "react-icons/io5";
import { useLocation, useNavigate, useParams } from "react-router";
import copy from "../../../assets/copy.svg";
import reuse from "../../../assets/reuse.svg";
import deleteIcon from "../../../assets/Group_Delete.svg";

import styles1 from "../../../Pages/AddNewScriptPage/AddNewScript.module.css";
import DownloadPopup from "../popup/DownloadPopup";
import ShowSourcePopup from "../popup/ShowSourcePopup";
import RegenerateScriptPopup from "../popup/RegenerateScriptPopup";
import ButtonComp from "../Buton/Button";
import PopupModal from "../../popUps/LanguagePopup";

import { toast } from "react-toastify";
import api, { BASE_URL } from "../../../api/axios";
import FullScreenGradientLoader from "../GradientLoader";
import { MdDone } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import { postTranslatedDataSave } from "../../../redux/features/saveSlice";
import DeleteScenePopup from "../popup/DeleteScenePopup";
import { postCreateVisualContent } from "../../../redux/features/createVisualSlice";

import { languages } from "../../../utils/languageOptions";
import SinglePromptModal from "../SinglePromptModal";
import { postSavePrompt } from "../../../redux/features/promptSlice";
import {
  getExtractCharacters,
  postDeleteScene,
  postExtractCharacters,
  postPromptSetupCharacters,
} from "../../../redux/features/scriptSlice";
import { CharacterCarousel } from "../carousel/CharacterCarousel";
import TableRowComp from "./TableRowComp";
import TableComp from "./TableComp";

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
  // const [openPopUp, setOpenPopup] = useState<boolean>(false);
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
    (store: RootState) => store.SaveTranslatedData,
  );

  const { characterData, promptData, scriptLoader } = useSelector(
    (store) => store.Script,
  );
  const { pathname } = useLocation();
  const { saveVisualContentLoader } = useSelector(
    (store: RootState) => store.CreateVisualContent,
  );

  console.log(rows, "tableRowssss");
  // const { scriptLoader } = useSelector((store: RootState) => store.Script);
  const [selectedScene, setSelectedScene] = useState<SceneRow | null>(null);
  const latestPrompt = tableExtraData?.latest_prompt;

  // const [operations, setOperations] = useState(false);
  // const [openDownloadPopup, setOpenDownloadPopup] = useState(false);
  // const [openShowPopup, setOpenShowPopup] = useState(false);
  // const [openRegeneratePopup, setOpenRegeneratePopup] = useState(false);
  // const [openDeletePopup, setOpenDeletePopup] = useState(false);
  // const [regenerateDisabled, setRegenerateDisabled] = useState(false);
  // const [openSavePrompt, setOpenSavePrompt] = useState(false);
  // const [showSourceLoader, setShowSourceLoader] = useState(false);
  // const [deleteLoader, setDeleteLoader] = useState(false);
  // const [open, setOpen] = useState(false);
  // const [openCharacterModal, setOpenCharacterModal] = useState(false);

  const [uiState, setUiState] = useState({
    openPopup: false,
    openDownloadPopup: false,
    openShowPopup: false,
    openRegeneratePopup: false,
    openDeletePopup: false,
    regenerateDisabled: false,
    operations: false,
    openSavePrompt: false,
    showSourceLoader: false,
    deleteLoader: false,
    open: false,
    openCharacterModal: false,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [charImageExist, setCharImageExist] = useState(
    extraDetails?.char_image_exist,
  );
  const [openFlowDialog, setOpenFlowDialog] = useState(false);
  // const [flowStep, setFlowStep] = useState<FlowStep>(null);
  // const [targetVersion, setTargetVersion] = useState("");
  const PROVIDERS = ["google", "azure", "gpt"] as const;
  type ProviderType = (typeof PROVIDERS)[number];
  const PROVIDER_LABELS: Record<ProviderType, string> = {
    google: "GOOGLE",
    azure: "AZURE",
    gpt: "OneFrame Translator",
  };
  const [selectedProvider, setSelectedProvider] =
    React.useState<ProviderType>("azure");

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
      setUiState((prev) => ({ ...prev, regenerateDisabled: false }));
      // setRegenerateDisabled(false);
    }
  }, [saveTranslatedData, saveLoader]);

  useEffect(() => {
    if (tableExtraData?.char_image_exist === true && id) {
      dispatch(getExtractCharacters(id));
    }
  }, [id, dispatch, tableExtraData?.char_image_exist]);

  // useEffect(() => {
  //   if (
  //     tableExtraData?.video_style === "mixed" &&
  //     tableExtraData?.char_image_exist
  //   ) {
  //     setFlowStep("mixed-options");
  //     setOpenFlowDialog(true);
  //   }
  // }, [tableExtraData?.char_image_exist,  ]);

  const handleSavePrompt = (prompt: string) => {
    const payload = { prompt };
    dispatch(
      postSavePrompt(
        id ?? "",
        payload,
        () => setUiState((prev) => ({ ...prev, openSavePrompt: false })),
        (value: boolean) =>
          setUiState((prev) => ({ ...prev, operations: value })),
        // setOperations,
      ),
    );
  };

  const filteredLanguages = languages.filter(
    (lang) => lang !== tableExtraData?.language,
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
            // regenerateDisabled
            uiState?.regenerateDisabled
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
                  uiState?.regenerateDisabled || pathname?.startsWith("SCRIPT-")
                    ? 0.5
                    : 1,
                cursor:
                  uiState?.regenerateDisabled || pathname?.startsWith("SCRIPT-")
                    ? "not-allowed"
                    : "pointer",
              }}
            />
          </span>
        </Tooltip>
      ),
      onClick: (row: any) => {
        if (!uiState?.regenerateDisabled) {
          setSceneData(row);
          setUiState((prev) => ({ ...prev, openRegeneratePopup: true }));
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
      Script: item?.description ?? item?.Script ?? item?.transcript ?? "-",
      OST: item?.on_screen_text ?? item?.OST ?? item?.final_ost?.text ?? "-",
      Type: item?.scene_type ?? item?.Type ?? "",
      id: item?.scene_id ?? item?.id ?? "",
    }));

    setRows(mapped);
  };

  const addScene = (data?: any) => {
    setPopUpdata(data ?? null);
    setUiState((prev) => ({ ...prev, operations: true }));
    // setOperations(true);
    setPopupTitle(data?.OST ? "Edit Scene" : "Add New Scene");
    setUiState((prev) => ({ ...prev, openPopup: true }));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    setMakeChanges(true);
    setUiState((prev) => ({ ...prev, operations: true }));
    // setOperations(true);

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
    console.log(tableExtraData, rows, "tableExtraData");
    const filteredScenes = [...rows]?.filter(
      (scene) => scene?.is_deleted !== true,
    );
    console.log(filteredScenes, "filteredScenes");

    try {
      if (type === "pdf") {
        downloadScriptPdf(
          {
            ...tableExtraData,
            // scenes: rows
            scenes: filteredScenes,
          },
          true,
        );
      } else if (type === "word") {
        downloadScriptWord({
          ...tableExtraData,
          // scenes: rows,
          scenes: filteredScenes,
        });
      }
      setUiState((prev) => ({ ...prev, openDownloadPopup: false }));
    } catch (err) {
      console.error("Error generating file:", err);
    }
    // setMakeChanges(true);
  };

  const handleUpdate = (data: any) => {
    setMakeChanges(true);
    setUiState((prev) => ({ ...prev, operations: true }));
    // setOperations(true);

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
          : item,
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

    // showToast.success("Scene saved successfully");
    setUiState((prev) => ({ ...prev, openPopup: false }));
  };

  const handleShowSource = async () => {
    // setOpenShowPopup(true);
    setUiState((prev) => ({
      ...prev,
      openShowPopup: true,
    }));
    setUiState((prev) => ({ ...prev, showSourceLoader: true }));
    // setShowSourceLoader(true);
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
      setUiState((prev) => ({ ...prev, showSourceLoader: false }));
      // setShowSourceLoader(false);
    }
    // setMakeChanges(true);
  };

  const handleTranslateScript = async () => {
    if (!pdfId && !id) return;
    if (!selectedLang || !selectedProvider) return;

    // setOperations(true);
    setUiState((prev) => ({ ...prev, operations: true }));
    setLoader(true);
    setLoaderText("Translating script...");

    const file_id = pdfId ?? id;
    const formData = new FormData();
    formData.append(id ? "script_id" : "file_id", String(file_id));
    formData.append("language", selectedLang);
    // formData.append("provider", "azure");
    formData.append("provider", selectedProvider);

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
    // setOperations(true);
    setUiState((prev) => ({ ...prev, operations: true }));
    setUiState((prev) => ({ ...prev, regenerateDisabled: true }));
    // setRegenerateDisabled(true);

    if (sceneData?.id) {
      const updated = rows.map((item) =>
        item["Scene No."] === sceneData["Scene No."] ? { ...data } : item,
      );
      setTableExtraData({ ...extraDetails, scenes: updated });
    } else {
      setTableExtraData(data);
    }

    setMakeChanges(true);
  };

  const handleSave = () => {
    // setOperations(false);
    setUiState((prev) => ({ ...prev, operations: false }));
    const { script_status, saved_version, scenes, ...rest } = tableExtraData;
    // let updatedData = [...rows]?.map((parentItem) => {
    //   let data = [...scenes].filter((item) => item?.scene_id == parentItem?.id);
    //   if (data[0]) {
    //     data[0].description = parentItem?.Script;
    //     data[0].on_screen_text = parentItem?.OST;
    //     data[0].scene_type = parentItem?.Type ? parentItem?.Type : "narrator";
    //     data[0].scene_number = parentItem?.["Scene No."];
    //     data[0].is_deleted = parentItem?.is_deleted;
    //     // data[0].scene_id=parentItem?.Script

    //     return data[0];
    //   } else {
    //     let data = {};
    //     data.description = parentItem?.Script;
    //     data.on_screen_text = parentItem?.OST;
    //     data.scene_type = parentItem?.Type ? parentItem?.Type : "narrator";
    //     data.scene_number = parentItem?.["Scene No."];
    //     // if (parentItem?.id || parentItem?.scene_id) {
    //     //   data.scene_id = parentItem.scene_id ?? parentItem.id;
    //     // }
    //     return data;
    //   }
    // });
    let updatedData = [...rows]
      .filter((parentItem) => !parentItem?.is_deleted) // ✅ skip deleted rows
      .map((parentItem) => {
        let existing = scenes.find((item) => item?.scene_id == parentItem?.id);

        if (existing) {
          return {
            ...existing,
            description: parentItem?.Script,
            on_screen_text: parentItem?.OST,
            scene_type: parentItem?.Type ? parentItem?.Type : "narrator",
            scene_number: parentItem?.["Scene No."],
            is_deleted: parentItem?.is_deleted,
          };
        } else {
          return {
            description: parentItem?.Script,
            on_screen_text: parentItem?.OST,
            scene_type: parentItem?.Type ? parentItem?.Type : "narrator",
            scene_number: parentItem?.["Scene No."],
          };
        }
      });

    const data = {
      data: {
        ...rest,
        script_id: id,
        scenes: updatedData,
        title: tableExtraData?.title,
        version: tableExtraData?.version,
        page: "script",
      },
      is_save_action: true,
    };

    dispatch(
      postTranslatedDataSave(data, (id) => {
        if (pathname === "/translated-script") {
          navigate(`/scenes/${id}`);
        }
      }),
    );
    setMakeChanges(false);
  };

  const handleDeleteScene = (scene: SceneRow) => {
    setSelectedScene(scene);
    setUiState((prev) => ({ ...prev, operations: true }));
    // setOperations(true);
    setUiState((prev) => ({ ...prev, openDeletePopup: true }));
    // setOpenDeletePopup(true);
    setMakeChanges(true);
  };

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
    setUiState((prev) => ({ ...prev, deleteLoader: true }));
    // setDeleteLoader(true);

    try {
      const response = await api.post("mongo/delete_scene", payload);
      console.log(response?.data?.target_version, "response");
      successDelete(scene);
      // setRows((prev) => prev.filter((item) => item.id !== scene.id));
      let newRows = [...rows].map((item) => {
        if (item?.id == scene.id) {
          item.is_deleted = true;
        }
        return item;
      });
      setRows([...newRows]);
      setUiState((prev) => ({ ...prev, openDeletePopup: false }));
      // setOpenDeletePopup(false);
    } catch (error) {
      console.error(error);
    } finally {
      setUiState((prev) => ({ ...prev, deleteLoader: false }));
      // setDeleteLoader(false);
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
    if (tableExtraData?.video_style === "conversational") {
      // setFlowStep("characters");
      setOpenFlowDialog(true);
      return;
    }

    if (tableExtraData?.video_style === "mixed") {
      // setFlowStep("characters");
      setOpenFlowDialog(true);
      return;
    }
  };

  const handleCloseFlowDialog = () => {
    setOpenFlowDialog(false);
  };

  const handleCreateVisualContent = (flowType) => {
    console.log(tableExtraData?.scenes, "check_table_extra_data");

    const filteredScenes = tableExtraData?.scenes?.filter(
      (scene) => scene?.is_deleted !== true,
    );
    const payload = { ...tableExtraData, scenes: filteredScenes };
    if (tableExtraData?.video_style === "mixed") {
      payload.flow_type = flowType;
    }
    dispatch(postCreateVisualContent(payload, setOpenFlowDialog));
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
      }),
    );
  };

  const handleOpenCharacterModal = (index = 0) => {
    setCurrentIndex(index);
    setUiState((prev) => ({ ...prev, openCharacterModal: true }));
    // setOpenCharacterModal(true);
  };

  const handleCloseCharacterModal = () => {
    setUiState((prev) => ({ ...prev, openCharacterModal: false }));
    // setOpenCharacterModal(false);
  };

  const handleSetupPrompt = () => {
    if (!id) return;
    dispatch(postPromptSetupCharacters(id));
  };

  const handleGenerateImagesFlow = () => {
    if (promptData?.length) {
      handleOpenCharacterModal();
    } else {
      handleSetupPrompt();
    }
  };

  // console.log(
  //   !saveTranslatedData?.saved_version,
  //   "tableExtraData",
  // );

  return (
    <>
      <div className={styles1.header}>
        <Typography variant="h4">
          {tableExtraData?.title ||
            visualContentTitle ||
            tableExtraData?.upload_info?.title ||
            "Your Script"}
        </Typography>

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
                <ButtonComp
                  variant="outlined"
                  colorType="secondary"
                  // className={styles1.outlineBtn}
                  onClick={() =>
                    handleVersion(tableExtraData?.previous_version_id)
                  }
                  disabled={!tableExtraData?.previous_version_id}
                >
                  ← Backward
                </ButtonComp>
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
                <ButtonComp
                  variant="outlined"
                  colorType="secondary"
                  // className={styles1.outlineBtn}
                  onClick={() => handleVersion(tableExtraData?.next_version_id)}
                  disabled={!tableExtraData?.next_version_id}
                >
                  Forward →
                </ButtonComp>
              </span>
            </Tooltip>

            {/* Add Scene */}
            <ButtonComp
              variant="outlined"
              colorType="secondary"
              // className={styles1.outlineBtn}
              onClick={() => addScene()}
            >
              + Add Scene
            </ButtonComp>

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
                  <ButtonComp
                    variant="contained"
                    // className={styles1.primaryBtn}
                    onClick={handleShowSource}
                    disabled={tableExtraData?.data_source == "openai"}
                  >
                    Show Source
                  </ButtonComp>
                </span>
              </Tooltip>
            )}
            {!id?.startsWith("SCRIPT") && (
              <ButtonComp
                variant="contained"
                // className={styles1.BtnSavePrompt}
                onClick={() =>
                  setUiState((prev) => ({ ...prev, openSavePrompt: true }))
                }
              >
                Show Prompt
              </ButtonComp>
            )}
            <ShowSourcePopup
              open={uiState?.openShowPopup}
              // open={openShowPopup}
              onClose={() =>
                setUiState((prev) => ({ ...prev, openShowPopup: false }))
              }
              // onClose={() => setOpenShowPopup(false)}
              data={showSourceData}
              loader={uiState?.showSourceLoader}
            />
            {/* Back Button */}
            <Button
              className={styles1.icon}
              onClick={() => navigate("/generate-script")}
            >
              <IoArrowBackCircleOutline size={30} />
              <span style={{ lineHeight: "normal" }}>Back</span>
            </Button>
            <Button
              className={styles1.icon}
              onClick={() =>
                navigate(
                  `/create-visual-content/${tableExtraData?.prompt_batch_id}`,
                )
              }
              disabled={!tableExtraData?.prompt_batch_id}
            >
              <span style={{ lineHeight: "normal" }}>Next</span>{" "}
              <IoArrowForwardCircleOutline size={30} />
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
      <TableComp
        handleDragEnd={handleDragEnd}
        columns={columns}
        rows={rows}
        showDragAndActions={showDragAndActions}
        actions={actions}
      />

      {/* ---------------- POPUPS ---------------- */}
      <AddNewScriptPopup
        open={uiState?.openPopup}
        onClose={() => setUiState((prev) => ({ ...prev, openPopup: false }))}
        fieldData={popUpData}
        title={popupTitle}
        handleUpdate={handleUpdate}
        tableData={tableExtraData}
      />

      <DeleteScenePopup
        open={uiState?.openDeletePopup}
        onClose={() =>
          setUiState((prev) => ({ ...prev, openDeletePopup: false }))
        }
        onConfirm={confirmDeleteScene}
        rowData={selectedScene}
        id={id}
        loader={uiState?.deleteLoader}
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
                open={uiState?.openCharacterModal}
                // open={openCharacterModal}
                onClose={handleCloseCharacterModal}
                characterData={characterData}
                promptData={promptData}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                onGenerateImages={handleCharacterGenerateImages}
                tableExtraData={tableExtraData}
                setOpenFlowDialog={setOpenFlowDialog}
              />
              <Tooltip
                title={
                  // !saveTranslatedData
                  !saveTranslatedData?.saved_version
                    ? "Please save before creating visual content."
                    : ""
                }
                action={() => setUiState((prev) => ({ ...prev, open: true }))}
                // action={() => setOpen(true)}
                placement="top"
                arrow
              >
                <span>
                  <ButtonComp
                    label={loader ? "Translating" : "Translate Script"}
                    variant="contained"
                    sx={
                      {
                        // backgroundColor: "#239DE0"
                      }
                    }
                    action={() => setOpen(true)}
                    disabled={!saveTranslatedData?.saved_version}
                  >
                    {loader ? "Translating" : "Translate Script"}
                  </ButtonComp>
                </span>
              </Tooltip>

              {/* Language Popup */}
              <PopupModal
                open={uiState?.open}
                onClose={() => setUiState((prev) => ({ ...prev, open: false }))}
                title="Select Language"
              >
                <div className={styles.languageList}>
                  {/* Translate tool options */}
                  {/* <div className={styles.providerSection}>
                    <h4 className={styles.sectionTitle}>Select Provider</h4>

                    <div className={styles.providerList}>
                      {PROVIDERS.map((provider) => (
                        <div
                          key={provider}
                          className={`${styles.providerItem} ${
                            selectedProvider === provider
                              ? styles.activeProvider
                              : ""
                          }`}
                          onClick={() => setSelectedProvider(provider)}
                        >
                          {selectedProvider === provider && (
                            <MdDone size={18} className={styles.tickIcon} />
                          )}
                          <span>{provider.toUpperCase()}</span>
                        </div>
                      ))}
                    </div>
                  </div> */}
                  {/* language options */}
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
                  <FormControl size="small" className={styles.providerDropdown}>
                    <Select
                      sx={{
                        // height: "50px",
                        width: "110px",
                      }}
                      value={selectedProvider}
                      onChange={(e) =>
                        setSelectedProvider(e.target.value as ProviderType)
                      }
                    >
                      {PROVIDERS.map((provider) => (
                        <MenuItem key={provider} value={provider}>
                          {/* {provider.toUpperCase()} */}
                          {PROVIDER_LABELS[provider]}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <ButtonComp
                    label="Translate Script"
                    variant="contained"
                    // className={styles.downloadBtn}
                    action={() => {
                      handleTranslateScript();
                      setUiState((prev) => ({ ...prev, open: false }));
                      // setOpen(false);
                    }}
                  >
                    Translate Script
                  </ButtonComp>
                </div>
              </PopupModal>
            </>
          )}

          {showDragAndActions && features && (
            <ButtonComp
              variant="outlined"
              colorType="secondary"
              // className={styles.largeOutline}
              disabled={pathname.startsWith("SCRIPT-")}
              onClick={() => {
                setMakeChanges(true);
                setSceneData({});
                setUiState((prev) => ({ ...prev, openRegeneratePopup: true }));
              }}
            >
              Regenerate Script
            </ButtonComp>
          )}

          {/* Regenerate Popup */}
          <RegenerateScriptPopup
            open={uiState?.openRegeneratePopup}
            // open={openRegeneratePopup}
            onClose={() => {
              setUiState((prev) => ({ ...prev, openRegeneratePopup: false }));
              setSceneData({});
            }}
            id={id}
            setTableExtraData={handleSetData}
            sceneId={sceneData}
            tableData={tableExtraData}
          />

          {features && (
            <ButtonComp
              variant="outlined"
              colorType="secondary"
              // className={styles.largeOutline}
              onClick={handleSave}
              disabled={saveLoader}
            >
              Save
            </ButtonComp>
          )}

          {features && (
            <ButtonComp
              colorType="download"
              variant="contained"
              // className={styles.successBtn}
              onClick={() =>
                setUiState((prev) => ({ ...prev, openDownloadPopup: true }))
              }
              disabled={!saveTranslatedData?.saved_version}
            >
              Download Script
            </ButtonComp>
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
                  <ButtonComp
                    onClick={
                      tableExtraData?.video_style === "conversational" ||
                      tableExtraData?.video_style === "mixed"
                        ? handleOpenFlowDialog
                        : handleCreateVisualContent
                    }
                    variant="contained"
                    colorType="secondary"
                    // className={styles.primaryBtn}
                    disabled={
                      saveTranslatedData === null ||
                      uiState?.operations ||
                      // operations ||
                      // saveTranslatedData?.is_save_action === false
                      !saveTranslatedData?.saved_version
                      // tableExtraData?.prompt_batch_id
                    }
                  >
                    Create Visual Content
                  </ButtonComp>
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
                      {/* {
                      (!tableExtraData?.char_image_exist ||
                        tableExtraData?.video_style === "conversational") &&
                        !(
                          tableExtraData?.video_style === "mixed" &&
                          characterData?.length > 0
                        ) && ( */}
                      {((tableExtraData?.video_style === "conversational" &&
                        !tableExtraData?.char_image_exist) ||
                        (tableExtraData?.video_style === "mixed" &&
                          !characterData?.length)) && (
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

                    <ButtonComp
                      onClick={handleCloseFlowDialog}
                      variant="outlined"
                      sx={{ px: 4 }}
                    >
                      Cancel
                    </ButtonComp>
                  </Dialog>
                </>
              ) : null}
            </>
          )}
        </Stack>

        <SinglePromptModal
          open={uiState?.openSavePrompt}
          onClose={() =>
            setUiState((prev) => ({ ...prev, openSavePrompt: false }))
          }
          prompt={latestPrompt}
          onSave={handleSavePrompt}
          size="md"
          extraDetails={tableExtraData}
          operations={uiState?.operations}
          // operations={operations}
        />

        <DownloadPopup
          open={uiState?.openDownloadPopup}
          // open={openDownloadPopup}
          onClose={() =>
            setUiState((prev) => ({ ...prev, openDownloadPopup: false }))
          }
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

{
  /* <TableContainer component={Paper} className={styles.tablePaper}>
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
            {rows?.map((row, rIdx) => (
              <TableRowComp
                row={row}
                rIdx={rIdx}
                columns={columns}
                actions={actions}
                showDragAndActions={showDragAndActions}
              />
            ))}
            {rows?.map((row, rIdx) => (
              // !row?.is_deleted && (
              <Draggable
                key={String(row.id)}
                draggableId={String(row.id)}
                index={rIdx}
                isDragDisabled={!showDragAndActions || row?.is_deleted}
              >
                {(providedDraggable) => (
                  <TableRow
                    ref={providedDraggable.innerRef}
                    {...providedDraggable.draggableProps}
                    className={`${styles.bodyRow} ${row?.is_deleted && styles.deletedRow}`}
                  >
                    {showDragAndActions && (
                      <TableCell className={styles.bodyCell}>
                        <Tooltip title="Drag & Drop" placement="top" arrow>
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
                          {row?.is_deleted ? (
                            <Tooltip title="Restore" placement="top" arrow>
                              <IconButton
                                className={styles.smallIconBtn}
                                size="small"
                              >
                                Deleted
                              </IconButton>
                            </Tooltip>
                          ) : (
                            actions.map((act, aIdx) => (
                              <IconButton
                                key={aIdx}
                                className={styles.iconBtn}
                                size="small"
                                onClick={() => act.onClick(row)}
                              >
                                {act.icon}
                              </IconButton>
                            ))
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </Draggable>
            ))}
            `provided.placeholder` belongs to Droppable's render-props. We
            render it below by using the `provided` variable from Droppable.
            {provided.placeholder}
          </TableBody>
        </Table>
      )}
    </Droppable>
  </DragDropContext>
</TableContainer>; */
}
