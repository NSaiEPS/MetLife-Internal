import React, { useState } from "react";
import styles from "./visualContent.module.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogContent,
  Typography,
  Button,
  TextField,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import ImageCarousel from "../carousel/ImageCarousel";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import FullScreenGradientLoader from "../GradientLoader";

import {
  deleteGenerateVisualContent,
  postEditGenerateVisualContent,
} from "../../../redux/features/generateVisualSlice";

// ------------------ TYPES ------------------

export interface VisualRow {
  scene_id: string | number;
  new_prompt?: string;
  Visual_Type?: "image" | "Footage";
  image_uploaded_urls?: { url: string }[];
  video_uploaded_urls?: { url: string }[];
  Visual_Image?: string;
  [key: string]: any;
}

export interface ColumnType {
  key: string;
  label: string;
  render?: (
    value: any,
    row: VisualRow,
    setPreviewImage: (val: any) => void,
    setVisualImages: (val: any) => void
  ) => React.ReactNode;
}

export interface ActionType {
  icon: React.ReactNode;
  onClick: (row: VisualRow) => void;
}

interface VisualContentTableProps {
  columns: any[];
  rows: any[];
  actions?: any[];
  updateImagesInRow: (
    scene_id: string | number,
    images: any[],
    type: "image" | "video"
  ) => void;
  updatePromptInRow: (obj: { new_prompt: string; scene_id: string | number }) => void;
}

// --------------------------------------------------

const VisualContentTable: React.FC<VisualContentTableProps> = ({
  columns = [],
  rows = [],
  actions = [],
  updateImagesInRow,
  updatePromptInRow,
}) => {
  const { generateVisualContentData, generateVisualLoader } = useSelector(
    (store: any) => store.GenerateVisualContent
  );

  const { audioAnimationLoader } = useSelector(
    (store: any) => store.AudioAnimation
  );

  const prompt_batch_id = generateVisualContentData?.prompt_batch_id;

  const [previewImage, setPreviewImage] = useState<any>(null);
  const [visuaiImages, setVisualImages] = useState<VisualRow | any>({});
  const [index, setIndex] = useState<number>(0);

  const [openPromptModal, setOpenPromptModal] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState("");

  const { id } = useParams();
  const dispatch = useDispatch<any>();

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  const getPromptFromSceneId = (sceneId: string | number): string => {
    const found = rows.find((v) => v.scene_id === sceneId);
    return found?.new_prompt || "";
  };

  const handlePrompt = (row: VisualRow) => {
    const prompt = getPromptFromSceneId(row.scene_id);
    setSelectedPrompt(prompt);
    setOpenPromptModal(true);
  };

  const handleEditDescription = (row: VisualRow) => {
    const payload = {
      script_id: id,
      scene_id: row.scene_id,
      prompt_batch_id,
      new_prompt: selectedPrompt,
    };

    dispatch(
      postEditGenerateVisualContent(payload, () => {
        setOpenPromptModal(false);
      }) as any
    );

    updatePromptInRow({
      new_prompt: selectedPrompt,
      scene_id: row.scene_id,
    });
  };

  // --------------------------------------------------
  // Delete image or video
  // --------------------------------------------------

  const handleDelete = () => {
    const currentImage = visuaiImages?.image_uploaded_urls?.[index]?.url;
    const currentVideo = visuaiImages?.video_uploaded_urls?.[index]?.url;

    if (visuaiImages?.Visual_Type === "image" && currentImage) {
      const payload = {
        script_id: id,
        scene_id: visuaiImages.scene_id,
        image_url: currentImage,
      };

      dispatch(
        deleteGenerateVisualContent(payload, () => {
          const updatedImages = visuaiImages.image_uploaded_urls.filter(
            (img: any) => img.url !== currentImage
          );

          updateImagesInRow(visuaiImages.scene_id, updatedImages, "image");

          setVisualImages((prev: any) => ({
            ...prev,
            image_uploaded_urls: updatedImages,
          }));

          if (index >= updatedImages.length) {
            setIndex(updatedImages.length - 1);
          }
          if (updatedImages.length === 0) setPreviewImage(null);
        }) as any
      );
    }

    if (visuaiImages?.Visual_Type === "Footage" && currentVideo) {
      const payload = {
        script_id: id,
        scene_id: visuaiImages.scene_id,
        video_url: currentVideo,
      };

      dispatch(
        deleteGenerateVisualContent(payload, () => {
          const updatedVideos = visuaiImages.video_uploaded_urls.filter(
            (vid: any) => vid.url !== currentVideo
          );

          updateImagesInRow(visuaiImages.scene_id, updatedVideos, "video");

          setVisualImages((prev: any) => ({
            ...prev,
            video_uploaded_urls: updatedVideos,
          }));

          if (index >= updatedVideos.length) {
            setIndex(updatedVideos.length - 1);
          }
          if (updatedVideos.length === 0) setPreviewImage(null);
        }) as any
      );
    }
  };

  // --------------------------------------------------

  return (
    <>
      {generateVisualLoader && <FullScreenGradientLoader text="loading..." />}
      {audioAnimationLoader && <FullScreenGradientLoader text="extracting..." />}

      <TableContainer className={styles.tablePaper}>
        <Table className={styles.tableRoot}>
          <TableHead>
            <TableRow>
              {columns.map((col, idx) => (
                <TableCell key={idx} sx={{ fontWeight: 600 }}>
                  {col.label}
                </TableCell>
              ))}

              {actions.length > 0 && (
                <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, rIdx) => (
              <TableRow key={rIdx}>
                {columns.map((col, cIdx) => (
                  <TableCell key={cIdx}>
                    {col.render
                      ? col.render(
                          row[col.key],
                          row,
                          setPreviewImage,
                          setVisualImages
                        )
                      : row[col.key]}
                  </TableCell>
                ))}

                {actions.length > 0 && (
                  <TableCell>
                    <div style={{ display: "flex", gap: 8 }}>
                      {actions.map((act, aIdx) => (
                        <IconButton
                          key={aIdx}
                          size="small"
                          onClick={() => act.onClick(row)}
                        >
                          {act.icon}
                        </IconButton>
                      ))}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ------------ PREVIEW DIALOG ------------ */}
      {previewImage && (
        <Dialog open={!!previewImage} onClose={() => setPreviewImage(null)} maxWidth={false}>
          <div
            style={{
              position: "absolute",
              right: 10,
              top: 10,
              zIndex: 10,
              display: "flex",
              gap: 8,
            }}
          >
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                backgroundColor: "#1976d2",
                color: "#fff",
                borderRadius: "8px",
              }}
              onClick={() => handlePrompt(visuaiImages)}
            >
              Prompt
            </Button>

            {visuaiImages?.image_uploaded_urls?.length > 0 && (
              <IconButton
                onClick={handleDelete}
                sx={{
                  backgroundColor: "rgba(255, 0, 0, 0.6)",
                  color: "white",
                  "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.8)" },
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}

            <IconButton
              onClick={() => setPreviewImage(null)}
              sx={{
                backgroundColor: "rgba(0,0,0,0.4)",
                color: "white",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
              }}
            >
              <CloseIcon />
            </IconButton>
          </div>

          <DialogContent>
            {visuaiImages?.Visual_Type === "image" ? (
              <ImageCarousel
                images={visuaiImages?.image_uploaded_urls}
                caroselIndex={setIndex}
                previewImage={previewImage}
              />
            ) : (
              <VideoPlayer videoUrl={visuaiImages?.Visual_Image} />
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* ------------ PROMPT EDIT MODAL ------------ */}
      <Dialog
        open={openPromptModal}
        onClose={() => setOpenPromptModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Description
          </Typography>

          <TextField
            fullWidth
            multiline
            minRows={4}
            value={selectedPrompt}
            onChange={(e) => setSelectedPrompt(e.target.value)}
            placeholder="Enter scene prompt..."
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button variant="outlined" onClick={() => setOpenPromptModal(false)}>
              Close
            </Button>

            <Button variant="contained" onClick={() => handleEditDescription(visuaiImages)}>
              Submit
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VisualContentTable;
