import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { TableRow, TableCell, IconButton, Tooltip, Chip } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import styles from "./Table.module.css";
import type { SceneRow } from "./DynamicTable";

const TableRowComp = ({
  row,
  rIdx,
  columns,
  actions,
  showDragAndActions,
}: {
  row: SceneRow;
  rIdx: number;
  columns: string[];
  actions?: any[];
  showDragAndActions?: boolean;
}) => {
  const getChipStyles = (value: string | undefined | null) => {
    const defaultStyle = {
      background: "rgba(255, 255, 255, 0.1)",
      color: "rgba(255, 255, 255, 0.8)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    };

    if (!value) return defaultStyle;

    const valStr = value.toString().toLowerCase();

    switch (valStr) {
      case "completed":
      case "approved":
      case "success":
      case "done":
        return {
          background: "rgba(76, 175, 80, 0.1)",
          color: "#4caf50",
          border: "1px solid rgba(76, 175, 80, 0.3)",
        };
      case "pending":
      case "in progress":
      case "processing":
        return {
          background: "rgba(255, 152, 0, 0.1)",
          color: "#ff9800",
          border: "1px solid rgba(255, 152, 0, 0.3)",
        };
      case "failed":
      case "rejected":
      case "error":
        return {
          background: "rgba(244, 67, 54, 0.1)",
          color: "#f44336",
          border: "1px solid rgba(244, 67, 54, 0.3)",
        };
      case "narrator":
        return {
          background: "rgba(33, 150, 243, 0.1)",
          color: "#2196f3", // Blue
          border: "1px solid rgba(33, 150, 243, 0.3)",
        };
      case "monologue":
        return {
          background: "rgba(156, 39, 176, 0.1)",
          color: "#9c27b0", // Purple
          border: "1px solid rgba(156, 39, 176, 0.3)",
        };
      case "conversational":
        return {
          background: "rgba(0, 150, 136, 0.1)",
          color: "#009688", // Teal
          border: "1px solid rgba(0, 150, 136, 0.3)",
        };
      case "mixed":
        return {
          background: "rgba(255, 87, 34, 0.1)",
          color: "#ff5722", // Deep Orange
          border: "1px solid rgba(255, 87, 34, 0.3)",
        };
      default:
        return defaultStyle;
    }
  };

  return (
    <Draggable
      key={String(row.id)}
      draggableId={String(row.id)}
      index={rIdx}
      isDragDisabled={!showDragAndActions || row?.is_deleted}
    >
      {(providedDraggable) => (
        <TableRow
          ref={providedDraggable.innerRef}
          {...providedDraggable.draggableProps}
          className={`${styles.bodyRow} ${row?.is_deleted && styles.deletedRow}`}
        >
          {showDragAndActions && (
            <TableCell className={styles.bodyCell}>
              <Tooltip title="Drag & Drop" placement="top" arrow>
                <span>
                  <IconButton
                    {...providedDraggable.dragHandleProps} // ✅ FIXED HERE
                    size="small"
                    className={styles.dragHandle}
                  >
                    <DragIndicatorIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </TableCell>
          )}

          {columns.map((col, cIdx) => (
            <TableCell key={cIdx} className={styles.bodyCell}>
              {col === "Type" || col === "Status" ? (
                <Chip
                  label={row?.status || row[col as keyof SceneRow]}
                  sx={{
                    ...getChipStyles(row?.status || row[col as keyof SceneRow]),
                    textTransform: "capitalize",
                    fontWeight: 500,
                  }}
                  // variant="outlined"
                />
              ) : (
                row[col as keyof SceneRow]
              )}
            </TableCell>
          ))}

          {showDragAndActions && (
            <TableCell className={styles.bodyCell}>
              <div className={styles.actionsWrap}>
                {row?.is_deleted ? (
                  <Tooltip title="Restore" placement="top" arrow>
                    <IconButton className={styles.smallIconBtn} size="small">
                      Deleted
                    </IconButton>
                  </Tooltip>
                ) : (
                  actions?.map((act, aIdx) => (
                    <IconButton
                      key={aIdx}
                      className={styles.iconBtn}
                      size="small"
                      onClick={() => act.onClick(row)}
                    >
                      {act.icon}
                    </IconButton>
                  ))
                )}
              </div>
            </TableCell>
          )}
        </TableRow>
      )}
    </Draggable>
  );
};

export default TableRowComp;
