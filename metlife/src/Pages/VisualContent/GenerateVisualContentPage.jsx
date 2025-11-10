import { Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import styles from "./generateVisualContent.module.css";
import Footer from "../../components/common/mainFooter";
import copy from "../../assets/copy.svg";
import reuse from "../../assets/reuse.svg";
import { NoDataMessage } from "../../components/common/NoDataMessage";
import VisualContentTable from "../../components/common/VisualContentTable/VisualContentTable";
import { useDispatch, useSelector } from "react-redux";
import { getGenerateVisualContentImage } from "../../redux/features/generateVisualSlice";
import { useParams } from "react-router";
import FullScreenGradientLoader from "../../components/common/GradientLoader";

const GenerateVisualContentPage = () => {
  const [rows, setRows] = useState([]);
  const columns = [
    { label: "Scene No.", key: "Scene_No." },
    {
      label: "Visual Type",
      key: "Visual_Type",
      //   render: (value, row) => (
      //     <Select
      //       value={value}
      //       size="small"
      //       onChange={(e) => handleVisualTypeChange(e.target.value, row)}
      //       sx={{ width: 100 }}
      //     >
      //       <MenuItem value="image">Image</MenuItem>
      //       <MenuItem value="clip">Clip</MenuItem>
      //     </Select>
      //   ),
    },
    { label: "Visual Description", key: "Visual_Description" },
    {
      label: "Visual Image",
      key: "Visual_Image",
      render: (value, row) => (
        <img
          src={value}
          alt="visual"
          style={{
            width: 50,
            height: 50,
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
      ),
    },
  ];

  const actions = [
    {
      icon: <img src={copy} />,
      onClick: (row) => {
        // openEditPrompt(row);
      },
    },
    {
      icon: <img src={reuse} />,
      onClick: (row) => {
        // handlePromptRegenerate(row);
      },
    },
    {
      icon: <img src={reuse} />,
      onClick: (row) => {
        // handlePromptRegenerate(row);
      },
    },
  ];
  const { generateVisualLoader, generateVisualContentData } = useSelector(
    (store) => store.GenerateVisualContent
  );
  console.log(generateVisualContentData, "check");
  const dispatch = useDispatch();
  const { id } = useParams();
  // console.log(id, "check_id");

  useEffect(() => {
    dispatch(getGenerateVisualContentImage(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (generateVisualContentData?.visuals) {
      settingDataInRows(generateVisualContentData?.visuals);
    }
  }, [generateVisualContentData?.visuals]);

  const settingDataInRows = (reqData) => {
    let newdata = reqData?.map((item, index) => {
      console.log(item.image_url, "image_url");
      return {
        "Scene_No.": index + 1,
        Visual_Type: item?.visual_type === "clip" ? "clip" : "image",
        // Visual_Description:  item?.prompt ?? "-",
        Visual_Description:
          item?.visual_type === "clip"
            ? item?.clip_prompt ?? "-"
            : item?.prompt ?? "-",
        Visual_Image: item?.image_url ?? "-",
        scene_id: item?.scene_id ?? "",
        prompt_id: item?.prompt_id ?? "",
        prompt: item?.prompt ?? "",
        clip_prompt: item?.clip_prompt ?? "",
      };
    });
    setRows(newdata);
  };

  return (
    <>
      <div className={styles.container}>
        <OneFrameHeader />
        {/* {saveVisualContentLoader && (
          <FullScreenGradientLoader text="loading..." />
        )} */}
        {/* {generateVisualLoader && (
          <FullScreenGradientLoader
            text="loading..."
            loader={generateVisualLoader}
          />
        )} */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            {generateVisualContentData?.title || "Visual Content"}
          </h2>
        </div>

        <div className={styles.tableContainer}>
          {generateVisualContentData?.visuals?.length > 0 ? (
            <>
              <VisualContentTable
                columns={columns}
                rows={rows}
                actions={actions}
              />
            </>
          ) : (
            <>
              <NoDataMessage filter="false" />
            </>
          )}

          <div className={styles.footerButtons}>
            <Button variant="contained" className={styles.primaryBtn}>
              Audio & Animation Toolkit
            </Button>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default GenerateVisualContentPage;
