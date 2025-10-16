import React, { useState, useMemo } from "react";
import styles from "./GenerateVisualPage.module.css";
import SceneCard from "../../components/common/sceneCard";
import RadioComp from "../../components/common/radio";
import ButtonComp from "../../components/common/Button";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import OneFrameHeader from "../../components/common/OneFrameHeader"

const initialScenes = [
  { id: 1, title: "Scene 01", text: "It’s a bright morning in the city. A boy is running to catch the bus." },
  { id: 2, title: "Scene 02", text: "He reaches the bus stop and meets a friend who shows him a secret map." },
  { id: 3, title: "Scene 03", text: "They decide to follow it and find a small hidden garden." },
];

const visualOptions = [
  { label: "Image", value: "image" },
  { label: "Footage", value: "footage" },
  { label: "Clip", value: "clip" },
];

const GenerateVisualsPage = () => {
  const [scenes, setScenes] = useState(initialScenes);
  const [selectedSceneId, setSelectedSceneId] = useState(scenes[0].id);
  const [selectedVisualType, setSelectedVisualType] = useState("image");

  // derived
  const selectedScene = useMemo(() => scenes.find(s => s.id === selectedSceneId) || scenes[0], [scenes, selectedSceneId]);

  // handlers
  const handleSelectScene = (id) => setSelectedSceneId(id);

  const handleAddScene = () => {
    const nextId = scenes.length ? Math.max(...scenes.map(s => s.id)) + 1 : 1;
    const newScene = { id: nextId, title: `Scene ${String(nextId).padStart(2, "0")}`, text: "New scene description..." };
    const updated = [...scenes, newScene];
    setScenes(updated);
    setSelectedSceneId(newScene.id);
  };

  const handleDeleteScene = (id) => {
    const updated = scenes.filter(s => s.id !== id);
    setScenes(updated);
    if (selectedSceneId === id && updated.length) setSelectedSceneId(updated[0].id);
  };

  const handleCopyScene = (id) => {
    const sceneToCopy = scenes.find(s => s.id === id);
    if (!sceneToCopy) return;
    const nextId = Math.max(...scenes.map(s => s.id)) + 1;
    const copy = { ...sceneToCopy, id: nextId, title: `Scene ${String(nextId).padStart(2, "0")}` };
    const idx = scenes.findIndex(s => s.id === id);
    const updated = [...scenes.slice(0, idx + 1), copy, ...scenes.slice(idx + 1)];
    setScenes(updated);
    setSelectedSceneId(copy.id);
  };

  const handleRegenerate = (id) => {
    // placeholder: just append " (regenerated)"
    setScenes(prev => prev.map(s => s.id === id ? { ...s, text: s.text + " (regenerated)" } : s));
  };

  const handleUpdateSceneText = (text) => {
    setScenes(prev => prev.map(s => s.id === selectedScene.id ? { ...s, text } : s));
  };

  const handleNext = () => {
    const idx = scenes.findIndex(s => s.id === selectedSceneId);
    if (idx < scenes.length - 1) setSelectedSceneId(scenes[idx + 1].id);
  };
  const handlePrev = () => {
    const idx = scenes.findIndex(s => s.id === selectedSceneId);
    if (idx > 0) setSelectedSceneId(scenes[idx - 1].id);
  };

  const handleGenerateVideo = () => {
    // wire up real API later. For now show console
    console.log("Generate video for scene:", selectedScene, "visualType:", selectedVisualType);
    alert(`Generate video for ${selectedScene.title} as ${selectedVisualType}`);
  };

  return (
 
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <OneFrameHeader />

      {/* content */}
      <main className={styles.container}>
        {/* left column */}
        <aside className={styles.left}>
          <div className={styles.leftHeader}>
            <h3>Your Script</h3>
            <ButtonComp label="Regenerate Entire Script"  sx={{ backgroundColor: "#938d8d12 ", "&:hover": { backgroundColor: "#938d8d12" } }} action={() => alert("Regenerate whole script")} />
          </div>

          <div className={styles.sceneList}>
            {scenes.map((scene, i) => (
              <SceneCard
                key={scene.id}
                scene={scene}
                index={i}
                active={scene.id === selectedSceneId}
                onSelect={handleSelectScene}
                onDelete={handleDeleteScene}
                onCopy={handleCopyScene}
                onRegenerate={handleRegenerate}
              />
            ))}
          </div>

          <div className={styles.addSceneWrap}>
            <ButtonComp
              label=" Add Scene"
              variant="contained"
              className={styles.addBtn}
              icon={<AddIcon />}
              action={handleAddScene}
            />
          </div>
        </aside>

        {/* right column */}
        <section className={styles.right}>
          <div className={styles.rightHeader}>
            <h3>Visuals for {selectedScene.title}</h3>
            <div className={styles.traversal}>
              <button className={styles.iconBtn} onClick={handlePrev} disabled={scenes.findIndex(s=>s.id===selectedSceneId)===0}>
                <ArrowBackIosNewIcon fontSize="small" />
              </button>
              <button className={styles.iconBtn} onClick={handleNext} disabled={scenes.findIndex(s=>s.id===selectedSceneId)===scenes.length-1}>
                <ArrowForwardIosIcon fontSize="small" />
              </button>
            </div>
          </div>

          <RadioComp options={visualOptions} value={selectedVisualType} onChange={setSelectedVisualType} />

          <div className={styles.section}>
            <label className={styles.label}>AI-generated prompt</label>
            <TextField
              multiline
              minRows={3}
              fullWidth
              variant="outlined"
              value={selectedScene.text}
              onChange={(e)=>handleUpdateSceneText(e.target.value)}
              className={styles.prompt}
            />
          </div>

          <div className={styles.section}>
            <label className={styles.label}>AI-generated Image</label>
            <div className={styles.imagePreview}>Image Preview Here</div>
          </div>

          <div className={styles.footerActions}>
            <ButtonComp
              label="Generate Video"
              variant="contained"
              className={styles.btnDark}
              action={handleGenerateVideo}
            />
          </div>
        </section>
      </main>
    </Box>
  );
};

export default GenerateVisualsPage;
