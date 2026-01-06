import { Menu, MenuItem } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";

export const UploadPopup = ({open, openPopup, handleCloseMenu }:{
    openPopup:boolean,
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
      >
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            // navigate("/upload-video");
          }}
        >
          Upload Video
        </MenuItem>

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
