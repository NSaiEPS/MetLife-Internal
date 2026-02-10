import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import FullScreenGradientLoader from "../GradientLoader";
import ButtonComp from "../Buton/Button";

// ---------- Types ----------
interface RowData {
  Script?: string;
  [key: string]: any;
}

interface DeleteScenePopupProps {
  open: boolean;
  onClose: () => void;
  rowData?: RowData | null;
  id?: string | number;
  onConfirm: (rowData: RowData | null | undefined) => void;
  loader?: boolean;
}

interface RootState {
  Script: {
    scriptLoader: boolean;
  };
}

// ---------- Component ----------
const DeleteScenePopup: React.FC<DeleteScenePopupProps> = ({
  open,
  onClose,
  rowData,
  id,
  onConfirm,
  loader = false,
}) => {
  const { scriptLoader } = useSelector(
    (store: RootState) => store.Script
  );

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

      {loader && (
        <Typography textAlign="center">
          <FullScreenGradientLoader text="loading" />
        </Typography>
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
        <ButtonComp
          onClick={onClose}
          colorType="secondary"
          variant="outlined"
          sx={{
            // minWidth: 100,
            // textTransform: "none",
            // borderRadius: "8px",
          }}
        >
          No
        </ButtonComp>

        <ButtonComp
          onClick={() => onConfirm(rowData)}
          variant="contained"
          colorType="error"
          // color="error"
          sx={{
            // minWidth: 100,
            // textTransform: "none",
            // borderRadius: "8px",
          }}
        >
          Yes
        </ButtonComp>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteScenePopup;
