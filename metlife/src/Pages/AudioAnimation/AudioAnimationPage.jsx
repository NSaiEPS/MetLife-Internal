import React from "react";
import styles from "./audioAnimation.module.css";
import OneFrameHeader from "../../components/common/OneFrameHeader";

const AudioAnimationPage = () => {
  return (
    <>
      <div className={styles.container}>
        <OneFrameHeader />
        <div className={styles.audioAnimationContainer}>
          <div className={styles.header}>
            <h2 className={styles.title}>{"Audio & Animation Toolkit"}</h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default AudioAnimationPage;
