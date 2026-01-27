import React, { useEffect, useState } from "react";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import Footer from "../../components/common/mainFooter";
import styles from "./visualContent.module.css";
import copy from "../../assets/copy.svg";
import reuse from "../../assets/reuse.svg";
import FullScreenGradientLoader from "../../components/common/GradientLoader";
import EditPromptPopup from "../../components/common/popup/EditPromptPopup";
import RegeneratePromptPopup from "../../components/common/popup/RegeneratePromptPopup";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import {
  getVisualContent,
  postVisualTypeUpdate,
} from "../../redux/features/createVisualSlice";
import { NoDataMessage } from "../../components/common/NoDataMessage";
import PromptTable from "../../components/common/PromptTable/PromptTable";
import { postGenerateVisualContentImage } from "../../redux/features/generateVisualSlice";
import {
  IoArrowBackCircleOutline,
  IoArrowForwardCircleOutline,
} from "react-icons/io5";
import type { AppDispatch, RootState } from "../../redux/store"; // adjust according to your setup
import { postTranslatedDataSave } from "../../redux/features/saveSlice";
import ButtonComp from "../../components/common/Buton/Button";
import AutoFixHighIcon from "../../assets/wizardMagic.svg";

// ---------- Types ----------
interface RowData {
  Scene_No: number;
  Visual_Type: string;
  Visual_Description: string;
  scene_id: string;
  prompt_id: string;
  prompt?: string;
  clip_prompt?: string;
}

interface PopupData {
  type: "edit" | "regenerate" | null;
  data: RowData | null;
}
interface Column<T> {
  label: string;
  key: keyof T;
  render?: (value: any, row: T) => React.ReactNode;
}

// ---------- Component ----------
const CreateVisualContentPage: React.FC = () => {
  const columns: Column<RowData>[] = [
    { label: "Scene No.", key: "Scene_No", width: "5%" },
    {
      label: "Visual Type",
      key: "Visual_Type",
      render: (value: RowData["Visual_Type"], row: RowData) => (
        <Select
          value={value}
          size="small"
          onChange={(e: SelectChangeEvent<string>) =>
            handleVisualTypeChange(e.target.value, row)
          }
          sx={{ width: 110 }}
        >
          <MenuItem value="image">Image</MenuItem>
          <MenuItem value="clip">Footage</MenuItem>
        </Select>
      ),
    },
    { label: "Scene Description", key: "Scene_Description", width: "30%" },
    { label: "Visual Description", key: "Visual_Description", width: "50%" },
  ];

  const actions = [
    {
      icon: (
        <Tooltip title="Edit" palcement="top" arrow>
          <span>
            <img src={copy} />
          </span>
        </Tooltip>
      ),
      onClick: (row: any) => {
        openEditPrompt(row);
      },
    },
    {
      icon: (
        <Tooltip title="Regenerate" placement="top" arrow>
          <span>
            <img src={reuse} />
          </span>
        </Tooltip>
      ),
      onClick: (row: any) => {
        handlePromptRegenerate(row);
      },
    },
  ];

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { saveVisualContentData, saveVisualContentLoader } = useSelector(
    (store: RootState) => store.CreateVisualContent,
  );

  const { saveLoader, saveTranslatedData } = useSelector(
    (store: RootState) => store.SaveTranslatedData,
  );

  const script_id = saveVisualContentData?.script_id;
  const [rows, setRows] = useState<RowData[]>([]);
  const [popup, setPopup] = useState<PopupData>({ type: null, data: null });
  const visualExist = saveVisualContentData?.visual_exist
  console.log(saveVisualContentData, "check__")


  useEffect(() => {
    if (id) {
      dispatch(getVisualContent(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (saveVisualContentData?.prompts) {
      settingDataInRows(saveVisualContentData.prompts);
    }
  }, [saveVisualContentData?.prompts]);

  const settingDataInRows = (reqData: any[]) => {
    const newdata: RowData[] = reqData.map((item, index) => ({
      Scene_No: index + 1,
      Visual_Type: item?.clip_visual_type === "clip" ? "clip" : "image",
      Scene_Description: item?.description ?? "-",
      Visual_Description:
        item?.clip_visual_type === "clip"
          ? (item?.clip_prompt ?? "-")
          : (item?.prompt ?? "-"),
      scene_id: item?.scene_id ?? "",
      prompt_id: item?.prompt_id ?? "",
      prompt: item?.prompt ?? "",
      clip_prompt: item?.clip_prompt ?? "",
    }));
    setRows(newdata);
  };

  const openEditPrompt = (data: RowData) => {
    setPopup({ type: "edit", data });
  };

  const handlePromptRegenerate = (data: RowData) => {
    setPopup({ type: "regenerate", data });
  };

  const closePopup = () => setPopup({ type: null, data: null });

  const handleUpdate = (data: { fieldData: any | null; prompt: string }) => {
    if (!data.fieldData) return; // extra safety

    const newData = rows.map((item) =>
      item.scene_id === data.fieldData!.scene_id
        ? { ...item, Visual_Description: data.prompt }
        : item,
    );

    setRows(newData);
  };

  const handleVisualTypeChange = (value: string, data: RowData) => {
    const updatedRows = rows.map((item) =>
      item.scene_id === data.scene_id
        ? {
            ...item,
            Visual_Type: value,
            Visual_Description:
              value === "image"
                ? data.prompt || "Generating..."
                : data.clip_prompt || "Generating...",
          }
        : item,
    );
    setRows(updatedRows);

    if (value === "clip") {
      const payload = {
        prompt_batch_id: id,
        prompt_id: data?.prompt_id,
        visual_type: value,
      };
      dispatch(postVisualTypeUpdate(payload));
    }
  };

  const handleGenerate = () => {
    const prompts = saveVisualContentData?.prompts ?? [];
    const manipulatedPrompts = prompts.map((item) => {
      const obj = {
        ...item,
        scene_type: item?.scene_type ?? item?.scene_type,
      };
      if (item.clip_visual_type === "clip") {
        delete obj?.prompt;
        delete obj.visual_type;
      } else if (item.visual_type === "image") {
        delete obj.clip_prompt;
        delete obj.clip_visual_type;
      }
      return obj;
    });

    const finalPayload = {
      script_id: saveVisualContentData?.script_id,
      prompt_batch_id: saveVisualContentData?.prompt_batch_id,
      title: saveVisualContentData?.title,
      total_scenes: saveVisualContentData?.total_scenes,
      processed_scenes: saveVisualContentData?.processed_scenes,
      prompts: manipulatedPrompts,
      video_style: saveVisualContentData?.video_style,
      flow_type: saveVisualContentData?.flow_type,
    };
    // console.log(finalPayload, "check_final_payload")
    dispatch(postGenerateVisualContentImage(finalPayload));
  };

  const handleSave = () => {
    const { title, ...rest } = saveVisualContentData;

    const data = {
      data: {
        ...rest,
        script_id: id,
        title: title,
        page: "prompt",
      },
      is_save_action: true,
    };
    dispatch(postTranslatedDataSave(data, id));
  };


  return (
    <>
      {saveLoader && <FullScreenGradientLoader text={"Loading..."} />}
      <div className={styles.container}>
        <OneFrameHeader />
        <div className={styles.tableContainer}>
          {saveVisualContentData?.prompts?.length ? (
            <>
              <div className={styles.innerContainer}>
                <div className={styles.header}>
                  <Typography variant="h4">
                    {" "}
                    {saveVisualContentData?.title || "Visual Content"}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      className={styles.icon}
                      onClick={() => navigate(`/scenes/${script_id}`)}
                    >
                      <IoArrowBackCircleOutline size={30} /> Back
                    </Button>
                    <Button
                      className={styles.icon}
                      disabled={!visualExist}
                      onClick={() => navigate(`/generate-visual-page/${script_id}`)}
                    >
                      Next <IoArrowForwardCircleOutline size={30} />
                    </Button>
                  </Box>
                </div>
              </div>

              <PromptTable columns={columns} rows={rows} actions={actions} />

              {popup.type === "edit" && popup.data && (
                <EditPromptPopup
                  open={true}
                  onClose={closePopup}
                  fieldData={popup.data}
                  script_id={script_id}
                  handleUpdate={handleUpdate}
                />
              )}

              {popup.type === "regenerate" && popup.data && (
                <RegeneratePromptPopup
                  open={true}
                  onClose={closePopup}
                  fieldData={popup.data}
                  id={id!}
                />
              )}

              <div className={styles.footerButtons}>
                <ButtonComp
                  variant="outlined"
                  colorType="secondary"
                  // className={styles.largeOutline}
                  onClick={handleSave}
                  disabled={saveLoader}
                >
                  Save
                </ButtonComp>
                <ButtonComp
                  onClick={handleGenerate}
                  variant="contained"
                  // className={styles.primaryBtn}
                  disabled={saveTranslatedData === null}
                  icon={AutoFixHighIcon}
                >
                  Generate Visual
                </ButtonComp>
              </div>
            </>
          ) : (
            <NoDataMessage filter={false} loading={saveVisualContentLoader} />
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default CreateVisualContentPage;
