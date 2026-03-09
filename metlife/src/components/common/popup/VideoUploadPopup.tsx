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
  FormControlLabel,
  Switch,
  Menu,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../redux/store"; // <-- update this path
import { postImageUpload } from "../../../redux/features/generateVisualSlice";
import ButtonComp from "../Buton/Button";
import { useLocation } from "react-router";
import { getVisualContent } from "../../../redux/features/createVisualSlice";

// ---------- TYPES ----------

interface ExistingVideo {
  url: string;
  [key: string]: any;
}

interface FieldData {
  scene_id?: string;
  ["Scene_No."]?: string | number;
  video_uploaded_urls?: ExistingVideo[];
  [key: string]: any;
}

interface VideoUploadPopupProps {
  open: boolean;
  onClose: () => void;
  fieldData: FieldData;
  script_id: string;
  prompt_batch_id: string;
  title: string;
}

// ---------- COMPONENT ----------

const VideoUploadPopup: React.FC<VideoUploadPopupProps> = ({
  open,
  onClose,
  fieldData,
  script_id,
  prompt_batch_id,
  title,
}) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const scene_id = fieldData?.scene_id;
  const scene_no = fieldData?.["Scene_No."] || fieldData?.Scene_No;
  const dispatch = useDispatch<AppDispatch>();
  const existingVideos = fieldData?.video_uploaded_urls || [];
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [audio, setAudio] = useState("on"); // default

  // Load last uploaded video on open
  useEffect(() => {
    if (open && existingVideos.length > 0) {
      const lastIndex = existingVideos.length - 1;
      setCurrentIndex(lastIndex);
      setPreviewUrl(existingVideos[lastIndex].url);
    }
  }, [open, fieldData, existingVideos]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Upload logic
  const handleUploadClick = () => {
    if (!videoFile) return;

    const formData = new FormData();
    formData.append("script_id", script_id);
    formData.append("scene_id", String(scene_id));
    formData.append("scene_number", String(scene_no));
    formData.append("title", title);
    formData.append("prompt_batch_id", prompt_batch_id);
    formData.append("file", videoFile);
    formData.append("generate_audio", audio === "on" ? true: false);

    dispatch(postImageUpload(formData, onClose, prompt_batch_id));
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  console.log(audio, "check_audio")

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Upload Video</Typography>

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
        <ButtonComp onClick={onClose} variant="outlined" colorType="secondary">
          Cancel
        </ButtonComp>

        <ButtonComp
          onClick={handleUploadClick}
          variant="contained"
          disabled={!videoFile}
        >
          Upload
        </ButtonComp>

        <ButtonComp
          sx={{ textTransform: "none", }}
          label={"Audio"}
          // action={generateVideo}
          action={handleMenuOpen}
       
        />

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{ sx: { p: 2, width: 230 } }}
        >
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="primary" fontWeight={600}>
              Want Audio
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={audio}
                  onChange={(e) => setAudio(e.target.checked)}
                />
              }
              label={audio ? "ON" : "OFF"}
            />
            {/* <ButtonComp
              sx={{ textTransform: "none", width: "200px" }}
              label={"Generate Final Video"}
              action={generateVideo}
              // action={handleMenuOpen}
              disabled={
                audioAnimationLoader ||
                videoAnimationLoader ||
                !videoAnimationData ||
                generatedVideoData?.final_video ||
                finalTime > 0
              }
            /> */}
          </Box>
        </Menu>
      </DialogActions>
    </Dialog>
  );
};

export default VideoUploadPopup;
