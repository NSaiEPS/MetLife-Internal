import React from "react";
import { FormControl, Select, MenuItem, Typography } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import styles from "./Select.module.css";

interface OptionType {
  label: string;
  value: string | number;
}

interface SelectCompOptionProps {
  label?: string;
  options?: OptionType[];
  value: OptionType | null;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  style?: boolean;
}

const SelectCompOption: React.FC<SelectCompOptionProps> = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select",
  fullWidth = true,
  disabled = false,
  style = false,
}) => {
  const selectedValue = value?.value ?? "";

  const handleChange = (e: SelectChangeEvent<string | number>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={styles.selectWrapper}>
      {label && (
        <Typography sx={{ mb: style ? 1 : 0 }} className={styles.selectLabel}>
          {label}
        </Typography>
      )}

      <FormControl fullWidth={fullWidth} variant="outlined">
        <Select
          displayEmpty
          value={selectedValue}
          onChange={handleChange}
          disabled={disabled}
          renderValue={(selected) =>
            selected ? (
              options.find((o) => o.value === selected)?.label ?? selected
            ) : (
              <span className={styles.selectPlaceholder}>{placeholder}</span>
            )
          }
          className={styles.selectBox}
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

export default SelectCompOption;
