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
import ImageCarousel from "../carousel/ImageCarousel";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from "react-router";
import { deleteGenerateVisualContent, postEditGenerateVisualContent } from "../../../redux/features/generateVisualSlice";
import { useDispatch , useSelector} from "react-redux";

const VisualContentTable = ({
  columns = [],
  rows = [],
  actions = [],
  updateImagesInRow,
  visuals,
  prompt_batch_id,
  handleUpdate,
}) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [visuaiImages, setVisualImages] = useState([]);
  const [index, setIndex] = useState(0);
  // const [singlePrompt, setSinglePrompt] = useState("");
  const [openPromptModal, setOpenPromptModal] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState("");

  const { id } = useParams();
  const dispatch = useDispatch();

  const { generateVisualLoader, generateVisualContentData } = useSelector(
    (store) => store.GenerateVisualContent
  );

  const handleDelete = () => {
    const currentImage = visuaiImages?.image_uploaded_urls[index]?.url;

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
        updateImagesInRow(visuaiImages.scene_id, updatedImages);
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
  };

  const getPromptFromSceneId = (sceneId) => {
    const found = visuals.find((v) => v.scene_id === sceneId);
    return found?.prompt || "";
  };

  console.log(selectedPrompt, "selectedPrompt")

  const handlePrompt = (row) => {
    const prompt = getPromptFromSceneId(row.scene_id);
    // setSinglePrompt(prompt);
    setSelectedPrompt(prompt);
    setOpenPromptModal(true);
  };

  const handleEditDescription = (row) => {
    console.log("clicked", row);
    const payload = {
      script_id: id,
      scene_id: row.scene_id,
      prompt_batch_id,
      new_prompt: selectedPrompt
    }
    dispatch(postEditGenerateVisualContent(payload, () => setOpenPromptModal(false)))
    handleUpdate({
      new_prompt: selectedPrompt,
      fieldData: row,
    })
  };

  return (
    <>
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

          <DialogContent>
            <ImageCarousel
              images={visuaiImages?.image_uploaded_urls}
              caroselIndex={setIndex}
              previewImage={previewImage}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* <Dialog open={openPromptModal} onClose={() => setOpenPromptModal(false)}>
        <DialogContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Scene Prompt
          </Typography>

          <Typography sx={{ whiteSpace: "pre-wrap" }}>
            {selectedPrompt || "No prompt found"}
          </Typography>

          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => setOpenPromptModal(false)}
          >
            Close
          </Button>
            <Button
            variant="contained"
            sx={{ mt: 2 }}
            // onClick={() => setOpenPromptModal(false)}
            onClick={() => handleEditDescription}
          >
            Submit
          </Button>
        </DialogContent>
      </Dialog> */}
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
