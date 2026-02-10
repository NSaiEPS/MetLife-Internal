import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Modal,
  Box,
} from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";

interface GeneratedVideoPlayerProps {
  description: string;
  s3_url: string;
  index: number;
  image_url?: string | null;
  data?: any; // If you know the structure, we can type it better
}

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: "800px",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 3,
  p: 2,
};

const GeneratedVideoPlayer: React.FC<GeneratedVideoPlayerProps> = ({
  description,
  s3_url,
  index,
  image_url,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const dummyImage =
    "https://dummyimage.com/50x50/e0e0e0/aaaaaa&text=No+Image";

  const downloadVideo = () => {
    const link = document.createElement("a");
    link.href = s3_url;
    link.setAttribute("download", `scene_${index + 1}.mp4`);
    link.setAttribute("target", "_blank");

    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <>
      {/* Card */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography sx={{ fontWeight: 500 }}>
            Scene {index + 1} {description}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
            {/* Thumbnail Preview */}
            <Box
              // onClick={() => setOpen(true)}
              sx={{
                width: 60,
                height: 60,
                borderRadius: "20%",
                overflow: "hidden",
                // cursor: "pointer",
                border: "2px solid #ddd",
              }}
            >
              <img
                src={image_url || dummyImage}
                alt="preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
     <Typography
              sx={{ fontSize: "14px", color: "#555", mt: 1, cursor:'pointer' }}
              onClick={() => setOpen(true)}
            >
              {"Video Preview"}
            </Typography>
            {/* Download Button */}
            <IconButton onClick={downloadVideo} sx={{ color: "#4c9ad1" }}>
              <DownloadIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      {/* Popup Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <video width="100%" controls style={{ borderRadius: 8 }}>
            <source src={s3_url} type="video/mp4" />
          </video>
        </Box>
      </Modal>
    </>
  );
};

export default GeneratedVideoPlayer;
