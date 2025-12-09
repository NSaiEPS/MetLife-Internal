import React, { useState, ChangeEvent, useEffect } from "react";
import { Box, Typography, Button, Paper, Stack } from "@mui/material";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import Footer from "../../components/common/mainFooter";
import styles from "./uploadConversationClips.module.css";
import {
  getClipsData,
  getDownloadAsset,
} from "../../redux/features/generateVisualSlice";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import FullScreenGradientLoader from "../../components/common/GradientLoader";
import api from "../../api/axios";

interface Scene {
  id: number;
  title: string;
}

interface ClipData {
  file: File;
  preview: string;
}

const scenesData: Scene[] = [
  { id: 1, title: "Scene 05" },
  { id: 2, title: "Scene 11 : The Conversation" },
];

const UploadConversationalClipsPage: React.FC = () => {
  const dispatch = useDispatch<any>();
  const [clips, setClips] = useState<Record<number, ClipData>>({});
  const { id } = useParams<{ id: string }>();
  const { generateVisualLoader, generateVisualContentData, scenesData } =
    useSelector((store: RootState) => store.GenerateVisualContent);
  const title = generateVisualContentData?.title;

  console.log(scenesData, "scenesData");

  // const handleUpload = (id: number, e: ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setClips((prev) => ({
  //       ...prev,
  //       [id]: {
  //         file,
  //         preview: URL.createObjectURL(file),
  //       },
  //     }));
  //   }
  // };

  // const handleUpload = async (
  //   scene: { id: string; scene_number: number },
  //   e: ChangeEvent<HTMLInputElement>
  // ) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   // Set preview
  //   setClips((prev) => ({
  //     ...prev,
  //     [scene.scene_id]: {
  //       file,
  //       preview: URL.createObjectURL(file),
  //     },
  //   }));

  //   const formData = new FormData();
  //   formData.append("script_id", id);
  //   formData.append("scene_id", scene.scene_id);
  //   formData.append("scene_number", String(scene.scene_number));
  //   formData.append("file", file);

  //   try {
  //     const res = await uploadSceneClip(formData);
  //     console.log("Upload success:", res.data);

  //     // Optional: update redux/out UI with returned upload_url
  //     // dispatch(updateSceneUploadUrl({ scene_id: scene.id, url: res.data.upload_url }));
  //   } catch (error) {
  //     console.error("Upload failed:", error);
  //   }
  // };

  const handleUpload = async (
    scene: { scene_id: string; scene_number: number },
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Correct key!
    setClips((prev) => ({
      ...prev,
      [scene.scene_id]: {
        file,
        preview: URL.createObjectURL(file),
      },
    }));

    const formData = new FormData();
    formData.append("script_id", id);
    formData.append("scene_id", scene.scene_id);
    formData.append("scene_number", String(scene.scene_number));
    formData.append("file", file);

    await uploadSceneClip(formData);
  };

  const uploadSceneClip = async (data: FormData) => {
    return api.post("/upload-clip/upload-scene-clip", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  // const allUploaded = scenesData.every((scene) => clips[scene.id]);
  const allUploaded = scenesData.every((scene) => clips[scene.scene_id]);

  const handleDownloadAssets = () => {
    dispatch(getDownloadAsset(id, title));
  };

  useEffect(() => {
    dispatch(getClipsData(id));
  }, [dispatch]);

  return (
    <>
      {generateVisualLoader && <FullScreenGradientLoader text={"Loading..."} />}

      <div className={styles.container}>
        <OneFrameHeader />
        <div className={styles.innerContainer}>
          <Box
            sx={{
              backgroundColor: "#e5f3fc",
              padding: "40px",
              borderRadius: "20px",
              border: "2px solid #bce2f6",
              margin: "3rem 0",
              minHeight: "70vh",
            }}
          >
            <Typography fontSize="32px" fontWeight="600" mb={4}>
              Upload Conversational Clips
            </Typography>

            <Stack spacing={3}>
              {scenesData.map((scene, index) => (
                <Paper
                  key={scene.id}
                  elevation={0}
                  sx={{
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid #d3e6f9",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    background: "white",
                  }}
                >
                  {/* Top row */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography fontWeight="600">{scene.title}</Typography>
                      <Typography
                        fontSize="16px"
                        fontWeight={600}
                        color="black"
                      >
                        {/* {clips[scene.id]?.file?.name || "Awaiting Upload"} */}
                        {`Scene ${index + 1}`}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      component="label"
                      sx={{
                        borderRadius: "10px",
                        textTransform: "none",
                        padding: "10px 25px",
                      }}
                    >
                      Upload Clip
                      <input
                        hidden
                        accept="video/*"
                        type="file"
                        // onChange={(e) => handleUpload(scene.id, e)}
                        onChange={(e) => handleUpload(scene, e)}
                      />
                    </Button>
                  </Box>

                  {/* Preview section */}
                  {clips[scene.scene_id]?.preview && (
                    <Box
                      sx={{
                        borderRadius: "10px",
                        overflow: "hidden",
                        border: "1px solid #d3e6f9",
                        mt: 1,
                      }}
                    >
                      {/* <video
                        src={clips[scene.scene_id].preview}
                        controls
                        style={{
                          width: "100%",
                          height: "40vh",
                          borderRadius: "10px",
                        }}
                      /> */}

                      {clips[scene.scene_id]?.uploadedUrl ? (
                        <video
                          src={clips[scene.scene_id].uploadedUrl}
                          controls
                          style={{
                            width: "100%",
                            height: "40vh",
                            borderRadius: "10px",
                          }}
                        />
                      ) : clips[scene.scene_id]?.preview ? (
                        <video
                          src={clips[scene.scene_id].preview}
                          controls
                          style={{
                            width: "100%",
                            height: "40vh",
                            borderRadius: "10px",
                          }}
                        />
                      ) : (
                        <Typography color="gray">No clip uploaded</Typography>
                      )}
                    </Box>
                  )}
                </Paper>
              ))}
            </Stack>

            {/* Bottom stitching section */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                mt: 5,
                gap: "10px",
              }}
            >
              <Typography
                fontSize="14px"
                mr={2}
                color={allUploaded ? "black" : "gray"}
              >
                Upload all clips to enable stitching.
              </Typography>

              <Button
                variant="contained"
                className={styles.primaryBtn}
                onClick={handleDownloadAssets}
                disabled={generateVisualLoader}
              >
                Download Assets
              </Button>

              <Button
                variant="contained"
                disabled={!allUploaded}
                sx={{
                  borderRadius: "10px",
                  padding: "10px 25px",
                  textTransform: "none",
                  backgroundColor: allUploaded ? "#1976d2" : "#a8c8e8",
                }}
              >
                Stitch My Video
              </Button>
            </Box>
          </Box>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default UploadConversationalClipsPage;
