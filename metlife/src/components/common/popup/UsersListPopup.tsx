import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import { postShareToUser } from "../../../redux/features/dashBoardSlice";

const UsersListPopup = ({ open, onClose, scriptId }) => {
  const { dashboardLoader, usersList } = useSelector(
    (store: RootState) => store.DashBoard,
  );

  const [selectedUserData, setSelectedUserData] = useState({
    new_user_email: "",
  });
  const dispatch = useDispatch();

  console.log(usersList, "usersList");

  const shareToNewUser = (user) => {
    console.log(user, "check_stored_value");
    if (!scriptId) return;
    const payload = {
      script_id: scriptId,
      new_user_email: user?.email,
    };

    setSelectedUserData((prev) => {
      return {
        ...prev,
        scriptId,
        new_user_email: user?.email,
      };
    });
    // dispatch(postShareToUser(data));
  };

  const transferOwnership = () => {
    const data = {
      script_id: scriptId,
      new_user_email: selectedUserData?.new_user_email,
    };
    dispatch(postShareToUser(data, onClose));
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Users List</DialogTitle>

        <DialogContent>
          {dashboardLoader ? (
            <Box display="flex" justifyContent="center" py={3}>
              <CircularProgress />
            </Box>
          ) : usersList?.data?.length > 0 ? (
            usersList?.data?.map((user: any) => {
              const isSelected = selectedUserData.new_user_email === user.email;
              return (
                <Box
                  key={user.id}
                  sx={{
                    p: 1.5,
                    borderBottom: "1px solid #eee",
                    cursor: "pointer",
                    borderRadius: 1,
                    backgroundColor: isSelected ? "#E3F2FD" : "transparent",
                    border: isSelected
                      ? "1px solid #1976d2"
                      : "1px solid transparent",
                    "&:hover": {
                      backgroundColor: isSelected ? "#E3F2FD" : "#f5f5f5",
                    },
                  }}
                  onClick={() => shareToNewUser(user)}
                >
                  <Typography fontWeight={500}>{user.email}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.username}
                  </Typography>
                </Box>
              );
            })
          ) : (
            <Typography align="center" py={2}>
              No users found
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            onClick={transferOwnership}
            disabled={!selectedUserData.new_user_email}
          >
            Share
          </Button>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UsersListPopup;
