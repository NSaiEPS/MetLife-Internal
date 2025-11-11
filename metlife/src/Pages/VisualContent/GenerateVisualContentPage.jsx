import { Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import styles from "./generateVisualContent.module.css";
import Footer from "../../components/common/mainFooter";
import copy from "../../assets/copy.svg";
import reuse from "../../assets/reuse.svg";
import upload from "../../assets/upload_icon.svg";
import FullScreenGradientLoader from "../../components/common/GradientLoader";
import VisualContentTable from "../../components/common/VisualContentTable/VisualContentTable";
import { NoDataMessage } from "../../components/common/NoDataMessage";
import { useDispatch, useSelector } from "react-redux";
import { getGenerateVisualContentImage } from "../../redux/features/generateVisualSlice";
import { useParams } from "react-router";

const GenerateVisualContentPage = () => {
  const [rows, setRows] = useState([]);
  const dummyImage = "https://dummyimage.com/50x50/e0e0e0/aaaaaa&text=No+Image";
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
      render: (value, row, setPreviewImage) => (
        <div
          style={{
            width: "50px",
            height: "50px",
            padding: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            cursor: "pointer",
          }}
          onClick={() => setPreviewImage(value)}
        >
          <img
            src={value}
            alt="visual"
            onError={(e) => (e.target.src = dummyImage)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 5,
            }}
          />
        </div>
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
      icon: <img src={upload} />,
      onClick: (row) => {
        handleImageUpload(row);
      },
    },
  ];
  const { generateVisualLoader, generateVisualContentData } = useSelector(
    (store) => store.GenerateVisualContent
  );
  console.log(generateVisualContentData, "check");
  const prompt_batch_id = generateVisualContentData?.prompt_batch_id;
  const title = generateVisualContentData?.title;
  const dispatch = useDispatch();
  const { id } = useParams();
  const [popup, setPopup] = useState({
    type: null,
    data: null,
  });

  useEffect(() => {
    dispatch(getGenerateVisualContentImage(id));
  }, [id, dispatch]);

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

  // Image upload function
  const handleImageUpload = (data) => {
    setPopup({
      type: "upload",
      data,
    });
  };

  const closePopup = () => {
    setPopup({
      type: null,
      data: null,
    });
  };

  return (
    <>
      <div className={styles.container}>
        <OneFrameHeader />
        {generateVisualLoader && <FullScreenGradientLoader text="loading..." />}
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
              {/* {popup.type === "upload" && (
                <ImageUploadPopup
                 open={true} 
                 onClose={closePopup} 
                 fieldData={popup.data}
                 script_id={id}
                 prompt_batch_id={prompt_batch_id}
                 title={title}
                 />
              )} */}

              <div className={styles.footerButtons}>
                <Button variant="contained" className={styles.primaryBtn}>
                  Audio & Animation Toolkit
                </Button>
              </div>
            </>
          ) : (
            <>
              <NoDataMessage filter="false" />
            </>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default GenerateVisualContentPage;
