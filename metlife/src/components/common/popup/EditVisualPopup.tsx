import React, { useEffect, useState, version } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../redux/store"; // adjust path as needed
import { postEditGenerateVisualContent } from "../../../redux/features/generateVisualSlice";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import ButtonComp from "../Buton/Button";
import { postEditScene } from "../../../redux/features/scriptSlice";
import FullScreenGradientLoader from "../GradientLoader";

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
  handleUpdate: (data: {
    new_prompt: string;
    fieldData: FieldDataType | null;
  }) => void;
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
  const { scriptLoader } = useSelector(
      (store) => store.Script
    );

  useEffect(() => {
    if (fieldData) {
      const description = (fieldData.Visual_Description || "").replace(
        /\r?\n|\r/g,
        " ",
      );
      setDescription(description);
    } else {
      setDescription("");
    }
  }, [fieldData, open]);

  const handleSave = () => {
    console.log(description, "check")
    const formData = new FormData();
    formData.append("script_id", script_id);
    formData.append("scene_id", fieldData?.scene_id);
    formData.append("version", "1");
    formData.append("update_description", description);
    // console.log(formData, "formData")
    // const payload = {
    //   script_id,
    //   scene_id: fieldData?.scene_id,
    //   prompt_batch_id,
    //   new_prompt: description,
    // };
    // const payload = {
    //   script_id,
    //   scene_id: fieldData?.scene_id,
    //   version :1,
    //   update_description:description,
    //   // update_on_screen_text: "",
    // }
    // dispatch(postEditGenerateVisualContent(payload, onClose));
    dispatch(postEditScene(formData, onClose));
    handleUpdate({
      new_prompt: description,
      fieldData: fieldData ?? null,
    });
  };

  return (
    <>
    {scriptLoader && <FullScreenGradientLoader text="Loading..." />}
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
        <DialogTitle>Edit Scene Description</DialogTitle>

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
            variant="outlined"
            colorType="secondary"
          >
            Cancel
          </ButtonComp>

          <ButtonComp variant="contained" onClick={handleSave}>
            Save
          </ButtonComp>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditVisualPopup;
