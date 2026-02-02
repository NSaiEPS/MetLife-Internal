import { Box, Button, Tooltip, Typography } from "@mui/material";
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
import VideoUploadPopup from "../../components/common/popup/VideoUploadPopup";
import { NoDataMessage } from "../../components/common/NoDataMessage";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadAsset,
  getGenerateVisualContentImage,
} from "../../redux/features/generateVisualSlice";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { postAudioAnimationData } from "../../redux/features/audioAnimationSlice";
import {
  IoArrowBackCircleOutline,
  IoArrowForwardCircleOutline,
} from "react-icons/io5";
import type { RootState } from "../../redux/store"; // adjust path if needed
import { navigateTo } from "../../utils/navigate";
import { postTranslatedDataSave } from "../../redux/features/saveSlice";
import ButtonComp from "../../components/common/Buton/Button";

// ---------- Types ----------
interface VisualRow {
  "Scene_No.": number;
  Visual_Type: string;
  Visual_Description: string;
  Visual_Image: string;
  scene_id: string;
  prompt_id?: string;
  new_prompt?: string;
  image_uploaded_urls?: { url: string }[];
  video_uploaded_urls?: { url: string }[];
}

interface Column<T> {
  label: string;
  key: keyof T;
  render?: (
    value: any,
    row: T,
    setPreviewImage?: React.Dispatch<React.SetStateAction<any>>,
    setVisualImages?: React.Dispatch<React.SetStateAction<any>>,
  ) => React.ReactNode;
}

interface Action<T> {
  icon: React.ReactNode;
  onClick: (row: T) => void;
}

interface PopupState {
  type: "upload" | "video_upload" | "edit" | "regenerate" | null;
  data: any;
}

// ---------- Component ----------
const GenerateVisualContentPage: React.FC = () => {
  const [rows, setRows] = useState<VisualRow[]>([]);
  const [popup, setPopup] = useState<PopupState>({ type: null, data: null });

  const dummyImage = "https://dummyimage.com/50x50/e0e0e0/aaaaaa&text=No+Image";

  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const { id } = useParams<{ id: string }>();

  const { generateVisualLoader, generateVisualContentData } = useSelector(
    (store: RootState) => store.GenerateVisualContent,
  );
  const conversational =
    generateVisualContentData?.flow_type === "conversation" ||
    generateVisualContentData?.video_style === "conversational";
  const { audioAnimationLoader } = useSelector(
    (store: RootState) => store.AudioAnimation,
  );
  const { saveLoader, saveTranslatedData } = useSelector(
    (store) => store.SaveTranslatedData,
  );
  const prompt_batch_id = generateVisualContentData?.prompt_batch_id;
  const title = generateVisualContentData?.title;
  const audioExist =
    generateVisualContentData?.audio_exist ||
    generateVisualContentData?.conversation_video_exist;
  console.log(audioExist, "check__");

  // ---------- Columns & Actions ----------
  const columns: Column<VisualRow>[] = [
    { label: "Scene No.", key: "Scene_No." },
    { label: "Visual Type", key: "Visual_Type" },
    { label: "Scenes", key: "Visual_Description" },
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
            if (!row.Visual_Image || row.Visual_Image.length === 0) {
              toast.error("No Image found to preview");
              setPreviewImage?.([]);
              return;
            }
            setPreviewImage?.(value);
            setVisualImages?.(row);
          }}
        >
          {row.Visual_Type === "Footage" ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 5,
                backgroundColor: "#e0e0e0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="80%"
                height="80%"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                  ry="2"
                  fill="#bdbdbd"
                />
                <polygon points="10,9 16,12 10,15" fill="#757575" />
              </svg>
            </div>
          ) : (
            <img
              src={value}
              alt="visual"
              onError={(e) => {
                (e.target as HTMLImageElement).src = dummyImage;
              }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 5,
              }}
            />
          )}
        </div>
      ),
    },
  ];

  const handleImageUpload = (data: VisualRow) =>
    setPopup({ type: "upload", data });
  const handleVideoUpload = (data: VisualRow) =>
    setPopup({ type: "video_upload", data });
  const handleVisualEdit = (data: VisualRow) =>
    setPopup({ type: "edit", data });
  const handleImageRegenerate = (data: VisualRow) =>
    setPopup({ type: "regenerate", data });
  const closePopup = () => setPopup({ type: null, data: null });

  const actions = [
    // {
    //   icon: (
    //     <Tooltip title="Edit" placement="top" arrow>
    //       <span>
    //         <img src={copy} />
    //       </span>
    //     </Tooltip>
    //   ),
    //   onClick: (row: any) => {
    //     handleVisualEdit(row);
    //   },
    // },
    {
      icon: (
        <Tooltip title="Regenerate" placement="top" arrow>
          <span>
            <img src={reuse} />
          </span>
        </Tooltip>
      ),
      onClick: (row: any) => {
        handleImageRegenerate(row);
      },
    },
    {
      icon: (
        <Tooltip title="Upload Image" placement="top" arrow>
          <span>
            <img src={upload} />
          </span>
        </Tooltip>
      ),
      onClick: (row: any) => {
        if (row.Visual_Type === "image") {
          handleImageUpload(row);
        } else if (row.Visual_Type === "Footage") {
          handleVideoUpload(row);
        }
      },
    },
  ];
  // ---------- Effects ----------
  useEffect(() => {
    if (id) dispatch(getGenerateVisualContentImage(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (generateVisualContentData?.visuals) {
      settingDataInRows(generateVisualContentData.visuals);
    }
  }, [generateVisualContentData?.visuals]);

  // ---------- Handlers ----------
  const settingDataInRows = (data: any[]) => {
    const newData: VisualRow[] = data.map((item, index) => {
      const firstImageUrl =
        item?.images?.[0]?.url ||
        item?.images ||
        item?.image_url ||
        item?.url ||
        "";
      const videoPreviewUrl = item?.videos?.[0]?.url;
      return {
        "Scene_No.": index + 1,
        Visual_Type:
          item?.visual_type === "clip" ? "Footage" : item?.visual_type,
        Visual_Description: item?.description,
        Visual_Image:
          item?.images?.length > 0
            ? item.images[item.images.length - 1]?.url
            : item?.videos?.length > 0
              ? videoPreviewUrl
              : "-",
        scene_id: item?.scene_id ?? "",
        prompt_id: item?.prompt_id ?? "",
        new_prompt: item?.prompt,
        image_uploaded_urls:
          item?.images?.length > 0 ? item.images : [{ url: firstImageUrl }],
        video_uploaded_urls:
          item?.videos?.length > 0 ? item.videos : [{ url: videoPreviewUrl }],
      };
    });
    setRows(newData);
  };

  // const handleImageUpdate = ({
  //   fieldData,
  //   new_images,
  // }: {
  //   fieldData: VisualRow;
  //   new_images: { url: string }[];
  // }) => {
  //   setRows((prev) =>
  //     prev.map((item) =>
  //       item.scene_id === fieldData.scene_id
  //         ? {
  //             ...item,
  //             Visual_Image:
  //               new_images?.[new_images.length - 1]?.url || item.Visual_Image,
  //           }
  //         : item
  //     )
  //   );
  // };

  const handleUpdate = (data: {
    fieldData: VisualRow;
    new_prompt?: string;
  }) => {
    setRows((prev) =>
      prev.map((item) =>
        item.scene_id === data.fieldData.scene_id
          ? {
              ...item,
              Visual_Description: data.new_prompt || item.Visual_Description,
            }
          : item,
      ),
    );
  };

  const updateImagesInRow = (
    sceneId: string | number,
    newFiles: { url: string }[],
    type: "image" | "video",
  ) => {
    setRows((prev) =>
      prev.map((row) =>
        row.scene_id === sceneId
          ? type === "image"
            ? {
                ...row,
                image_uploaded_urls: newFiles,
                Visual_Image: newFiles[newFiles.length - 1]?.url || "",
              }
            : {
                ...row,
                video_uploaded_urls: newFiles,
                Visual_Image: newFiles[newFiles.length - 1]?.url || "",
              }
          : row,
      ),
    );
  };

  const updatePromptInRow = (data: {
    scene_id: string | number;
    new_prompt: string;
  }) => {
    setRows((prev) =>
      prev.map((row) =>
        row.scene_id === data.scene_id
          ? {
              ...row,
              new_prompt: data.new_prompt,
              // image_uploaded_urls: data?.image_uploaded_urls,
              image_uploaded_urls:
                data?.image_uploaded_urls ?? row?.image_uploaded_urls,

              // Visual_Image: data.image_uploaded_urls?.length
              //   ? data.image_uploaded_urls[data.image_uploaded_urls.length - 1]
              //       ?.url
              //   : row.Visual_Image,
            }
          : row,
      ),
    );
  };

  const handleAudioAndAnimation = () => {
    if (id) {
      dispatch(postAudioAnimationData({ script_id: id }));
    }
  };

  const handleDownloadAssets = () => {
    dispatch(getDownloadAsset(id, title));
  };

  const handleNext = () => {
    navigateTo(`/upload-conversational-clips/${id}`);
  };

  const handleSave = () => {
    const { title, ...rest } = generateVisualContentData;

    const data = {
      data: {
        ...rest,
        script_id: id,
        title: title,
        page: "visual",
      },
      is_save_action: true,
    };
    dispatch(postTranslatedDataSave(data, id));
  };

  // ---------- Render ----------
  return (
    <>
      {saveLoader && <FullScreenGradientLoader text={"Loading..."} />}

      <div className={styles.container}>
        <OneFrameHeader />
        <div className={styles.tableContainer}>
          {generateVisualContentData?.visuals?.length &&
          generateVisualContentData?.visuals?.length > 0 ? (
            <>
              <div className={styles.innerContainer}>
                <div className={styles.header}>
                  {/* <h2 className={styles.title}>
                    {generateVisualContentData?.title || "Visual Content"}
                  </h2> */}
                  <Typography variant="h4">
                    {generateVisualContentData?.title || "Visual Content"}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      className={styles.icon}
                      onClick={() =>
                        navigate(`/create-visual-content/${prompt_batch_id}`)
                      }
                    >
                      <IoArrowBackCircleOutline size={30} /> Back
                    </Button>
                    <Button
                      className={styles.icon}
                      disabled={!audioExist}
                      onClick={() => navigate(`/audio-animation-toolkit/${id}`)}
                    >
                      Next <IoArrowForwardCircleOutline size={30} />
                    </Button>
                  </Box>
                </div>
              </div>

              <VisualContentTable
                columns={columns}
                rows={rows}
                actions={actions}
                updateImagesInRow={updateImagesInRow}
                updatePromptInRow={updatePromptInRow}
                conversational={conversational}
              />

              {popup.type === "upload" && (
                <ImageUploadPopup
                  open
                  onClose={closePopup}
                  fieldData={popup.data}
                  script_id={id!}
                  prompt_batch_id={prompt_batch_id}
                  title={title}
                  // handleImageUpdate={handleImageUpdate}
                />
              )}
              {popup.type === "video_upload" && (
                <VideoUploadPopup
                  open
                  onClose={closePopup}
                  fieldData={popup.data}
                  script_id={id!}
                  prompt_batch_id={prompt_batch_id}
                  title={title}
                />
              )}

              {popup.type === "edit" && (
                <EditVisualPopup
                  open
                  onClose={closePopup}
                  fieldData={popup.data}
                  script_id={id!}
                  prompt_batch_id={prompt_batch_id}
                  handleUpdate={handleUpdate}
                />
              )}

              {popup.type === "regenerate" && (
                <RegenerateImagePopup
                  open
                  onClose={closePopup}
                  fieldData={popup.data}
                  prompt_batch_id={prompt_batch_id}
                />
              )}
              <div className={styles.footerButtons}>
                {conversational ? (
                  <>
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
                      variant="contained"
                      className={styles.primaryBtn}
                      onClick={handleNext}
                      disabled={saveTranslatedData === null}
                    >
                      Next
                    </ButtonComp>
                    <ButtonComp
                      variant="contained"
                      // className={styles.primaryBtn}
                      onClick={handleDownloadAssets}
                      disabled={
                        generateVisualLoader || saveTranslatedData === null
                      }
                    >
                      Download Assets
                    </ButtonComp>
                  </>
                ) : (
                  <>
                    <ButtonComp
                      variant="outlined"
                      // className={styles.largeOutline}
                      colorType="secondary"
                      onClick={handleSave}
                      disabled={saveLoader}
                    >
                      Save
                    </ButtonComp>
                    <ButtonComp
                      variant="contained"
                      // className={styles.primaryBtn}
                      onClick={handleAudioAndAnimation}
                      disabled={
                        generateVisualLoader || saveTranslatedData === null
                      }
                    >
                      Audio & Animation Toolkit
                    </ButtonComp>
                  </>
                )}
              </div>
            </>
          ) : (
            <NoDataMessage filter={false} loading={generateVisualLoader} />
          )}
        </div>

        <Footer />
      </div>
    </>
  );
};

export default GenerateVisualContentPage;
