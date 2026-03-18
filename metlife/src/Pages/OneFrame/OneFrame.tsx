import React, { useState } from "react";
import { Typography, Box, Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./OneFrame.module.css";
import { useNavigate } from "react-router";
import Footer from "../../components/common/mainFooter";
import { UploadPopup } from "../../components/common/popup/UploadPopup";
import ButtonComp from "../../components/common/Buton/Button";

const VideoCreationOptions: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<null | HTMLElement>(null);
  const openPopup = Boolean(open);

  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
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
          <div className={styles.hero}>
            {/* Left Side Info */}
            <div className={styles.heroLeft}>
              <div className={styles.heroEyebrow}>✨ AI-Powered Video Creation</div>
              <h1 className={styles.heroTitle}>Create <span>AI-Powered</span> Educational Videos</h1>
              <p className={styles.heroSub}>Generate scripts, localize content, and produce high-quality videos using AI.</p>

              <div className={styles.heroBtns}>
                <ButtonComp
                  transform="none"
                  // className={styles.btnGold}
                  colorType="primary"
                  onClick={() => navigate("/generate-script")}
                >
                  ✨ Generate Script
                </ButtonComp>
                <ButtonComp
                  transform="none"
                  // className={styles.btnOutline}
                  colorType="secondary"
                  onClick={() => navigate("/dashboard")}
                >
                  View Dashboard
                </ButtonComp>
              </div>
            </div>

            {/* Right Side Visual Placeholder */}
            <div className={styles.heroRight}>
              <div className={styles.heroVisual}>
                {/* <div className={`${styles.floatingCard} ${styles.floatingCardTopLeft}`}>📄 Script ready</div>
                <div className={`${styles.floatingCard} ${styles.floatingCardTopRight}`}>🌍 Localization</div> */}

                <div className={styles.heroVideoPlaceholder} onClick={() => setVideoModalOpen(true)}>
                  <div className={styles.playCircle}>▶</div>
                  <p style={{ color: "var(--text-secondary-dark)", fontSize: "14px" }}>
                    AI-generated video preview
                  </p>
                </div>

                <div className={`${styles.floatingCard} ${styles.floatingCardBottom}`}>
                  ⬜ 00:00 ─────────── 03:45
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid Segment */}
          <div style={{ padding: "0 80px 40px" }}>
            <h2 className={styles.sectionTitle}>
              What can <b>EdWave</b> do today?
            </h2>

            <div className={styles.homeActions}>

              {/* Generate Script Action */}
              <div className={styles.actionCard} onClick={() => navigate("/generate-script")}>
                <div className={styles.actionIcon} style={{ background: "rgba(245,166,35,.1)" }}>✨</div>
                <h3 className={styles.actionTitle}>Generate Script</h3>
                <p className={styles.actionSub}>Create a structured video script using AI</p>
                <ButtonComp transform="none" colorType="primary" className={styles.btnSm} >✨ Start Writing</ButtonComp>
              </div>

              {/* Localize Content Action */}
              <div className={styles.actionCard} onClick={() => alert("Localize Content coming soon!")}>
                <div className={styles.actionIcon} style={{ background: "rgba(59,130,246,.1)" }}>🌍</div>
                <h3 className={styles.actionTitle}>Localize Content</h3>
                <p className={styles.actionSub}>Upload existing content to translate and localize</p>
                <ButtonComp transform="none" colorType="outlined" className={styles.btnSm}>Upload Content</ButtonComp>
              </div>

              {/* Brand Kit Action */}
              <div className={styles.actionCard} onClick={() => alert("Brand kit coming soon!")}>
                <div className={styles.actionIcon} style={{ background: "rgba(168,85,247,.1)" }}>🎨</div>
                <h3 className={styles.actionTitle}>Brand Kit</h3>
                <p className={styles.actionSub}>Set up your brand identity for all videos</p>
                <ButtonComp transform="none" colorType="outlined" className={styles.btnSm}>Set Up Brand</ButtonComp>
              </div>

              {/* Lesson Designer Action */}
              <div className={styles.actionCard} onClick={() => alert("Instructional Designer coming soon!")}>
                <div className={styles.actionIcon} style={{ background: "rgba(20,184,166,.1)" }}>🧠</div>
                <h3 className={styles.actionTitle}>AI Instructional Designer</h3>
                <p className={styles.actionSub}>Auto-generate lesson structure and objectives</p>
                <ButtonComp transform="none" colorType="outlined" className={styles.btnSm}>Design Lesson</ButtonComp>
              </div>

              {/* Templates Action */}
              <div className={styles.actionCard} onClick={() => alert("Templates coming soon!")}>
                <div className={styles.actionIcon} style={{ background: "rgba(245,166,35,.1)" }}>🗂</div>
                <h3 className={styles.actionTitle}>
                  Templates <span className={`${styles.tag} ${styles.tagNew}`}>New</span>
                </h3>
                <p className={styles.actionSub}>Start faster with ready-made video templates</p>
                <ButtonComp transform="none" colorType="outlined" className={styles.btnSm}>Browse Templates</ButtonComp>
              </div>

              {/* AI Presenter Action */}
              <div className={styles.actionCard} onClick={() => alert("AI Presenter coming soon!")}>
                <div className={styles.actionIcon} style={{ background: "rgba(168,85,247,.1)" }}>🧑‍💼</div>
                <h3 className={styles.actionTitle}>
                  AI Presenter <span className={`${styles.tag} ${styles.tagNew}`}>New</span>
                </h3>
                <p className={styles.actionSub}>Add a realistic AI avatar presenter to your video</p>
                <ButtonComp transform="none" colorType="outlined" className={styles.btnSm}>Choose Avatar</ButtonComp>
              </div>

              {/* Storyboard Action */}
              <div className={styles.actionCard} onClick={() => alert("Storyboard coming soon!")}>
                <div className={styles.actionIcon} style={{ background: "rgba(20,184,166,.1)" }}>🎞</div>
                <h3 className={styles.actionTitle}>
                  Storyboard Generator <span className={`${styles.tag} ${styles.tagNew}`}>New</span>
                </h3>
                <p className={styles.actionSub}>Turn your script into visual storyboards with AI</p>
                <ButtonComp transform="none" colorType="outlined" className={styles.btnSm}>Create Storyboard</ButtonComp>
              </div>

              {/* Prompt Library Action */}
              <div className={styles.actionCard} onClick={() => alert("Prompt Library coming soon!")}>
                <div className={styles.actionIcon} style={{ background: "rgba(59,130,246,.1)" }}>📚</div>
                <h3 className={styles.actionTitle}>
                  Prompt Library <span className={`${styles.tag} ${styles.tagNew}`}>New</span>
                </h3>
                <p className={styles.actionSub}>Saved prompt patterns to accelerate content creation</p>
                <ButtonComp transform="none" colorType="outlined" className={styles.btnSm}>Browse Prompts</ButtonComp>
              </div>
            </div>
            {/* HOW IT WORKS */}
            <div style={{ textAlign: "center", padding: "28px 80px 0px" }}>
              <p style={{ fontSize: "16px", color: "var(--secondary)", marginBottom: "4px" }}>
                How <b style={{ color: "var(--gold)", fontWeight: "800", }}>EdWave</b> Works
              </p>
            </div>
            <div className={styles.howItWorks}>
              <div className={styles.howStep}><div className={styles.stepCircle}>1</div><div className={styles.stepLabel}>Generate Script</div></div>
              <div className={styles.stepArrow}>→</div>
              <div className={styles.howStep}><div className={styles.stepCircle}>2</div><div className={styles.stepLabel}>Create Scenes</div></div>
              <div className={styles.stepArrow}>→</div>
              <div className={styles.howStep}><div className={styles.stepCircle}>3</div><div className={styles.stepLabel}>Edit Transitions</div></div>
              <div className={styles.stepArrow}>→</div>
              <div className={styles.howStep}><div className={styles.stepCircle}>4</div><div className={styles.stepLabel}>Export Video</div></div>
            </div>
          </div>


          <UploadPopup
            open={open}
            openPopup={openPopup}
            handleCloseMenu={handleCloseMenu}
          />

          {/* Video Modal */}
          <Dialog
            open={videoModalOpen}
            onClose={() => setVideoModalOpen(false)}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                backgroundColor: "#000",
                borderRadius: 2,
                overflow: "hidden",
                position: "relative",
              },
            }}
          >
            <IconButton
              onClick={() => setVideoModalOpen(false)}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "#fff",
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 10,
                "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
              }}
            >
              <CloseIcon />
            </IconButton>
            <DialogContent sx={{ p: 0, '&:first-of-type': { paddingTop: 0 } }}>
              <Box sx={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                {/* Embed a relevant AI demo video here */}
                <video
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                  controls
                  preload="metadata"
                  src="https://videos.pexels.com/video-files/3163534/3163534-uhd_3840_2160_30fps.mp4"
                >
                  Your browser does not support the HTML5 video tag.
                </video>
              </Box>
            </DialogContent>
          </Dialog>
        </Box>
        <Footer />
      </Box>
    </>
  );
};

export default VideoCreationOptions;
