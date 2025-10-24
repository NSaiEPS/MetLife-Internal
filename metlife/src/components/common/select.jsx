import React from "react";
import { FormControl, Select, MenuItem, Typography } from "@mui/material";
import styles from "./select.module.css"; // Import CSS Module

const SelectComp = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select",
  fullWidth = true,
}) => {
  // Find the label of the currently selected value
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`${styles.selectWrapper} ${fullWidth ? styles.fullWidth : ""}`}>
      {/* Label outside the select box */}
      {label && <Typography className={styles.selectLabel}>{label}</Typography>}

      <FormControl fullWidth={fullWidth} variant="outlined" size="medium">
        <Select
          displayEmpty
          value={value ?? ""}
          onChange={(e) => onChange && onChange(e.target.value)}
          renderValue={(selected) =>
            selected ? (
              selectedOption?.label || selected
            ) : (
              <span className={styles.selectPlaceholder}>{placeholder}</span>
            )
          }
          className={styles.selectBox}
        >
          {/* Placeholder is not included as an option now, 
              since renderValue handles it */}
          {options.map((opt) => (
            <MenuItem key={opt.value ?? opt} value={opt.value ?? opt}>
              {opt.label ?? opt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default SelectComp;
