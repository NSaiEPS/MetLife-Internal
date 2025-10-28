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
  // const [openPopUp, setOpenPopup] = useState(false);
  // const [popUpData, setPopUpdata] = useState();
  // const [popupTitle, setPopupTitle] = useState("Add New Script");

  // dynamic actions (icons + handlers)
  // const actions = [
  //   { icon: <img src={copy} />, onClick: (row) => addScene(row) },
  //   {
  //     icon: <img src={reuse} />,
  //     onClick: (row) => alert(`Delete ${row["Scene No."]}`),
  //   },
  // ];

  // example add scene (demonstrates dynamic rows)
  // const addScene = (data) => {
  //   setPopUpdata(data);
  //   if (data && data.OST) {
  //     setPopupTitle("Edit Script");
  //   } else {
  //     setPopupTitle("Add New Script");
  //   }
  //   setOpenPopup(true);
  // };

  const handleDownloadScript = () => {
    try {
      downloadScriptPdf(sceneData);
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };
  const [sceneData, setSceneData] = useState({});
  console.log(sceneData?.scenes, "sceneData");
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
  // const handleUpdate = (data) => {
  //   // setSceneData({...sceneData,sceneData:})
  //   console.log(data, "check-data");
  //   // // // edit
  //   if (data?.id) {
  //     setSceneData((prev) => ({
  //       ...prev,
  //       scenes: prev.scenes.map((scene) =>
  //         scene.id === data.id ? data : scene
  //       ),
  //     }));
  //   } else {
  //     // adding new row
  //     const newScene = {
  //       id: Date.now(),
  //       "Scene No.": (sceneData.scenes?.length || 0) + 1,
  //       ...data,
  //     };

  //     setSceneData((prev) => ({
  //       ...prev,
  //       scenes: [...(prev.scenes || []), newScene],
  //     }));
  //   }

  //   showToast.success("Scene saved successfully");
  //   setOpenPopup(false);
  // };
  return (
    <div className={styles.container}>
      <OneFrameHeader />
      {/* <div className={styles.header}>
        <h2 className={styles.title}>Your Script</h2>
        <div className={styles.headerButtons}>
          <Button
            variant="outlined"
            className={styles.outlineBtn}
            onClick={() => addScene()}
          >
            + Add Scene
          </Button>
          <Button variant="contained" className={styles.primaryBtn}>
            Show Source
          </Button>
          <Button
            className={styles.icon}
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
      </div> */}

      <div className={styles.tableContainer}>
        {sceneData?.scenes?.length && !loading ? (
          <DynamicTable
            columns={columns}
            // data={sceneData?.scenes}
            // actions={actions}
            extraDetails={sceneData}
          />
        ) : (
          <NoDataMessage filter={false} loading={loading} />
        )}
      </div>
      {/* <AddNewScriptPopup
        open={openPopUp}
        onClose={() => setOpenPopup(false)}
        fieldData={popUpData}
        title={popupTitle}
        handleUpdate={handleUpdate}
      /> */}
      <Footer />
    </div>
  );
};

export default ScriptPage;
