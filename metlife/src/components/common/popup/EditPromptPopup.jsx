import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { postEditVisualContent } from "../../../redux/features/createVisualSlice";

const EditPromptPopup = ({
  open,
  onClose,
  fieldData,
  script_id,
  handleUpdate,
}) => {
  const { saveVisualContentLoader } = useSelector(
    (store) => store.CreateVisualContent
  );
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();
  console.log(fieldData, "From_popup");

  // ✅ Load data when popup opens or row changes
  useEffect(() => {
    if (fieldData) {
      setDescription(fieldData.Visual_Description || "");
    } else {
      setDescription("");
    }
  }, [fieldData, open]);

  const handleSave = () => {
    const payload = {
      script_id,
      prompt: description,
      scene_id: fieldData?.scene_id,
    };
    dispatch(postEditVisualContent(payload, onClose));
    handleUpdate({
      prompt: description,
      fieldData: fieldData,
    });
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
      <DialogTitle>Edit Prompt</DialogTitle>

      <DialogContent>
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          multiline
          rows={4}
        />
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={saveVisualContentLoader}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={saveVisualContentLoader}
          onClick={handleSave}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPromptPopup;
