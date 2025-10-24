// components/popUps/addScripts.js
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

const AddNewScriptPopup = ({ open, onClose, fieldData }) => {
  const [script, setScript] = useState("");
  const [ost, setOst] = useState("");
  const [type, setType] = useState("");
  console.log(fieldData)

  // ✅ Update popup fields when `fieldData` changes
  useEffect(() => {
    if (fieldData) {
      setScript(fieldData.Script || "");
      setOst(fieldData.OST || "");
      setType(fieldData.Type || "");
    } else {
      setScript("");
      setOst("");
      setType("");
    }
  }, [fieldData, open]);

  const handleSave = () => {
    console.log({ script, ost, type });
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
      <DialogTitle className={styles.title}>Add New Script</DialogTitle>

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
            value={type}
            label="Type"
            onChange={(e) => setType(e.target.value)}
          >
            <MenuItem value="Monologue">Monologue</MenuItem>
            <MenuItem value="Dialogue">Dialogue</MenuItem>
            <MenuItem value="Narration">Narration</MenuItem>
          </Select>
        </FormControl>
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

export default AddNewScriptPopup;
