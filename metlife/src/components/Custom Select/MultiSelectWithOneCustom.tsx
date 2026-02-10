import { Autocomplete, Chip, TextField } from "@mui/material";
import React from "react";

const MultiSelectWithOneCustom = ({ label, options, value, onChange }) => {
  const predefinedLabels = options.map((opt) => opt.label);

  const handleChange = (event, newValue) => {
    if (!newValue) return;

    let labels = newValue.map((item) =>
      typeof item === "string" ? item : item.label
    );

    labels = [...new Set(labels)];

    const hasAllSelected = labels.includes("all");

    const isSelectingAll = hasAllSelected && !value.includes("all");

    if (isSelectingAll) {
      const custom = labels.filter((l) => !predefinedLabels.includes(l));

      return onChange(["all", ...custom]);
    }

    if (hasAllSelected && labels.length > 1) {
      const hasNormalOption = labels.some(
        (l) => predefinedLabels.includes(l) && l !== "all"
      );

      if (hasNormalOption) {
        labels = labels.filter((l) => l !== "all");
      }
    }

    const customItems = labels.filter((l) => !predefinedLabels.includes(l));

    if (customItems.length > 1) return;

    onChange(labels);
  };

  return (
    <Autocomplete
      multiple
      freeSolo
      limitTags={2}
      options={options.map((opt) => opt.label).filter((l) => l !== "user")}
      value={value}
      onChange={handleChange}
      renderValue={(val, getItemProps) =>
        val.map((label, index) => {
          const { key, ...itemProps } = getItemProps({ index });

          return (
            <Chip variant="outlined" label={label} key={key} {...itemProps} />
          );
        })
      }
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder="Select" />
      )}
    />
  );
};

export default MultiSelectWithOneCustom;
