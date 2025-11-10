import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import styles from "./generateVisualContent.module.css";
import Footer from "../../components/common/mainFooter";
import copy from "../../assets/copy.svg";
import reuse from "../../assets/reuse.svg";
import { NoDataMessage } from "../../components/common/NoDataMessage";
import VisualContentTable from "../../components/common/VisualContentTable/VisualContentTable";

const GenerateVisualContentPage = () => {
  const [rows, setRows] = useState([]);
  const columns = [
    { label: "Scene No.", key: "Scene_No." },
    {
      label: "Visual Type",
      key: "Visual_Type",
      //   render: (value, row) => (
      //     <Select
      //       value={value}
      //       size="small"
      //       onChange={(e) => handleVisualTypeChange(e.target.value, row)}
      //       sx={{ width: 100 }}
      //     >
      //       <MenuItem value="image">Image</MenuItem>
      //       <MenuItem value="clip">Clip</MenuItem>
      //     </Select>
      //   ),
    },
    { label: "Visual Description", key: "Visual_Description" },
    { label: "Visual Image", key: "Visual_Image" },
  ];

  const actions = [
    {
      icon: <img src={copy} />,
      onClick: (row) => {
        // openEditPrompt(row);
      },
    },
    {
      icon: <img src={reuse} />,
      onClick: (row) => {
        // handlePromptRegenerate(row);
      },
    },
    {
      icon: <img src={reuse} />,
      onClick: (row) => {
        // handlePromptRegenerate(row);
      },
    },
  ];

  return (
    <>
      <div className={styles.container}>
        <OneFrameHeader />
        {/* {saveVisualContentLoader && (
          <FullScreenGradientLoader text="loading..." />
        )} */}
        <div className={styles.header}>
          <h2 className={styles.title}>{"Visual Content"}</h2>
        </div>

        <div className={styles.tableContainer}>
          <VisualContentTable columns={columns} rows={rows} actions={actions} />

          <div className={styles.footerButtons}>
            <Button variant="contained" className={styles.primaryBtn}>
              Audio & Animation Toolkit
            </Button>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default GenerateVisualContentPage;
