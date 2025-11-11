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
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import { postImageUpload } from "../../../redux/features/generateVisualSlice";

const ImageUploadPopup = ({
  open,
  onClose,
  fieldData,
  script_id,
  prompt_batch_id,
  title,
  handleImageUpdate,
}) => {
  console.log(fieldData, "in_popup");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  //   const [imageTitle, setImageTitle] = useState("");
  const scene_id = fieldData?.scene_id;
  const scene_no = fieldData?.["Scene_No."];
  const dispatch = useDispatch();
  const existingImages = fieldData?.image_uploaded_urls || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (open) {
      if (existingImages.length > 0) {
        setCurrentIndex(existingImages.length - 1); // show latest by default
        setPreviewUrl(existingImages[existingImages.length - 1].url);
      }
    }
  }, [open, fieldData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUploadClick = () => {
    // if (onUpload) {
    //   onUpload({
    //     file: imageFile,
    //     title: imageTitle,
    //   });
    // }

    const formData = new FormData();
    formData.append("script_id", script_id);
    formData.append("scene_id", scene_id);
    formData.append("scene_number", scene_no);
    formData.append("title", title);
    formData.append("prompt_batch_id", prompt_batch_id);
    formData.append("file", imageFile);
    dispatch(postImageUpload(formData));

    // handleImageUpdate({
    //   fieldData: fieldData,
    // });
    // handleImageUpdate({
    //   fieldData: fieldData,
    //   new_images: newImagesArray,
    // });

    dispatch(postImageUpload(formData)).then((newImagesArray) => {
      handleImageUpdate({
        fieldData,
        new_images: newImagesArray,
      });

      onClose();
    });
  };

  const handlePrev = () => {
    if (existingImages.length === 0) return;
    setCurrentIndex((prev) =>
      prev === 0 ? existingImages.length - 1 : prev - 1
    );
    setPreviewUrl(
      existingImages[
        currentIndex === 0 ? existingImages.length - 1 : currentIndex - 1
      ].url
    );
  };

  const handleNext = () => {
    if (existingImages.length === 0) return;
    setCurrentIndex((prev) =>
      prev === existingImages.length - 1 ? 0 : prev + 1
    );
    setPreviewUrl(
      existingImages[
        currentIndex === existingImages.length - 1 ? 0 : currentIndex + 1
      ].url
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">{"Upload Image"}</Typography>

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
