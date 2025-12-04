import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Tooltip,
} from "@mui/material";

// ---------- TYPES ----------
interface ExtraDetails {
  is_saved?: boolean;
  [key: string]: any;
}

type ModalSize = "md" | "lg";

interface SinglePromptModalProps {
  open: boolean;
  onClose: () => void;
  prompt?: string;
  onSave: (prompt: string) => void;
  size?: ModalSize; // md = 600px, lg = 800px
  extraDetails?: ExtraDetails;
  operations?: boolean;
}

// ---------- COMPONENT ----------

const SinglePromptModal: React.FC<SinglePromptModalProps> = ({
  open,
  onClose,
  prompt = "",
  onSave,
  size = "md",
  extraDetails,
  operations,
}) => {
  const modalWidth = size === "lg" ? 800 : 600;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: modalWidth,
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: 24,
          p: 3,
        }}
      >
        {/* Heading */}
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
          Prompt
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Prompt Box */}
        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "grey.50",
            minHeight: "120px",
            fontSize: "16px",
            lineHeight: 1.5,
            color: "text.secondary",
            whiteSpace: "pre-wrap",
          }}
        >
          {prompt}
        </Paper>

        {/* Actions */}
        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
            }}
          >
            Close
          </Button>

          <Tooltip
            title={extraDetails?.is_saved ? "Cannot use this prompt!" : ""}
            placement="top"
            arrow
          >
            <span>
              <Button
                variant="contained"
                onClick={() => onSave(prompt)}
                 disabled={extraDetails?.is_saved || operations}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  px: 3,
                  opacity: extraDetails?.is_saved ? 0.5 : 1,
                  cursor: extraDetails?.is_saved
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                SAVE THIS PROMPT
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Box>
    </Modal>
  );
};

export default SinglePromptModal;
