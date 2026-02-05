import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { toast } from "react-toastify";

import styles from "./translateScript.module.css";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import Footer from "../../components/common/mainFooter";
import DynamicTable from "../../components/common/Table";
import FullScreenGradientLoader from "../../components/common/GradientLoader";
import { BASE_URL } from "../../api/axios";
import { NoDataMessage } from "../../components/common/NoDataMessage";
import { useDispatch, useSelector } from "react-redux";
import { getLocalizationImageUrl } from "../../redux/features/scriptSlice";

// ---------- Types ----------
interface SceneItem {
  Script?: string;
  description?: string;
  header?: string;
  on_screen_text?: string;
  OST?: string;
  Type?: string;
  scene_type?: string;
}

interface PdfViewData {
  scenes: SceneItem[];
  [key: string]: any; // for any extra properties from API
}

// interface LocationState {
//   state?: {
//     data?: {
//       file_id?: string | number;
//     };
//   };
// }

// ---------- Component ----------
const TranslatedScript: React.FC = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  console.log(state, "check_state");

  const [pdfViewData, setPdfViewData] = useState<PdfViewData | null>(null);
  const [columns] = useState<string[]>(["Scene No.", "Script", "OST", "Type"]);
  const { localizationImageData } = useSelector((store) => store.Script);

  console.log(localizationImageData, "check_this");

  useEffect(() => {
    const fileUploadData = async () => {
      try {
        const fileId = state?.data?.file_id;
        if (!fileId) return;

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

        const result = await response.json();

        // Expecting result.data to contain the object with scenes array
        if (result?.data) {
          setPdfViewData(result.data);
        }
      } catch (error) {
        // console.error(error);
        toast.error("Failed to fetch data");
      }
    };

    fileUploadData();
  }, [state?.data?.file_id]);

  useEffect(() => {
    if (state) {
      dispatch(getLocalizationImageUrl(state));
    }
  }, []);

  return (
    <div className={styles.container}>
      <OneFrameHeader />
      {pdfViewData?.scenes?.length && (
        <FullScreenGradientLoader text="Fetching details" />
      )}

      <div className={styles.tableContainer}>
        {pdfViewData?.scenes?.length ? (
          <DynamicTable
            columns={columns}
            extraDetails={pdfViewData}
            showDragAndActions={false}
            pdfId={state?.data?.file_id}
          />
        ) : localizationImageData?.scenes?.length > 0 ? (
          <>
            <DynamicTable
              columns={columns}
              extraDetails={localizationImageData}
              showDragAndActions={false}
              // pdfId={state?.data?.file_id}
            />
          </>
        ) : (
          // <FullScreenGradientLoader text="Fetching details" />
          <NoDataMessage />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default TranslatedScript;
