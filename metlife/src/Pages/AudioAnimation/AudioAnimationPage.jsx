import React, { useState } from "react";
import styles from "./audioAnimation.module.css";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  Button,
  InputBase,
  Tooltip,
  Paper,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useNavigate } from "react-router";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import Input from "../../components/common/Input";
import FullScreenGradientLoader from "../../components/common/GradientLoader";
import Footer from "../../components/common/mainFooter";
import SelectComp from "../../components/common/select";
import ButtonComp from "../../components/common/Buton/Button";

const AudioAnimationPage = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [narration, setNarration] = useState("");
  const [entryAnimation, setEntryAnimation] = useState("fadeOut");
  const [exitAnimation, setExitAnimation] = useState("fadeOut");

  const narrationVoiceOptions = [
    { label: "Aria (Female, Warm & Clear)", value: "aria" },
    { label: "Jenny (Female, Professional)", value: "jenny" },
  ];

  const animationOptions = [
    { label: "Fade In", value: "fadeIn" },
    { label: "Fade Out", value: "fadeOut" },
    { label: "Zoom In", value: "zoomIn" },
    { label: "Zoom Out", value: "zoomOut" },
  ];

  return (
    <>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
        <OneFrameHeader />
        {loader && <FullScreenGradientLoader />}
        <main className={styles.cardWrap}>
          <div className={styles.card}>
            <div className={styles.headerRow}>
              <h1 className={styles.title}>Audio & Animation Toolkit</h1>
              {/* <Button
                className={styles.icon}
                onClick={() => navigate("/video-frame")}
              >
                <IoArrowBackCircleOutline size={30} /> Back
              </Button> */}
            </div>

            <div className={styles.insideContainer}>
              <Typography
                className={styles.audioSelectionTitle}
                sx={{ fontSize: "22px", fontWeight: "500" }}
              >
                Audio Selection
              </Typography>

              <Grid
                container
                spacing={2}
                alignItems="flex-end"
                sx={{ mt: 2, mb: 2 }}
              >
                <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                  <SelectComp
                    label="Narration"
                    options={narrationVoiceOptions}
                    value={narration}
                    onChange={setNarration}
                    placeholder="Select Tool"
                    style={true}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                  <SelectComp
                    options={narrationVoiceOptions}
                    placeholder="Select Voice"
                    style={true}
                  />
                </Grid>
              </Grid>

              <Grid
                container
                spacing={2}
                alignItems="flex-end"
                sx={{ mt: 2, mb: 2 }}
              >
                <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                  <SelectComp
                    label="Alex"
                    options={narrationVoiceOptions}
                    value={narration}
                    onChange={setNarration}
                    placeholder="Select Tool"
                    style={true}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                  <SelectComp
                    options={narrationVoiceOptions}
                    placeholder="Select Voice"
                    style={true}
                  />
                </Grid>
              </Grid>

              <Grid
                container
                spacing={2}
                alignItems="flex-end"
                sx={{ mt: 2, mb: 2 }}
              >
                <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                  <SelectComp
                    label="Alex"
                    options={narrationVoiceOptions}
                    value={narration}
                    onChange={setNarration}
                    placeholder="Select Tool"
                    style={true}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                  <SelectComp
                    options={narrationVoiceOptions}
                    placeholder="Select Voice"
                    style={true}
                  />
                </Grid>
              </Grid>
              <div className={styles.actions}>
                <ButtonComp
                  // disabled={loader}
                  // label={loader ? "Submit" : "Submitting"}
                  label={"Submit"}
                  className={styles.submitBtn}
                  // action={handleGenerate}
                />
              </div>
            </div>
            {/* <div className={styles.insideContainer}>
              <Typography
                className={styles.audioSelectionTitle}
                sx={{ fontSize: "22px", fontWeight: "500", marginBottom: "10px" }}
              >
                Animation Selection
              </Typography>
              <Grid container spacing={3}>

                <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                  <Typography variant="h6" fontWeight="400" mb={1}>
                    Entry
                  </Typography>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      border: "1px solid #e0e0e0",
                      borderRadius: 3,
                    }}
                  >
                    <FormControl>
                      <RadioGroup
                        value={entryAnimation}
                        onChange={(e) => setEntryAnimation(e.target.value)}
                      >
                        {animationOptions.map((opt) => (
                          <FormControlLabel
                            key={opt.value}
                            value={opt.value}
                            control={<Radio color="primary" />}
                            label={opt.label}
                            sx={{
                              "& .MuiFormControlLabel-label": {
                                color: "#555",
                                fontSize: "0.95rem",
                              },
                            }}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                  <Typography variant="h6" fontWeight="400" mb={1}>
                    Exit
                  </Typography>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      border: "1px solid #e0e0e0",
                      borderRadius: 3,
                    }}
                  >
                  
                    <FormControl>
                      <RadioGroup
                        value={exitAnimation}
                        onChange={(e) => setExitAnimation(e.target.value)}
                      >
                        {animationOptions.map((opt) => (
                          <FormControlLabel
                            key={opt.value}
                            value={opt.value}
                            control={<Radio color="primary" />}
                            label={opt.label}
                            sx={{
                              "& .MuiFormControlLabel-label": {
                                color: "#555",
                                fontSize: "0.95rem",
                              },
                            }}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </Paper>
                </Grid>
              </Grid>
            </div> */}
          </div>
        </main>
        <Footer />
      </Box>
    </>
  );
};

export default AudioAnimationPage;
