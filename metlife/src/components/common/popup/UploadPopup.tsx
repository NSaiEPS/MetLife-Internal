import { Divider, Menu, MenuItem } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";

export const UploadPopup = ({
  open,
  openPopup,
  handleCloseMenu,
}: {
  openPopup: boolean;
  open: HTMLElement | null;
  handleCloseMenu: () => void;
}) => {
  const navigate = useNavigate();

  return (
    <>
      <Menu
        anchorEl={open}
        open={openPopup}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            minWidth: 166,
            width: "max-content",
            paddingTop: 0,
            paddingBottom: 0
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            navigate("/upload-video");
          }}
        >
          Upload Video
        </MenuItem>
        <Divider sx={{ my: 0 }} />

        <MenuItem
          onClick={() => {
            handleCloseMenu();
            navigate("/upload-script");
          }}
        >
          Upload Script
        </MenuItem>
      </Menu>
    </>
  );
};
