import React, { useState, ChangeEvent, useEffect } from "react";
import { Box, Typography, Button, Paper, Stack, CircularProgress } from "@mui/material";
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
// import FullScreenGradientLoader from "../../components/common/GradientLoader";
import api from "../../api/axios";
import { NoDataMessage } from "../../components/common/NoDataMessage";

interface ClipData {
  file: File;
  preview: string;
}

const UploadConversationalClipsPage: React.FC = () => {
  const dispatch = useDispatch<any>();
  const [clips, setClips] = useState<Record<number, ClipData>>({});
  const { id } = useParams<{ id: string }>();
  const { generateVisualLoader, generateVisualContentData, scenesData } =
    useSelector((store: RootState) => store.GenerateVisualContent);
  const title = scenesData?.title;

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

    const res = await uploadSceneClip(formData);
    if (res?.data?.upload_url) {
      setClips((prev) => ({
        ...prev,
        [scene.scene_id]: {
          ...prev[scene.scene_id],
          upload_url: res.data.upload_url,
        },
      }));
    }
  };

  const uploadSceneClip = async (formData: FormData) => {
    try {
      const res = await api.post("/upload-clip/upload-scene-clip", formData);

      // return only what you need
      return res.data;
    } catch (error) {
      console.error("Upload Error:", error);
      throw error;
    }
  };

  // const uploadSceneClip = async (data: FormData) => {
  //   return api.post("/upload-clip/upload-scene-clip", data, {
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //   });
  // };

  const allUploaded = scenesData?.scenes?.every(
    (scene) => clips[scene.scene_id]
  );

  const handleDownloadAssets = () => {
    dispatch(getDownloadAsset(id, title));
  };

  useEffect(() => {
    dispatch(getClipsData(id));
  }, [dispatch]);

  useEffect(() => {
    if (!scenesData?.scenes) return;

    const mapped: any = {};

    scenesData?.scenes.forEach((scene: any) => {
      mapped[scene.scene_id] = {
        upload_url: scene.upload_url || null,
        preview: null,
        file: null,
      };
    });

    setClips(mapped);
  }, [scenesData?.scenes]);

  return (
    <>
      <div className={styles.container}>
        <OneFrameHeader />
        {scenesData?.scenes?.length && scenesData?.scenes?.length > 0 ? (
          <>
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
                  {scenesData?.scenes.map((scene, index) => (
                    <Paper
                      key={scene.scene_id}
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

                      <Box
                        sx={{
                          borderRadius: "10px",
                          overflow: "hidden",
                          border: "1px solid #d3e6f9",
                          mt: 1,
                        }}
                      >
                        {clips[scene.scene_id]?.upload_url ? (
                          <video
                            src={clips[scene.scene_id].upload_url}
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
                          <Typography color="gray" sx={{ p: 2 }}>
                            No clip uploaded
                          </Typography>
                        )}
                      </Box>
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
                    marginBottom: "6rem",
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
                    sx={{
                      borderRadius: "10px",
                      padding: "10px 25px",
                      textTransform: "none",
                      backgroundColor: allUploaded ? "#1976d2" : "#a8c8e8",
                    }}
                    onClick={handleDownloadAssets}
                    disabled={generateVisualLoader}
                  >
                    {generateVisualLoader ? (
                      <CircularProgress
                        size={22}
                        sx={{
                          color: "white",
                        }}
                      />
                    ) : (
                      "Download Assets"
                    )}
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
          </>
        ) : (
          <NoDataMessage filter={false} loading={generateVisualLoader} />
        )}

        <Footer />
      </div>
    </>
  );
};

export default UploadConversationalClipsPage;
