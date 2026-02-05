import { Divider, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import DownloadPopup from "../../common/popup/DownloadPopup";

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
  const { pathname } = useLocation();
  const route = pathname === "/dashboard";
  const [openDownloadPopup, setOpenDownloadPopup] = useState(false);

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
            paddingBottom: 0,
          },
        }}
      >
        {" "}
        {route
          ? [
              <MenuItem
                key="download-script"
                onClick={() => setOpenDownloadPopup(true)}
              >
                Download Script
              </MenuItem>,
              <Divider key="d1" sx={{ my: 0 }} />,
              <MenuItem key="download-video" onClick={handleCloseMenu}>
                Download Video
              </MenuItem>,
            ]
          : [
              <MenuItem
                key="upload-video"
                onClick={() => {
                  handleCloseMenu();
                  navigate("/upload-video");
                }}
              >
                Upload Video
              </MenuItem>,
              <Divider key="d2" sx={{ my: 0 }} />,
              <MenuItem
                key="upload-script"
                onClick={() => {
                  handleCloseMenu();
                  navigate("/upload-script");
                }}
              >
                Upload Script
              </MenuItem>,
            ]}
      </Menu>

      <DownloadPopup
        open={openDownloadPopup}
        onClose={() => setOpenDownloadPopup(false)}
        // onSelect={handleDownloadType}
      />
    </>
  );
};
