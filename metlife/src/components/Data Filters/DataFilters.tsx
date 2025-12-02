import React from "react";
import { Box, Grid } from "@mui/material";
import MultiSelectWithOneCustom from "../Custom Select/MultiSelectWithOneCustom";

// --------------------------
// Types
// --------------------------
interface OptionType {
  label: string;
  value: string;
}

interface DataFiltersProps {
  setFilter: React.Dispatch<React.SetStateAction<DataFiltersState>>;
  filter: DataFiltersState;
}

export interface DataFiltersState {
  channel: string[];
  language: string[];
  domain: string[];
  category: string[];
  roles: string[];
  source_type: string[];
  core_skill: string[];
  sub_skill: string[];
  proficiency_level: string[];
  sub_category: string[];
  microsegment: string[];
  skill_domain: string[];
}

// --------------------------
// Component
// --------------------------
const DataFilters: React.FC<DataFiltersProps> = ({ setFilter, filter }) => {
  const allFilters: Record<keyof DataFiltersState, OptionType[]> = {
    channel: [
      { label: "agency", value: "agency" },
      { label: "all", value: "all" },
    ],
    language: [
      { label: "en", value: "en" },
      { label: "esp", value: "esp" },
      { label: "all", value: "all" },
    ],
    domain: [
      { label: "global", value: "global" },
      { label: "all", value: "all" },
    ],
    category: [
      { label: "learning content", value: "learning content" },
      { label: "all", value: "all" },
    ],
    roles: [
      { label: "Sales Manager", value: "Sales Manager" },
      { label: "all", value: "all" },
    ],
    source_type: [
      { label: "Documents", value: "Documents" },
      { label: "all", value: "all" },
    ],
    core_skill: [
      { label: "Sales Processing", value: "Sales Processing" },
      { label: "all", value: "all" },
    ],
    sub_skill: [
      { label: "Objection Handling", value: "Objection Handling" },
      { label: "Prospecting", value: "Prospecting" },
      { label: "all", value: "all" },
    ],
    proficiency_level: [
      { label: "Foundational", value: "Foundational" },
      { label: "all", value: "all" },
    ],
    sub_category: [{ label: "user", value: "user" }],
    microsegment: [{ label: "user", value: "user" }],
    skill_domain: [{ label: "user", value: "user" }],
  };

  const handleChange = (value: string[], type: keyof DataFiltersState) => {
    setFilter((prev) => ({ ...prev, [type]: value }));
  };

  return (
    <Box sx={{ width: "100%", px: 2, py: 2 }}>
      <Grid container spacing={3}>
        {Object.entries(allFilters).map(([key, options]) => (
          <Grid key={key} xs={12} md={6} lg={6}>
            <MultiSelectWithOneCustom
              label={
                key.charAt(0).toUpperCase() +
                key.slice(1).replace(/_/g, " ")
              }
              options={options}
              value={filter[key as keyof DataFiltersState]}
              onChange={(val : any) => handleChange(val, key as keyof DataFiltersState)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DataFilters;
