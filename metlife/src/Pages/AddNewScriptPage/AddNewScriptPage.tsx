import React, { useEffect, useState } from "react";
import { Button, Stack } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DynamicTable from "../../components/common/Table";
import styles from "./AddNewScript.module.css";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import { useParams } from "react-router";
import Footer from "../../components/common/mainFooter";
import AddNewScriptPopup from "../../components/popUps/addScripts";
import { downloadScriptPdf } from "../../utils/index";
import api from "../../api/axios";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { NoDataMessage } from "../../components/common/NoDataMessage";
import { showToast } from "../../utils/toast";

// ---------- Types ----------
interface Scene {
  id: number;
  text: string;
  scene_no?: number;
  ost?: string;
  type?: string;
}

interface SceneData {
  status?: boolean;
  scenes?: Scene[];
  [key: string]: any;
}

const ScriptPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [columns] = useState<string[]>(["Scene No.", "Script", "OST", "Type"]);
  const [sceneData, setSceneData] = useState<SceneData>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [makeChanges, setMakeChanges] = useState<boolean>(false);

  // -------- Fetch Scene Details ----------
  useEffect(() => {
    if (id) getSceneDetails();
  }, [id]);

  // -------- Warn Before Page Leave ----------
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (makeChanges) {
        const message =
          "You have unsaved changes. Are you sure you want to leave?";
        event.preventDefault();
        event.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [makeChanges]);

  // -------- API Fetch ----------
  const getSceneDetails = async () => {
    setLoading(true);
    try {
      const result = await api.get(`scripts/${id}`);

      if (result?.status === 200 || result?.status === "200") {
        setSceneData(result.data);
      }
    } catch (e: any) {
      showToast.error(e?.detail || "Failed to fetch scene details.");
    } finally {
      setLoading(false);
    }
  };

  // -------- Render ----------
  return (
    <div className={styles.container}>
      <OneFrameHeader
        setMakeChanges={setMakeChanges}
        makeChanges={makeChanges}
        sceneHandle={true}
      />

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
