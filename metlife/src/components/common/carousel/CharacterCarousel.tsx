import React, { useState } from "react";
import { Modal, Box, Typography, Button, Skeleton, IconButton } from "@mui/material";
import { IoCloseCircleOutline } from "react-icons/io5";

export const CharacterCarousel = ({
  open,
  onClose,
  characterData = [],
  currentIndex,
  setCurrentIndex,
}) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  if (!characterData || characterData.length === 0) return null;
  const current = characterData[currentIndex];

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: "80%",
          maxWidth: 600,
          // height: "60%",
          maxHeight: "60vh",
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
          position: "relative",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color:'#000',
            background: "#e0e0e0",
            "&:hover": { background: "#e0e0e0" },
          }}
        >
          <IoCloseCircleOutline />
        </IconButton>
        {!imgLoaded && (
          <Skeleton
            variant="rectangular"
            width="100%"
            height={350}
            animation="wave"
            sx={{ borderRadius: "10px" }}
          />
        )}
        {/* IMAGE */}
        <img
          // src={characterData[currentIndex]?.image_url}
          src={current?.image_url}
          onLoad={() => setImgLoaded(true)}
          alt="character"
          style={{
            width: "100%",
            height: "auto",
            // maxHeight: "60vh",
            height: imgLoaded ? "auto" : 0,
            borderRadius: "10px",
            objectFit: "contain",
            transition: "opacity 0.3s ease",
            opacity: imgLoaded ? 1 : 0,
          }}
        />

        {/* NAME */}
        <Typography
          variant="h6"
          sx={{ textTransform: "capitalize", textAlign: "center" }}
        >
          {characterData[currentIndex]?.character_name}
          {/* DESCRIPTION */}
          {/* <Typography
            sx={{
              color: "gray",
              fontSize: "14px",
              textTransform: "lowercase",
              textAlign: "center",
            }}
          >
            {characterData[currentIndex]?.description}
          </Typography> */}
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
            // onClick={() => setCurrentIndex((i) => i - 1)}
            onClick={() => {
              setImgLoaded(false);
              setCurrentIndex((i) => i - 1);
            }}
          >
            Previous
          </Button>

          <Button
            variant="contained"
            disabled={currentIndex === characterData.length - 1}
            // onClick={() => setCurrentIndex((i) => i + 1)}
            onClick={() => {
              setImgLoaded(false);
              setCurrentIndex((i) => i + 1);
            }}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
