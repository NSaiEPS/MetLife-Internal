import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Grid,
    Paper,
    Button,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/CloudUpload";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

const VideoCreationOptions = () => {
    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
            {/* Header */}
            <AppBar position="static" sx={{ backgroundColor: "#333", boxShadow: "none" }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", fontFamily: "serif", fontSize: "1.5rem" }}>
                        OneFrame
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Box sx={{ py: 6, px: 2, textAlign: "center" }}>
                <Typography variant="h4" fontWeight="bold" mb={5}>
                    Create Your Video with OneFrame
                </Typography>

                <Grid container spacing={4} justifyContent="center">
                    {/* Upload Script Card */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: "left" }}>
                            <Typography variant="h6" gutterBottom>
                                Upload a Script
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mb={3}>
                                Already have a script? Upload a .txt, .doc, or .pdf file to get started.
                            </Typography>
                            <Button
                                variant="contained"
                                fullWidth
                                startIcon={<UploadIcon />}
                                sx={{ backgroundColor: "#333", "&:hover": { backgroundColor: "#000" } }}
                            >
                                Upload a Script
                            </Button>
                        </Paper>
                    </Grid>

                    {/* Generate Script Card */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: "left" }}>
                            <Typography variant="h6" gutterBottom>
                                Generate a Script
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mb={3}>
                                Describe your video idea, and our AI will write the perfect script for you.
                            </Typography>
                            <Button
                                variant="contained"
                                fullWidth
                                startIcon={<AutoFixHighIcon />}
                                sx={{ backgroundColor: "#333", "&:hover": { backgroundColor: "#000" } }}
                            >
                                Generate a Script
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default VideoCreationOptions;
