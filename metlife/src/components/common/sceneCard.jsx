import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import styles from "./sceneCard.module.css";

const SceneCard = ({ scene, index, active, onSelect, onDelete, onCopy, onRegenerate }) => {
  return (
    <Card
      className={`${styles.card} ${active ? styles.activeCard : ""}`}
      onClick={() => onSelect(scene.id)}
      elevation={0}
    >
      <CardContent className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <Typography variant="subtitle1" className={styles.title}>
            {scene.title}
          </Typography>

          <div className={styles.icons}>
            <IconButton size="small" onClick={(e)=>{ e.stopPropagation(); onRegenerate(scene.id); }}>
              <RestartAltIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={(e)=>{ e.stopPropagation(); onCopy(scene.id); }}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={(e)=>{ e.stopPropagation(); onDelete(scene.id); }}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </div>
        </div>

        <Typography variant="body2" className={styles.text}>
          {scene.text}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SceneCard;
