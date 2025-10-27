import React, { useState } from "react";
import { Button, Stack } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DynamicTable from "../../components/common/Table";
import styles from "./AddNewScript.module.css";
import OneFrameHeader from "../../components/common/OneFrameHeader"
import { useNavigate } from "react-router";
import Footer from '../../components/common/mainFooter'
import copy from '../../assets/copy.svg'
import reuse from "../../assets/reuse.svg"
import AddNewScriptPopup from '../../components/popUps/addScripts'
import {downloadScriptPdf} from '../../utils/index'
import {Scriptdata} from '../../../script'

const ScriptPage = () => {
  // dynamic columns & rows
  const [columns] = useState(["Scene No.", "Script", "OST", "Type"]);
  const [openPopUp , setOpenPopup]  = useState(false)
  const [popUpData , setPopUpdata] = useState()
  const [popupTitle , setPopupTitle] = useState("Add New Script")
  const [data, setData] = useState([
    { "Scene No.": "01", Script: "Create a 90-second explainer", OST: "Ambience", Type: "Narration" },
    { "Scene No.": "02", Script: "Explain photosynthesis", OST: "Soft piano", Type: "Monologue" },
    { "Scene No.": "03", Script: "Show product features", OST: "Uplifting", Type: "Demo" },
    { "Scene No.": "03", Script: "Show product features", OST: "Uplifting", Type: "Demo" }
  ]);

  // dynamic actions (icons + handlers)
  const actions = [
    { icon: <img src={copy}/>, onClick: (row) =>(addScene(row) ) , },
    { icon: <img src = {reuse}/>, onClick: (row) => alert(`Delete ${row["Scene No."]}`) }
  ];

  // example add scene (demonstrates dynamic rows)
 const addScene = (data) => {
  setPopUpdata(data || {}); 
  if(data && data.OST){
    setPopupTitle("Edit Script")
  }
  else{
    setPopupTitle("Add New Script")
  }
  setOpenPopup(true);    
};

const handleDownloadScript = () => {
  try {
    downloadScriptPdf(Scriptdata);
  } catch (err) {
    console.error("Error generating PDF:", err);
  }
};

;

  return (
    <div className={styles.container}>
      <OneFrameHeader/>
      <div className={styles.header}>
        <h2 className={styles.title}>Your Script</h2>
        <div className={styles.headerButtons}>
          <Button variant="outlined" className={styles.outlineBtn} onClick={addScene}>+ Add Scene</Button>
          <Button variant="contained" className={styles.primaryBtn}>Show Source</Button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <DynamicTable columns={columns} data={data} actions={actions} />
      </div>

      <div className={styles.footerButtons}>
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" className={styles.stack}>
          <Button variant="outlined" className={styles.largeOutline}>Regenerate Script</Button>
          <Button variant="contained" className={styles.successBtn} onClick={handleDownloadScript}>Download Script</Button>
          <Button variant="contained" className={styles.primaryBtn}>Create Visual Content</Button>
        </Stack>
      <AddNewScriptPopup open={openPopUp} onClose={() => setOpenPopup(false)} fieldData ={popUpData}  title ={popupTitle}/>

      </div>
      <Footer/>
    </div>
  );
};

export default ScriptPage;
