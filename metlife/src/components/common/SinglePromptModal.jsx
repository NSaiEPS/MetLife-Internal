import React from "react";
import { Modal, Box, Typography, Button, Paper, Divider } from "@mui/material";

export default function SinglePromptModal({
  open,
  onClose,
  prompt = "",
  onSave,
  size = "md", // md = 600px, lg = 800px
}) {
  const modalWidth = size === "lg" ? 800 : 600;

  return (
    <Modal open={open}>
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
          }}
        >
          {prompt}
        </Paper>

        {/* Actions */}
        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ textTransform: "none", borderRadius: 2, px: 3 }}
          >
            Close
          </Button>

          <Button
            variant="contained"
            onClick={() => onSave(prompt)}
            sx={{ textTransform: "none", borderRadius: 2, px: 3 }}
          >
            SAVE THIS PROMPT
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
