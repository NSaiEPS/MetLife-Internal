import React, { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { Character, CharacterPrompt } from "./Character";

// ---------- Types ----------
export type InputType = "prompt" | "image";

export interface CharacterType {
  name: string;
  role: string;
  prompt: string;
  img: string;
  inputType: InputType;
}

// ---------- Empty Character ----------
const emptyCharacter: CharacterType = {
  name: "",
  role: "",
  prompt: "",
  img: "",
  inputType: "prompt",
};

const CharacterParent: React.FC = ({
  setCharacters,characters
}) => {


  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showSubmit, setShowSubmit] = useState<boolean>(false);
  // ---------- Validate Characters ----------
  useEffect(() => {
    const hasValidCharacter = characters.some((char) => {
      const hasBasicInfo = char.name.trim() && char.role.trim();
      const hasValidInput =
        char.inputType === "prompt" ? char.prompt.trim() : char.img;

      return Boolean(hasBasicInfo && hasValidInput);
    });

    setShowSubmit(hasValidCharacter);
  }, [characters]);

  // ---------- Open / Close Prompt ----------
  const openPrompt = (index: number) => setEditingIndex(index);
  const closePrompt = () => setEditingIndex(null);

  // ---------- Add New Character ----------
  const addCharacter = () => {
    // Only open prompt, don't push empty object yet
    setEditingIndex(characters.length);
  };

  // ---------- Update Character ----------
  const updateCharacter = (index: number, updatedData: CharacterType) => {
    if (index >= characters.length) {
      // New character
      setCharacters((prev) => [...prev, updatedData]);
    } else {
      // Existing character edit
      setCharacters((prev) =>
        prev.map((item, i) => (i === index ? updatedData : item))
      );
    }
  };

  // ---------- Delete Character ----------
  const deleteCharacter = (index: number) => {
    if (characters.length === 1) {
      setCharacters([emptyCharacter]);
    } else {
      setCharacters((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // ---------- Submit ----------
  const handleSubmit = () => {
    const validCharacters = characters.filter((char) => {
      const hasBasicInfo = char.name.trim() && char.role.trim();
      const hasValidInput =
        char.inputType === "prompt" ? char.prompt.trim() : char.img;

      return Boolean(hasBasicInfo && hasValidInput);
    });
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {/* CHARACTER CARDS */}
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

      {/* BUTTONS */}
      <Box display="flex" justifyContent="space-between" gap={5} mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={addCharacter}
          sx={{ px: 3, py: 1, fontSize: "14px" }}
        >
          Add Character
        </Button>

        {showSubmit && (
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            sx={{ px: 3, py: 1, fontSize: "14px" }}
          >
            Submit
          </Button>
        )}
      </Box>

      {/* CHARACTER PROMPT MODAL */}
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
