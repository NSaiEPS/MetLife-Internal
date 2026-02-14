import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import Footer from "../../components/common/mainFooter";
import DynamicTable from "../../components/common/Table/DynamicTable";
import { NoDataMessage } from "../../components/common/NoDataMessage";
import api from "../../api/axios";
import styles from "./AddNewScript.module.css";
import { showToast } from "../../utils/toast";

// ---------- Types ----------
interface Scene {
  scene_no: number;
  script: string;
  ost: string;
  type: string;
  [key: string]: any;
}

interface SceneData {
  scenes?: Scene[];
  status?: boolean;
  [key: string]: any;
}

const ScriptPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [columns] = useState<string[]>(["Scene No.", "Script", "OST", "Type"]);
  const [sceneData, setSceneData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [makeChanges, setMakeChanges] = useState<boolean>(false);

  // Fetch scene details
  useEffect(() => {
    if (id) {
      getSceneDetails();
    }
  }, [id]);

  // Warn on unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (makeChanges) {
        const message =
          "You have unsaved changes. Are you sure you want to leave?";
        event.preventDefault();
        event.returnValue = message; // For modern browsers
        return message; // For older browsers
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [makeChanges]);

  const getSceneDetails = async () => {
    setLoading(true);
    try {
      const result = await api.get(`scripts/${id}`);
      if (result?.status === 200) {
        setSceneData(result?.data);
      }
    } catch (e: any) {
      showToast.error(e?.detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* <OneFrameHeader
        // setMakeChanges={setMakeChanges}
        makeChanges={makeChanges}
        sceneHandle={true}
      /> */}

      <div className={styles.tableContainer}>
        {sceneData?.scenes?.length && !loading && sceneData.status ? (
          <DynamicTable
            setMakeChanges={setMakeChanges}
            columns={columns}
            extraDetails={sceneData}
            //  makeChanges={makeChanges}
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
