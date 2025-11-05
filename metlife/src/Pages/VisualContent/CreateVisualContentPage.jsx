import React, { useState } from "react";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import Footer from "../../components/common/mainFooter";
import styles from "./visualContent.module.css";
import DynamicTable from "../../components/common/Table";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
  //   Paper,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AutorenewIcon from "@mui/icons-material/Autorenew";

const rows = [
  {
    id: "01",
    type: "Image",
    description:
      "Create a 90-second explainer video script about photosynthesis",
  },
  { id: "02", type: "Footage", description: "Create a 90-second explainer" },
  {
    id: "03",
    type: "Clip",
    description:
      "Create a 90-second explainer video script about photosynthesis",
  },
  { id: "04", type: "Footage", description: "Create a 90-second explainer" },
  {
    id: "05",
    type: "Image",
    description:
      "Create a 90-second explainer video script about photosynthesis",
  },
];
const CreateVisualContentPage = () => {
  const [columns] = useState([
    "Scene No.",
    "Visual Type",
    "Visual Description",
  ]);
  const { saveVisualContentData, saveVisualContentLoader } = useSelector(
    (store) => store.CreateVisualContent
  );

  console.log(saveVisualContentData, "Check_response");

  return (
    <>
      <div className={styles.container}>
        <OneFrameHeader />
        <div className={styles.header}>
          <h2 className={styles.title}>{"Your Script"}</h2>
        </div>

        <div className={styles.tableContainer}>
          <TableContainer className={styles.tablePaper}>
            <Table className={styles.tableRoot}>
              <TableHead>
                <TableRow className={styles.headRow}>
                  <TableCell className={styles.headCell}  sx={{ fontWeight: 600 }}>Scene No.</TableCell>
                  <TableCell className={styles.headCell} sx={{ fontWeight: 600 }}>Visual Type</TableCell>
                  <TableCell className={styles.headCell} sx={{ fontWeight: 600 }}>
                    Visual Description
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {saveVisualContentData.map((row, idx) => (
                  <TableRow key={row.id}>
                    <TableCell className={styles.bodyCell} >{idx + 1}</TableCell>
                    <TableCell className={styles.bodyCell}>{"Image"}</TableCell>
                    <TableCell className={styles.bodyCell}>{row?.prompt}</TableCell>
                    <TableCell className={styles.bodyCell}>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <EditNoteIcon color="primary" />
                        <AutorenewIcon color="primary" />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        

          
        </div>
        <Footer />
      </div>
    </>
  );
};

export default CreateVisualContentPage;
