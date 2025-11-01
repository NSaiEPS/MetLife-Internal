import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import FullScreenGradientLoader from "../GradientLoader";

const ShowSourcePopup = ({ open, onClose, data = [], loader = false }) => {
  console.log(data);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
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
        Show Source
      </DialogTitle>

      <DialogContent dividers sx={{ maxHeight: 400, overflowY: "auto" }}>
        {loader ? (
          <Typography color="text.secondary" textAlign="center">
            loading...
            {/* <FullScreenGradientLoader text="loading" /> */}
          </Typography>
        ) : data && data.length > 0 ? (
          <Stack spacing={2}>
            {data.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  p: 2,
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  backgroundColor: "#fafafa",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    width: "30px",
                    fontWeight: 600,
                    color: "#1976d2",
                    textAlign: "center",
                  }}
                >
                  {index + 1}.
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    flex: 1,
                    whiteSpace: "pre-wrap",
                    textAlign: "left",
                  }}
                >
                  {item.content}
                </Typography>
              </Box>
            ))}
          </Stack>
        ) : (
          " NO Data Available"
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
        <Button onClick={onClose} color="inherit" variant="outlined">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShowSourcePopup;
