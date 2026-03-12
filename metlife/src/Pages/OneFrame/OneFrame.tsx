import React, { use, useState } from "react";
import { Typography, Box, Grid, Button, MenuItem, Menu, useTheme } from "@mui/material";
import UploadIcon from "../../assets/UploadCloudIcon.svg";
import AutoFixHighIcon from "../../assets/wizardMagic.svg";
import ButtonComp from "../../components/common/Buton/Button";
import styles from "./OneFrame.module.css";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import { useNavigate } from "react-router";
import Footer from "../../components/common/mainFooter";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { UploadPopup } from "../../components/common/popup/UploadPopup";
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';
// If needed for importing SVGs
// declare module "*.svg" {
//   const content: string;
//   export default content;
// }

const VideoCreationOptions: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const [open, setOpen] = React.useState<null | HTMLElement>(null);
  const openPopup = Boolean(open);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <Box
        sx={{
          // minHeight:  "calc(100vh - 70px)",
          minHeight: "90vh",
          // backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            px: 2,
            gap: "40px",
            textAlign: "center",
          }}
        >
          {/* <p className={styles.upperHeading}>Create Your Video with OneFrame</p> */}

          <Typography variant="h3">
            {" "}
            Create Your Video with <b className={styles.colorTitle}>EdwSurf AI Studio</b>
          </Typography>

          <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="stretch"
            sx={{ maxWidth: 1000, width: "100%" }}
          >
            {/* Generate Script Card */}
            <Grid item xs={12} sm={6} md={4}>
              <div className={styles.beigeCard}>
                <div className={styles.completeBoxData}>
                  <Typography variant="h6" className={styles.boxHeading}>
                    Generate a Script
                  </Typography>

                  <Typography variant="body1" className={styles.boxText}>
                    Describe your video idea, and our AI will write the perfect
                    script for you.
                  </Typography>

                  <div className={styles.parentContainer}>
                    <ButtonComp
                      label="Generate a Script"
                      colorType={mode == "dark" ? "secondary" : "primary"}
                      // sx={styles.Button}
                      // className={styles.button_bg}

                      icon={<AutoFixHighOutlinedIcon />}
                      variant="contained"
                      action={() => navigate("/generate-script")}
                    >
                      Generate a Script
                    </ButtonComp>
                  </div>
                </div>
              </div>
            </Grid>

            {/* Upload Script Card */}
            <Grid item xs={12} sm={6} md={4}>
              <div className={styles.beigeCard}>
                <div className={styles.completeBoxData}>
                  <Typography variant="h6" className={styles.boxHeading}>
                    {/* Upload a Script
                     */}
                    Localization
                  </Typography>

                  <Typography variant="body1" className={styles.boxText}>
                    Already have a script? Upload a .pdf file or video to get
                    started.
                  </Typography>

                  <div className={styles.parentContainer}>
                    <ButtonComp
                      // label="Upload a Script"
                      label="Localization"
                      colorType={mode == "dark" ? "secondary" : "primary"}
                      // sx={styles.Button}
                      // className={styles.button_bg}
                      icon={<CloudUploadOutlinedIcon />}
                      variant="contained"
                      // action={() => navigate("/upload-script")}
                      action={handleOpenMenu}
                    >
                      Localization
                    </ButtonComp>

                    <UploadPopup
                      open={open}
                      openPopup={openPopup}
                      handleCloseMenu={handleCloseMenu}
                    />
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Footer />
    </>
  );
};

export default VideoCreationOptions;
