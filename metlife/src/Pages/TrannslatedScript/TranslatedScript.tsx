import React, { useEffect, useState } from "react";
import styles from "./translateScript.module.css";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import Footer from "../../components/common/mainFooter";
import { useLocation } from "react-router";
import DynamicTable from "../../components/common/Table";
import { BASE_URL } from "../../api/axios";
import { toast } from "react-toastify";
import FullScreenGradientLoader from "../../components/common/GradientLoader";

interface Scene {
  scene_no: number;
  script: string;
  ost: string;
  type: string;
}

interface SceneResponse {
  scenes: Scene[];
}

const TranslatedScript: React.FC = () => {
  const { state } = useLocation();
  const [pdfViewData, setPdfViewData] = useState<SceneResponse | null>(null);

const columns: string[] = ["Scene No.", "Script", "OST", "Type"];

  useEffect(() => {
    const fileUploadData = async () => {
      try {
        const fileId = state?.data?.file_id;
        const response = await fetch(`${BASE_URL}get-upload/${fileId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          toast.error("Something went wrong!");
          return;
        }

        const data = await response.json();

        // Set proper object, not array
        setPdfViewData({ scenes: data?.data?.scenes });
      } catch (error) {
        console.log(error);
      }
    };

    fileUploadData();
  }, [state?.data?.file_id]);

  return (
    <div className={styles.container}>
      <OneFrameHeader />

      <div className={styles.tableContainer}>
        {pdfViewData?.scenes?.length ? (
          <DynamicTable
            columns={columns}
            extraDetails={pdfViewData}
            showDragAndActions={false}
            pdfId={state?.data?.file_id}
          />
        ) : (
          <FullScreenGradientLoader text="Fetching details" />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default TranslatedScript;
