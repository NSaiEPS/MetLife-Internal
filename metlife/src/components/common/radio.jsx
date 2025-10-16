import React from "react";
import { Radio, FormControlLabel } from "@mui/material";
import styles from "./radio.module.css";

const RadioComp = ({ options = [], value, onChange }) => {
  const handleChange = (newValue) => {
    onChange(newValue);
  };

  return (
    <div className={styles.container}>
      {options.map((opt) => (
        <div
          key={opt.value}
          className={`${styles.radioBox} ${
            value === opt.value ? styles.active : ""
          }`}
          onClick={() => handleChange(opt.value)}
        >
          <FormControlLabel
            value={opt.value}
            control={<Radio checked={value === opt.value} />}
            label={opt.label}
            onChange={() => handleChange(opt.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default RadioComp;
