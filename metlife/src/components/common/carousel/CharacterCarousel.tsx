import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

export const CharacterCarousel = ({
  open,
  onClose,
  characterData = [],
  currentIndex,
  setCurrentIndex,
}) => {
  if (!characterData || characterData.length === 0) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: "80%",
          maxWidth: 600,
          height: "80%",
          margin: "auto",
          marginTop: "5%",
          background: "white",
          borderRadius: 2,
          p: 3,
          outline: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* IMAGE */}
        <img
          src={characterData[currentIndex]?.image_url}
          alt="character"
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "10px",
            objectFit: "contain",
          }}
        />

        {/* NAME */}
        <Typography variant="h6">
          {characterData[currentIndex]?.character_name}
           {/* DESCRIPTION */}
        <Typography sx={{ color: "gray", fontSize: "14px" }}>
          {characterData[currentIndex]?.description}
        </Typography>
        </Typography>

       

        {/* BUTTON CONTROLS */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            marginTop: 2,
          }}
        >
          <Button
            variant="contained"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => i - 1)}
          >
            Previous
          </Button>

          <Button
            variant="contained"
            disabled={currentIndex === characterData.length - 1}
            onClick={() => setCurrentIndex((i) => i + 1)}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
