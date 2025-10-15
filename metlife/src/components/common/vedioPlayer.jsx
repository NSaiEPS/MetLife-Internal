import React, { useRef } from "react";
import styles from "./vedioPlayer.module.css";
import { Button, IconButton } from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import DeleteIcon from "@mui/icons-material/Delete";
import CachedIcon from "@mui/icons-material/Cached";

const VideoPlayer = ({ label, src, onDelete, onReplace }) => {
  const videoRef = useRef(null);

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  return (
    <div className={styles.playerContainer}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        <div className={styles.actions}>
          <IconButton onClick={handleReplay}>
            <ReplayIcon />
          </IconButton>
          <IconButton onClick={onReplace}>
            <CachedIcon />
          </IconButton>
          <IconButton onClick={onDelete}>
            <DeleteIcon color="error" />
          </IconButton>
        </div>
      </div>

      <video
        ref={videoRef}
        src={src}
        controls
        className={styles.video}
      />
    </div>
  );
};

export default VideoPlayer;
