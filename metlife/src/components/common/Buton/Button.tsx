import React from "react";
import { Button } from "@mui/material";
import type { ButtonProps } from "@mui/material";

interface ButtonCompProps {
  label: string;
  variant?: ButtonProps["variant"];
  icon?: string;
  className?: string;
  sx?: any;
  action?: () => void;
  disabled?: boolean | undefined;
}

const ButtonComp: React.FC<ButtonCompProps> = ({
  label,
  variant = "contained",
  icon,
  className,
  sx,
  action,
  disabled = false,
}) => {
  return (
    <Button
      variant={variant}
      startIcon={icon ? <img src={icon} alt="icon" /> : undefined}
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
