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
  Stack,
  Button,
} from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import styles from "./Table.module.css";
import AddNewScriptPopup from "../popUps/addScripts";
import { downloadScriptPdf } from "../../utils";
import { showToast } from "../../utils/toast";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import copy from "../../assets/copy.svg";
import reuse from "../../assets/reuse.svg";
import styles1 from "../../Pages/AddNewScriptPage/AddNewScript.module.css"

/**
 * props:
 *  - columns: array of column header strings
 *  - data: array of row objects where keys match column names
 *  - actions: array of { icon: ReactNode, onClick: (row) => void }
 */
function DynamicTable({
  columns = [],
  data = [],
  // actions = [],
  extraDetails = {},
}) {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [openPopUp, setOpenPopup] = useState(false);
  const [popUpData, setPopUpdata] = useState();
  const [popupTitle, setPopupTitle] = useState("Add New Script");
  const actions = [
    { icon: <img src={copy} />, onClick: (row) => addScene(row) },
    {
      icon: <img src={reuse} />,
      onClick: (row) => alert(`Delete ${row["Scene No."]}`),
    },
  ];
  console.log(rows, data);
  useEffect(() => {
    let newdata = extraDetails?.scenes?.map((item, index) => {
      let data = {
        // "Scene No.": item?.scene_number,
        "Scene No.": index + 1,
        Script: item?.description,
        OST: item?.on_screen_text ?? "-",
        Type: item?.scene_type,
        id: item?.scene_id,
      };
      return data;
    });
    setRows(newdata);
  }, [extraDetails?.data]);

  const addScene = (data) => {
    setPopUpdata(data);
    if (data && data.OST) {
      setPopupTitle("Edit Script");
    } else {
      setPopupTitle("Add New Script");
    }
    setOpenPopup(true);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const updated = Array.from(rows);
    const [moved] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, moved);

    // Reassign scene numbers based on new order
    const reIndexed = updated.map((item, index) => ({
      ...item,
      "Scene No.": index + 1,
    }));

    setRows(reIndexed);
    showToast.success("Updated Successfully!");
  };

  const handleDownloadScript = () => {
    try {
      downloadScriptPdf({ ...extraDetails, scenes: rows });
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };

  const handleUpdate = (data) => {
    // setSceneData({...sceneData,sceneData:})
    console.log(data, "check-data");
    // // // edit
    if (data?.fieldData) {
      let newData = rows.map((item) => {
        console.log(item);
        let child = { ...item };
        if (item?.id === data?.fieldData.id) {
          child = {
            "Scene No.": data.fieldData?.["Scene No."],
            Script: data?.script,
            OST: data?.ost,
            Type: data?.type,
            id: data.fieldData?.id,
          };
        }
        return child;
      });
      setRows(newData);
      console.log(newData);
      // setRows((prev) => [
      //   prev.map((scene) => (scene.id === data?.fieldData.id ? data : scene)),
      // ]);
    } else {
      // adding new row
      const newScene = {
        id: Date.now(),
        "Scene No.": (rows?.length || 0) + 1,
        ...data,
        Script: data?.script,
        OST: data?.ost,
        Type: data?.type,
      };

      setRows((prev) => [...prev, newScene]);
    }

    showToast.success("Scene saved successfully");
    setOpenPopup(false);
  };
  return (
    <>
      <div className={styles1.header}>
        <h2 className={styles1.title}>Your Script</h2>
        <div className={styles1.headerButtons}>
          <Button
            variant="outlined"
            className={styles1.outlineBtn}
            onClick={() => addScene()}
          >
            + Add Scene
          </Button>
          <Button variant="contained" className={styles1.primaryBtn}>
            Show Source
          </Button>
          <Button
            className={styles1.icon}
            onClick={() => {
              navigate("/generate-script");
            }}
          >
            <IoArrowBackCircleOutline
              size={30}
              // onClick={() => navigate("/generate-script")}
            />{" "}
            Back
          </Button>
        </div>
      </div>
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
                              {/* {cIdx == 0 ? rIdx + 1 : row[col]} */}
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

      <AddNewScriptPopup
        open={openPopUp}
        onClose={() => setOpenPopup(false)}
        fieldData={popUpData}
        title={popupTitle}
        handleUpdate={handleUpdate}
      />

      <div className={styles.footerButtons}>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
          className={styles.stack}
        >
          <Button variant="outlined" className={styles.largeOutline}>
            Regenerate Script
          </Button>
          <Button
            variant="contained"
            className={styles.successBtn}
            onClick={handleDownloadScript}
          >
            Download Script
          </Button>
          <Button variant="contained" className={styles.primaryBtn}>
            Create Visual Content
          </Button>
        </Stack>
      </div>
    </>
  );
}

export default DynamicTable;
