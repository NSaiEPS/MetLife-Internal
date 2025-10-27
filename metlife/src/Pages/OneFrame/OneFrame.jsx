import React from "react";
import { Typography, Box, Grid } from "@mui/material";
import UploadIcon from "../../assets/UploadCloudIcon.svg";
import AutoFixHighIcon from "../../assets/wizardMagic.svg";
import ButtonComp from "../../components/common/Buton/Button";
import styles from "./OneFrame.module.css";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import { useNavigate } from "react-router";
import Footer from "../../components/common/mainFooter";

const VideoCreationOptions = () => {
  const navigate = useNavigate();
  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <OneFrameHeader />

        <Box
          sx={{
            flex: 1, // takes up remaining space after header
            display: "flex",
            flexDirection: "column",
            justifyContent: "center", // vertical centering
            alignItems: "center", // horizontal centering
            px: 2,
            textAlign: "center",
          }}
        >
          <p className={styles.upperHeading}>Create Your Video with OneFrame</p>
          <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="stretch"
            sx={{ maxWidth: 1000, width: "100%" }}
          >
            {/* Upload Script Card */}
            <Grid item xs={12} sm={6} md={4}>
              <div className={styles.beigeCard}>
                <div className={styles.completeBoxData}>
                  <Typography variant="h6" className={styles.boxHeading}>
                    Upload a Script
                  </Typography>
                  <Typography className={styles.boxText}>
                    Already have a script? Upload a .txt, .doc, or .pdf file to
                    get started.
                  </Typography>
                  <div className={styles.parentContainer}>
                    <ButtonComp
                      label="Upload a Script"
                      sx={styles.Button}
                      icon={UploadIcon}
                      variant="contained"
                      action={() => navigate("/upload-script")}
                    />
                  </div>
                </div>
              </div>
            </Grid>

            {/* Generate Script Card */}
            <Grid item xs={12} sm={6} md={4}>
              <div className={styles.beigeCard}>
                <div className={styles.completeBoxData}>
                  <Typography variant="h6" className={styles.boxHeading}>
                    Generate a Script
                  </Typography>
                  <Typography className={styles.boxText}>
                    Describe your video idea, and our AI will write the perfect
                    script for you.
                  </Typography>
                  <div className={styles.parentContainer}>
                    <ButtonComp
                      label="Generate a Script"
                      sx={styles.Button}
                      icon={AutoFixHighIcon}
                      variant="contained"
                      action={() => navigate("/generate-script")}
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
