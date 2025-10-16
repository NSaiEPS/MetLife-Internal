// src/pages/VideoProgressPage/VideoProgressPage.jsx
import React, { useState, useEffect } from "react";
import styles from "./VedioProgressVideo.module.css";
import ProgressBar from "../../components/common/progressBar";
import ButtonComp from "../../components/common/Button";
import SelectComp from "../../components/common/select"; // ✅ using your SelectComp
import video from "../../assets/dummy.mp4"
import { Box } from "@mui/material";
import OneFrameHeader from "../../components/common/OneFrameHeader"

const VideoProgressPage = () => {
  const [progress, setProgress] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [resolution, setResolution] = useState("");

  // ✅ Static Resolution Options
  const resolutionOptions = [
    { label: "720p", value: "720p" },
    { label: "1080p", value: "1080p" },
    { label: "4K", value: "4k" },
  ];

  // ✅ Simulate progress
  useEffect(() => {
    if (progress < 100) {
      const timer = setTimeout(() => setProgress(progress + 10), 500);
      return () => clearTimeout(timer);
    } else {
      setVideoReady(true);
    }
  }, [progress]);

  // ✅ Handle video download
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/dummy.mp4"; // dummy video in public folder
    link.download = "my-video.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <OneFrameHeader />
  <div className={styles.page}>
  <div className={styles.wrapper}>
    
    <h2 className={styles.title}>Finalization & Download</h2>
    
    <p className={styles.subTitle}>Generation Progress</p>
    
    <ProgressBar progress={progress} />
    <p className={styles.progressText}>{progress}%</p>
    
    {videoReady && (
      <div className={styles.readySection}>
        <h3>Your video is ready</h3>
        
        <video controls className={styles.video}>
          <source src={video} type="video/mp4" />
        </video>
        
        <div className={styles.actionsRow}>
          <div className={styles.resolutionWrap}>
            <SelectComp
              label="Resolution"
              options={resolutionOptions}
              value={resolution}
              onChange={setResolution}
            />
          </div>

          <ButtonComp
            label="Download Video"
            variant="contained"
            className={styles.downloadBtn}
            action={handleDownload}
          />
        </div>
      </div>
    )}
  </div>
</div>

    </Box>
  );
};

export default VideoProgressPage;
