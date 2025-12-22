import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

// ---------- Props ----------
interface MissingAnimationPopupProps {
  open: boolean;
  missingScenes: number[];
  onClose: () => void;
  onConfirm: () => void;
}

// ---------- Component ----------
const MissingAnimationPopup: React.FC<MissingAnimationPopupProps> = ({
  open,
  missingScenes,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 1,
        },
      }}
    >
      {/* Title */}
      <DialogTitle
        sx={{
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        Missing Animations
      </DialogTitle>

      {/* Content */}
      <DialogContent>
        <Box textAlign="center" mt={1}>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 1 }}>
            You have not applied animations to the following scenes:
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              color: "#1976d2",
              mb: 2,
            }}
          >
            {missingScenes.join(", ")}
          </Typography>

          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Are you sure you want to continue?
          </Typography>
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            minWidth: 110,
            textTransform: "none",
            borderRadius: "8px",
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            background: "#1976d2",
            minWidth: 110,
            textTransform: "none",
            borderRadius: "8px",
          }}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MissingAnimationPopup;
