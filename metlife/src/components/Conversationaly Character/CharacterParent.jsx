import React, { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { Character, CharacterPrompt } from "./Character";

const emptyCharacter = { name: "", role: "", prompt: "", img: "" };

const CharacterParent = () => {
  const [characters, setCharacters] = useState([emptyCharacter]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showSubmit, setShowSubmit] = useState(false);

  // Validate characters to show/hide submit button
  useEffect(() => {
    const hasValidCharacter = characters.some(
      (char) =>
        char.name.trim() && char.role.trim() && char.prompt.trim() && char.img
    );
    setShowSubmit(hasValidCharacter);
  }, [characters]);

  const openPrompt = (index) => setEditingIndex(index);
  const closePrompt = () => setEditingIndex(null);

  const addCharacter = () => {
    // Only open prompt for new character, don't add empty character yet
    setEditingIndex(characters.length);
  };

  const updateCharacter = (index, updatedData) => {
    if (index >= characters.length) {
      // This is a new character being added
      setCharacters((prev) => [...prev, updatedData]);
    } else {
      // This is an existing character being edited
      setCharacters((prev) =>
        prev.map((item, i) => (i === index ? updatedData : item))
      );
    }
  };

  const deleteCharacter = (index) => {
    if (characters.length === 1) {
      // Reset to empty if deleting the only character
      setCharacters([emptyCharacter]);
    } else {
      setCharacters((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = () => {
    // Filter out any empty characters before submitting
    const validCharacters = characters.filter(
      (char) =>
        char.name.trim() && char.role.trim() && char.prompt.trim() && char.img
    );
    console.log("Final character list:", validCharacters);
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {/* CHARACTER CARDS - Only show non-empty characters */}
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
