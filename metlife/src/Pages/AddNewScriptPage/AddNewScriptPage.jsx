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
  // const navigate = useNavigate();

  console.log("Scene ID:", id);
  // dynamic columns & rows
  const [columns] = useState(["Scene No.", "Script", "OST", "Type"]);
  const [sceneData, setSceneData] = useState({});
  const [loading, setLoading] = useState(false);
  const getSceneDetails = async () => {
    setLoading(true);
    try {
      const result = await api.get(`scripts/${id}`);
      console.log("Video created successfully:", result);
      if (result?.status == "200") {
        setSceneData(result?.data);
      }
    } catch (e) {
      console.log(e);
      showToast.error(e?.detail);
    } finally {
      setLoading(false);
      // setSceneData({
      //   scenes: [
      //     {
      //       description: "description",
      //       on_screen_text: "on_screen_text",
      //       scene_type: "narrative",
      //       scene_id: "56yuhjbvew67uikmhuik",
      //     },
      //   ],
      // });
    }
  };
  useEffect(() => {
    if (id) {
      getSceneDetails();
    }
  }, [id]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (true) {
        // Show confirmation dialog
        const message =
          "You have unsaved changes. Are you sure you want to leave?";
        event.preventDefault();
        event.returnValue = message; // Some browsers require this for custom messages
        return message; // For some older browsers
      }
      // Clean up builder data only if there are no unsaved changes
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  return (
    <div className={styles.container}>
      <OneFrameHeader />

      <div className={styles.tableContainer}>
        {sceneData?.scenes?.length && !loading ? (
          <DynamicTable columns={columns} extraDetails={sceneData} />
        ) : (
          <NoDataMessage filter={false} loading={loading} />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ScriptPage;
