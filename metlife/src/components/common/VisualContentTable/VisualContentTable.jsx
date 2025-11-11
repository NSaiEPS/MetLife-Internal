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

const VisualContentTable = ({ columns = [], rows = [], actions = [] }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [visuaiImages, setVisualImages] = useState([]);
  console.log(visuaiImages, "visulimges");
  // const [previewModal, setPreviewModal] = useState({
  //   open: false,
  //   images: [],
  //   index: 0,
  // });
  console.log(rows, "checkRows");
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

      <Dialog
        open={!!previewImage}
        onClose={() => setPreviewImage(null)}
        maxWidth="md"
      >
        <IconButton
          onClick={() => setPreviewImage(null)}
          sx={{
            position: "absolute",
            right: 10,
            top: 10,
            zIndex: 2,
            backgroundColor: "rgba(0,0,0,0.4)",
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.6)",
              transform: "scale(1.2)",
              transition: "transform 0.2s ease",
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent>
          {/* <img
            src={previewImage}
            alt="Preview"
            style={{
              width: "100%",
              maxHeight: "80vh",
              objectFit: "contain",
              borderRadius: 8,
            }}
          /> */}
          <ImageCarousel images={visuaiImages?.image_uploaded_urls} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VisualContentTable;
