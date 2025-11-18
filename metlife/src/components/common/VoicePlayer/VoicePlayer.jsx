// import { useRef, useState } from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   IconButton,
//   Box,
// } from "@mui/material";
// import { PlayArrow, Pause } from "@mui/icons-material";

// const VoicePlayer = ({ name, gender, s3_url }) => {
// console.log(s3_url, "check_url")
//   const audioRef = useRef(null);
//   const [playing, setPlaying] = useState(false);

//   const togglePlay = () => {
//     if (!audioRef.current) return;

//     if (!playing) {
//       audioRef.current.play();
//       setPlaying(true);

//       audioRef.current.onended = () => setPlaying(false);
//     } else {
//       audioRef.current.pause();
//       setPlaying(false);
//     }
//   };

//   return (
//     <Card
//       elevation={1}
//       sx={{
//         mb: 2,
//         borderRadius: 3,
//         border: "1px solid #e2e2e2",
//         background: "#fff",
//       }}
//     >
//       <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//         <IconButton
//           color="primary"
//           onClick={togglePlay}
//           sx={{
//             border: "1px solid #1976d2",
//             width: 45,
//             height: 45,
//           }}
//         >
//           {playing ? <Pause /> : <PlayArrow />}
//         </IconButton>
// {/*
//         <Box>
//           <Typography variant="subtitle1" fontWeight={600}>
//             {name}
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Gender: {gender}
//           </Typography>
//         </Box> */}
//       </CardContent>

//       <audio ref={audioRef} src={s3_url} preload="none" />
//     </Card>
//   );
// };

// export default VoicePlayer;

import { useRef, useState } from "react";
import { Card, CardContent, Typography, IconButton, Box } from "@mui/material";
import { PlayArrow, Pause, Download } from "@mui/icons-material";

const VoicePlayer = ({ description, s3_url }) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (!playing) {
      audioRef.current.play();
      setPlaying(true);

      audioRef.current.onended = () => setPlaying(false);
    } else {
      audioRef.current.pause();
      setPlaying(false);
    }
  };

  const handleDownload = () => {
    if (!s3_url) return;

    const link = document.createElement("a");
    link.href = s3_url;
    link.download = `scene-audio-${Date.now()}.mp3`; // filename
    link.click();
  };

  return (
    <Card
      elevation={1}
      sx={{
        mb: 2,
        borderRadius: 3,
        border: "1px solid #e2e2e2",
        background: "#fff",
      }}
    >
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton
          color="primary"
          onClick={togglePlay}
          sx={{
            border: "1px solid #1976d2",
            width: 45,
            height: 45,
          }}
        >
          {playing ? <Pause /> : <PlayArrow />}
        </IconButton>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
            Scene Audio
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </Typography>
        </Box>
        <IconButton
          color="secondary"
          onClick={handleDownload}
          sx={{
            border: "1px solid #1976d2",
            width: 40,
            height: 40,
            color: "#1976d2",
          }}
        >
          <Download />
        </IconButton>
      </CardContent>

      <audio ref={audioRef} src={s3_url} preload="none" />
    </Card>
  );
};

export default VoicePlayer;
