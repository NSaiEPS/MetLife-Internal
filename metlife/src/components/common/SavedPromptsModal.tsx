import React from "react";
import {
  Modal,
  Box,
  Typography,
  List,
  Button,
  Divider,
  Paper,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { showToast } from "../../utils/toast";
import { NoDataMessage } from "./NoDataMessage";
import { useSelector } from "react-redux";

export default function SavedPromptsModal({
  open,
  onClose,
  prompts = [],
  size = "md", // "md" or "lg"
}) {
  const { promtLoader } = useSelector((store) => store.Prompts);

  const handleCopy = async (text) => {
    showToast.info("Prompt copied to clipboard!");

    await navigator.clipboard.writeText(text);
    onClose(text);
  };

  const modalWidth = size === "lg" ? 800 : 600; // 600 = md, 800 = lg

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
        {/* Header */}
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
          Saved Prompts
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Scrollable ONLY this section */}
        <Box
          sx={{
            maxHeight: "55vh", // limit internal height
            overflowY: "auto",
            pr: 1,
          }}
        >
          <List
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {promtLoader ? (
              <>
                <Typography color="text.secondary" textAlign="center">
                  loading...
                </Typography>
              </>
            ) : prompts && prompts?.length > 0 ? (
              prompts?.map((prompt, index) => (
                <Paper
                  key={index}
                  elevation={1}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "grey.50",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      flex: 1,
                      mr: 2,
                      color: "text.secondary",
                      fontSize: "15px",
                    }}
                  >
                    {prompt?.prompt}
                  </Typography>

                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleCopy(prompt?.prompt)}
                    startIcon={<ContentCopyIcon />}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: 10,
                      px: 2,
                    }}
                  >
                    Use this prompt
                  </Button>
                </Paper>
              ))
            ) : (
              <>
                <NoDataMessage />
              </>
            )}
          </List>
        </Box>

        {/* Footer */}
        <Box textAlign="right" mt={3}>
          <Button
            variant="outlined"
            onClick={() => onClose()}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
            }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
