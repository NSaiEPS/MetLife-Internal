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
  MenuItem,
  Select,
  //   Paper,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { useLocation, useParams } from "react-router";
import {
  getVisualContent,
  postVisualTypeUpdate,
} from "../../redux/features/createVisualSlice";
import FullScreenGradientLoader from "../../components/common/GradientLoader";
import { NoDataMessage } from "../../components/common/NoDataMessage";
import AddNewScriptPopup from "../../components/popUps/addScripts";
import EditPromptPopup from "../../components/common/popup/EditPromptPopup";
import RegeneratePromptPopup from "../../components/common/popup/RegeneratePromptPopup";

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
        openEditPrompt(row);
      },
    },
    {
      icon: <img src={reuse} />,
      onClick: (row) => {
        console.log(row, "row_data_check");
        handlePromptRegenerate(row);
      },
    },
  ];
  const {
    saveVisualContentData,
    setSaveVisualContentData,
    saveVisualContentLoader,
  } = useSelector((store) => store.CreateVisualContent);
  const script_id = saveVisualContentData?.script_id;
  const [rows, setRows] = useState([]);
  const [openEditPromptPopup, setOpenEditPromptPopup] = useState(false);
  const [editPromptData, setEditPromptData] = useState(null);
  const [openRegeneratePromptPopup, setOpenRegeneratePromptPopup] =
    useState(false);
  const [regeneratePromptData, setRegeneratePromptData] = useState(null);
  console.log(saveVisualContentData, "save_visual_data");
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
      console.log(item, "check_item");
      return {
        "Scene_No.": index + 1,
        Visual_Type: item?.visual_type === "clip" ? "clip" : "image",
        // Visual_Description:  item?.prompt ?? "-",
        Visual_Description:
          item?.visual_type === "clip"
            ? item?.clip_prompt ?? "-"
            : item?.prompt ?? "-",
        scene_id: item?.scene_id ?? "",
        prompt_id: item?.prompt_id ?? "",
      };
    });
    setRows(newdata);
  };

  const openEditPrompt = (data) => {
    setEditPromptData(data);
    setOpenEditPromptPopup(true);
  };

  const handlePromptRegenerate = (data) => {
    console.log(data, "check_data");
    setRegeneratePromptData(data);
    setOpenRegeneratePromptPopup(true);
  };

  const handleUpdate = (data) => {
    console.log(data, "check_updated_data");
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

  const handleVisualTypeChange = (value, data) => {
    console.log(data, "check_visual");
    // return
    const updatedRows = rows.map((item) =>
      item.scene_id === data.scene_id ? { ...item, Visual_Type: value } : item
    );
    setRows(updatedRows);

    const payload = {
      prompt_batch_id: id,
      prompt_id: data?.prompt_id,
      visual_type: value,
    };

    dispatch(postVisualTypeUpdate(payload));
  };
  console.log(regeneratePromptData, "Check_regenerate_data");

  return (
    <>
      <div className={styles.container}>
        <OneFrameHeader />
        {saveVisualContentLoader && (
          <FullScreenGradientLoader text="loading..." />
        )}
        <div className={styles.header}>
          <h2 className={styles.title}>
            {saveVisualContentData?.title || "Visual Content"}
          </h2>
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
                            {/* {row[col.key]} */}
                            {col.key === "Visual_Type" ? (
                              <Select
                                value={row.Visual_Type}
                                size="small"
                                onChange={(e) =>
                                  handleVisualTypeChange(e.target.value, row)
                                }
                                sx={{ width: 100 }}
                              >
                                <MenuItem value="image">Image</MenuItem>
                                <MenuItem value="clip">Clip</MenuItem>
                              </Select>
                            ) : (
                              row[col.key]
                            )}
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

              <RegeneratePromptPopup
                open={openRegeneratePromptPopup}
                onClose={() => setOpenRegeneratePromptPopup(false)}
                fieldData={regeneratePromptData}
                id={id}
                // handleRegenerate={handleRegenerate}
              />
              <div className={styles.footerButtons}>
                <Button variant="contained" className={styles.primaryBtn}>
                  Generate Visual
                </Button>
              </div>
            </>
          ) : (
            <>
              <NoDataMessage filter={false} />
            </>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default CreateVisualContentPage;
