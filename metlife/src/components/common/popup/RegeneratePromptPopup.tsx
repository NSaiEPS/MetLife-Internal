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
import ButtonComp from "../Buton/Button";

const RegeneratePromptPopup = ({ open, onClose, fieldData, id }) => {
  const onCloseTempData = () => {
    setFeedback("");
    onClose();
  }
  const { saveVisualContentLoader } = useSelector(
    (store) => store.CreateVisualContent
  );
  const [feedback, setFeedback] = useState("");
  const dispatch = useDispatch();

  const handleRegenerateApi = () => {
    const payload = {
      prompt_batch_id: id,
      scene_id: fieldData?.scene_id,
    };

    dispatch(postRegenerateVisualContent(payload, onCloseTempData));
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
      <DialogTitle>Regenerate Prompt</DialogTitle>

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
        <ButtonComp
          disabled={saveVisualContentLoader}
          variant="outlined"
          onClick={onCloseTempData}
          colorType="secondary"
        >
          Cancel
        </ButtonComp>
        <ButtonComp
          disabled={saveVisualContentLoader}
          variant="contained"
          onClick={handleRegenerateApi}
        >
          Regenerate
        </ButtonComp>
      </DialogActions>
    </Dialog>
  );
};

export default RegeneratePromptPopup;
