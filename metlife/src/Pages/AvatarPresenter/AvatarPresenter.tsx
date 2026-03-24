import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Slider,
  IconButton,
  Chip,
} from "@mui/material";
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeIcon,
  CloudUpload as UploadIcon,
  AutoFixHigh as CreateIcon,
  Edit as EditIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from "@mui/icons-material";
import Sidebar from "../../components/layout/Sidebar";
import ButtonComp from "../../components/common/Buton/Button";

const avatars = [
  { id: "grace", name: "Grace", role: "Professional", color: "#f5a623" },
  { id: "mia", name: "Mia", role: "Casual", color: "#a855f7" },
  { id: "james", name: "James", role: "Professional", color: "#3b82f6" },
  { id: "amanda", name: "Amanda", role: "Casual", color: "#22c55e" },
  { id: "vanessa", name: "Vanessa", role: "Casual", color: "#ec4899" },
];

const AvatarPresenter: React.FC = () => {
  const [selectedAvatar, setSelectedAvatar] = useState("grace");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(60);

  return (
    <Box sx={{ display: "flex", height: "90vh", bgcolor: "#060910", color: "#fff", overflow: "hidden" }}>

      {/* Left Avatar Selection Side - FULL HEIGHT */}
      <Box sx={{
        width: "280px",
        height: "100%",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
        bgcolor: "rgba(255,255,255,0.01)"
      }}>
        <Box sx={{ p: 3, pb: 1, display: "flex", gap: 1 }}>
          <Button size="small" variant="contained" sx={{ bgcolor: "rgba(255,255,255,0.05)", color: "#8899bb", textTransform: "none", fontSize: "12px", minWidth: "90px" }}>All Genres ▾</Button>
          <Button size="small" sx={{ color: "#8899bb", textTransform: "none", fontSize: "12px", minWidth: 0, p: 0.5 }}>Pro</Button>
          <Button size="small" sx={{ color: "#8899bb", textTransform: "none", fontSize: "12px", minWidth: 0, p: 0.5 }}>Casual</Button>
        </Box>

        <Box sx={{ px: 3, py: 1 }}>
          <Typography variant="caption" sx={{ color: "#8899bb", fontWeight: 700, letterSpacing: "1px" }}>SELECTED AVATAR</Typography>
        </Box>

        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1, overflowY: "auto", px: 2, pb: 3 }}>
          {avatars.map((avatar) => (
            <Box
              key={avatar.id}
              onClick={() => setSelectedAvatar(avatar.id)}
              sx={{
                p: 1.5,
                borderRadius: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                bgcolor: selectedAvatar === avatar.id ? "rgba(245, 166, 35, 0.05)" : "transparent",
                border: "1px solid",
                borderColor: selectedAvatar === avatar.id ? "#f5a623" : "transparent",
                transition: "0.2s",
                "&:hover": { bgcolor: "rgba(255,255,255,0.05)" }
              }}
            >
              <Avatar sx={{ bgcolor: avatar.color, width: 32, height: 32, fontSize: "14px" }}>
                {avatar.name[0]}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={600} sx={{ color: selectedAvatar === avatar.id ? "#fff" : "#8899bb" }}>{avatar.name}</Typography>
                <Typography variant="caption" sx={{ color: "#4b5563", fontSize: "10px" }}>{avatar.role}</Typography>
              </Box>
            </Box>
          ))}
          <Button sx={{ color: "#8899bb", textTransform: "none", fontSize: "12px", justifyContent: "flex-start", p: 1, mt: 1 }}>Manage Avatars ›</Button>
        </Box>
      </Box>

      {/* Main Right Column */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", height: "100%", overflowY: "auto", p: 3, pt: 1 }}>

        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, mt: 1 }}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h5" fontWeight={700}>Avatar Presenter</Typography>
              <Chip label="New" size="small" sx={{ bgcolor: "rgba(34, 197, 94, 0.15)", color: "#22c55e", fontWeight: 700, fontSize: "10px", height: "18px" }} />
            </Box>
            <Typography variant="caption" sx={{ color: "#8899bb" }}>Bring your script to life with realistic AI avatars</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              size="small"
              sx={{ color: "#8899bb", bgcolor: "rgba(255,255,255,0.03)", textTransform: "none", borderRadius: "8px", px: 2 }}
            >
              Animation Editor
            </Button>
            <ButtonComp transform="none">
              Generate Video ...
            </ButtonComp>
          </Box>
        </Box>

        {/* Body Area */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Center Preview Area */}
          <Box sx={{ flexGrow: 1, bgcolor: "#0f1521", borderRadius: "16px", position: "relative", display: "flex", flexDirection: "column", overflow: "hidden", minHeight: "800px" }}>
            <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", p: 4 }}>
              {/* Avatar Placeholder */}
              <Box sx={{ width: "220px", height: "320px", bgcolor: "#1e293b", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: avatars.find(a => a.id === selectedAvatar)?.color || "#f5a623", fontSize: "32px" }}>
                  {avatars.find(a => a.id === selectedAvatar)?.name[0]}
                </Avatar>
              </Box>

              {/* Subtitles Overlay */}
              <Box sx={{ position: "absolute", bottom: 40, width: "100%", px: 4, textAlign: "center" }}>
                <Box sx={{
                  display: "inline-block",
                  bgcolor: "rgba(15, 21, 33, 0.9)",
                  px: 2,
                  py: 1,
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.05)",
                  maxWidth: "80%"
                }}>
                  <Typography variant="body2" sx={{ color: "#fff", fontSize: "14px" }}>
                    In today's interconnected enterprise, <span style={{ color: "#f5a623", fontWeight: 700 }}>inconsistent vocabularies</span> create confusion and bottlenecks.
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Progress Bar Container */}
            <Box sx={{ px: 3, pb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                <IconButton size="small" onClick={() => setIsPlaying(!isPlaying)} sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.1)", p: 1 }}>
                  {isPlaying ? <PauseIcon fontSize="small" /> : <PlayIcon fontSize="small" />}
                </IconButton>
                <IconButton size="small" sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.1)", p: 1 }}>
                  <VolumeIcon fontSize="small" />
                </IconButton>
                <Box sx={{ flexGrow: 1, position: "relative", pt: 1 }}>
                  <Slider
                    size="small"
                    value={progress}
                    onChange={(_, val) => setProgress(val as number)}
                    sx={{
                      color: "#f5a623",
                      height: 6,
                      "& .MuiSlider-thumb": { width: 0, height: 0 },
                      "& .MuiSlider-rail": { bgcolor: "rgba(255,255,255,0.1)", opacity: 1 },
                      "& .MuiSlider-track": { border: "none" }
                    }}
                  />
                  <Typography variant="caption" sx={{ position: "absolute", right: 0, top: -15, color: "#8899bb", fontWeight: 700 }}>09:43</Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Avatar Voice Section - NOW BELOW PREVIEW */}
          <Box sx={{ bgcolor: "#0f1521", p: 3, borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, fontSize: "14px", letterSpacing: "0.5px" }}>Avatar Voice</Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
              {["Female", "Grace", "English (US)", "Friendly"].map((label) => (
                <Box
                  key={label}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    px: 2,
                    py: 1.2,
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    minWidth: "140px",
                    cursor: "pointer",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.05)" }
                  }}
                >
                  <Typography variant="body2" sx={{ fontSize: "13px", color: "#fff", fontWeight: 500 }}>{label}</Typography>
                  <ArrowDownIcon sx={{ fontSize: "18px", color: "#8899bb" }} />
                </Box>
              ))}
            </Box>

            {/* Footer Row */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Button size="small" variant="text" sx={{ color: "#8899bb", textTransform: "none", fontSize: "13px", fontWeight: 600 }}>Manage Avatars</Button>
                <Button size="small" variant="contained" startIcon={<UploadIcon sx={{ fontSize: 16 }} />} sx={{ bgcolor: "rgba(255,255,255,0.05)", color: "#fff", textTransform: "none", fontSize: "13px", px: 2, borderRadius: "8px", boxShadow: "none" }}>Upload Photo</Button>
                <Button size="small" variant="contained" startIcon={<CreateIcon sx={{ fontSize: 16 }} />} sx={{ bgcolor: "rgba(245, 166, 35, 0.1)", color: "#f5a623", textTransform: "none", fontSize: "13px", px: 2, borderRadius: "8px", boxShadow: "none" }}>Create Avatar</Button>
                <Button size="small" sx={{ color: "#8899bb", textTransform: "none", fontSize: "13px", px: 2 }}>Cancel</Button>
              </Box>
              <ButtonComp
                transform="none"
                sx={{
                  width: "400px",
                  py: 2,
                  fontSize: "15px",
                  fontWeight: 700,
                  borderRadius: "10px",
                  bgcolor: "#f5a623",
                  boxShadow: "0 4px 14px 0 rgba(245, 166, 35, 0.39)",
                  "&:hover": { bgcolor: "#d98a1f" }
                }}
              >
                Add Script to Video
              </ButtonComp>
            </Box>
          </Box>
        </Box>

      </Box>
    </Box>
  );
};

export default AvatarPresenter;
