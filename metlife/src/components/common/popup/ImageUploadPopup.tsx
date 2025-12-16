import React, { useEffect, useState,  } from "react";
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
import type {ChangeEvent} from "react"
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import { postImageUpload } from "../../../redux/features/generateVisualSlice";

// ---------- Props Interface ----------
interface ImageUploadPopupProps {
  open: boolean;
  onClose: () => void;
  fieldData: {
    scene_id: string;
    "Scene_No.": number;
    image_uploaded_urls?: { url: string }[];
  };
  script_id: string;
  prompt_batch_id: string;
  title: string;
}

const ImageUploadPopup: React.FC<ImageUploadPopupProps> = ({
  open,
  onClose,
  fieldData,
  script_id,
  prompt_batch_id,
  title,
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const scene_id = fieldData?.scene_id;
  const scene_no = fieldData?.["Scene_No."];
  const dispatch = useDispatch();
  const existingImages = fieldData?.image_uploaded_urls || [];
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (open && existingImages.length > 0) {
      setCurrentIndex(existingImages.length - 1); 
    }
  }, [open, existingImages]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUploadClick = () => {
    if (!imageFile) return;

    const formData = new FormData();
    formData.append("script_id", script_id);
    formData.append("scene_id", scene_id);
    formData.append("scene_number", scene_no.toString());
    formData.append("title", title);
    formData.append("prompt_batch_id", prompt_batch_id);
    formData.append("file", imageFile);

    dispatch(postImageUpload(formData, onClose));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Upload Image</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box mt={2}>
          <input type="file" accept="image/*" onChange={handleFileChange} />

          {previewUrl && (
            <Box mt={2}>
              <Typography variant="subtitle2">Preview:</Typography>
              <img
                src={previewUrl}
                alt="preview"
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
          disabled={!imageFile}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageUploadPopup;
