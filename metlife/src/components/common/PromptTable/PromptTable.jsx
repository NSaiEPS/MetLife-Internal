import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import styles from "./promptTable.module.css";

const PromptTable = ({ columns = [], rows = [], actions = [] }) => {
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
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
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
    </>
  );
};

export default PromptTable;
