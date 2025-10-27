import React from "react";
import { Button } from "@mui/material";

const ButtonComp = ({
  label,
  variant = "contained",
  icon,
  className,
  sx,
  action,
  disabled,
}) => {
  return (
    <Button
      disable={disabled}
      variant={variant}
      startIcon={icon ? <img src={icon} alt="icon" /> : null}
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
