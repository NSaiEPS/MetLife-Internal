import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../redux/store"; // adjust path as needed
import { postEditGenerateVisualContent } from "../../../redux/features/generateVisualSlice";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

// ---------- Props Types ----------
interface FieldDataType {
  Visual_Description?: string;
  scene_id?: string | number;
  [key: string]: any;
}

interface EditVisualPopupProps {
  open: boolean;
  onClose: () => void;
  fieldData?: FieldDataType | null;
  script_id: string;
  prompt_batch_id: string;
  handleUpdate: (data: { new_prompt: string; fieldData: FieldDataType | null }) => void;
}

// ---------- Component ----------
const EditVisualPopup: React.FC<EditVisualPopupProps> = ({
  open,
  onClose,
  fieldData,
  script_id,
  prompt_batch_id,
  handleUpdate,
}) => {
  const [description, setDescription] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (fieldData) {
    const description = (fieldData.Visual_Description || "").replace(
        /\r?\n|\r/g,
        " "
      );
      setDescription(description);
    } else {
      setDescription("");
    }
  }, [fieldData, open]);

  const handleSave = () => {
    const payload = {
      script_id,
      scene_id: fieldData?.scene_id,
      prompt_batch_id,
      new_prompt: description,
    };

    dispatch(postEditGenerateVisualContent(payload, onClose));

    handleUpdate({
      new_prompt: description,
      fieldData: fieldData ?? null,
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
      <DialogTitle>Edit Description</DialogTitle>

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
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>

        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditVisualPopup;
