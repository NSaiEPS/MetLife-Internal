import React, { useEffect, useState } from "react";
import { Button, Stack } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DynamicTable from "../../components/common/Table";
import styles from "./AddNewScript.module.css";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import { useParams } from "react-router";
import Footer from "../../components/common/mainFooter";
// import copy from "../../assets/copy.svg";
// import reuse from "../../assets/reuse.svg";
import AddNewScriptPopup from "../../components/popUps/addScripts";
import { downloadScriptPdf } from "../../utils/index";
import { Scriptdata } from "../../../script";
import api from "../../api/axios";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { NoDataMessage } from "../../components/common/NoDataMessage";
import { showToast } from "../../utils/toast";

const ScriptPage = () => {
  const { id } = useParams();
  // dynamic columns & rows
  const [columns] = useState(["Scene No.", "Script", "OST", "Type"]);
  const [sceneData, setSceneData] = useState({});
  const [loading, setLoading] = useState(false);
  const [makeChanges, setMakeChanges] = useState(false);

  useEffect(() => {
    if (id) {
      getSceneDetails();
    }
  }, [id]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (makeChanges) {
        // Show confirmation dialog
        const message =
          "You have unsaved changes. Are you sure you want to leave?";
        event.preventDefault();
        event.returnValue = message; // Some browsers require this for custom messages
        return message; // For some older browsers
      }
      // Clean up builder data only if there are no unsaved changes
    };

    // const handleTabChange = () => {
    //   // This triggers when user switches tab or minimizes the window
    //   if (document.visibilityState === "hidden" && makeChanges) {
    //     alert("⚠️ You have unsaved changes. Please save before leaving!");
    //   }
    // };

    window.addEventListener("beforeunload", handleBeforeUnload);
    // document.addEventListener("visibilitychange", handleTabChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // document.removeEventListener("visibilitychange", handleTabChange);
    };
  }, [makeChanges]);

  const getSceneDetails = async () => {
    setLoading(true);
    try {
      const result = await api.get(`scripts/${id}`);
      if (result?.status == "200") {
        setSceneData(result?.data);
      }
    } catch (e) {
      showToast.error(e?.detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <OneFrameHeader
       setMakeChanges={setMakeChanges}
        makeChanges={makeChanges} 
        sceneHandle={true} />

      <div className={styles.tableContainer}>
        {sceneData?.scenes?.length && !loading && sceneData.status ? (
          <DynamicTable
            setMakeChanges={setMakeChanges}
            columns={columns}
            extraDetails={sceneData}
            makeChanges={makeChanges}
          />
        ) : (
          <NoDataMessage filter={false} loading={loading} />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ScriptPage;
