import React from "react";
import {
  FormControl,
  Select,
  MenuItem,
  Typography,
  Tooltip,
} from "@mui/material";
import styles from "./select.module.css"; // Import CSS Module

const SelectComp = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select",
  fullWidth = true,
  disabled = false,
  style = false,
}) => {
  // Find the label of the currently selected value
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div
      className={`${styles.selectWrapper} ${fullWidth ? styles.fullWidth : ""}`}
    >
      {/* Label outside the select box */}

      {label && (
        <Typography sx={{ mb: style ? 1 : 0 }} className={styles.selectLabel}>
          {label}
        </Typography>
      )}

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
          disabled={disabled}
          style={{
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
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
