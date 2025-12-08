import React, { useState, ChangeEvent } from "react";
import { Box, Typography, Button, Paper, Stack } from "@mui/material";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import Footer from "../../components/common/mainFooter";
import styles from "./uploadConversationClips.module.css";

interface Scene {
  id: number;
  title: string;
}

interface ClipData {
  file: File;
  preview: string;
}

const scenesData: Scene[] = [
  { id: 1, title: "Scene 05" },
  { id: 2, title: "Scene 11 : The Conversation" },
];

const UploadConversationalClipsPage: React.FC = () => {
  const [clips, setClips] = useState<Record<number, ClipData>>({});

  const handleUpload = (id: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setClips((prev) => ({
        ...prev,
        [id]: {
          file,
          preview: URL.createObjectURL(file),
        },
      }));
    }
  };

  const allUploaded = scenesData.every((scene) => clips[scene.id]);

  return (
    <>
      <div className={styles.container}>
        <OneFrameHeader />
        <div className={styles.innerContainer}>
          <Box
            sx={{
              backgroundColor: "#e5f3fc",
              padding: "40px",
              borderRadius: "20px",
              border: "2px solid #bce2f6",
              margin: "3rem 0",
              minHeight: "70vh",
            }}
          >
            <Typography fontSize="32px" fontWeight="600" mb={4}>
              Upload Conversational Clips
            </Typography>

            <Stack spacing={3}>
              {scenesData.map((scene) => (
                <Paper
                  key={scene.id}
                  elevation={0}
                  sx={{
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid #d3e6f9",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    background: "white",
                  }}
                >
                  {/* Top row */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography fontWeight="600">{scene.title}</Typography>
                      <Typography fontSize="14px" color="gray">
                        {clips[scene.id]?.file?.name || "Awaiting Upload"}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      component="label"
                      sx={{
                        borderRadius: "10px",
                        textTransform: "none",
                        padding: "10px 25px",
                      }}
                    >
                      Upload Clip
                      <input
                        hidden
                        accept="video/*"
                        type="file"
                        onChange={(e) => handleUpload(scene.id, e)}
                      />
                    </Button>
                  </Box>

                  {/* Preview section */}
                  {clips[scene.id]?.preview && (
                    <Box
                      sx={{
                        borderRadius: "10px",
                        overflow: "hidden",
                        border: "1px solid #d3e6f9",
                        mt: 1,
                      }}
                    >
                      <video
                        src={clips[scene.id].preview}
                        controls
                        style={{
                          width: "100%",
                          height: "40vh",
                          borderRadius: "10px",
                        }}
                      />
                    </Box>
                  )}
                </Paper>
              ))}
            </Stack>

            {/* Bottom stitching section */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                mt: 5,
              }}
            >
              <Typography
                fontSize="14px"
                mr={2}
                color={allUploaded ? "black" : "gray"}
              >
                Upload all clips to enable stitching.
              </Typography>

              <Button
                variant="contained"
                disabled={!allUploaded}
                sx={{
                  borderRadius: "10px",
                  padding: "10px 25px",
                  textTransform: "none",
                  backgroundColor: allUploaded ? "#1976d2" : "#a8c8e8",
                }}
              >
                Stitch My Video
              </Button>
            </Box>
          </Box>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default UploadConversationalClipsPage;
