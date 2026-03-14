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
  Menu,
  FormControlLabel,
  Switch,
} from "@mui/material";
import Footer from "../../components/common/mainFooter";
import styles from "./uploadConversationClips.module.css";
import {
  getClipsData,
  getDownloadAsset,
} from "../../redux/features/generateVisualSlice";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { NoDataMessage } from "../../components/common/NoDataMessage";
import { showToast } from "../../utils/toast";
import {
  getStitchedVideoStatus,
  postStitchAllVideos,
  uploadSceneClip,
} from "../../redux/features/conversationalSlice";
import FullScreenGradientLoader from "../../components/common/GradientLoader";
import type { SceneDataType, SceneType } from "../../utils/types";
import ButtonComp from "../../components/common/Buton/Button";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import Timer from "../../components/common/Timer/Timer";
import { convertToISTParts } from "../../utils";

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

type SceneClips = {
  files: File[];
  previews: string[];
  upload_urls: string[];
};

const UploadConversationalClipsPage: React.FC = () => {
  const dispatch = useDispatch<any>();
  // const [clips, setClips] = useState<Record<number, ClipData>>({});
  const [clips, setClips] = useState<Record<number, SceneClips>>({});
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { generateVisualLoader, scenesData } = useSelector(
    (store: RootState) => store.GenerateVisualContent,
  );
  const title = scenesData?.title;
  const {
    stitchedVideoUrl,
    conversationalLoader,
    uploadSceneClipLoader,
    uploadSceneClipResponse,
    stitchedVideoStatus,
  } = useSelector((state: RootState) => state.Conversational);
  const [openConfirm, setOpenConfirm] = useState(false);
  // const uploadedCount =
  //   scenesData?.scenes?.filter((scene) => clips[scene.scene_id]?.upload_url)
  //     ?.length || 0;
  const uploadedCount =
    scenesData?.scenes?.filter(
      (scene) => clips[scene.scene_id]?.upload_urls?.length > 0,
    )?.length || 0;
  // const remainingScenes =
  //   scenesData?.scenes?.filter((scene) => !clips[scene.scene_id]?.upload_url) ||
  //   [];
  const remainingScenes =
    scenesData?.scenes?.filter(
      (scene) => !clips[scene.scene_id]?.upload_urls?.length,
    ) || [];
  const hasMissingScenes = remainingScenes.length > 0;
  const maxFileSize = 10 * 1024 * 1024;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null >(null);
  const [bgMusic, setBgMusic] = useState(false);
  const [ost, setOst] = useState(false);
  const waitingTime = convertToISTParts(
    stitchedVideoStatus?.estimated_completion_at ?? "",
  );

  const finalTime = Math.ceil(waitingTime / 60);

  // useEffect(() => {
  //   if (scenesData?.scenes) {
  //     const mapped: Record<number, SceneClips> = {};

  //     scenesData.scenes.forEach((scene) => {
  //       mapped[scene.scene_id] = {
  //         files: [],
  //         previews: [],
  //         upload_urls: scene.upload_url ? [scene.upload_url] : [],
  //       };
  //     });

  //     setClips(mapped);
  //   }
  // }, [scenesData?.scenes]);

  useEffect(() => {
    if (id && stitchedVideoStatus?.stitching_status === "processing") {
      dispatch(getStitchedVideoStatus(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (!scenesData?.scenes) return;

    setClips((prev) => {
      const updated = { ...prev };

      scenesData.scenes.forEach((scene) => {
        if (!updated[scene.scene_id]) {
          updated[scene.scene_id] = {
            files: [],
            previews: [],
            upload_urls: scene.upload_url ? [scene.upload_url] : [],
          };
        }
      });

      return updated;
    });
  }, [scenesData?.scenes]);

  useEffect(() => {
    if (uploadSceneClipResponse) {
      const { scene_id, url } = uploadSceneClipResponse;

      setClips((prev) => ({
        ...prev,
        [scene_id]: {
          ...prev[scene_id],
          // upload_url: url,
          upload_urls: [...(prev[scene_id]?.upload_urls || []), url],
        },
      }));
    }
  }, [uploadSceneClipResponse]);

  // const handleUpload = (scene: SceneType, e: ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   if (file.size > maxFileSize) {
  //     showToast.error("File size must be less than or equal to 10 MB");
  //     e.target.value = "";
  //     return;
  //   }

  //   setClips((prev) => ({
  //     ...prev,
  //     [scene.scene_id]: {
  //       file,
  //       preview: URL.createObjectURL(file),
  //     },
  //   }));

  //   const formData = new FormData();
  //   if (id) {
  //     formData.append("script_id", id);
  //   }
  //   formData.append("scene_id", String(scene.scene_id));
  //   formData.append("scene_number", String(scene.scene_number));
  //   formData.append("file", file);
  //   dispatch(uploadSceneClip(formData));
  // };

  const handleUpload = (scene: SceneType, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // if (file.size > maxFileSize) {
    //   showToast.error("File size must be ≤ 10 MB");
    //   e.target.value = "";
    //   return;
    // }

    const previewUrl = URL.createObjectURL(file);

    setClips((prev) => ({
      ...prev,
      [scene.scene_id]: {
        files: [...(prev[scene.scene_id]?.files || []), file],
        previews: [...(prev[scene.scene_id]?.previews || []), previewUrl],
        upload_urls: prev[scene.scene_id]?.upload_urls || [],
      },
    }));

    const formData = new FormData();
    if (id) formData.append("script_id", id);

    formData.append("scene_id", String(scene.scene_id));
    formData.append("scene_number", String(scene.scene_number));
    formData.append("file", file);

    dispatch(uploadSceneClip(formData));

    e.target.value = "";
  };

  // const allUploaded = scenesData?.scenes?.every(
  //   (scene) => clips[scene.scene_id],
  // );

  const allUploaded = scenesData?.scenes?.every(
    (scene) => clips[scene.scene_id]?.upload_urls?.length > 0,
  );

  const handleDownloadAssets = () => {
    if (id && title) {
      dispatch(getDownloadAsset(id, title));
    }
  };
  // console.log(scenesData, "check")
  useEffect(() => {
    if (id || stitchedVideoUrl || scenesData?.stitched_video_exists) {
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

  // const handleStitchClick = () => {
  //   if (uploadedCount) {
  //     setOpenConfirm(true);
  //     return;
  //   }
  //   if (uploadedCount === 0) {
  //     showToast.error(
  //       "No uploaded video found. Please upload at least one clip.",
  //     );
  //     return;
  //   }
  //   handleStichVideo();
  // };

  const handleStitchClick = () => {
    if (uploadedCount === 0) {
      showToast.error(
        "No uploaded video found. Please upload at least one clip.",
      );
      return;
    }

    // If some scenes are missing → show confirmation
    if (!allUploaded) {
      setOpenConfirm(true);
      return;
    }

    handleStichVideo();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStichVideo = () => {
    console.log(bgMusic, ost, "backgroundMusic");
    if (id) {
      dispatch(postStitchAllVideos(id, setOpenConfirm, bgMusic, ost));
      handleMenuClose();
    }
  };

  console.log(stitchedVideoStatus, "stitchedVideoStatus");

  return (
    <>
      <div className={styles.container}>
        {conversationalLoader && <FullScreenGradientLoader text="loading..." />}
        {scenesData?.scenes?.length && scenesData?.scenes?.length > 0 ? (
          <>
            <div className={styles.innerContainer}>
              {
              stitchedVideoStatus?.stitching_status === "processing"
               &&
              !stitchedVideoStatus?.stitched_video?.url
               ? (
                <>
                  <Timer
                    time={finalTime}
                    onComplete={() => dispatch(getStitchedVideoStatus(id))}
                  />
                </>
              ) :  (
                <>
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
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "2rem",
                      }}
                    >
                      <Typography variant="h1" fontSize="32px">
                        {!scenesData?.stitched_video?.url && !stitchedVideoUrl && !stitchedVideoStatus?.stitched_video?.url
                          ? "Upload Conversational Clips"
                          : "Final Stitched Video"}
                      </Typography>
                      <Button
                        className={styles.icon}
                        onClick={() => navigate(`/generate-visual-page/${id}`)}
                        disabled={!scenesData?.image_exist}
                      >
                        <IoArrowBackCircleOutline size={30} /> Back
                      </Button>
                    </Box>
                    {!scenesData?.stitched_video?.url && !stitchedVideoUrl && !stitchedVideoStatus?.stitched_video?.url &&  (
                      <>
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
                                  // disabled={
                                  //   uploadSceneClipLoader?.[scene?.scene_id] ||
                                  //   clips[scene.scene_id]?.upload_url
                                  // }
                                  disabled={
                                    uploadSceneClipLoader?.[scene.scene_id]
                                  }
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
                                      uploadSceneClipLoader?.[
                                        scene?.scene_id
                                      ] || clips[scene?.scene_id]?.upload_url
                                    }
                                    onChange={(e) => handleUpload(scene, e)}
                                  />
                                </ButtonComp>
                              </Box>

                              {/* <Box
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
                                </Box> */}

                              <Box
                                // sx={{
                                //   borderRadius: "10px",
                                //   overflow: "hidden",
                                //   border: "1px solid #d3e6f9",
                                //   mt: 1,
                                //   p: 2,
                                // }}
                                sx={{
                                  borderRadius: "10px",
                                  border: "1px solid #d3e6f9",
                                  mt: 1,
                                  p: 2,
                                  display: "flex",
                                  gap: "16px",
                                  overflowX: "auto",
                                  scrollbarWidth: "thin",
                                  "&::-webkit-scrollbar": {
                                    height: "6px",
                                  },
                                  "&::-webkit-scrollbar-thumb": {
                                    backgroundColor: "#bce2f6",
                                    borderRadius: "4px",
                                  },
                                }}
                              >
                                {clips[scene.scene_id]?.upload_urls?.length >
                                0 ? (
                                  clips[scene.scene_id].upload_urls.map(
                                    (url, idx) => (
                                      <>
                                        <Box
                                          key={idx}
                                          sx={{
                                            minWidth: "320px",
                                            maxWidth: "320px",
                                            flexShrink: 0,
                                            borderRadius: "10px",
                                            border: "1px solid #d3e6f9",
                                            overflow: "hidden",
                                            background: "#f9fcff",
                                          }}
                                        >
                                          <video
                                            src={url}
                                            controls
                                            style={{
                                              width: "100%",
                                              height: "180px",
                                              objectFit: "cover",
                                            }}
                                          />
                                        </Box>
                                      </>
                                    ),
                                  )
                                ) : clips[scene.scene_id]?.previews?.length >
                                  0 ? (
                                  clips[scene.scene_id].previews.map(
                                    (preview, idx) => (
                                      <>
                                        <Box
                                          key={idx}
                                          sx={{
                                            minWidth: "320px",
                                            maxWidth: "320px",
                                            flexShrink: 0,
                                            borderRadius: "10px",
                                            border: "1px solid #d3e6f9",
                                            overflow: "hidden",
                                            background: "#f9fcff",
                                          }}
                                        >
                                          <video
                                            src={preview}
                                            controls
                                            style={{
                                              width: "100%",
                                              height: "180px",
                                              objectFit: "cover",
                                            }}
                                          />
                                        </Box>
                                      </>
                                    ),
                                  )
                                ) : (
                                  <Typography color="gray">
                                    No clips uploaded
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
                            // disabled={
                            //   !allUploaded ||
                            //   stitchedVideoUrl ||
                            //   scenesData?.stitched_video?.url
                            // }
                            disabled={scenesData?.video_exist}
                          >
                            Stitch My Video
                          </ButtonComp>
                        </Box>
                      </>
                    )}

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
                              {/* You can still proceed, but the final video will
                                include only the uploaded clip. */}
                              You can still proceed. The final video will
                              include only the uploaded clips for each completed
                              scene.
                            </Typography>
                          </>
                        ) : (
                          <>
                            <Typography variant="body2" color="text.primary">
                              Proceed to generate your final video. This may
                              take a moment.
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
                          // onClick={handleStichVideo}
                          onClick={handleMenuOpen}
                          variant="contained"
                          disabled={conversationalLoader}
                        >
                          Yes
                        </ButtonComp>

                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleMenuClose}
                          PaperProps={{ sx: { p: 2, width: 330 } }}
                        >
                          {/* <Box display="flex" flexDirection="column" gap={2}>
                              <Typography variant="primary" fontWeight={600}>
                                Background Music
                              </Typography>

                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={bgMusic}
                                    onChange={(e) => setBgMusic(e.target.checked)}
                                  />
                                }
                                label={bgMusic ? "ON" : "OFF"}
                              />

                              <Typography variant="secondary" fontWeight={600}>
                                OST
                              </Typography>

                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={ost}
                                    onChange={(e) => setOst(e.target.checked)}
                                  />
                                }
                                label={ost ? "ON" : "OFF"}
                              />
                              <ButtonComp
                                // onClick={handleStichVideo}
                                onClick={handleStichVideo}
                                variant="contained"
                                disabled={conversationalLoader}
                              >
                                Stitch Video
                              </ButtonComp>
                            </Box> */}

                          <Box
                            display="flex"
                            flexDirection="column"
                            gap={3}
                            width="100%"
                          >
                            {/* Background Music */}
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="space-between"
                            >
                              <Typography fontWeight={600}>
                                Background Music
                              </Typography>

                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={bgMusic}
                                    onChange={(e) =>
                                      setBgMusic(e.target.checked)
                                    }
                                  />
                                }
                                label={bgMusic ? "ON" : "OFF"}
                                labelPlacement="end"
                              />
                            </Box>

                            {/* OST */}
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="space-between"
                            >
                              <Typography fontWeight={600}>OST</Typography>

                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={ost}
                                    onChange={(e) => setOst(e.target.checked)}
                                  />
                                }
                                label={ost ? "ON" : "OFF"}
                                labelPlacement="end"
                              />
                            </Box>

                            {/* Button */}
                            <Box>
                              <ButtonComp
                                fullWidth
                                onClick={handleStichVideo}
                                variant="contained"
                                disabled={conversationalLoader}
                              >
                                Stitch Video
                              </ButtonComp>
                            </Box>
                          </Box>
                        </Menu>
                      </DialogActions>
                    </Dialog>

                  {(stitchedVideoUrl ||
                    scenesData?.stitched_video?.url ||
                    stitchedVideoStatus?.stitched_video?.url) && (
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
                        Final Stitched Video - {scenesData?.title}
                      </Typography>
    
                      <video
                        src={
                          stitchedVideoUrl ??
                          scenesData?.stitched_video?.url ??
                          stitchedVideoStatus?.stitched_video?.url
                        }
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
                </>
              )}
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
