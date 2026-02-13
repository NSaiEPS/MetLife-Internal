import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import TableRowComp from "./TableRowComp";
import React from "react";
import styles from "./Table.module.css";
import type { SceneRow } from "./DynamicTable";


const TableComp = ({
  rows,
  columns,
  actions,
  showDragAndActions,
  handleDragEnd,
}: {
  rows: SceneRow[];
  columns: string[];
  actions?: any[];
  showDragAndActions?: boolean;
  handleDragEnd: (result: DropResult) => void;
}) => {
  return (
    <TableContainer component={Paper} className={styles.tablePaper}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="table" isDropDisabled={!showDragAndActions}>
          {(provided) => (
            <Table
              className={styles.tableRoot}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <TableHead>
                <TableRow className={styles.headRow}>
                  {showDragAndActions && (
                    <TableCell className={styles.headCell}></TableCell>
                  )}

                  {columns.map((col, idx) => (
                    <TableCell key={idx} className={styles.headCell}>
                      {col}
                    </TableCell>
                  ))}

                  {showDragAndActions && actions?.length > 0 && (
                    <TableCell className={styles.headCell}>Action</TableCell>
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {rows?.map((row, rIdx) => (
                  <TableRowComp
                    row={row}
                    rIdx={rIdx}
                    columns={columns}
                    actions={actions}
                    showDragAndActions={showDragAndActions}
                  />
                ))}

                {provided.placeholder}
              </TableBody>
            </Table>
          )}
        </Droppable>
      </DragDropContext>
    </TableContainer>
  );
};

export default TableComp;
