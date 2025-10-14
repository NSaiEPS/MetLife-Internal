import React from "react";
import { Checkbox, FormControlLabel } from "@mui/material";

const CheckboxComp = ({ label, checked = false, onChange }) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={(e) => onChange && onChange(e.target.checked)}
        />
      }
      label={label}
    />
  );
};

export default CheckboxComp;
