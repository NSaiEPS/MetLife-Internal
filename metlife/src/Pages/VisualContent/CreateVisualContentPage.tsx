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
import { Button, MenuItem, Select, Tooltip } from "@mui/material";
import type {SelectChangeEvent} from "@mui/material"
import { useNavigate, useParams } from "react-router";
import {
  getVisualContent,
  postVisualTypeUpdate,
} from "../../redux/features/createVisualSlice";
import { NoDataMessage } from "../../components/common/NoDataMessage";
import PromptTable from "../../components/common/PromptTable/PromptTable";
import { postGenerateVisualContentImage } from "../../redux/features/generateVisualSlice";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import type { AppDispatch, RootState } from "../../redux/store"; // adjust according to your setup

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
  { label: "Scene No.", key: "Scene_No" },  // fixed key
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
        sx={{ width: 120 }}
      >
        <MenuItem value="image">Image</MenuItem>
        <MenuItem value="clip">Footage</MenuItem>
      </Select>
    ),
  },
  { label: "Visual Description", key: "Visual_Description" },
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
      onClick: (row : any) => {
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
      onClick: (row : any) => {
        handlePromptRegenerate(row);
      },
    },
  ];

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { saveVisualContentData, saveVisualContentLoader } = useSelector(
    (store: RootState) => store.CreateVisualContent
  );
  console.log(saveVisualContentData?.video_style, 'check_visual_content_Data')

  const script_id = saveVisualContentData?.script_id;

  const [rows, setRows] = useState<RowData[]>([]);
  const [popup, setPopup] = useState<PopupData>({ type: null, data: null });

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
      Visual_Description:
        item?.clip_visual_type === "clip" ? item?.clip_prompt ?? "-" : item?.prompt ?? "-",
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
      : item
  );

  setRows(newData);
};


  const handleVisualTypeChange = (value: string, data: RowData) => {
    const updatedRows = rows.map((item) =>
      item.scene_id === data.scene_id
        ? {
            ...item,
            Visual_Type: value,
            Visual_Description: value === "image" ? data.prompt || "Generating..." : data.clip_prompt || "Generating...",
          }
        : item
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
      const obj = { ...item };
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
      video_style:saveVisualContentData?.video_style,
    };
    // console.log(finalPayload, "check_final_payload")
    dispatch(postGenerateVisualContentImage(finalPayload));
  };

  return (
    <div className={styles.container}>
      <OneFrameHeader />

      <div className={styles.tableContainer}>
        {saveVisualContentData?.prompts?.length ? (
          <>
            <div className={styles.innerContainer}>
              <div className={styles.header}>
                <h2 className={styles.title}>
                  {saveVisualContentData?.title || "Visual Content"}
                </h2>
                <Button
                  className={styles.icon}
                  onClick={() => navigate(`/scenes/${script_id}`)}
                >
                  <IoArrowBackCircleOutline size={30} /> Back
                </Button>
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
              <Button
                onClick={handleGenerate}
                variant="contained"
                className={styles.primaryBtn}
              >
                Generate Visual
              </Button>
            </div>
          </>
        ) : (
          <NoDataMessage filter={false} loading={saveVisualContentLoader} />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CreateVisualContentPage;
