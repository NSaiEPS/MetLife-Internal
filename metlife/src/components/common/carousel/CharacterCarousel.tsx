import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Skeleton,
  IconButton,
  TextField,
} from "@mui/material";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import {
  patchEditPromp,
  postRegenerateCharacterImages,
} from "../../../redux/features/scriptSlice";
import { postCreateVisualContent } from "../../../redux/features/createVisualSlice";
import ButtonComp from "../Buton/Button";
import { RiUploadCloud2Line } from "react-icons/ri";
import reuse from "../../../assets/reuse.svg";
import RegenerateCharacterImagesPopup from "../../popUps/RegenerateCharacterImagesPopup";
export const CharacterCarousel = ({
  open,
  onClose,
  promptData,
  characterData = [],
  currentIndex,
  setCurrentIndex,
  onGenerateImages,
  tableExtraData,
  setOpenFlowDialog,
}) => {
  console.log(characterData, "characterData");
  const current =
    characterData[currentIndex] ||
    characterData[currentIndex]?.image_url ||
    characterData?.image_url;
  console.log(current, "checkCurrent");
  // const [stage, setStage] = useState<"prompt" | "images">("prompt");
  const [stage, setStage] = useState<"prompt" | "images">(
    tableExtraData?.char_image_exist ? "images" : "prompt",
  );
  const [prompts, setPrompts] = useState<Record<string, string>>({});
  const [imgLoaded, setImgLoaded] = useState(false);
  const { scriptLoader } = useSelector((store) => store.Script);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [regenerateOpen, setRegenerateOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!open) return;

    if (tableExtraData?.char_image_exist) {
      setStage("images");
    } else {
      setStage("prompt");
    }
  }, [open, tableExtraData?.char_image_exist]);

  useEffect(() => {
    if (open && promptData?.length && !tableExtraData?.char_image_exist) {
      const initialPrompts: Record<string, string> = {};

      promptData.forEach((char) => {
        initialPrompts[char.character_name] = char.prompt || "";
      });
      setPrompts(initialPrompts);
    }
  }, [open, promptData, !tableExtraData?.char_image_exist]);

  useEffect(() => {
  setImgLoaded(false);
}, [current?.image_url]);

  const handleApprove = () => {
    onGenerateImages();
    setStage("images");
    setOpenFlowDialog(true);
  };

  const handleEditPrompt = (characterName: string, character_id: string) => {
    const updatedPrompt = prompts[characterName];
    dispatch(patchEditPromp(id, character_id, characterName, updatedPrompt));
  };

  const handleCreateVisualContent = () => {
    if (tableExtraData?.video_style === "mixed" && promptData?.length > 0) {
      onClose(true);
    } else {
      dispatch(postCreateVisualContent(tableExtraData));
    }
  };

  const handleRegenerateCharacterImage = (characterName: string) => {
    console.log(characterName, "charcaterName");
    setSelectedCharacter(characterName);
    setRegenerateOpen(true);
    // dispatch(postRegenerateCharacterImages(id, characterName));
  };

  const handleSubmitRegenerate = () => {
    if (!selectedCharacter) return;

    dispatch(postRegenerateCharacterImages(id, selectedCharacter, feedback));
    setRegenerateOpen(false);
    setFeedback("");
    setSelectedCharacter(null);
  };

  console.log(characterData[currentIndex] ,"checkkk")

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            width: "80%",
            maxWidth: 600,
            // height: "60%",
            maxHeight: "70vh",
            margin: "auto",
            marginTop: "5%",
            background: "white",
            borderRadius: 2,
            p: 3,
            outline: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            position: "relative",
            overflowY: "scroll !important",
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "#000",
              background: "#e0e0e0",
              "&:hover": { background: "#e0e0e0" },
            }}
          >
            <IoCloseCircleOutline />
          </IconButton>

          {stage === "prompt" ? (
            <>
              <Typography variant="h6">Prompts</Typography>

              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  maxHeight: "30rem",
                  overflowY: "scroll",
                }}
              >
                {promptData?.length &&
                  promptData.map((char) => (
                    <Box
                      key={char.character_name}
                      sx={{
                        border: "1px solid #E5E7EB",
                        borderRadius: 2,
                        p: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Typography fontWeight={600}>
                          {char.character_name}
                        </Typography>

                        <ButtonComp
                          size="small"
                          variant="outlined"
                          colorType="secondary"
                          disabled={
                            scriptLoader ||
                            prompts[char.character_name] === char.prompt
                          }
                          onClick={() =>
                            handleEditPrompt(
                              char.character_name,
                              char.character_id,
                            )
                          }
                        >
                          Edit
                        </ButtonComp>
                      </Box>
                      {/* <Typography fontWeight={600} mb={1}>
                      {char.character_name}
                    </Typography> */}

                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        placeholder={`Describe ${char.character_name}'s appearance, style, personality...`}
                        value={prompts[char.character_name] || ""}
                        onChange={(e) =>
                          setPrompts((prev) => ({
                            ...prev,
                            [char.character_name]: e.target.value,
                          }))
                        }
                      />
                    </Box>
                  ))}
              </Box>

              <ButtonComp
                variant="contained"
                sx={{
                  mt: 2,
                }}
                disabled={
                  scriptLoader ||
                  Object.values(prompts).some((p) => !p.trim()) ||
                  tableExtraData?.char_image_exist
                }
                onClick={handleApprove}
              >
                {scriptLoader ? "Generating..." : "Approve & Generate"}
              </ButtonComp>
            </>
          ) : (
            <>
              {!imgLoaded && (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={350}
                  animation="wave"
                  sx={{ borderRadius: "10px" }}
                />
              )}
              {/* IMAGE */}
              <img
                // src={characterData[currentIndex]?.image_url}
                src={current?.image_url || current || "Loading..."}
                onLoad={() => setImgLoaded(true)}
                alt="character"
                style={{
                  width: "100%",
                  height: "auto",
                  // maxHeight: "60vh",
                  height: imgLoaded ? "auto" : 0,
                  borderRadius: "10px",
                  objectFit: "contain",
                  transition: "opacity 0.3s ease",
                  opacity: imgLoaded ? 1 : 0,
                }}
              />

              {/* NAME */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ textTransform: "capitalize", textAlign: "center" }}
                >
                  {characterData[currentIndex]?.character_name || characterData?.character_name}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    textTransform: "capitalize",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleRegenerateCharacterImage(
                      characterData[currentIndex]?.character_name,
                    )
                  }
                >
                  <img src={reuse} alt="regenerate" />
                </Typography>
              </Box>

              {/* BUTTON CONTROLS */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <ButtonComp
                  variant="contained"
                  disabled={currentIndex === 0}
                  // onClick={() => setCurrentIndex((i) => i - 1)}
                  onClick={() => {
                    setImgLoaded(false);
                    setCurrentIndex((i) => i - 1);
                  }}
                >
                  Previous
                </ButtonComp>

                <ButtonComp
                  variant="contained"
                  disabled={currentIndex === characterData.length - 1}
                  // onClick={() => setCurrentIndex((i) => i + 1)}
                  onClick={() => {
                    setImgLoaded(false);
                    setCurrentIndex((i) => i + 1);
                  }}
                >
                  Next
                </ButtonComp>
              </Box>
              <Box
                onClick={handleCreateVisualContent}
                sx={{
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "center",
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                  transition: "0.2s",
                  "&:hover": {
                    boxShadow: 3,
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Typography fontWeight={500}>Create Visual Content</Typography>
              </Box>
            </>
          )}
        </Box>
      </Modal>
      <RegenerateCharacterImagesPopup
        open={regenerateOpen}
        feedback={feedback}
        // onClose={() => setRegenerateOpen(false)}
        onClose={() => {
          setRegenerateOpen(false);
          setFeedback("");
        }}
        onChangeFeedback={setFeedback}
        onSubmit={handleSubmitRegenerate}
      />
    </>
  );
};
