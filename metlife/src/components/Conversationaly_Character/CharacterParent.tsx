import React, { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";

import { CharacterPrompt, Character } from "./Character";
import {
  emptyCharacter,
  type CharacterType,
} from "../../Pages/GenerateScipt/GenerateScript";

/* ================= TYPES ================= */

export type InputType = "prompt" | "image";

/* ================= COMPONENT ================= */

const CharacterParent: React.FC = ({ setCharacters, characters }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showSubmit, setShowSubmit] = useState<boolean>(false);

  const hasPromptData = (char: CharacterType) => {
    return Boolean(
      char.age ||
        char.gender ||
        char.skin_tone ||
        char.hair ||
        char.face ||
        char.build ||
        char.wardrobe ||
        char.accessories ||
        char.personality ||
        char.origin
    );
  };

  /* ================= HANDLERS ================= */

  const openPrompt = (index: number) => setEditingIndex(index);
  const closePrompt = () => setEditingIndex(null);

  const addCharacter = () => {
    setEditingIndex(characters.length);
  };

  const updateCharacter = (index: number, updatedData: CharacterType) => {
    if (index >= characters.length) {
      setCharacters((prev) => [...prev, updatedData]);
    } else {
      setCharacters((prev) =>
        prev.map((item, i) => (i === index ? updatedData : item))
      );
    }
  };

  const deleteCharacter = (index: number) => {
    if (characters.length === 1) {
      setCharacters([emptyCharacter]);
    } else {
      setCharacters((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = () => {
    const validCharacters = characters.filter((char) => {
      const hasBasicInfo = char.name.trim() && char.role.trim();
      const hasValidInput =
        char.inputType === "image" ? !!char.img : hasPromptData(char);

      return Boolean(hasBasicInfo && hasValidInput);
    });

    console.log("Final character list:", validCharacters);
  };

  /* ================= EFFECT ================= */

  useEffect(() => {
    const hasValidCharacter = characters.some((char) => {
      const hasBasicInfo = char.name.trim() !== "" && char.role.trim() !== "";

      const hasValidInput =
        char.inputType === "image" ? !!char.img : hasPromptData(char);

      return hasBasicInfo && hasValidInput;
    });

    setShowSubmit(hasValidCharacter);
  }, [characters]);

  /* ================= RENDER ================= */

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {characters.map((char, index) => (
        <Character
          key={index}
          index={index}
          data={char}
          onEdit={() => openPrompt(index)}
          onDelete={deleteCharacter}
          total={characters.length}
          isEmpty={!char.name && !char.role && !char.prompt && !char.img}
        />
      ))}

      <Box display="flex" justifyContent="space-between" gap={5} mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={addCharacter}
          sx={{ px: 3, py: 1, fontSize: "14px" }}
        >
          Add Character
        </Button>

        {/* {showSubmit && (
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            sx={{ px: 3, py: 1, fontSize: "14px" }}
          >
            Submit
          </Button>
        )} */}
      </Box>

      {editingIndex !== null && (
        <CharacterPrompt
          index={editingIndex}
          data={characters[editingIndex] || emptyCharacter}
          closePrompt={closePrompt}
          updateCharacter={updateCharacter}
        />
      )}
    </Box>
  );
};

export default CharacterParent;
