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
import SelectComp from "../select";
import ButtonComp from "../Buton/Button";
import { showToast } from "../../../utils/toast";
import api from "../../../api/axios";
import FullScreenGradientLoader from "../GradientLoader";

const topNOptions = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 15, label: "15" },
  { value: 20, label: "20" },
];

const modelOptions = [
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "gpt-4o-mini", label: "GPT-4o-mini" },
  { value: "gpt-4.1", label: "GPT-4.1" },
];

const RegenerateScriptPopup = ({ open, onClose, id }) => {
  const [model, setModel] = useState("gpt-4o-mini");
  const [topn, setTopn] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loader, setLoader] = useState(false);
  const [regenerateData, setRegenerateData] = useState([]);

  //   console.log(data);
  const handleRegenerate = () => {
    if (!feedback) {
      showToast.error("Please give feedback");
    } else if (!model) {
      showToast.error("Please select model");
    } else if (!topn) {
      showToast.error("Please select TopN");
    } else {
      apiCall();
    }
  };

  const apiCall = async () => {
    setLoader(true);

    const new_payload = {
      feedback,
      top_n: topn,
      model: model,
    };

    try {
      const result = await api.post(`scripts/${id}/regenerate`, new_payload);
      console.log(result, "regenerate_result");
      if (result?.status == 200) {
        setRegenerateData(result?.data)
        
        // if (result?.data?.scenes) {
        //   navigate(`/scenes/${result?.data?.script_id}`);
        // }
      } else {
        showToast?.error("Some Issue In Generating");
      }
      console.log("Video created successfully:", result);
    } catch (err) {
      showToast?.error("Some Issue In Re-Generating");

      console.error("Video creation failed:", err);
    } finally {
      setLoader(false);
      onClose(true);
    }
  };

  return (
    <>
      {loader && <FullScreenGradientLoader text="Re-Generating..." />}
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
              fontWeight: 500,
              fontSize: "18px",
              color: "#333",
              mb: 1,
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
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  textAlign: "left",
                  fontWeight: 500,
                  fontSize: "18px",
                }}
              >
                Model
              </Typography>
              <SelectComp
                options={modelOptions}
                value={model}
                onChange={setModel}
                placeholder="Select Model"
              />
            </Box>

            {/* Top N Dropdown */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  textAlign: "left",
                  fontWeight: 500,
                  fontSize: "18px",
                  color: "#333",
                }}
              >
                Top N
              </Typography>
              <SelectComp
                //   label="Top N"
                options={topNOptions}
                value={topn}
                onChange={setTopn}
                placeholder="Select Top N"
              />
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
          <ButtonComp
            disabled={loader}
            label={loader ? "Submitting" : "Submit"}
            variant="contained"
            sx={{
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#b2d1f0ff" },
            }}
            action={handleRegenerate}
          />
          <Button onClick={onClose} color="inherit" variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RegenerateScriptPopup;
