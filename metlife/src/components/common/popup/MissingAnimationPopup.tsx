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
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ButtonComp from "../Buton/Button";

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
  const hasMissing = missingScenes.length > 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      {/* Title */}
      <DialogTitle
        sx={{
          fontWeight: 600,
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        {hasMissing ? (
          <>
            <WarningAmberIcon color="warning" />
            Missing Animations
          </>
        ) : (
          <>
            <CheckCircleOutlineIcon color="success" />
            Confirm Animation Changes
          </>
        )}
      </DialogTitle>

      {/* Content */}
      <DialogContent>
        <Box textAlign="center" mt={1}>
          {hasMissing ? (
            <>
              <Typography
                variant="body1"
                sx={{ color: "text.secondary", mb: 1 }}
              >
                The following scenes have no animations applied:
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  color: "#ed6c02",
                  mb: 2,
                }}
              >
                {missingScenes.join(", ")}
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                These scenes will play <b>without transitions</b>.
                <br />
                Do you want to continue?
              </Typography>
            </>
          ) : (
            <>
              <Typography
                variant="body1"
                sx={{ color: "text.secondary", mb: 2 }}
              >
                All scenes have animations applied.
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Are you sure you want to submit these animation changes?
              </Typography>
            </>
          )}
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ justifyContent: "center", pb: 2, gap: 1 }}>
        <ButtonComp
          onClick={onClose}
          variant="outlined"
          colorType="secondary"
          sx={{
            // minWidth: 110,
            // textTransform: "none",
            // borderRadius: "8px",
          }}
        >
          Cancel
        </ButtonComp>

        <ButtonComp
          onClick={onConfirm}
          colorType="warning"
          variant="contained"
          color={hasMissing ? "warning" : "primary"}
          sx={{
            // minWidth: 110,
            // textTransform: "none",
            // borderRadius: "8px",
          }}
        >
          {hasMissing ? "Continue Anyway" : "Confirm"}
        </ButtonComp>
      </DialogActions>
    </Dialog>
  );
};

export default MissingAnimationPopup;
