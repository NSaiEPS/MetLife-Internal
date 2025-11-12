import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { postRegenerateVisualContent } from "../../../redux/features/createVisualSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { postRegenerateImage } from "../../../redux/features/generateVisualSlice";

const RegenerateImagePopup = ({
  open,
  onClose,
  fieldData,
  prompt_batch_id,
}) => {
  const { id } = useParams();

  const onCloseTempData = () => {
    setFeedback("");
    onClose();
  };

  const { generateVisualLoader,} = useSelector(
    (store) => store.GenerateVisualContent
  );

  const [feedback, setFeedback] = useState("");
  const dispatch = useDispatch();

  const handleRegenerateApi = () => {
    const scene_id = fieldData?.scene_id;
    const prommpt_batch_id = prompt_batch_id;

    const payload = {
      script_id: id,
      scene_id: scene_id,
      prompt_batch_id: prommpt_batch_id,
    };
    dispatch(postRegenerateImage(payload, onCloseTempData));
  };

  return (
    <Dialog
      open={open}
      onClose={onCloseTempData}
      PaperProps={{
        sx: {
          width: "500px",
          borderRadius: "16px",
          padding: "16px",
        },
      }}
    >
      <DialogTitle>Regenerate Image</DialogTitle>
      <DialogContent>
        <TextField
          label="Your Feedback"
          variant="outlined"
          rows={4}
          fullWidth
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          margin="normal"
          multiline
          placeholder="Enter your feedback to improve prompt..."
        />
      </DialogContent>

      <DialogActions>
        <Button
          disabled={generateVisualLoader}
          variant="outlined"
          onClick={onCloseTempData}
        >
          Cancel
        </Button>
        <Button
          disabled={generateVisualLoader}
          variant="contained"
          onClick={handleRegenerateApi}
        >
          Regenerate
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegenerateImagePopup;
