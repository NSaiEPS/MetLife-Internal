import React from "react";
import {
    Typography,
    Box,
    Grid,
} from "@mui/material";
import UploadIcon from '../../assets/UploadCloudIcon.svg'
import AutoFixHighIcon from "../../assets/wizardMagic.svg";
import ButtonComp from "../../components/common/Button"
import styles from './OneFrame.module.css'
import OneFrameHeader from "../../components/common/OneFrameHeader"
import { useNavigate } from "react-router";

const VideoCreationOptions = () => {
    const navigate = useNavigate();
    return (

        <Box sx={{ minHeight: "100vh", backgroundColor: "#fff" }}>
            <OneFrameHeader />
            <Box sx={{ py: 6, px: 2, textAlign: "center" }}>
                <p className={styles.upperHeading}>
                    Create Your Video with OneFrame
                </p>

                <Grid container spacing={4} justifyContent="center">
                    {/* Upload Script Card */}
                    <Grid item xs={12} sm={6} md={4} >
                        <div className={styles.beigeCard}>
                            <div className={styles.completeBoxData}>
                            <Typography variant="h6"  className={styles.boxHeading } >
                                Upload a Script
                            </Typography>
                            <Typography className={styles.boxText}>
                                Already have a script? Upload a .txt, .doc, or .pdf file to get started.
                            </Typography>
                            <div className={styles.parentContainer}>
                            <ButtonComp
                                label="Upload a Script"
                                sx={styles.Button}
                                icon={UploadIcon}
                                variant="contained"
                                action={() => navigate("/upload-script")}   // ✅ wrap in function
                            />
                            </div>
</div>
                        </div>
                    </Grid>
                    {/* Generate Script Card */}
                    <Grid item xs={12} sm={6} md={4}>
                              <div className={styles.beigeCard}>
                            <div className={styles.completeBoxData}>
                            <Typography variant="h6"  className={styles.boxHeading } >
                              Generate a Script
                            </Typography>
                            <Typography className={styles.boxText}>
                                Describe your video idea, and our AI will write the perfect script for you.
                            </Typography>
                            <div className={styles.parentContainer}>
                            <ButtonComp
                                label="Generate a Script"
                                sx={styles.Button}
                                icon={AutoFixHighIcon}
                                variant="contained"
                                action={() => navigate("/upload-script")}   // ✅ wrap in function
                            />
                            </div>
</div>
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default VideoCreationOptions;
