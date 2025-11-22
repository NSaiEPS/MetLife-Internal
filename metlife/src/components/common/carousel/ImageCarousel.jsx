import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useSelector } from "react-redux";
import dummy from "../../../assets/dummy-image.png";

const ImageCarousel = ({ images = [], caroselIndex, previewImage }) => {
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!images || images.length === 0) {
      setIndex(0);
      caroselIndex(0);
      return;
    }

    if (index >= images.length) {
      const newIndex = Math.max(0, images.length - 1);
      setIndex(newIndex);
      caroselIndex(newIndex);
      return;
    }

    // caroselIndex(index);
    setLoading(true);
  }, [images, caroselIndex, index]);

  useEffect(() => {
    if (images.length > 0) {
      caroselIndex(index);
    }
  }, [index, caroselIndex, images?.length]);

  if (!images || images.length === 0) {
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

  const handleError = (e) => {
    e.target.src = dummy;
  };
  // console.log(images[index].url);

  return (
    <Box sx={{ textAlign: "center", mt: 1, position: "relative" }}>
      <Typography
        variant="subtitle2"
        sx={{ mb: 1, fontSize: "18px", fontWeight: 500 }}
      >
        Images
      </Typography>

      <Box
        sx={{
          width: "85vw",
          height: "85vh", // ✅ FIXED HEIGHT
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
          onClick={() => {
            setLoading(true);
            prev();
          }}
          sx={{
            position: "absolute",
            left: 5,
            backgroundColor: "#fff", // ✅ Background color
            border: "1px solid #000",
            color: "black",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

        {images[index]?.url && images.length > 0 ? (
          <>
            <img
              key={images[index].url}
              src={images[index].url}
              alt="carousel-img"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "fill",
                borderRadius: 8,
              }}
              onLoad={() => setLoading(false)}
              onError={handleError}
            />
          </>
        ) : (
          <Typography variant="body2" color="gray">
            Image not found
          </Typography>
        )}

        {loading && images?.length === 2 && (
          <Typography
            variant="body1"
            sx={{
              position: "absolute",
              color: "black",
              fontWeight: "bold",
              background: "rgba(255,255,255,0.8)",
              padding: "6px 12px",
              borderRadius: "6px",
            }}
          >
            Loading...
          </Typography>
        )}

        <IconButton
          size="small"
          onClick={() => {
            setLoading(true);
            next();
          }}
          sx={{
            position: "absolute",
            right: 5,
            backgroundColor: "#fff", // ✅ Background color
            border: "1px solid #000",
            color: "black",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
      <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
        {images?.length > 0 ? `${index + 1} / ${images.length}` : "0 / 0"}
      </Typography>
    </Box>
  );
};

export default ImageCarousel;
