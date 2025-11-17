import React, { useState } from "react";
import styles from "./visualContent.module.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ImageCarousel from "../carousel/ImageCarousel";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from "react-router";
import {
  deleteGenerateVisualContent,
} from "../../../redux/features/generateVisualSlice";
import { useDispatch } from "react-redux";

const VisualContentTable = ({
  columns = [],
  rows = [],
  actions = [],
  updateImagesInRow,
}) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [visuaiImages, setVisualImages] = useState([]);
  const [index, setIndex] = useState(0);
  const { id } = useParams();
  const dispatch = useDispatch();

  console.log(previewImage, "preview");

  const handleDelete = () => {
    const currentImage = visuaiImages?.image_uploaded_urls[index]?.url;

    const payload = {
      script_id: id,
      scene_id: visuaiImages?.scene_id,
      image_url: currentImage,
    };

    dispatch(
      deleteGenerateVisualContent(payload, () => {
        // 1. Remove from local state
        const updatedImages = visuaiImages.image_uploaded_urls.filter(
          (img) => img.url !== currentImage
        );

        // 2. Update table row in parent
        updateImagesInRow(visuaiImages.scene_id, updatedImages);

        // 3. Update modal carousel
        setVisualImages((prev) => ({
          ...prev,
          image_uploaded_urls: updatedImages,
        }));

        // 4. Fix index if needed
        if (index >= updatedImages.length) {
          setIndex(updatedImages.length - 1);
        }

        if (updatedImages.length === 0) {
          setPreviewImage(null);
        }
      })
    );
  };

  return (
    <>
      <TableContainer className={styles.tablePaper}>
        <Table className={styles.tableRoot}>
          <TableHead>
            <TableRow>
              {columns.map((col, idx) => (
                <TableCell key={idx} sx={{ fontWeight: 600 }}>
                  {col.label}
                </TableCell>
              ))}

              {actions.length > 0 && (
                <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, rIdx) => (
              <TableRow key={rIdx}>
                {columns.map((col, cIdx) => (
                  <TableCell key={cIdx}>
                    {col.render
                      ? col.render(
                          row[col.key],
                          row,
                          setPreviewImage,
                          setVisualImages
                        )
                      : row[col.key]}
                  </TableCell>
                ))}

                {actions.length > 0 && (
                  <TableCell>
                    <div style={{ display: "flex", gap: 8 }}>
                      {actions.map((act, aIdx) => (
                        <IconButton
                          key={aIdx}
                          size="small"
                          onClick={() => act.onClick(row)}
                        >
                          {act.icon}
                        </IconButton>
                      ))}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {previewImage && previewImage.length > 0 && (
        <Dialog
          open={!!previewImage}
          onClose={() => setPreviewImage(null)}
          // maxWidth="md"
          maxWidth={false}
        >
          <div
            style={{
              position: "absolute",
              right: 10,
              top: 10,
              zIndex: 10,
              display: "flex",
              gap: 8,
            }}
          >
            {/* DELETE */}
            {visuaiImages?.image_uploaded_urls?.length > 0 && (
              <IconButton
                onClick={handleDelete}
                sx={{
                  backgroundColor: "rgba(255, 0, 0, 0.6)",
                  color: "white",
                  "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.8)" },
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}

            {/* CLOSE */}
            <IconButton
              onClick={() => setPreviewImage(null)}
              sx={{
                backgroundColor: "rgba(0,0,0,0.4)",
                color: "white",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
              }}
            >
              <CloseIcon />
            </IconButton>
          </div>

          <DialogContent>
            <ImageCarousel
              images={visuaiImages?.image_uploaded_urls}
              caroselIndex={setIndex}
              previewImage={previewImage}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default VisualContentTable;
