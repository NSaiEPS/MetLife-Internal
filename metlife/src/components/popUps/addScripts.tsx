// components/popUps/addScripts.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import styles from "./addScripts.module.css";
import ButtonComp from "../common/Buton/Button";
import { useDispatch } from "react-redux";
import { postAddScene, postEditScene } from "../../redux/features/scriptSlice";
import { useParams } from "react-router";

interface ScriptData {
  Script?: string;
  OST?: string;
  Type?: string;
}

interface AddNewScriptPopupProps {
  open: boolean;
  onClose: () => void;
  fieldData?: ScriptData | null;
  title: string;
  handleUpdate: (data: {
    script: string;
    ost: string;
    type: string;
    fieldData?: ScriptData | null;
  }) => void;
}

const AddNewScriptPopup: React.FC<AddNewScriptPopupProps> = ({
  open,
  onClose,
  fieldData,
  title,
  handleUpdate,
  tableData,
}) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [script, setScript] = useState("");
  const [ost, setOst] = useState("");
  const [type, setType] = useState("narrator");

  useEffect(() => {
    if (fieldData) {
      setScript(fieldData.Script || "");
      const cleanOST = (fieldData.OST || "").replace(/\r?\n|\r/g, " ");
      setOst(cleanOST);
      if (fieldData.Type == "narrator") {
        setType("narrator");
      } else {
        setType(fieldData.Type || "");
      }
    } else {
      setScript("");
      setOst("");
      setType("");
    }
  }, [fieldData, open]);

  console.log(fieldData, "field");

  const handleSave = () => {
    if (title === "Add New Scene") {
      const formData = new FormData();
      formData.append("script_id", id);
      formData.append("version", tableData?.version);
      formData.append("scene_type", tableData?.video_style === "narrative" ? "narrator" : "");
      formData.append("description", script);
      formData.append("on_screen_text", ost);
      dispatch(postAddScene(formData));
    }
    if (title === "Edit Scene") {
      const formData = new FormData();
      formData.append("script_id", id);
      formData.append("version", tableData?.version);
      formData.append("scene_id", fieldData?.id);
      formData.append("update_description", script);
      formData.append("update_on_screen_text", ost);
      dispatch(postEditScene(formData));
    }

    handleUpdate({ script, ost, type, fieldData });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className={styles.selectLangParent}
      PaperProps={{
        sx: {
          width: "523px",
          maxWidth: "none",
          borderRadius: "16px",
          padding: "16px",
        },
      }}
    >
      <DialogTitle className={styles.title}>{title}</DialogTitle>

      <DialogContent>
        <TextField
          label="Script"
          variant="outlined"
          fullWidth
          value={script}
          onChange={(e) => setScript(e.target.value)}
          margin="normal"
        />

        <TextField
          label="OST"
          variant="outlined"
          fullWidth
          value={ost}
          onChange={(e) => setOst(e.target.value)}
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Type</InputLabel>
          <Select
            disabled
            value={type}
            label="Type"
            sx={{ "& .MuiSelect-select": { textAlign: "justify" } }}
            onChange={(e) => setType(e.target.value)}
          >
            <MenuItem value="narrator">Narrator</MenuItem>
            <MenuItem value="monologue">Monologue</MenuItem>
            <MenuItem value="conversational">Conversational</MenuItem>
            <MenuItem value="mixed">Combined</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <ButtonComp onClick={onClose} variant="outlined" colorType="secondary">
          Cancel
        </ButtonComp>
        <ButtonComp variant="contained" onClick={handleSave}>
          Save
        </ButtonComp>
      </DialogActions>
    </Dialog>
  );
};

export default AddNewScriptPopup;
