import React, { useState, useRef } from "react";
import {
  FormControl,
  MenuItem,
  Select,
  ListItemText,
  IconButton,
  Typography,
} from "@mui/material";
import { PlayArrow, Pause } from "@mui/icons-material";

const SelectWithAudio = ({
  value,
  onChange,
  options,
  placeholder,
  getPreviewUrl,
}) => {
  const audioRef = useRef(new Audio());
  const [playing, setPlaying] = useState(null);

  const handlePlay = (url, optValue) => {
    if (!url) return;

    if (playing === optValue) {
      audioRef.current.pause();
      setPlaying(null);
      return;
    }

    audioRef.current.pause();
    audioRef.current.src = url;
    audioRef.current.play();
    setPlaying(optValue);

    audioRef.current.onended = () => setPlaying(null);
  };

  return (
    <FormControl fullWidth size="small">
      <Select
        value={value}
        displayEmpty
        onChange={(e) => onChange(e.target.value)}
        renderValue={(selected) => {
          if (!selected) {
            return (
              <Typography sx={{ color: "#9e9e9e" }}>
                {placeholder || "Select"}
              </Typography>
            );
          }

          const selectedOption = options.find(
            (o) => o.value === selected
          );
          return selectedOption?.label;
        }}
        sx={{
          background: "#fff",
          borderRadius: "10px",
          height: "50px",
          "& fieldset": {
            borderColor: "#d0d0d0",
          },
          "&:hover fieldset": {
            borderColor: "#b5b5b5",
          },
        }}
      >
        {options.map((opt, idx) => {
          const url = getPreviewUrl(opt.value);

          return (
            <MenuItem
              key={idx}
              value={opt.value}
               disabled={opt.disabled}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <ListItemText primary={opt.label} />

              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent dropdown from closing
                  handlePlay(url, opt.value);
                }}
              >
                {playing === opt.value ? <Pause /> : <PlayArrow />}
              </IconButton>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default SelectWithAudio;

