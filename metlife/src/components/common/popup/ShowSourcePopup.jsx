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
import { NoDataMessage } from "../NoDataMessage";

const ShowSourcePopup = ({ open, onClose, data = [], loader = false }) => {
  return (
    <>
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
            textTransform: "capitalize",
          }}
        >
          {data?.data_source || "Show Source"}
        </DialogTitle>

        <DialogContent dividers sx={{ maxHeight: 400, overflowY: "auto" }}>
          {loader ? (
            <Typography color="text.secondary" textAlign="center">
              loading...
            </Typography>
          ) : data?.documents && data?.documents?.length > 0 ? (
            <Stack spacing={2}>
              {data?.documents?.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    backgroundColor: "#fafafa",
                    textAlign: "left",
                  }}
                >
                  {/* File Name */}
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: "#1976d2",
                      mb: 1,
                    }}
                  >
                    {index + 1}. {item.file_name || "Unnamed File"}
                  </Typography>

                  {/* Text Content */}
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: "pre-wrap",
                      color: "#333",
                      backgroundColor: "#fff",
                      borderRadius: 1,
                      p: 1.5,
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    {item.text_content || "No text content available"}
                  </Typography>
                </Box>
              ))}
            </Stack>
          ) : (
            // "No Data Available"
            <NoDataMessage />
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
          <Button onClick={onClose} color="inherit" variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ShowSourcePopup;
