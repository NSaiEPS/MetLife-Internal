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
import { Button, MenuItem, Select } from "@mui/material";
import { useParams } from "react-router";
import {
  getVisualContent,
  postVisualTypeUpdate,
} from "../../redux/features/createVisualSlice";
import { NoDataMessage } from "../../components/common/NoDataMessage";
import PromptTable from "../../components/common/PromptTable/PromptTable";
import { postGenerateVisualContentImage } from "../../redux/features/generateVisualSlice";

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
      icon: <img src={copy} />,
      onClick: (row) => {
        openEditPrompt(row);
      },
    },
    {
      icon: <img src={reuse} />,
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

  const handleGenerate = async () => {
    const data = saveVisualContentData;
    const payload = data?.prompts?.map(item => {
      return {
        prompt:item.visual_type === "image" ? item?.prompt
        : item.clip_visual_type === "clip" ? item.clip_prompt : null
      }
    })
    dispatch(postGenerateVisualContentImage(data));
  };

  return (
    <>
      <div className={styles.container}>
        <OneFrameHeader />
        {/* {(saveVisualContentLoader || generateVisualLoader) && (
          <FullScreenGradientLoader text="loading..." />
        )} */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            {saveVisualContentData?.title || "Visual Content"}
          </h2>
        </div>

        <div className={styles.tableContainer}>
          {saveVisualContentData?.prompts?.length > 0 ? (
            <>
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
