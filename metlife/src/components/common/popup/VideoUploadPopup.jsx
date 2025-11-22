import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import { postImageUpload } from "../../../redux/features/generateVisualSlice"; // <-- create API similar to postImageUpload

const VideoUploadPopup = ({
  open,
  onClose,
  fieldData,
  script_id,
  prompt_batch_id,
  title,
}) => {
  const [videoFile, setVideoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const scene_id = fieldData?.scene_id;
  const scene_no = fieldData?.["Scene_No."];
  const dispatch = useDispatch();
  const existingVideos = fieldData?.video_uploaded_urls || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (open) {
      if (existingVideos.length > 0) {
        setCurrentIndex(existingVideos.length - 1); // show latest by default
        setPreviewUrl(existingVideos[existingVideos.length - 1].url);
      }
    }
  }, [open, fieldData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setVideoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUploadClick = () => {
    const formData = new FormData();
    formData.append("script_id", script_id);
    formData.append("scene_id", scene_id);
    formData.append("scene_number", scene_no);
    formData.append("title", title);
    formData.append("prompt_batch_id", prompt_batch_id);
    formData.append("file", videoFile);

    dispatch(postImageUpload(formData, onClose)); // <-- same as image but for video
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">{"Upload Video"}</Typography>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box mt={2}>
          <input type="file" accept="video/*" onChange={handleFileChange} />

          {previewUrl && (
            <Box mt={2}>
              <Typography variant="subtitle2">Preview:</Typography>

              <video
                src={previewUrl}
                controls
                style={{
                  width: "100%",
                  maxHeight: 300,
                  objectFit: "contain",
                  borderRadius: 8,
                  marginTop: 8,
                }}
              />
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>

        <Button
          onClick={handleUploadClick}
          variant="contained"
          disabled={!videoFile}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VideoUploadPopup;
