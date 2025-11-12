import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useSelector } from "react-redux";

const ImageCarousel = ({ images = [], caroselIndex, previewImage }) => {
  const [index, setIndex] = useState(0);
  const { generateVisualContentData } = useSelector(
    (store) => store.GenerateVisualContent
  );
  console.log(images, "immges");

  // reset to last image when images change
  useEffect(() => {
    if (images?.length > 0) {
      caroselIndex(0);
      // setIndex(0); // show latest image by default
      setIndex(images.length - 1)
       caroselIndex(images.length - 1);
    }
  }, [images, previewImage]);

  if (!images || images?.length === 0) {
    return (
      <Typography
        variant="body2"
        sx={{ textAlign: "center", color: "gray", mt: 2 }}
      >
        No images available.
      </Typography>
    );
  }

  const prev = () => {
    setIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const next = () => {
    setIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <Box sx={{ textAlign: "center", mt: 1, position: "relative" }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Uploaded Images
      </Typography>

      <Box
        sx={{
          width: 350, // ✅ FIXED WIDTH (change as required)
          height: 260, // ✅ FIXED HEIGHT
          margin: "0 auto",
          position: "relative",
          borderRadius: 2,
          backgroundColor: "#f4f4f4", // ✅ Background for carousel box
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <IconButton
          size="small"
          onClick={prev}
          sx={{
            position: "absolute",
            left: 5,
            backgroundColor: "rgba(0,0,0,0.4)", // ✅ Background color
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.7)",
            },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

        {/* IMAGE */}
        <img
          src={images[index].url}
          alt="carousel-img"
          style={{
            width: "100%",
            maxHeight: 260,
            objectFit: "contain",
            borderRadius: 8,
          }}
        />

        <IconButton
          size="small"
          onClick={next}
          sx={{
            position: "absolute",
            right: 5,
            backgroundColor: "rgba(0,0,0,0.4)", // ✅ Background color
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.7)",
            },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>

      {/* Counter */}
      <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
        {index + 1} / {images.length}
      </Typography>
    </Box>
  );
};

export default ImageCarousel;
