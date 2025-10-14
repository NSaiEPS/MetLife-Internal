import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const SelectComp = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select",
  fullWidth = true,
}) => {
  return (
    <FormControl fullWidth={fullWidth} variant="outlined" size="medium">
      {label && <InputLabel>{label}</InputLabel>}

      <Select
        label={label}
        value={value ?? ""}
        onChange={(e) => onChange && onChange(e.target.value)}
        displayEmpty
      >
        {/* Placeholder as first disabled option */}
        <MenuItem value="" disabled>
       
        </MenuItem>

        {options.map((opt) => (
          <MenuItem key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectComp;
