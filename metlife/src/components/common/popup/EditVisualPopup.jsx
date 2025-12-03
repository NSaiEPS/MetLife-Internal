import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { postEditGenerateVisualContent } from "../../../redux/features/generateVisualSlice";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  TextareaAutosize,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";

const EditVisualPopup = ({
  open,
  onClose,
  fieldData,
  script_id,
  prompt_batch_id,
  handleUpdate,
}) => {
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();
  console.log(fieldData, "check_field_data");

  useEffect(() => {
    if (fieldData) {
      const description = (fieldData.Visual_Description || "").replace(
        /\r?\n|\r/g,
        " "
      );
      setDescription(description);
      // setDescription(fieldData.Visual_Description || "");
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
        <Button
          onClick={onClose}
          variant="outlined"
          //   disabled={saveVisualContentLoader}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          //   disabled={saveVisualContentLoader}
          onClick={handleSave}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditVisualPopup;
