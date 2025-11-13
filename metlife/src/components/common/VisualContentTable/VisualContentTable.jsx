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
  getGenerateVisualContentImage,
} from "../../../redux/features/generateVisualSlice";
import { useDispatch } from "react-redux";

const VisualContentTable = ({ columns = [], rows = [], actions = [] }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [visuaiImages, setVisualImages] = useState([]);
  const [index, setIndex] = useState(0);
  const { id } = useParams();
  const dispatch = useDispatch();

  const handleDelete = () => {
    console.log(visuaiImages, index, "visulimges");
    const payload = {
      script_id: id,
      scene_id: visuaiImages?.scene_id,
      image_url: visuaiImages?.image_uploaded_urls[index]?.url,
    };
    dispatch(
      deleteGenerateVisualContent(payload, () => {
        setPreviewImage(null);
        setVisualImages(prev => ({
          ...prev,
          image_uploaded_urls:prev.image_uploaded_urls.filter(img =>  img.url !== payload.image_url)
        }))
        // dispatch(getGenerateVisualContentImage(id))
      })
    );
  };

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
    </>
  );
};

export default VisualContentTable;
