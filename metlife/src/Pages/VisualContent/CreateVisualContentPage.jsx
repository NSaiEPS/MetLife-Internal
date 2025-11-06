import React, { useEffect, useState } from "react";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import Footer from "../../components/common/mainFooter";
import styles from "./visualContent.module.css";
import DynamicTable from "../../components/common/Table";
import { useDispatch, useSelector } from "react-redux";
import copy from "../../assets/copy.svg";
import reuse from "../../assets/reuse.svg";

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
  IconButton,
  //   Paper,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { useLocation, useParams } from "react-router";
import { getVisualContent } from "../../redux/features/createVisualSlice";
import FullScreenGradientLoader from "../../components/common/GradientLoader";
import { NoDataMessage } from "../../components/common/NoDataMessage";
import AddNewScriptPopup from "../../components/popUps/addScripts";
import EditPromptPopup from "../../components/common/popup/EditPromptPopup";

const CreateVisualContentPage = () => {
  const [columns] = useState([
    { label: "Scene No.", key: "Scene_No." },
    { label: "Visual Type", key: "Visual_Type" },
    { label: "Visual Description", key: "Visual_Description" },
  ]);

  const actions = [
    {
      icon: <img src={copy} />,
      onClick: (row) => {
        console.log(row);
        // editPrompt(row);
        openEditPrompt(row);
      },
    },
    {
      icon: <img src={reuse} />,
      onClick: (row) => {
        console.log(row);
      },
    },
  ];
  const { saveVisualContentData, saveVisualContentLoader } = useSelector(
    (store) => store.CreateVisualContent
  );
  const script_id = saveVisualContentData?.script_id;
  const [rows, setRows] = useState([]);
  const [openEditPromptPopup, setOpenEditPromptPopup] = useState(false);
  const [editPromptData, setEditPromptData] = useState(null);
  //   console.log(saveVisualContentData, "save_visual_data");
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;
    dispatch(getVisualContent(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (saveVisualContentData?.prompts) {
      settingDataInRows(saveVisualContentData?.prompts);
    }
  }, [saveVisualContentData?.prompts]);

  const settingDataInRows = (reqData) => {
    let newdata = reqData?.map((item, index) => {
      return {
        "Scene_No.": index + 1,
        Visual_Type: "Image",
        Visual_Description: item?.prompt ?? "-",
        scene_id: item?.scene_id ?? "",
      };
    });
    setRows(newdata);
  };

  const openEditPrompt = (data) => {
    setEditPromptData(data);
    setOpenEditPromptPopup(true);
  };

  const handleUpdate = (data) => {
    console.log(data, "check_updated_data");

    // edit
    if (data?.fieldData) {
      const newData = rows.map((item) => {
        if (item?.scene_id === data.fieldData.scene_id) {
          return {
            ...item,
            Visual_Description: data.prompt,
          };
        }
        return item;
      });
      setRows(newData);
    }
  };

  console.log(saveVisualContentData, "Check_response");

  return (
    <>
      <div className={styles.container}>
        <OneFrameHeader />
        {saveVisualContentLoader && <FullScreenGradientLoader text="loading..." />}
        <div className={styles.header}>
          <h2 className={styles.title}>{"Visual Content"}</h2>
        </div>

        <div className={styles.tableContainer}>
          {saveVisualContentData?.prompts?.length > 0 ? (
            <>
              <TableContainer className={styles.tablePaper}>
                <Table className={styles.tableRoot}>
                  <TableHead>
                    <TableRow className={styles.headRow}>
                      {columns.map((col, idx) => (
                        <TableCell
                          key={idx}
                          className={styles.headCell}
                          sx={{ fontWeight: 600 }}
                        >
                          {col.label}
                        </TableCell>
                      ))}
                      {actions?.length > 0 && (
                        <TableCell
                          className={styles.headCell}
                          sx={{ fontWeight: 600 }}
                        >
                          Action
                        </TableCell>
                      )}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {rows.map((row, rIdx) => (
                      <TableRow key={rIdx} className={styles.bodyRow}>
                        {columns.map((col, cIdx) => (
                          <TableCell key={cIdx} className={styles.bodyCell}>
                            {row[col.key]}
                          </TableCell>
                        ))}

                        {actions.length > 0 && (
                          <TableCell className={styles.bodyCell}>
                            <div className={styles.actionsWrap}>
                              {actions.map((act, aIdx) => (
                                <IconButton
                                  key={aIdx}
                                  className={styles.iconBtn}
                                  size="small"
                                  onClick={() => {
                                    console.log("clicked");
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
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <EditPromptPopup
                open={openEditPromptPopup}
                onClose={() => setOpenEditPromptPopup(false)}
                fieldData={editPromptData}
                script_id={script_id}
                handleUpdate={handleUpdate}
              />
              <div className={styles.footerButtons}>
                <Button variant="contained" className={styles.primaryBtn}>
                  Generate Visual
                </Button>
              </div>
            </>
          ) : (
            <>
              <NoDataMessage filter={false} loading={saveVisualContentLoader} />
            </>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default CreateVisualContentPage;
