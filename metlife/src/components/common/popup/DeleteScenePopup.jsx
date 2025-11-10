import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { postDeleteScene } from "../../../redux/features/scriptSlice";
import api from "../../../api/axios";
import FullScreenGradientLoader from "../GradientLoader";

const DeleteScenePopup = ({
  open,
  onClose,
  rowData,
  id,
  onConfirm,
  loader,
}) => {
  const { scriptLoader } = useSelector((store) => store.Script);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, p: 1 },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, textAlign: "center" }}>
        Confirm Delete
      </DialogTitle>
      {loader ? (
        <>
          <Typography textAlign="center">
            <FullScreenGradientLoader text="loading" />
          </Typography>
        </>
      ) : (
        <></>
      )}
      <DialogContent>
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            color: "text.secondary",
            mt: 1,
            mb: 2,
          }}
        >
          {rowData?.Script ||
            "Are you sure you want to delete this scene? This action cannot be undone."}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            minWidth: 100,
            textTransform: "none",
            borderRadius: "8px",
          }}
        >
          No
        </Button>
        <Button
          onClick={() => onConfirm(rowData)}
          variant="contained"
          color="error"
          sx={{
            minWidth: 100,
            textTransform: "none",
            borderRadius: "8px",
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteScenePopup;
