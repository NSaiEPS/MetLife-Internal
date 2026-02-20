import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

interface RegenerateDialogProps {
  open: boolean;
  feedback: string;
  loading?: boolean;
  onClose: () => void;
  onChangeFeedback: (value: string) => void;
  onSubmit: () => void;
}

const RegenerateCharacterImagesPopup: React.FC<RegenerateDialogProps> = ({
  open,
  feedback,
  loading = false,
  onClose,
  onChangeFeedback,
  onSubmit,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Regenerate Character</DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Enter feedback"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={feedback}
          onChange={(e) => onChangeFeedback(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>

        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={!feedback.trim() || loading}
        >
          {loading ? "Regenerating..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegenerateCharacterImagesPopup;
