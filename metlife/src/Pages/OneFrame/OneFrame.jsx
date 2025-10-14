import React from "react";
import {
    Typography,
    Box,
    Grid,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/CloudUpload";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import ButtonComp from "../../components/common/Button"
import styles from './OneFrame.module.css'
import OneFrameHeader from "../../components/common/OneFrameHeader"
import { useNavigate } from "react-router";

const VideoCreationOptions = () => {
    const navigate = useNavigate();
    return (

        <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
            <OneFrameHeader />
            <Box sx={{ py: 6, px: 2, textAlign: "center" }}>
                <Typography variant="h4" fontWeight="bold" mb={5}>
                    Create Your Video with OneFrame
                </Typography>

                <Grid container spacing={4} justifyContent="center">
                    {/* Upload Script Card */}
                    <Grid item xs={12} sm={6} md={4} >
                        <div className={styles.beigeCard}>
                            <Typography variant="h6" gutterBottom >
                                Upload a Script
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mb={3} >
                                Already have a script? Upload a .txt, .doc, or .pdf file to get started.
                            </Typography>
                            <ButtonComp
                                label="Upload a Script"
                                sx={{ backgroundColor: "#333", "&:hover": { backgroundColor: "#000" } }}
                                icon={<UploadIcon />}
                                variant="contained"
                                action={() => navigate("/upload-script")}   // ✅ wrap in function
                            />

                        </div>
                    </Grid>
                    {/* Generate Script Card */}
                    <Grid item xs={12} sm={6} md={4}>
                        <div className={styles.beigeCard}>
                            <Typography variant="h6" gutterBottom>
                                Generate a Script
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mb={3}>
                                Describe your video idea, and our AI will write the perfect script for you.
                            </Typography>
                            <ButtonComp
                                label={"Generate a Script"}
                                sx={{ backgroundColor: "#333", "&:hover": { backgroundColor: "#000" } }}
                                icon={<AutoFixHighIcon />}
                                variant="contained"
                            />
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default VideoCreationOptions;
