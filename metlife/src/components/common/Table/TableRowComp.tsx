import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { TableRow, TableCell, IconButton, Tooltip } from "@mui/material";
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
              {row[col as keyof SceneRow]}
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
