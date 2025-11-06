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

const RegeneratePromptPopup = ({ open, onClose, fieldData, id }) => {
  const { saveVisualContentLoader } = useSelector(
    (store) => store.CreateVisualContent
  );
  console.log(fieldData, id, "check_regenerate");
  const [feedback, setFeedback] = useState("");
  const dispatch = useDispatch();

  const handleRegenerateApi = () => {
    const payload = {
      prompt_batch_id: id,
      scene_id: fieldData?.scene_id,
    };
    dispatch(postRegenerateVisualContent(payload, onClose));
    // dispatch(
    //   postRegenerateVisualContent(payload, (res) => {
    //     handleRegenerate({
    //       prompt: res.new_prompt,
    //       scene_id: fieldData.scene_id,
    //     });

    //     onClose();
    //   })
    // );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        <Button
          disabled={saveVisualContentLoader}
          variant="outlined"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          disabled={saveVisualContentLoader}
          variant="contained"
          onClick={handleRegenerateApi}
        >
          Regenerate
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegeneratePromptPopup;
