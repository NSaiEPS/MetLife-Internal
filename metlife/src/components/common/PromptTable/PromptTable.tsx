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
import { useSelector } from "react-redux";
import FullScreenGradientLoader from "../GradientLoader";
import type { RootState } from "../../../redux/store"; // adjust path according to your project

// ---------- Types ----------
interface Column<T> {
  label: string;
  key: keyof T;
  render?: (value: any, row: T) => React.ReactNode;
}

interface Action<T> {
  icon: React.ReactNode;
  onClick: (row: T) => void;
}

interface PromptTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  actions?: Action<T>[];
}

// ---------- Component ----------
function PromptTable<T extends Record<string, any>>({
  columns = [],
  rows = [],
  actions = [],
}: PromptTableProps<T>) {
  const { saveVisualContentLoader } = useSelector(
    (store: RootState) => store.CreateVisualContent,
  );
  const { generateVisualLoader } = useSelector(
    (store: RootState) => store.GenerateVisualContent,
  );

  return (
    <>
      {(saveVisualContentLoader || generateVisualLoader) && (
        <FullScreenGradientLoader text="loading..." />
      )}
      <TableContainer className={styles.tablePaper}>
        <Table className={styles.tableRoot}>
          <TableHead>
            <TableRow>
              {columns.map((col, idx) => (
                <TableCell
                  key={idx}
                  sx={{
                    fontWeight: 600,
                    width: col.width,
                    maxWidth: col.width,
                  }}
                >
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
              <TableRow
                key={rIdx}
                sx={{
                  "& td": {
                    verticalAlign: "top", // 🔥 TOP ALIGN ALL CELLS
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                    paddingTop: "12px",
                  },
                }}
              >
                {columns.map((col, cIdx) => (
                  <TableCell
                    key={cIdx}
                    sx={{
                      width: col.width,
                      maxWidth: col.width,
                    }}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </TableCell>
                ))}
                {actions.length > 0 && (
                  <TableCell
                    sx={{
                      verticalAlign: "top",
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    <div style={{ display: "flex", gap: 8 }}>
                      {/* {actions.map((act, aIdx) => (
                        <IconButton
                          key={aIdx}
                          size="small"
                          onClick={() => act.onClick(row)}
                        >
                          {act.icon}
                        </IconButton>
                      ))} */}

                      {actions.map((act, aIdx) => {
                        const Icon =
                          typeof act.icon === "function"
                            ? act.icon(row)
                            : act.icon;

                        if (!Icon) return null;

                        return (
                          <IconButton
                            key={aIdx}
                            size="small"
                            onClick={() => act.onClick(row)}
                          >
                            {Icon}
                          </IconButton>
                        );
                      })}
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
}

export default PromptTable;
