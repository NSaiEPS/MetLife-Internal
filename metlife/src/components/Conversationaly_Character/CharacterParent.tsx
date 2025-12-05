import React, { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { Character, CharacterPrompt } from "./Character";

// ---------- Types ----------
export interface CharacterType {
  name: string;
  role: string;
  prompt: string;
  img: string;
}

// ---------- Empty Character ----------
const emptyCharacter: CharacterType = {
  name: "",
  role: "",
  prompt: "",
  img: "",
};

const CharacterParent: React.FC = () => {
  const [characters, setCharacters] = useState<CharacterType[]>([emptyCharacter]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showSubmit, setShowSubmit] = useState<boolean>(false);

  // ---------- Validate characters ----------
  useEffect(() => {
    const hasValidCharacter = characters.some(
      (char) =>
        char.name.trim() &&
        char.role.trim() &&
        char.prompt.trim() &&
        char.img
    );

    setShowSubmit(hasValidCharacter);
  }, [characters]);

  // ---------- Open/Close Prompt ----------
  const openPrompt = (index: number) => setEditingIndex(index);
  const closePrompt = () => setEditingIndex(null);

  // ---------- Add New Character ----------
  const addCharacter = () => {
    setEditingIndex(characters.length);
  };

  // ---------- Update Character ----------
  const updateCharacter = (index: number, updatedData: CharacterType) => {
    if (index >= characters.length) {
      // Adding a new character
      setCharacters((prev) => [...prev, updatedData]);
    } else {
      // Editing an existing character
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
    const validCharacters = characters.filter(
      (char) =>
        char.name.trim() &&
        char.role.trim() &&
        char.prompt.trim() &&
        char.img
    );

    console.log("Final character list:", validCharacters);
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

        {/* 
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
        */}
      </Box>

      {/* CHARACTER PROMPT */}
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
