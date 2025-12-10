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
  Tooltip,
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

const RegenerateScriptPopup = ({
  open,
  onClose,
  id,
  setTableExtraData,
  sceneId,
  tableData,
}) => {
  const onCloseFun = () => {
    setTopn("");
    setFeedback("");
    onClose();
  };
  const [model, setModel] = useState("gpt-4o-mini");
  const [topn, setTopn] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loader, setLoader] = useState(false);

  const handleRegenerate = () => {
    if (!feedback) {
      showToast.error("Please give feedback");
    } else if (!model) {
      showToast.error("Please select model");
    } else if (!topn && !sceneId?.id && tableData?.data_source != "openai") {
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
      source_version: tableData?.version,
    };
    if (!topn) {
      delete new_payload.top_n;
    }
    if (sceneId?.id) {
      delete new_payload.top_n;
    }
    try {
      let apis = `scripts/${id}/regenerate`;
      if (sceneId?.id) {
        apis = `scripts/${id}/scenes/${sceneId?.id}`;
      }
      let result;
      if (sceneId?.id) {
        result = await api.patch(apis, new_payload);
      } else {
        result = await api.post(apis, new_payload);
      }
      if (result?.status == 200) {
        setTableExtraData(result?.data);
        // if (result?.data?.scenes) {
        //   navigate(`/scenes/${result?.data?.script_id}`);
        // }
      } else {
        showToast?.error("Some Issue In Generating");
      }
    } catch (err) {
      showToast?.error("Some Issue In Re-Generating");

      console.error("Video creation failed:", err);
    } finally {
      setLoader(false);
      onCloseFun(true);
    }
  };

  return (
    <>
      {loader && <FullScreenGradientLoader text="Re-Generating..." />}
      <Dialog
        open={open}
        onClose={onCloseFun}
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
          {sceneId?.id ? "Regenerate Scene" : "Regenerate Script"}
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
            placeholder="• Description needs more context.
• Make it more engaging.
• Some ideas feel underdeveloped. Add examples or clarify key points.
• The tone should be more professional and smooth.
• The tone should be more professional and smooth.

 "
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
            {!sceneId?.id && (
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
                <Tooltip
                  title={
                    tableData?.data_source == "openai"
                      ? "OpenAI does not have any source"
                      : ""
                  }
                  arrow
                >
                  <span>
                    <SelectComp
                      //   label="Top N"
                      options={topNOptions}
                      value={topn}
                      onChange={setTopn}
                      placeholder="Select Top N"
                      disabled={tableData?.data_source == "openai"}
                    />
                  </span>
                </Tooltip>
              </Box>
            )}
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
          <Button onClick={onCloseFun} color="inherit" variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RegenerateScriptPopup;
