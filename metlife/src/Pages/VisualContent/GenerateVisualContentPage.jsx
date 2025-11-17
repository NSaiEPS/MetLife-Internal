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
import ImageUploadPopup from "../../components/common/popup/ImageUploadPopup";
import EditVisualPopup from "../../components/common/popup/EditVisualPopup";
import RegenerateImagePopup from "../../components/common/popup/RegenerateImagePopup";
import { NoDataMessage } from "../../components/common/NoDataMessage";
import { useDispatch, useSelector } from "react-redux";
import { getGenerateVisualContentImage } from "../../redux/features/generateVisualSlice";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { postAudioAnimationData } from "../../redux/features/audioAnimationSlice";

const GenerateVisualContentPage = () => {
  const [rows, setRows] = useState([]);
  const dummyImage = "https://dummyimage.com/50x50/e0e0e0/aaaaaa&text=No+Image";
  const columns = [
    { label: "Scene No.", key: "Scene_No." },
    {
      label: "Visual Type",
      key: "Visual_Type",
    },
    { label: "Visual Description", key: "Visual_Description" },
    {
      label: "Visual Image",
      key: "Visual_Image",
      render: (value, row, setPreviewImage, setVisualImages) => (
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
          onClick={() => {
            console.log(row.Visual_Image.length === 0, "check_mage");
            if (row.Visual_Image.length === 0) {
              toast.error("No Image found to preview");
              setPreviewImage([]);
              return;
            }
            setPreviewImage(value);
            setVisualImages(row);
          }}
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
        handleVisualEdit(row);
      },
    },
    {
      icon: <img src={reuse} />,
      onClick: (row) => {
        // handlePromptRegenerate(row);
        handleImageRegenerate(row);
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
  const { audioAnimationLoader, } = useSelector(
    (store) => store.AudioAnimation
  );
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
      console.log("useeffect triggered");
      settingDataInRows(generateVisualContentData?.visuals);
    }
  }, [generateVisualContentData?.visuals]);
  console.log(generateVisualContentData?.visuals, "visuals");

  const settingDataInRows = (reqData) => {
    let newdata = reqData?.map((item, index) => {
      const firstImageUrl =
        item?.images?.[0]?.url ||
        item?.images ||
        item?.image_url ||
        item?.url ||
        "";
      return {
        "Scene_No.": index + 1,
        Visual_Type: item?.visual_type === "clip" ? "Footage" : item?.visual_type,
        Visual_Description: item?.description,
        Visual_Image:
          item?.images?.length > 0
            ? item.images[item.images.length - 1]?.url
            : firstImageUrl,
        scene_id: item?.scene_id ?? "",
        prompt_id: item?.prompt_id ?? "",
        image_uploaded_urls:
          item?.images?.length > 0 ? item.images : [{ url: firstImageUrl }],
      };
    });
    setRows(newdata);
  };

  const handleImageUpload = (data) => {
    setPopup({
      type: "upload",
      data: {
        scene_id: data?.scene_id,
      },
    });
  };

  const handleVisualEdit = (data) => {
    setPopup({
      type: "edit",
      data,
    });
  };

  const handleImageRegenerate = (data) => {
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

  const handleImageUpdate = ({ fieldData, new_images }) => {
    const updatedRows = rows.map((item) => {
      if (item.scene_id === fieldData.scene_id) {
        const lastImage = new_images?.length
          ? new_images[new_images.length - 1].url
          : item.Visual_Image;

        return {
          ...item,
          Visual_Image: lastImage,
        };
      }
      return item;
    });

    setRows(updatedRows);
  };

  const handleUpdate = (data) => {
    console.log(data);
    if (data?.fieldData) {
      const newData = rows.map((item) => {
        console.log(item);
        if (item?.scene_id === data.fieldData.scene_id) {
          return {
            ...item,
            Visual_Description: data.new_prompt,
          };
        }
        return item;
      });
      setRows(newData);
    }
  };

  const updateImagesInRow = (sceneId, newImages) => {
    setRows((prev) =>
      prev.map((row) =>
        row.scene_id === sceneId
          ? {
              ...row,
              image_uploaded_urls: newImages,
              Visual_Image: newImages[newImages.length - 1]?.url || "",
            }
          : row
      )
    );
  };

  const handleAudioAndAnimation = () => {
    const payload = {
      script_id: id,
    };
    dispatch(postAudioAnimationData(payload));
  };

  return (
    <>
      <div className={styles.container}>
        <OneFrameHeader />
        {generateVisualLoader && <FullScreenGradientLoader text="loading..." />}
        {audioAnimationLoader && <FullScreenGradientLoader text="extracting..." />}
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
                updateImagesInRow={updateImagesInRow}
              />
              {popup.type === "upload" && (
                <ImageUploadPopup
                  open={true}
                  onClose={closePopup}
                  fieldData={popup.data}
                  script_id={id}
                  prompt_batch_id={prompt_batch_id}
                  title={title}
                  handleImageUpdate={handleImageUpdate}
                />
              )}

              {popup.type === "edit" && (
                <EditVisualPopup
                  open={true}
                  onClose={closePopup}
                  fieldData={popup.data}
                  script_id={id}
                  prompt_batch_id={prompt_batch_id}
                  handleUpdate={handleUpdate}
                />
              )}

              {popup.type === "regenerate" && (
                <RegenerateImagePopup
                  open={true}
                  onClose={closePopup}
                  fieldData={popup.data}
                  prompt_batch_id={prompt_batch_id}
                  // handleUpdate={handleUpdate}
                />
              )}

              <div className={styles.footerButtons}>
                <Button
                  variant="contained"
                  className={styles.primaryBtn}
                  onClick={handleAudioAndAnimation}
                >
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
