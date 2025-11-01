import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Stack,
  TextField,
  MenuItem,
} from "@mui/material";

const RegenerateScriptPopup = ({ open, onClose, data = [] }) => {
  const [model, setModel] = useState("");
  const [topN, setTopN] = useState("");
  const [feedback, setFeedback] = useState("");
  console.log(data);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2,
          textAlign: "center",
        },
      }}
      sx={{
        "& .MuiDialog-container": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          color: "#1976d2",
          fontSize: "1.3rem",
        }}
      >
        Regenerate Script
      </DialogTitle>

     <DialogContent dividers>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#333",
            mb: 2,
            textAlign: "left",
          }}
        >
          Feedback
        </Typography>

        {/* Feedback Input */}
        <TextField
          multiline
          rows={3}
          fullWidth
          placeholder="Enter your feedback here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          sx={{ mb: 3 }}
        />

        {/* Row: Model + Top N */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          {/* Model Dropdown */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Model
            </Typography>
            <TextField
              select
              fullWidth
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Select Model"
            >
              <MenuItem value="gpt-4">GPT-4</MenuItem>
              <MenuItem value="gpt-5">GPT-5</MenuItem>
              <MenuItem value="custom">Custom Model</MenuItem>
            </TextField>
          </Box>

          {/* Top N Dropdown */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Top N
            </Typography>
            <TextField
              select
              fullWidth
              value={topN}
              onChange={(e) => setTopN(e.target.value)}
              placeholder="Select Top N"
            >
              <MenuItem value="1">Top 1</MenuItem>
              <MenuItem value="3">Top 3</MenuItem>
              <MenuItem value="5">Top 5</MenuItem>
              <MenuItem value="10">Top 10</MenuItem>
            </TextField>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
        <Button onClick={onClose} color="inherit" variant="outlined">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegenerateScriptPopup;
