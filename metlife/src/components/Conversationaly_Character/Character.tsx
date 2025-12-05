import {
  Box,
  Typography,
  IconButton,
  Avatar,
  TextField,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState, useRef } from "react";
import { showToast } from "../../utils/toast";

// =========================
// Types
// =========================

export interface CharacterData {
  name: string;
  role: string;
  prompt?: string;
  img?: string;
}

interface CharacterProps {
  index: number;
  data: CharacterData;
  onEdit: () => void;
  onDelete: (index: number) => void;
  total: number;
  isEmpty?: boolean;
}

interface CharacterPromptProps {
  index: number;
  data: CharacterData;
  updateCharacter: (index: number, updated: CharacterData) => void;
  closePrompt: () => void;
}

interface ErrorState {
  name?: boolean;
  role?: boolean;
  img?: boolean;
  prompt?: boolean;
}

// =========================
// Character Component
// =========================

export const Character: React.FC<CharacterProps> = ({
  index,
  data,
  onEdit,
  onDelete,
  total,
  isEmpty = false,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "center",
        padding: 2,
        borderRadius: 2,
        border: "1px solid #ddd",
        backgroundColor: isEmpty ? "#f5f5f5" : "white",
        opacity: isEmpty ? 0.8 : 1,
      }}
    >
      <Avatar
        src={data.img}
        sx={{
          width: 60,
          height: 60,
          border: isEmpty ? "2px dashed #ccc" : "none",
        }}
      >
        {!data.img && "?"}
      </Avatar>

      <Box flex={1}>
        <Typography fontWeight={600}>
          {data.name
            ? data.name.length > 20
              ? `${data.name.slice(0, 20)}...`
              : data.name
            : "Please enter details"}
        </Typography>

        <Typography
          fontSize={14}
          color={data.role ? "text.primary" : "text.secondary"}
        >
          {data.role
            ? data.role.length > 20
              ? `${data.role.slice(0, 20)}...`
              : data.role
            : "No role specified"}
        </Typography>
      </Box>

      <IconButton onClick={onEdit}>
        <EditIcon />
      </IconButton>

      {total > 1 && (
        <IconButton onClick={() => onDelete(index)} color="error">
          <DeleteIcon />
        </IconButton>
      )}
    </Box>
  );
};

// =========================
// CharacterPrompt Component
// =========================

export const CharacterPrompt: React.FC<CharacterPromptProps> = ({
  index,
  data,
  updateCharacter,
  closePrompt,
}) => {
  const [form, setForm] = useState<CharacterData>(data);
  const [preview, setPreview] = useState<string>(data.img || "");
  const [errors, setErrors] = useState<ErrorState>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // -------------------------
  // Validation
  // -------------------------

  const validate = () => {
    const err: ErrorState = {
      name: !form.name.trim(),
      role: !form.role.trim(),
    };

    if (!form.prompt && !form.img) {
      showToast.error("Image or Prompt is mandatory!");
      err.img = true;
      err.prompt = true;
    }

    setErrors(err);
    return !Object.values(err).some(Boolean);
  };

  const handleSave = () => {
    if (!validate()) return;
    updateCharacter(index, form);
    closePrompt();
  };

  // -------------------------
  // Image Selection
  // -------------------------

  const handleImgSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview(url);
    setForm({ ...form, img: url });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // -------------------------
  // JSX
  // -------------------------

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#00000050",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <Box
        sx={{
          padding: 4,
          width: 460,
          background: "white",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* IMAGE UPLOAD */}
        <Box sx={{ position: "relative", width: "fit-content", mx: "auto" }}>
          <Avatar
            src={preview}
            sx={{
              width: 80,
              height: 80,
              border: errors.img ? "2px solid #d32f2f" : "none",
            }}
          />

          <IconButton
            onClick={triggerFileInput}
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: "white",
              border: "1px solid #ccc",
              width: 28,
              height: 28,
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
          >
            <EditIcon sx={{ fontSize: 16 }} />
          </IconButton>

          <input
            type="file"
            ref={fileInputRef}
            hidden
            accept="image/*"
            onChange={handleImgSelect}
          />
        </Box>

        {errors.img && (
          <Box
            sx={{
              color: "#d32f2f",
              fontSize: "0.75rem",
              textAlign: "center",
              mt: -2,
            }}
          >
            Image is required
          </Box>
        )}

        {/* NAME */}
        <TextField
          label="Character Name"
          value={form.name}
          error={!!errors.name}
          helperText={errors.name && "Required"}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* ROLE */}
        <TextField
          label="Character Role"
          value={form.role}
          error={!!errors.role}
          helperText={errors.role && "Required"}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        />

        {/* PROMPT */}
        <TextField
          label="Character Prompt"
          multiline
          rows={3}
          value={form.prompt}
          error={!!errors.prompt}
          helperText={errors.prompt && "Required (Image or Prompt required)"}
          onChange={(e) => setForm({ ...form, prompt: e.target.value })}
        />

        {/* ACTIONS */}
        <Box display="flex" justifyContent="space-between">
          <Button variant="outlined" color="error" onClick={closePrompt}>
            Cancel
          </Button>

          <Button variant="contained" color="success" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
