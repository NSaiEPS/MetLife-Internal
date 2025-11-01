import React, { useEffect, useState } from "react";
import styles from "./translateScript.module.css";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import Footer from "../../components/common/mainFooter";
import { NoDataMessage } from "../../components/common/NoDataMessage";
import { useLocation } from "react-router";
import DynamicTable from "../../components/common/Table";
import { BASE_URL } from "../../api/axios";
import PopupModal from "../../components/popUps/LanguagePopup";
import ButtonComp from "../../components/common/Buton/Button";
import { toast } from "react-toastify";
import FullScreenGradientLoader from "../../components/common/GradientLoader";

const TranslatedScript = () => {

  const { state } = useLocation();
  const [pdfViewData, setPdfViewData] = useState([]);
  const [columns] = useState(["Scene No.", "Script", "OST", "Type"]);

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
        if (response.status !== 200) {
          toast.error("Something went wrong!");
          return;
        }
        const data = await response.json();
        console.log(data?.data?.scenes, "response_data_check");
        setPdfViewData(data?.data?.scenes[0]);
      } catch (error) {
        console.log(error);
      }
    };

    fileUploadData();
  }, [state?.data?.file_id]);

  console.log(pdfViewData, "pdfViewData");

  return (
    <>
      <div className={styles.container}>
        
        <OneFrameHeader />
        <div className={styles.tableContainer}>
          {pdfViewData?.scenes?.length > 0 ? (
            <>
              <DynamicTable
                columns={columns}
                // data={data}
                // actions={actions}
                extraDetails={pdfViewData}
                showDragAndActions={false}
                pdfId={state?.data?.file_id}
              />
            </>
          ) : (
            <FullScreenGradientLoader  text="Fetching details" />
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default TranslatedScript;
