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

const DeleteScenePopup = ({ open, onClose, rowData, id, onConfirm }) => {
  const { scriptLoader } = useSelector((store) => store.Script);
  console.log(scriptLoader, "check_selector");
  console.log(rowData, "Check_rowData");
  // const handleDelete = async () => {
  //   const payload = {
  //     script_id: id,
  //     scene_id: rowData?.id,
  //   };
  //   try {
  //     const res = await api.post("mongo/delete_scene", payload);
  //     console.log(res, "check_delete");
  //     onClose(false);
  //     // if (res?.status) {
  //     //   dispatch(setScriptData(res?.data));
  //     //   console.log(res);
  //     // }
  //   } catch (error) {
  //     console.log(error);
  //     // toast.error("Something went wrong!");
  //   } finally {
  //     // dispatch(setScriptLoader(false));
  //     onClose(false);
  //   }
  // };
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
          // disabled={scriptLoader}
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
          // onClick={handleDelete}
          onClick={() => onConfirm(rowData)}
          variant="contained"
          // disabled={scriptLoader}
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
