import React from "react";
import {
  FormControl,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import styles from "./select.module.css";

interface OptionType {
  label: string;
  value: string | number;
}

interface SelectCompProps {
  label?: string;
  options?: OptionType[];
  value: string | number | null;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  style?: boolean;
}

const SelectComp: React.FC<SelectCompProps> = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select",
  fullWidth = true,
  disabled = false,
  style = false,
}) => {
  const selectedOption = options.find((opt) => opt.value === value);

  // ✅ correct event type for MUI Select
  const handleChange = (e: SelectChangeEvent<string | number>) => {
    const newValue = e.target.value as string | number;
    onChange?.(newValue);
  };

  return (
    <div
      className={`${styles.selectWrapper} ${
        fullWidth ? styles.fullWidth : ""
      }`}
    >
      {label && (
        <Typography sx={{ mb: style ? 1 : 0 }} className={styles.selectLabel}>
          {label}
        </Typography>
      )}

      <FormControl fullWidth={fullWidth} variant="outlined" size="medium">
        <Select
          displayEmpty
          value={value ?? ""}
          onChange={handleChange}
          renderValue={(selected) =>
            selected ? (
              selectedOption?.label ?? selected
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
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default SelectComp;
