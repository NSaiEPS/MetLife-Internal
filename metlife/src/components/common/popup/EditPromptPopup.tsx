import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { postEditVisualContent } from "../../../redux/features/createVisualSlice";
import type { RootState } from "../../../redux/store";
import ButtonComp from "../Buton/Button";

interface FieldData {
  scene_id: string | number;
  Visual_Description?: string;
}

interface EditPromptPopupProps {
  open: boolean;
  onClose: () => void;
  fieldData?: FieldData | null;
  script_id: string | number;
  handleUpdate: (data: { prompt: string; fieldData: FieldData | null }) => void;
}

const EditPromptPopup: React.FC<EditPromptPopupProps> = ({
  open,
  onClose,
  fieldData,
  script_id,
  handleUpdate,
}) => {
  const dispatch = useDispatch<any>();

  const { saveVisualContentLoader } = useSelector(
    (store: RootState) => store.CreateVisualContent
  );

  const [description, setDescription] = useState("");
  console.log(fieldData, "check__")

  // Load initial description when modal opens
  useEffect(() => {
    if (fieldData) {
      setDescription(fieldData.Visual_Description || "");
    } else {
      setDescription("");
    }
  }, [fieldData, open]);

  const handleSave = () => {
    if (!fieldData) return;

    const payload = {
      script_id,
      value: description,
      scene_id: fieldData.scene_id,
      prompt_type: fieldData?.Visual_Type === "clip" ? "clip_prompt" : "prompt",
    };

    dispatch(postEditVisualContent(payload, onClose));

    handleUpdate({
      prompt: description,
      fieldData,
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
        <ButtonComp
          onClick={onClose}
          colorType="secondary"
          variant="outlined"
          disabled={saveVisualContentLoader}
        >
          Cancel
        </ButtonComp>

        <ButtonComp
          variant="contained"
          onClick={handleSave}
          disabled={saveVisualContentLoader}
        >
          Save
        </ButtonComp>
      </DialogActions>
    </Dialog>
  );
};

export default EditPromptPopup;
