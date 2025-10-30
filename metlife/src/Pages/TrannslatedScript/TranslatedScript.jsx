import React, { useState } from "react";
import styles from "./translateScript.module.css";
import OneFrameHeader from "../../components/common/OneFrameHeader";
import Footer from "../../components/common/mainFooter";
import { NoDataMessage } from "../../components/common/NoDataMessage";
import { useLocation } from "react-router";
import DynamicTable from "../../components/common/Table";

const TranslatedScript = () => {
  //   const [loading, setLoading] = useState(false);
  const { state } = useLocation();
  const translatedData = state?.data;
  console.log(state?.data?.scenes, "check-data");
  const [columns] = useState(["Scene No.", "Script", "OST", "Type"]);

  return (
    <>
      <div className={styles.container}>
        <OneFrameHeader />
        <div className={styles.tableContainer}>
          {translatedData?.scenes?.length > 0 ? (
            <DynamicTable
              columns={columns}
              // data={translatedData}
              // actions={actions}
              extraDetails={translatedData}
              showDragAndActions={false}
            />
          ) : (
            <NoDataMessage filter={false} />
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default TranslatedScript;
