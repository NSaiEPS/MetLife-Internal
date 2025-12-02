import React, { useState } from "react";
import type { FC } from "react";

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
  Tooltip,
} from "@mui/material";

import type { SelectChangeEvent } from "@mui/material";

import SelectComp from "../select";
import ButtonComp from "../Buton/Button";
import { showToast } from "../../../utils/toast";
import api from "../../../api/axios";
import FullScreenGradientLoader from "../GradientLoader";

interface RegenerateScriptPopupProps {
  open: boolean;
  onClose: () => void;
  id: string | number;
  setTableExtraData: (data: any) => void;
  sceneId?: { id?: string | number } | null;
  tableData?: any;
}

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

const RegenerateScriptPopup: FC<RegenerateScriptPopupProps> = ({
  open,
  onClose,
  id,
  setTableExtraData,
  sceneId,
  tableData,
}) => {
  const [model, setModel] = useState("gpt-4o-mini");
  const [topn, setTopn] = useState<string | number>("");
  const [feedback, setFeedback] = useState("");
  const [loader, setLoader] = useState(false);

  const onCloseFun = () => {
    setTopn("");
    setFeedback("");
    onClose();
  };

  const handleRegenerate = () => {
    if (!feedback) return showToast.error("Please give feedback");
    if (!model) return showToast.error("Please select model");
    if (!topn && !sceneId?.id && tableData?.data_source !== "openai")
      return showToast.error("Please select TopN");

    apiCall();
  };

  const apiCall = async () => {
    setLoader(true);

    const payload: any = {
      feedback,
      top_n: topn,
      model,
    };

    if (!topn) delete payload.top_n;
    if (sceneId?.id) delete payload.top_n;

    try {
      let endpoint = `scripts/${id}/regenerate`;
      let response;

      if (sceneId?.id) {
        endpoint = `scripts/${id}/scenes/${sceneId.id}`;
        response = await api.patch(endpoint, payload);
      } else {
        response = await api.post(endpoint, payload);
      }

      if (response?.status === 200) {
        setTableExtraData(response?.data);
      } else {
        showToast.error("Some Issue In Generating");
      }
    } catch (err) {
      showToast.error("Some Issue In Re-Generating");
      console.error(err);
    } finally {
      setLoader(false);
      onCloseFun();
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

          <TextField
            multiline
            rows={3}
            fullWidth
            placeholder="Give detailed feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                sx={{ mb: 1, textAlign: "left", fontWeight: 500, fontSize: "18px" }}
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
                    tableData?.data_source === "openai"
                      ? "OpenAI does not have any source"
                      : ""
                  }
                  arrow
                >
                  <span>
                    <SelectComp
                      disabled={tableData?.data_source === "openai"}
                      options={topNOptions}
                      value={topn}
                      onChange={setTopn}
                      placeholder="Select Top N"
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
            label={loader ? "Submitting..." : "Submit"}
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
