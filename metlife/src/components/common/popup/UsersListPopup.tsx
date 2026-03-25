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
import {
  getDashboardInfo,
  postShareToUser,
} from "../../../redux/features/dashBoardSlice";
import { Divider } from "@mui/material";

const UsersListPopup = ({ open, onClose, scriptId }) => {
  const { dashboardLoader, usersList } = useSelector(
    (store: RootState) => store.DashBoard,
  );

  const [selectedUserData, setSelectedUserData] = useState({
    new_user_email: "",
  });
  const dispatch = useDispatch();

  const shareToNewUser = (user) => {
    if (!scriptId) return;
    // const payload = {
    //   script_id: scriptId,
    //   new_user_email: user?.email,
    // };

    setSelectedUserData((prev) => {
      return {
        ...prev,
        scriptId,
        new_user_email: user?.email,
      };
    });
  };

  const transferOwnership = () => {
    const data = {
      script_id: scriptId,
      new_user_email: selectedUserData?.new_user_email,
    };
    dispatch(postShareToUser(data, onClose, successCallback));
  };

  const successCallback = () => {
    dispatch(getDashboardInfo());
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Users List</DialogTitle>

        <DialogContent>
          {dashboardLoader ? (
            <>
              {/* <Box display="flex" justifyContent="center" py={3}>
                <CircularProgress />
              </Box> */}
              <Typography>Loading...</Typography>
            </>
          ) : usersList?.data?.length > 0 ? (
            usersList?.data?.map((user: any, index:number) => {
              const isSelected = selectedUserData.new_user_email === user.email;
              return (
                <>
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
                    <Typography fontWeight={500}>{user.username}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                  {(index !== usersList.data.length - 1) && <Divider />}
                </>
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
