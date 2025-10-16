import React, { useState } from "react";
import VideoPlayer from "../../components/common/vedioPlayer";
import styles from "./UploadVideoPage.module.css";
import ButtonComp from "../../components/common/Button";   // ✅ Use ButtonComp
import video from "../../assets/dummy.mp4";

const UploadClipsPage = () => {
  const [clips, setClips] = useState([
    { id: 1, src: video },
  ]);

  // ✅ Add new dummy clip
  const addDummyClip = () => {
    setClips((prev) => [
      ...prev,
      { id: Date.now(), src: video },
    ]);
  };

  // ✅ Delete a clip
  const deleteClip = (id) => {
    setClips((prev) => prev.filter((clip) => clip.id !== id));
  };

  // ✅ Replace clip with dummy again
  const replaceClip = (id) => {
    setClips((prev) =>
      prev.map((clip) =>
        clip.id === id ? { ...clip, src: video } : clip
      )
    );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Upload Clips</h2>

      {/* ✅ Replaced normal MUI Button with ButtonComp */}
      <ButtonComp
        label="Add Dummy Clip"
        variant="contained"
        sx={{ backgroundColor: "#333", "&:hover": { backgroundColor: "#000" } }}
        action={addDummyClip}
      />

      <div className={styles.clipsContainer}>
        {clips.map((clip, index) => (
          <VideoPlayer
            key={clip.id}
            label={`Clip ${index + 1}`}
            src={clip.src}
            onDelete={() => deleteClip(clip.id)}
            onReplace={() => replaceClip(clip.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default UploadClipsPage;
