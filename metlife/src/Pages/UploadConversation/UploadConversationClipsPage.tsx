import React, { useState, type ChangeEvent, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
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
import { NoDataMessage } from "../../components/common/NoDataMessage";
import { showToast } from "../../utils/toast";
import {
  postStitchAllVideos,
  uploadSceneClip,
} from "../../redux/features/conversationalSlice";
import FullScreenGradientLoader from "../../components/common/GradientLoader";
import type { SceneDataType, SceneType } from "../../utils/types";
import ButtonComp from "../../components/common/Buton/Button";

interface ClipData {
  file: File;
  preview: string;
  upload_url?: string | undefined;
}

// export interface Scene {
//   scene_id: string;
//   scene_number: number;
//   upload_url: string | null;
//   uploaded_at?: string;
//   ost?: string;
// }

// export interface StitchedVideo {
//   url: string;
//   updated_at: string;
// }

// export interface ScenesData {
//   script_id: string;
//   title: string;
//   video_style: string;
//   stitched_video?: StitchedVideo;
//   scenes: Scene[];
// }

const UploadConversationalClipsPage: React.FC = () => {
  const dispatch = useDispatch<any>();
  const [clips, setClips] = useState<Record<number, ClipData>>({});
  const { id } = useParams<{ id: string }>();
  const { generateVisualLoader, scenesData } = useSelector(
    (store: RootState) => store.GenerateVisualContent
  );

  const title = scenesData?.title;
  const {
    stitchedVideoUrl,
    conversationalLoader,
    uploadSceneClipLoader,
    uploadSceneClipResponse,
  } = useSelector((state: RootState) => state.Conversational);
  const [openConfirm, setOpenConfirm] = useState(false);
  const uploadedCount =
    scenesData?.scenes?.filter((scene) => clips[scene.scene_id]?.upload_url)
      ?.length || 0;
  const remainingScenes =
    scenesData?.scenes?.filter((scene) => !clips[scene.scene_id]?.upload_url) ||
    [];
  const hasMissingScenes = remainingScenes.length > 0;
  const maxFileSize = 10 * 1024 * 1024;

  useEffect(() => {
    if (uploadSceneClipResponse) {
      const { scene_id, url } = uploadSceneClipResponse;

      setClips((prev) => ({
        ...prev,
        [scene_id]: {
          ...prev[scene_id],
          upload_url: url,
        },
      }));
    }
  }, [uploadSceneClipResponse]);

  const handleUpload = (scene: SceneType, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxFileSize) {
      showToast.error("File size must be less than or equal to 10 MB");
      e.target.value = "";
      return;
    }

    setClips((prev) => ({
      ...prev,
      [scene.scene_id]: {
        file,
        preview: URL.createObjectURL(file),
      },
    }));

    const formData = new FormData();
    if (id) {
      formData.append("script_id", id);
    }
    formData.append("scene_id", String(scene.scene_id));
    formData.append("scene_number", String(scene.scene_number));
    formData.append("file", file);
    dispatch(uploadSceneClip(formData));
  };

  const allUploaded = scenesData?.scenes?.every(
    (scene) => clips[scene.scene_id]
  );

  const handleDownloadAssets = () => {
    if (id && title) {
      dispatch(getDownloadAsset(id, title));
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(getClipsData(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (scenesData?.scenes) {
      const mapped: any = {};
      scenesData?.scenes.forEach((scene: any) => {
        mapped[scene.scene_id] = {
          upload_url: scene.upload_url || null,
          preview: null,
          file: null,
        };
      });

      setClips(mapped);
    }
  }, [scenesData?.scenes]);

  const handleStitchClick = () => {
    if (uploadedCount) {
      setOpenConfirm(true);
      return;
    }
    if (uploadedCount === 0) {
      showToast.error(
        "No uploaded video found. Please upload at least one clip."
      );
      return;
    }
    handleStichVideo();
  };

  const handleStichVideo = () => {
    if (id) {
      dispatch(postStitchAllVideos(id, setOpenConfirm));
    }
  };

  return (
    <>
      <div className={styles.container}>
        <OneFrameHeader />
        {conversationalLoader && <FullScreenGradientLoader text="loading..." />}
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
                  {scenesData?.scenes?.map((scene, index) => (
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

                        <ButtonComp
                          variant="contained"
                          component="label"
                          disabled={
                            uploadSceneClipLoader?.[scene?.scene_id] ||
                            clips[scene.scene_id]?.upload_url
                          }
                          // sx={{
                          //   borderRadius: "10px",
                          //   textTransform: "none",
                          //   padding: "10px 25px",
                          //   minWidth: "140px",
                          // }}
                        >
                          {uploadSceneClipLoader?.[scene?.scene_id] ? (
                            <CircularProgress
                              size={20}
                              sx={{ color: "white" }}
                            />
                          ) : (
                            "Upload Clip"
                          )}

                          <input
                            hidden
                            accept="video/*"
                            type="file"
                            disabled={
                              uploadSceneClipLoader?.[scene?.scene_id] ||
                              clips[scene?.scene_id]?.upload_url
                            }
                            onChange={(e) => handleUpload(scene, e)}
                          />
                        </ButtonComp>
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

                  <ButtonComp
                    variant="contained"
                    // sx={{
                    //   borderRadius: "10px",
                    //   padding: "10px 25px",
                    //   textTransform: "none",
                    //   backgroundColor: allUploaded ? "#1976d2" : "#a8c8e8",
                    // }}
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
                  </ButtonComp>

                  <ButtonComp
                    variant="contained"
                    onClick={handleStitchClick}
                    disabled={
                      !allUploaded ||
                      stitchedVideoUrl ||
                      scenesData?.stitched_video?.url
                    }
                    // sx={{
                    //   borderRadius: "10px",
                    //   padding: "10px 25px",
                    //   textTransform: "none",
                    //   backgroundColor: allUploaded ? "#1976d2" : "#a8c8e8",
                    // }}
                  >
                    Stitch My Video
                  </ButtonComp>
                </Box>

                <Dialog
                  open={openConfirm}
                  onClose={() => setOpenConfirm(false)}
                  maxWidth="sm"
                  fullWidth
                >
                  <DialogTitle sx={{ fontWeight: 600 }}>
                    Confirm Stitching
                  </DialogTitle>

                  <DialogContent>
                    {hasMissingScenes && (
                      <>
                        <Typography sx={{ mb: 2 }}>
                          The following scenes are missing:
                        </Typography>
                      </>
                    )}

                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      {remainingScenes.map((scene) => (
                        <Chip
                          key={scene.scene_id}
                          label={`Scene ${scene?.scene_number}`}
                          variant="outlined"
                          color="info"
                        />
                      ))}
                    </Box>
                    {hasMissingScenes ? (
                      <>
                        <Typography variant="body2" color="text.secondary">
                          You can still proceed, but the final video will
                          include only the uploaded clip.
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography variant="body2" color="text.primary">
                          Proceed to generate your final video. This may take a
                          moment.
                        </Typography>
                      </>
                    )}
                  </DialogContent>

                  <DialogActions>
                    <ButtonComp
                      colorType="secondary"
                      onClick={() => setOpenConfirm(false)}
                      color="inherit"
                    >
                      No
                    </ButtonComp>

                    <ButtonComp
                      onClick={handleStichVideo}
                      variant="contained"
                      // color="primary"
                      disabled={conversationalLoader}
                    >
                      Yes
                    </ButtonComp>
                  </DialogActions>
                </Dialog>

                {(stitchedVideoUrl || scenesData?.stitched_video?.url) && (
                  <Box
                    sx={{
                      marginTop: "2rem",
                      padding: "20px",
                      borderRadius: "12px",
                      border: "1px solid #d3e6f9",
                      background: "white",
                    }}
                  >
                    <Typography fontSize="20px" fontWeight={600} mb={2}>
                      Final Stitched Video
                    </Typography>

                    <video
                      src={stitchedVideoUrl ?? scenesData?.stitched_video?.url}
                      controls
                      style={{
                        width: "100%",
                        height: "50vh",
                        borderRadius: "10px",
                      }}
                    />
                  </Box>
                )}
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
