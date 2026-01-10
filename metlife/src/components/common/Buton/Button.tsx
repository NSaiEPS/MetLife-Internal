// import React from "react";
// import { Button } from "@mui/material";
// import type { ButtonProps } from "@mui/material";

// interface ButtonCompProps {
//   label: string;
//   variant?: ButtonProps["variant"];
//   icon?: string;
//   className?: string;
//   sx?: any;
//   action?: () => void;
//   disabled?: boolean | undefined;
// }

// const ButtonComp: React.FC<ButtonCompProps> = ({
//   label,
//   variant = "contained",
//   icon,
//   className,
//   sx,
//   action,
//   disabled = false,
// }) => {
//   return (
//     <Button
//       variant={variant}
//       startIcon={icon ? <img src={icon} alt="icon" /> : undefined}
//       className={className}
//       sx={sx}
//       onClick={action}
//       disabled={disabled}
//     >
//       {label}
//     </Button>
//   );
// };

// export default ButtonComp;

import React from "react";
import { Button } from "@mui/material";
import type { ButtonProps } from "@mui/material";

interface ButtonCompProps {
  children: React.ReactNode;
  variant?: ButtonProps["variant"];
  icon?: string;
  label: string;
  transform: string;
  className?: string;
  sx?: any;
  action?: () => void;
  disabled?: boolean;
  colorType?: "primary" | "secondary" | "download" | "warning" | "error"; // 🔥 NEW
}

const COLOR_CONFIG = {
  primary: {
    bg: "#007ABC",
    text: "#FFFFFF",
    border: "2px solid #007ABC",
    hoverBg: "#0061A0",
    hoverText: "#FFFFFF",
    hoverBorder: "2px solid #0061A0",
  },
  secondary: {
    bg: "#FFFFFF",
    text: "#2f91c7",
    border: "2px solid #007ABC",
    hoverBg: "#0061A0",
    hoverText: "#FFFFFF",
    hoverBorder: "2px solid #0061A0",
  },
  download: {
    bg: "#327037ff",
    text: "#ffffff",
    border: "2px solid #327037ff",
    hoverBg: "#1B5E20",
    hoverText: "#ffffff",
    hoverBorder: "2px solid #1B5E20",
  },
  warning: {
    bg: "#e65100",          // ORANGE
    text: "#FFFFFF",
    border: "2px solid #e65100",
    hoverBg: "#E59400",
    hoverText: "#FFFFFF",
    hoverBorder: "2px solid #E59400",
  },

  error: {
    bg: "#C62828",          
    text: "#FFFFFF",
    border: "2px solid #C62828",
    hoverBg: "#B71C1C",
    hoverText: "#FFFFFF",
    hoverBorder: "2px solid #B71C1C",
  },
};

const ButtonComp: React.FC<ButtonCompProps> = ({
  children,
  label,
  transform = "uppercase",
  variant = "contained",
  icon,
  className,
  sx,
  action,
  disabled = false,
  colorType = "primary",
  ...rest
}) => {
  const colors = COLOR_CONFIG[colorType];

  return (
    <Button
      variant={variant}
      startIcon={icon ? <img src={icon} alt="icon" /> : undefined}
      className={className}
      onClick={action}
      disabled={disabled}
      {...rest}
      sx={{
        lineHeight: "normal",
        boxSizing: "border-box",
        height: "fit-content",
        borderRadius: "4px",
        textTransform: transform,
        fontSize: "14px",
        fontWeight: 500,
        padding: "8px 16px",

        backgroundColor: disabled ? "#E0E0E0" : colors.bg,
        color: disabled ? "#9E9E9E" : colors.text,
        border: disabled ? "none" : colors.border,

        "&:hover": {
          backgroundColor: disabled ? "#E0E0E0" : colors.hoverBg,
          color: disabled ? "#9E9E9E" : colors.hoverText,
          border: disabled ? "none" : colors.hoverBorder,
        },

        ...sx,
      }}
    >
      {children || label}
    </Button>
  );
};

export default ButtonComp;
