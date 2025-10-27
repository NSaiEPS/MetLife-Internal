import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import styles from "./Table.module.css";
import AddNewScriptPopup from "../popUps/addScripts";

/**
 * props:
 *  - columns: array of column header strings
 *  - data: array of row objects where keys match column names
 *  - actions: array of { icon: ReactNode, onClick: (row) => void }
 */
function DynamicTable({ columns = [], data = [], actions = [] }) {
  const [rows, setRows] = useState(data);
  console.log(rows, data);
  useEffect(() => {
    let newdata = data?.map((item) => {
      let data = {
        "Scene No.": item?.scene_number,
        Script: item?.description,
        OST: item?.on_screen_text ?? "-",
        Type: item?.scene_type,
      };
      return data;
    });
    setRows(newdata);
  }, [data]);
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const updated = Array.from(rows);
    const [moved] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, moved);

    setRows(updated);
  };

  return (
    <TableContainer component={Paper} className={styles.tablePaper}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="table">
          {(provided) => (
            <Table
              className={styles.tableRoot}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <TableHead>
                <TableRow className={styles.headRow}>
                  {/* Drag handle header cell */}
                  <TableCell className={styles.headCell}></TableCell>

                  {columns.map((col, idx) => (
                    <TableCell key={idx} className={styles.headCell}>
                      {col}
                    </TableCell>
                  ))}

                  {actions?.length > 0 && (
                    <TableCell className={styles.headCell}>Action</TableCell>
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row, rIdx) => (
                  <Draggable
                    key={row.id || rIdx}
                    draggableId={String(row.id || rIdx)}
                    index={rIdx}
                  >
                    {(provided) => (
                      <TableRow
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={styles.bodyRow}
                      >
                        {/* Drag handle cell */}
                        <TableCell className={styles.bodyCell}>
                          <IconButton
                            {...provided.dragHandleProps}
                            size="small"
                            className={styles.dragHandle}
                          >
                            <DragIndicatorIcon />
                          </IconButton>
                        </TableCell>

                        {/* Data cells */}
                        {columns.map((col, cIdx) => (
                          <TableCell key={cIdx} className={styles.bodyCell}>
                            {row[col]}
                          </TableCell>
                        ))}

                        {/* Action icons */}
                        {actions?.length > 0 && (
                          <TableCell className={styles.bodyCell}>
                            <div className={styles.actionsWrap}>
                              {actions.map((act, aIdx) => (
                                <IconButton
                                  key={aIdx}
                                  className={styles.iconBtn}
                                  size="small"
                                  onClick={() => {
                                    act.onClick(row);
                                  }}
                                >
                                  {act.icon}
                                </IconButton>
                              ))}
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </TableBody>
            </Table>
          )}
        </Droppable>
      </DragDropContext>
    </TableContainer>
  );
}

export default DynamicTable;
