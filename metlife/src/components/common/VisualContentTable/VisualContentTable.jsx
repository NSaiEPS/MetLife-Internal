import React, { useEffect, useState } from "react";
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
import ImageCarousel from "../carousel/ImageCarousel";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from "react-router";
import {
  deleteGenerateVisualContent,
  postEditGenerateVisualContent,
} from "../../../redux/features/generateVisualSlice";
import { useDispatch, useSelector } from "react-redux";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import FullScreenGradientLoader from "../GradientLoader";

const VisualContentTable = ({
  columns = [],
  rows = [],
  actions = [],
  updateImagesInRow,
  updatePromptInRow,
}) => {
  const { generateVisualContentData } = useSelector(
    (store) => store.GenerateVisualContent
  );
  const prompt_batch_id = generateVisualContentData?.prompt_batch_id;
  const [previewImage, setPreviewImage] = useState(null);
  const [visuaiImages, setVisualImages] = useState([]);
  const [index, setIndex] = useState(0);
  const [openPromptModal, setOpenPromptModal] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState("");

  const { id } = useParams();
  const dispatch = useDispatch();
  console.log(visuaiImages, "visuaiImages");
  const { generateVisualLoader } = useSelector(
    (store) => store.GenerateVisualContent
  );

  const { audioAnimationLoader } = useSelector((store) => store.AudioAnimation);

  const handleDelete = () => {
    const currentImage = visuaiImages?.image_uploaded_urls[index]?.url;
    const currentVideo = visuaiImages?.video_uploaded_urls[index]?.url;
    if (visuaiImages?.Visual_Type === "image") {
      const payload = {
        script_id: id,
        scene_id: visuaiImages?.scene_id,
        image_url: currentImage,
      };

      dispatch(
        deleteGenerateVisualContent(payload, () => {
          const updatedImages = visuaiImages.image_uploaded_urls.filter(
            (img) => img.url !== currentImage
          );
          updateImagesInRow(visuaiImages.scene_id, updatedImages, "image");
          setVisualImages((prev) => ({
            ...prev,
            image_uploaded_urls: updatedImages,
          }));

          if (index >= updatedImages.length) {
            setIndex(updatedImages.length - 1);
          }

          if (updatedImages.length === 0) {
            setPreviewImage(null);
          }
        })
      );
    } else if (visuaiImages?.Visual_Type === "Footage") {
      const payload = {
        script_id: id,
        scene_id: visuaiImages?.scene_id,
        video_url: currentVideo,
      };
      dispatch(
        deleteGenerateVisualContent(payload, () => {
          const updatedVideos = visuaiImages.video_uploaded_urls.filter(
            (vid) => vid.url !== currentVideo
          );
          updateImagesInRow(visuaiImages.scene_id, updatedVideos, "video");
          setVisualImages((prev) => ({
            ...prev,
            video_uploaded_urls: updatedVideos,
          }));

          if (index >= updatedVideos.length) {
            setIndex(updatedVideos.length - 1);
          }

          if (updatedVideos.length === 0) {
            setPreviewImage(null);
          }
        })
      );
    }
  };

  const getPromptFromSceneId = (sceneId) => {
    const found = rows.find((v) => v.scene_id === sceneId);
    return found?.new_prompt || "";
  };

  const handlePrompt = (row) => {
    const prompt = getPromptFromSceneId(row.scene_id);
    setSelectedPrompt(prompt);
    setOpenPromptModal(true);
  };

  const handleEditDescription = (row) => {
    const payload = {
      script_id: id,
      scene_id: row.scene_id,
      prompt_batch_id,
      new_prompt: selectedPrompt,
    };
    dispatch(
      postEditGenerateVisualContent(payload, () => setOpenPromptModal(false))
    );
    updatePromptInRow({
      new_prompt: selectedPrompt,
      scene_id: row.scene_id,
    });
  };

  return (
    <>
      {generateVisualLoader && <FullScreenGradientLoader text="loading..." />}
      {audioAnimationLoader && (
        <FullScreenGradientLoader text="extracting..." />
      )}
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
      {previewImage && previewImage.length > 0 && (
        <Dialog
          open={!!previewImage}
          onClose={() => setPreviewImage(null)}
          // maxWidth="md"
          maxWidth={false}
        >
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
            {/* Prompt Button */}
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
            {/* DELETE */}
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

            {/* CLOSE */}
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
          {visuaiImages?.Visual_Type === "image" ? (
            <>
              <DialogContent>
                <ImageCarousel
                  images={visuaiImages?.image_uploaded_urls}
                  caroselIndex={setIndex}
                  previewImage={previewImage}
                />
              </DialogContent>
            </>
          ) : (
            <>
              <DialogContent>
                <VideoPlayer videoUrl={visuaiImages?.Visual_Image} />
              </DialogContent>
            </>
          )}
        </Dialog>
      )}
      {/*  Prompt Edit modal */}
      <Dialog
        open={openPromptModal}
        onClose={() => setOpenPromptModal(false)}
        fullWidth
        maxWidth="sm"
        // PaperProps={{
        //   sx: {
        //     width: "650px", // manually increase width
        //   },
        // }}
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
            <Button
              variant="outlined"
              onClick={() => setOpenPromptModal(false)}
            >
              Close
            </Button>

            <Button
              variant="contained"
              onClick={() => handleEditDescription(visuaiImages)} // ✅ FIXED
            >
              Submit
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VisualContentTable;
