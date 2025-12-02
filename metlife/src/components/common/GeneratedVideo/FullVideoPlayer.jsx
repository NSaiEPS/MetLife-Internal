// import { useState } from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   IconButton,
//   Modal,
//   Box,
// } from "@mui/material";
// import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
// import CloseIcon from "@mui/icons-material/Close";
// import DownloadIcon from "@mui/icons-material/Download";

// const modalStyle = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "80%",
//   maxWidth: "900px",
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   borderRadius: 3,
//   p: 2,
// };

// const FullVideoPlayer = ({ video_url }) => {
//   console.log(video_url, "check_video_url");
//   const [open, setOpen] = useState(false);

//   const downloadVideo = () => {
//     const link = document.createElement("a");
//     link.href = video_url;
//     link.download = "full_video.mp4";
//     link.click();
//   };

//   return (
//     <>
//       <Card sx={{ borderRadius: 3 }}>
//         <CardContent>
//           <Typography sx={{ fontWeight: 500 }}>Final Video</Typography>

//           <Box sx={{ display: "flex", mt: 2 }}>
//             <IconButton onClick={() => setOpen(true)}>
//               <PlayCircleOutlineIcon fontSize="large" />
//             </IconButton>

//             <IconButton onClick={downloadVideo}>
//               <DownloadIcon />
//             </IconButton>
//           </Box>
//         </CardContent>
//       </Card>

//       {/* Popup Modal */}
//       <Modal open={open} onClose={() => setOpen(false)}>
//         <Box sx={modalStyle}>
//           <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//             <IconButton onClick={() => setOpen(false)}>
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           <video width="100%" controls style={{ borderRadius: 8 }}>
//             <source src={video_url} type="video/mp4" />
//           </video>
//         </Box>
//       </Modal>
//     </>
//   );
// };

// export default FullVideoPlayer;

import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Modal,
  Box,
  Divider,
} from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: "900px",
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 2,
};

const FullVideoPlayer = ({ video_url }) => {
  const [open, setOpen] = useState(false);

  const downloadVideo = () => {
    const link = document.createElement("a");
    link.href = video_url;
    link.download = "final_video.mp4";
    link.click();
  };

  return (
    <>
      <Card
        sx={{
          borderRadius: 3,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <Box>
          <Typography sx={{ fontSize: "20px", fontWeight: 600 }}>
            Final Video
          </Typography>
          <Typography sx={{ fontSize: "14px", color: "#666", mt: 0.5 }}>
            Your full generated video is ready to view or download.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            onClick={() => setOpen(true)}
            sx={{
              width: 48,
              height: 48,
              bgcolor: "#f5f5f5",
              borderRadius: "50%",
              "&:hover": { bgcolor: "#e9e9e9" },
            }}
          >
            <PlayCircleOutlineIcon fontSize="large" />
          </IconButton>

          <IconButton
            onClick={downloadVideo}
            sx={{
              width: 48,
              height: 48,
              bgcolor: "#f5f5f5",
              borderRadius: "50%",
              color: "#4c9ad1",
              "&:hover": { bgcolor: "#e9e9e9" },
            }}
          >
            <DownloadIcon fontSize="medium" />
          </IconButton>
        </Box>
      </Card>

      {/* Modal with Video */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <video
            width="100%"
            controls
            style={{ borderRadius: 8, marginTop: 8 }}
          >
            <source src={video_url} type="video/mp4" />
          </video>
        </Box>
      </Modal>
    </>
  );
};

export default FullVideoPlayer;
