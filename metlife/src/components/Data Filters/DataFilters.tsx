import { Box, Button, Typography, Grid } from "@mui/material";
import MultiSelectWithOneCustom from "../Custom Select/MultiSelectWithOneCustom";

const DataFilters = ({ setFilter, filter }) => {
  const allFilters = {
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

  const handleChange = (value, type) => {
    setFilter((prev) => ({ ...prev, [type]: value }));
  };

  return (
    <Box sx={{ width: "100%", px: 2, py: 2 }}>
      <Grid container spacing={3}>
        {Object.entries(allFilters).map(([key, options]) => (
          <Grid size={{ xs: 12, md: 6, lg: 6 }} key={key}>
            <MultiSelectWithOneCustom
              label={
                key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")
              }
              options={options}
              value={filter[key]}
              onChange={(val) => handleChange(val, key)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DataFilters;
