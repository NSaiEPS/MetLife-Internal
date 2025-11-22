// import { Card, CardContent, IconButton, Typography } from "@mui/material";
// import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
// import DownloadIcon from "@mui/icons-material/Download";

// const GeneratedVideoPlayer = ({ s3_url }) => {
//   const downloadVideo = () => {
//     const link = document.createElement("a");
//     link.href = s3_url;
//     link.download = "scene_video.mp4";
//     link.click();
//   };

//   return (
//     <Card sx={{ p: 2, borderRadius: 3 }}>
//       <CardContent>
//         <video
//           width="100%"
//           controls
//           style={{ borderRadius: 8, marginBottom: 8 }}
//         >
//           <source src={s3_url} type="video/mp4" />
//         </video>

//         <Typography sx={{ fontWeight: 500 }}>Scene Video</Typography>

//         <IconButton onClick={downloadVideo} sx={{ mt: 1 }}>
//           <DownloadIcon />
//         </IconButton>
//       </CardContent>
//     </Card>
//   );
// };

// export default GeneratedVideoPlayer;


import { useState } from "react";
import { Card, CardContent, Typography, IconButton, Modal, Box } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";

const style = {
  position: "absolute",
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

const GeneratedVideoPlayer = ({ description, s3_url }) => {
  const [open, setOpen] = useState(false);

  const downloadVideo = () => {
    const link = document.createElement("a");
    link.href = s3_url;
    link.download = "scene_video.mp4";
    link.click();
  };

  return (
    <>
      {/* --- Card --- */}
      <Card sx={{  borderRadius: 3 }}>
        <CardContent>
          <Typography sx={{ fontWeight: 500 }}>Generated Video</Typography>

          {/* <Typography sx={{ fontSize: "14px", color: "#555", mt: 1 }}>
            {description}
          </Typography> */}

          <Box sx={{ display: "flex", mt: 2 }}>
            <IconButton onClick={() => setOpen(true)}>
              <PlayCircleOutlineIcon fontSize="large" />
            </IconButton>

            <IconButton onClick={downloadVideo}>
              <DownloadIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      {/* --- Popup Modal --- */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
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

