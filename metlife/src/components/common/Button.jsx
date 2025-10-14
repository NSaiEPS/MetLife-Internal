import React from "react";
import { Button } from "@mui/material";

const ButtonComp = ({ label, variant = "contained", icon, className, sx, action, disabled }) => {
  return (
    <Button
      variant={variant}
      startIcon={icon}
      className={className}
      sx={sx}
      onClick={action}
      disabled={disabled}
    >
      {label}
    </Button>
  );
};

export default ButtonComp;
