import {
  Box,
  Typography,
  IconButton,
  Avatar,
  AccordionSummary,
  AccordionDetails,
  Accordion,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// =========================
// Types
// =========================

export type InputType = "prompt" | "image" | "search";
// export type InputType = "prompt" | "image" ;


export interface CharacterData {
  name: string;
  role: string;
  prompt?: string;
  img?: string;
  inputType: InputType;
}

interface CharacterProps {
  index: number;
  data: CharacterData;
  onEdit: () => void;
  onDelete: (index: number) => void;
  total: number;
  isEmpty?: boolean;
}

// =========================
// Component
// =========================

const characters = [
  {
    id: 1,
    name: "John Carter",
    age: 28,
    role: "Sales Executive",
    ethnicity: "Asian",
    avatar: "/images/avatar1.png",
  },
];

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
      {data.img && (
        <Avatar
          variant="square"
          src={data.img}
          sx={{ width: 60, height: 60 }}
        />
      )}

      <Box flex={1}>
        <Typography fontWeight={600}>
          {data.name
            ? data.name.length > 20
              ? `${data.name.slice(0, 20)}...`
              : data.name
            : "Please enter character details"}
        </Typography>

        <Typography
          fontSize={14}
          color={data.role ? "text.primary" : "text.secondary"}
        >
          {data.role
            ? data.role.length > 20
              ? `${data.role.slice(0, 20)}...`
              : data.role
            : ""}
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
import { useState, useRef } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Modal,
  Paper,
} from "@mui/material";
import type { CharacterType } from "../../utils/types";
import ButtonComp from "../common/Buton/Button";
import { useDispatch, useSelector } from "react-redux";
import { postTranslatedDataSave } from "../../redux/features/saveSlice";
import { useLocation, useNavigate } from "react-router";
import AvailableCharacters from "../Available Characters/AvailableCharacters";
import { getCharactersList } from "../../redux/features/scriptSlice";

/* ================= TYPES ================= */

type ErrorState = Partial<Record<keyof CharacterType, boolean>>;

interface CharacterPromptProps {
  index: number;
  data: CharacterType;
  updateCharacter: (index: number, data: CharacterType) => void;
  closePrompt: () => void;
}

const GENDER_OPTIONS = ["Male", "Female", "Other"] as const;

/* ================= COMPONENT ================= */

export const CharacterPrompt: React.FC<CharacterPromptProps> = ({
  index,
  data,
  updateCharacter,
  closePrompt,
  pdfData,
  onSave,
  totalCharacters,
}) => {
  const [form, setForm] = useState<CharacterType>(data);
  const [preview, setPreview] = useState<string>(data.img || "");
  const [errors, setErrors] = useState<ErrorState>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [collectedCharacters, setCollectedCharacters] = useState<any[]>([]);
  const [characterData, setCharacterData] = useState(null);
  const { charactersListData } = useSelector((state) => state?.Script);
  /* ================= VALIDATION ================= */


  useEffect(() => {
  if (pathname === "/translated-script" && pdfData?.characters?.[index]) {
    setForm((prev) => ({
      ...prev,
      name: pdfData.characters[index],
    }));
  }
}, [pathname, index, pdfData]);

  const validate = (): boolean => {
    const err: ErrorState = {
      name: !form.name.trim(),
      role: !form.role.trim(),
    };

    if (form.inputType === "prompt") {
      Object.assign(err, {
        age: !Number(form.age),
        gender: !form.gender.trim(),
        skin_tone: !form.skin_tone.trim(),
        hair: !form.hair.trim(),
        face: !form.face.trim(),
        build: !form.build.trim(),
        wardrobe: !form.wardrobe.trim(),
        accessories: !form.accessories.trim(),
        personality: !form.personality.trim(),
        origin: !form.origin.trim(),
      });
    } else {
      err.img = !form.img;
    }

    if (form.inputType === "image") {
      Object.assign(err, {
        file: !form.img,
      });
    }

    setErrors(err);
    return !Object.values(err).some(Boolean);
  };

  /* ================= HANDLERS ================= */

  const handleSave = () => {
    if (pathname === "/generate-script" && (form.inputType === "image" || form.inputType === "prompt") ) {
      if (!validate()) return;
      console.log("hit");
      updateCharacter(index, form);
      closePrompt();
    }

    if (pathname === "/generate-script" && form.inputType === "search") {
      console.log(form, index, characterData, "form_check");
      updateCharacter(index, form);
      // updateCharacter(index, characterData);

      closePrompt();
    }

    if (pathname === "/translated-script") {
      if (!validate()) return;
      onSave(index, form);
    }
  };

  const handleImgSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    // setForm({ ...form, img: URL.createObjectURL(file) });
    setForm({
      ...form,
      img: file,
    });
  };

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  console.log(characterData, "characterDataCheck");

  /* ================= RENDER ================= */

  return (
    <>
      <Modal open>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "60%",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" mb={2}>
              Generate Characters
            </Typography>

            {/* INPUT TYPE */}
            <Box my={2}>
              <FormControl fullWidth>
                <InputLabel>Input Type</InputLabel>
                <Select
                  value={form.inputType}
                  label="Input Type"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      inputType: e.target.value as InputType,
                      img: "",
                    })
                  }
                >
                  <MenuItem value="prompt">Generate</MenuItem>
                  <MenuItem value="image">Upload</MenuItem>
                  {/* <MenuItem value="search">Search</MenuItem> */}
                </Select>
              </FormControl>
            </Box>

            {/* NAME & ROLE */}
            {(form.inputType === "prompt" || form.inputType === "image") && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 2,
                  mt: 3,
                }}
              >
                {(
                  [
                    ["Name", "name"],
                    ["Role", "role"],
                  ] as Array<[string, keyof CharacterType]>
                ).map(([label, key]) => (
                  <TextField
                    key={key}
                    fullWidth
                    label={label}
                    value={form[key]}
                    disabled={pathname === "/translated-script" && key === "name"} 
                    error={!!errors[key]}
                    helperText={errors[key] && "Required"}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />
                ))}
              </Box>
            )}

            {/* INPUT TYPE: PROMPT */}
            {form.inputType === "prompt" && (
              <Box mt={4}>
                {/* BASIC INFO */}
                <Accordion
                  sx={{ mb: 2, boxShadow: "none", background: "aliceblue" }}
                  expanded={expanded === "basic"}
                  onChange={handleChange("basic")}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle2" sx={{ fontSize: "16px" }}>
                      Basic Info
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: 2,
                        mb: 3,
                        background: "#fff",
                        padding: "16px",
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Age"
                        type="number"
                        value={form.age}
                        error={!!errors.age}
                        helperText={errors.age && "Required"}
                        inputProps={{ min: 18, max: 120 }}
                        onChange={(e) =>
                          setForm({ ...form, age: Number(e.target.value) })
                        }
                      />

                      <FormControl fullWidth error={!!errors.gender}>
                        <InputLabel>Gender</InputLabel>
                        <Select
                          label="Gender"
                          value={form.gender}
                          onChange={(e) =>
                            setForm({ ...form, gender: e.target.value })
                          }
                        >
                          {GENDER_OPTIONS.map((g) => (
                            <MenuItem key={g} value={g}>
                              {g}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.gender && (
                          <Typography fontSize={12} color="error">
                            Required
                          </Typography>
                        )}
                      </FormControl>
                    </Box>
                  </AccordionDetails>
                </Accordion>

                {/* APPEARANCE */}
                <Accordion
                  sx={{
                    mb: 2,
                    boxShadow: "none",
                    border: "none",
                    background: "aliceblue",
                    "&:before": {
                      display: "none",
                    },
                  }}
                  expanded={expanded === "appearance"}
                  onChange={handleChange("appearance")}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography
                      sx={{
                        fontSize: "16px",
                      }}
                      variant="subtitle2"
                    >
                      Appearance
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: 2,
                        mb: 3,
                        background: "#fff",
                        padding: "16px",
                      }}
                    >
                      {(
                        [
                          ["Skin Tone", "skin_tone"],
                          ["Hair", "hair"],
                          ["Face", "face"],
                          ["Build", "build"],
                        ] as Array<[string, keyof CharacterType]>
                      ).map(([label, key]) => (
                        <TextField
                          key={key}
                          fullWidth
                          label={label}
                          value={form[key]}
                          error={!!errors[key]}
                          helperText={errors[key] && "Required"}
                          onChange={(e) =>
                            setForm({ ...form, [key]: e.target.value })
                          }
                        />
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>

                {/* STYLE & PERSONALITY */}
                <Accordion
                  sx={{
                    boxShadow: "none",
                    background: "aliceblue",
                    "&:before": {
                      display: "none",
                    },
                  }}
                  expanded={expanded === "style"}
                  onChange={handleChange("style")}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: 500,
                      }}
                      variant="subtitle2"
                    >
                      Style & Personality
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: 2,
                        background: "#fff",
                        padding: "16px",
                      }}
                    >
                      {(
                        [
                          ["Attire", "wardrobe"],
                          ["Accessories", "accessories"],
                          ["Personality", "personality"],
                          ["Origin / Ethnicity", "origin"],
                        ] as Array<[string, keyof CharacterType]>
                      ).map(([label, key]) => (
                        <TextField
                          key={key}
                          fullWidth
                          label={label}
                          value={form[key]}
                          error={!!errors[key]}
                          helperText={errors[key] && "Required"}
                          onChange={(e) =>
                            setForm({ ...form, [key]: e.target.value })
                          }
                        />
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            )}

            {/* INPUT TYPE: IMAGE */}
            {form.inputType === "image" && (
              <Box textAlign="center" mt={4}>
                <Box position="relative" display="inline-block">
                  <Avatar
                    src={preview}
                    variant="square"
                    sx={{
                      width: 90,
                      height: 90,
                      borderRadius: "5px",
                      border: errors.img ? "2px solid red" : "1px solid #ddd",
                    }}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: -4,
                      right: -4,
                      bgcolor: "white",
                      border: "1px solid #ccc",
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>

                <input
                  hidden
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImgSelect}
                />

                {errors.img && (
                  <Typography color="error" fontSize={12} mt={1}>
                    Image required
                  </Typography>
                )}
                <Box textAlign="center" mt={4}>
                  {/* BASIC INFO */}
                  <Accordion
                    sx={{ mb: 2, boxShadow: "none", background: "aliceblue" }}
                    expanded={expanded === "basic"}
                    onChange={handleChange("basic")}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle2" sx={{ fontSize: "16px" }}>
                        Basic Info
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, 1fr)",
                          gap: 2,
                          mb: 3,
                          background: "#fff",
                          padding: "16px",
                        }}
                      >
                        <TextField
                          fullWidth
                          label="Age"
                          type="number"
                          value={form.age}
                          error={!!errors.age}
                          helperText={errors.age && "Required"}
                          inputProps={{ min: 18, max: 120 }}
                          onChange={(e) =>
                            setForm({ ...form, age: Number(e.target.value) })
                          }
                        />

                        <FormControl fullWidth error={!!errors.gender}>
                          <InputLabel>Gender</InputLabel>
                          <Select
                            label="Gender"
                            value={form.gender}
                            onChange={(e) =>
                              setForm({ ...form, gender: e.target.value })
                            }
                          >
                            {GENDER_OPTIONS.map((g) => (
                              <MenuItem key={g} value={g}>
                                {g}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.gender && (
                            <Typography fontSize={12} color="error">
                              Required
                            </Typography>
                          )}
                        </FormControl>
                      </Box>
                    </AccordionDetails>
                  </Accordion>

                  {/* APPEARANCE */}
                  <Accordion
                    sx={{
                      mb: 2,
                      boxShadow: "none",
                      border: "none",
                      background: "aliceblue",
                      "&:before": {
                        display: "none",
                      },
                    }}
                    expanded={expanded === "appearance"}
                    onChange={handleChange("appearance")}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography
                        sx={{
                          fontSize: "16px",
                        }}
                        variant="subtitle2"
                      >
                        Appearance
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, 1fr)",
                          gap: 2,
                          mb: 3,
                          background: "#fff",
                          padding: "16px",
                        }}
                      >
                        {(
                          [
                            ["Skin Tone", "skin_tone"],
                            ["Hair", "hair"],
                            ["Face", "face"],
                            ["Build", "build"],
                          ] as Array<[string, keyof CharacterType]>
                        ).map(([label, key]) => (
                          <TextField
                            key={key}
                            fullWidth
                            label={label}
                            value={form[key]}
                            error={!!errors[key]}
                            helperText={errors[key] && "Required"}
                            onChange={(e) =>
                              setForm({ ...form, [key]: e.target.value })
                            }
                          />
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>

                  {/* STYLE & PERSONALITY */}
                  <Accordion
                    sx={{
                      boxShadow: "none",
                      background: "aliceblue",
                      "&:before": {
                        display: "none",
                      },
                    }}
                    expanded={expanded === "style"}
                    onChange={handleChange("style")}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography
                        sx={{
                          fontSize: "16px",
                          fontWeight: 500,
                        }}
                        variant="subtitle2"
                      >
                        Style & Personality
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, 1fr)",
                          gap: 2,
                          background: "#fff",
                          padding: "16px",
                        }}
                      >
                        {(
                          [
                            ["Attire", "wardrobe"],
                            ["Accessories", "accessories"],
                            ["Personality", "personality"],
                            ["Origin / Ethnicity", "origin"],
                          ] as Array<[string, keyof CharacterType]>
                        ).map(([label, key]) => (
                          <TextField
                            key={key}
                            fullWidth
                            label={label}
                            value={form[key]}
                            error={!!errors[key]}
                            helperText={errors[key] && "Required"}
                            onChange={(e) =>
                              setForm({ ...form, [key]: e.target.value })
                            }
                          />
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              </Box>
            )}

            {/* INPUT TYPE: SEARCH */}
            {form.inputType === "search" && (
              <>
                <AvailableCharacters
                  characters={charactersListData}
                  setCharacterData={setCharacterData}
                  setForm={setForm}
                />
              </>
            )}

            {/* ACTIONS */}
            <Box display="flex" justifyContent="space-between" mt={4}>
              <ButtonComp
                color="inherit"
                variant="outlined"
                onClick={closePrompt}
                colorType="secondary"
              >
                Cancel
              </ButtonComp>
              <ButtonComp variant="contained" onClick={handleSave}>
                Save
              </ButtonComp>
            </Box>
          </Paper>
        </Box>
      </Modal>
    </>
  );
};

export default CharacterPrompt;

// const handleSave = () => {
//   if (pathname === "/generate-script") {
//     if (!validate()) return;
//     updateCharacter(index, form);
//     closePrompt();
//   }

//   if (pathname === "/translated-script") {
//     if (!validate()) return;
//     const updatedCharacters = [...collectedCharacters, form];
//     const totalCharacters = pdfData?.characters?.length;
//     if (currentCharacterIndex < totalCharacters - 1) {
//       setCollectedCharacters(updatedCharacters);
//       setCurrentCharacterIndex((prev) => prev + 1);
//       updateCharacter(currentCharacterIndex, form);
//       return;
//     }
//     const {
//       script_status,
//       script_id,
//       saved_version,
//       scenes,
//       title,
//       ...rest
//     } = pdfData;
//     let characters = [];
//     characters.push(form);
//     const data = {
//       data: {
//         ...rest,
//         script_id,
//         scenes,
//         title,
//         characters: updateCharacter,
//         // version: tableExtraData?.version,
//         page: "script",
//       },
//       is_save_action: true,
//     };

//     dispatch(
//       postTranslatedDataSave(data, (id) => {
//         if (pathname === "/translated-script") {
//           navigate(`/scenes/${id}`);
//         }
//       }),
//     );
//     setCollectedCharacters([]);
//     setCurrentCharacterIndex(0);
//     updateCharacter(index, form);
//     closePrompt();
//   }
// };

// <Modal open>
//   <Box
//     sx={{
//       position: "absolute",
//       top: "50%",
//       left: "50%",
//       transform: "translate(-50%, -50%)",
//       width: "60%",
//     }}
//   >
//     <Paper sx={{ p: 3, borderRadius: 2 }}>
//       <Typography variant="h6" mb={2}>
//         Generate Characters
//       </Typography>

//       {/* INPUT TYPE */}
//       <Box my={2}>
//         <FormControl fullWidth>
//           <InputLabel>Input Type</InputLabel>
//           <Select
//             value={form.inputType}
//             label="Input Type"
//             onChange={(e) =>
//               setForm({
//                 ...form,
//                 inputType: e.target.value as InputType,
//                 img: "",
//               })
//             }
//           >
//             <MenuItem value="prompt">Generate</MenuItem>
//             <MenuItem value="image">Upload</MenuItem>
//           </Select>
//         </FormControl>
//       </Box>

//       {/* Name & Role */}
//       <Box
//         sx={{
//           display: "grid",
//           gridTemplateColumns: "repeat(3, 1fr)",
//           gap: 2,
//           mt: 2,
//         }}
//       >
//         {(
//           [
//             ["Name", "name"],
//             ["Role", "role"],
//           ] as Array<[string, keyof CharacterType]>
//         ).map(([label, key]) => (
//           <TextField
//             key={key}
//             fullWidth
//             label={label}
//             value={form[key]}
//             error={!!errors[key]}
//             helperText={errors[key] && "Required"}
//             onChange={(e) => setForm({ ...form, [key]: e.target.value })}
//           />
//         ))}
//       </Box>

//       {/* INPUT TYPE: Prompt */}
//       {form.inputType === "prompt" && (
//         <Box
//           sx={{
//             display: "grid",
//             gridTemplateColumns: "repeat(3, 1fr)",
//             gap: 2,
//             mt: 2,
//           }}
//         >
//           {/* Age */}
//           <TextField
//             fullWidth
//             label="Age"
//             type="number"
//             value={form.age}
//             error={!!errors.age}
//             helperText={errors.age && "Required"}
//             inputProps={{
//               min: 0,
//               max: 120,
//             }}
//             onChange={(e) =>
//               setForm({ ...form, age: Number(e.target.value) })
//             }
//           />

//           {/* Gender */}
//           <FormControl fullWidth error={!!errors.gender}>
//             <InputLabel>Gender</InputLabel>
//             <Select
//               label="Gender"
//               value={form.gender}
//               onChange={(e) => setForm({ ...form, gender: e.target.value })}
//             >
//               {GENDER_OPTIONS.map((g) => (
//                 <MenuItem key={g} value={g}>
//                   {g}
//                 </MenuItem>
//               ))}
//             </Select>
//             {errors.gender && (
//               <Typography fontSize={12} color="error">
//                 Required
//               </Typography>
//             )}
//           </FormControl>

//           {(
//             [
//               ["Skin Tone", "skin_tone"],
//               ["Hair", "hair"],
//               ["Face", "face"],
//               ["Build", "build"],
//               ["Wardrobe", "wardrobe"],
//               ["Accessories", "accessories"],
//               ["Personality", "personality"],
//               ["Origin / Ethnicity", "origin"],
//             ] as Array<[string, keyof CharacterType]>
//           ).map(([label, key]) => (
//             <TextField
//               key={key}
//               fullWidth
//               label={label}
//               value={form[key]}
//               error={!!errors[key]}
//               helperText={errors[key] && "Required"}
//               onChange={(e) => setForm({ ...form, [key]: e.target.value })}
//             />
//           ))}
//         </Box>
//       )}

//       {/* INPUT TYPE: Image */}
//       {form.inputType === "image" && (
//         <Box textAlign="center" mt={3}>
//           <Box position="relative" display="inline-block">
//             <Avatar
//               src={preview}
//               sx={{
//                 width: 90,
//                 height: 90,
//                 border: errors.img ? "2px solid red" : "none",
//               }}
//             />
//             <IconButton
//               sx={{
//                 position: "absolute",
//                 bottom: -4,
//                 right: -4,
//                 bgcolor: "white",
//                 border: "1px solid #ccc",
//               }}
//               onClick={() => fileInputRef.current?.click()}
//             >
//               <EditIcon fontSize="small" />
//             </IconButton>
//           </Box>

//           <input
//             hidden
//             ref={fileInputRef}
//             type="file"
//             accept="image/*"
//             onChange={handleImgSelect}
//           />

//           {errors.img && (
//             <Typography color="error" fontSize={12} mt={1}>
//               Image required
//             </Typography>
//           )}
//         </Box>
//       )}

//       {/* ACTIONS */}
//       <Box display="flex" justifyContent="space-between" mt={3}>
//         <Button color="error" variant="outlined" onClick={closePrompt}>
//           Cancel
//         </Button>
//         <Button variant="contained" onClick={handleSave}>
//           Save
//         </Button>
//       </Box>
//     </Paper>
//   </Box>
// </Modal>
