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
import { useNavigate, useParams } from "react-router";
import {
  getVisualContent,
  postVisualTypeUpdate,
} from "../../redux/features/createVisualSlice";
import { NoDataMessage } from "../../components/common/NoDataMessage";
import PromptTable from "../../components/common/PromptTable/PromptTable";
import { postGenerateVisualContentImage } from "../../redux/features/generateVisualSlice";
import { IoArrowBackCircleOutline } from "react-icons/io5";

const CreateVisualContentPage = () => {
  const columns = [
    { label: "Scene No.", key: "Scene_No." },
    {
      label: "Visual Type",
      key: "Visual_Type",
      render: (value, row) => (
        <Select
          value={value}
          size="small"
          onChange={(e) => handleVisualTypeChange(e.target.value, row)}
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
      onClick: (row) => {
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
      onClick: (row) => {
        handlePromptRegenerate(row);
      },
    },
  ];
  const { saveVisualContentData, saveVisualContentLoader } = useSelector(
    (store) => store.CreateVisualContent
  );
  const { generateVisualLoader, generateVisualContentData } = useSelector(
    (store) => store.GenerateVisualContent
  );
  const script_id = saveVisualContentData?.script_id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const { id } = useParams();
  const [popup, setPopup] = useState({
    type: null,
    data: null,
  });

  useEffect(() => {
    if (!id) return;
    dispatch(getVisualContent(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (saveVisualContentData?.prompts) {
      settingDataInRows(saveVisualContentData?.prompts);
    }
  }, [saveVisualContentData?.prompts]);

  const settingDataInRows = (reqData) => {
    let newdata = reqData?.map((item, index) => {
      return {
        "Scene_No.": index + 1,
        Visual_Type: item?.clip_visual_type === "clip" ? "clip" : "image",
        Visual_Description:
          item?.clip_visual_type === "clip"
            ? item?.clip_prompt ?? "-"
            : item?.prompt ?? "-",
        scene_id: item?.scene_id ?? "",
        prompt_id: item?.prompt_id ?? "",
        prompt: item?.prompt ?? "",
        clip_prompt: item?.clip_prompt ?? "",
      };
    });
    setRows(newdata);
  };

  const openEditPrompt = (data) => {
    setPopup({
      type: "edit",
      data,
    });
  };

  const handlePromptRegenerate = (data) => {
    setPopup({
      type: "regenerate",
      data,
    });
  };

  const closePopup = () => {
    setPopup({
      type: null,
      data: null,
    });
  };

  const handleUpdate = (data) => {
    if (data?.fieldData) {
      const newData = rows.map((item) => {
        if (item?.scene_id === data.fieldData.scene_id) {
          return {
            ...item,
            Visual_Description: data.prompt,
          };
        }
        return item;
      });
      setRows(newData);
    }
  };

  const handleVisualTypeChange = (value, data) => {
    if (value === "image") {
      const updatedRows = rows.map((item) =>
        item.scene_id === data.scene_id
          ? {
              ...item,
              Visual_Type: value,
              Visual_Description: data.prompt || "Generating...",
            }
          : item
      );
      setRows(updatedRows);
      return;
    }

    const updatedRows = rows.map((item) =>
      item.scene_id === data.scene_id
        ? {
            ...item,
            Visual_Type: value,
            Visual_Description: data?.clip_prompt || "Generating...",
          }
        : item
    );
    setRows(updatedRows);

    const payload = {
      prompt_batch_id: id,
      prompt_id: data?.prompt_id,
      visual_type: value,
    };

    dispatch(postVisualTypeUpdate(payload));
  };

  console.log(saveVisualContentData);

  const handleGenerate = async () => {
    const prompts = saveVisualContentData?.prompts;
    const manipulatedPrompts = prompts?.map((item) => {
      const obj = { ...item };

      if (item.clip_visual_type === "clip") {
        delete obj.prompt;
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
    };

    console.log(finalPayload, "payload");
    dispatch(postGenerateVisualContentImage(finalPayload));
  };

  return (
    <>
      <div className={styles.container}>
        <OneFrameHeader />
        {/* <div className={styles.innerContainer}>
          <div className={styles.header}>
            <h2 className={styles.title}>
              {saveVisualContentData?.title || "Visual Content"}
            </h2>
            <Button
              className={styles.icon}
              onClick={() => {
                navigate(`/scenes/${script_id}`);
              }}
            >
              <IoArrowBackCircleOutline size={30} /> Back
            </Button>
          </div>
        </div> */}

        <div className={styles.tableContainer}>
          {saveVisualContentData?.prompts?.length > 0 ? (
            <>
              <div className={styles.innerContainer}>
                <div className={styles.header}>
                  <h2 className={styles.title}>
                    {saveVisualContentData?.title || "Visual Content"}
                  </h2>
                  <Button
                    className={styles.icon}
                    onClick={() => {
                      navigate(`/scenes/${script_id}`);
                    }}
                  >
                    <IoArrowBackCircleOutline size={30} /> Back
                  </Button>
                </div>
              </div>

              <PromptTable columns={columns} rows={rows} actions={actions} />
              {popup.type === "edit" && (
                <EditPromptPopup
                  open={true}
                  onClose={closePopup}
                  fieldData={popup.data}
                  script_id={script_id}
                  handleUpdate={handleUpdate}
                />
              )}

              {popup.type === "regenerate" && (
                <RegeneratePromptPopup
                  open={true}
                  onClose={closePopup}
                  fieldData={popup.data}
                  id={id}
                  // handleRegenerate={handleRegenerate}
                />
              )}

              <div className={styles.footerButtons}>
                <Button
                  onClick={handleGenerate}
                  // disabled={generateVisualLoader}
                  variant="contained"
                  className={styles.primaryBtn}
                >
                  Generate Visual
                </Button>
              </div>
            </>
          ) : (
            <>
              <NoDataMessage filter={false} loading={saveVisualContentLoader} />
            </>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default CreateVisualContentPage;
