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
  icon?: any;
  img_icon?: boolean;
  label?: string;
  transform?: string;
  className?: string;
  sx?: any;
  action?: any;
  onClick?: () => void;
  disabled?: boolean;
  colorType?: "primary" | "secondary" | "download" | "warning" | "error" | "outlined"; // 🔥 NEW
}

const COLOR_CONFIG = {
  primary: {
    bg: "var(--button-bg)", // Use CSS variable for primary color
    text: "var(--button-text)", // Use CSS variable for text color
    border: "2px solid var(--button-border)",
    hoverBg: "var(--button-hover-bg)", // Use CSS variable for hover background
    hoverText: "var(--button-hover-text)", // Use CSS variable for hover text color
    hoverBorder: "2px solid var(--button-hover-border)", // Use CSS variable for hover border
  },
  secondary: {
    bg: "#FFFFFF",
    text: "var(--button-secondary-text)",
    border: "2px solid var(--button-secondary-border)",
    hoverBg: "var(--button-secondary-hover-bg)",
    hoverText: "var(--button-hover-text)",
    hoverBorder: "2px solid var(--button-secondary-hover-border)",
  },
  download: {
    bg: "#327037ff",
    text: "#ffffff",
    border: "2px solid #327037ff",
    hoverBg: "#1B5E20",
    hoverText: "#ffffff",
    hoverBorder: "2px solid #1B5E20",
  },
  outlined: {
    bg: "transparent",
    text: "var(--primary-color)",
    border: "2px solid var(--primary-color)",
    hoverBg: "var(--primary-color)",
    hoverText: "#fff",
    hoverBorder: "2px solid var(--primary-color)",
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
  img_icon,
  className,
  sx,
  action,
  onClick,
  disabled = false,
  colorType = "primary",
  ...rest
}) => {
  const colors = COLOR_CONFIG[colorType];

  return (
    <Button
      variant={variant}
      startIcon={img_icon ? <img src={icon} alt="icon" /> : icon}
      className={className}
      onClick={action ?? onClick}
      disabled={disabled}
      {...rest}
      sx={{
        lineHeight: "normal",
        boxSizing: "border-box",
        height: "fit-content",
        borderRadius: "4px",
        textTransform: transform,
        fontSize: "14px",
        fontWeight: 600,
        padding: "8px 16px",

        backgroundColor: disabled ? "#E0E0E0" : colors.bg,
        color: disabled ? "var(--button-disabled-color)" : colors.text,
        border: disabled ? "none" : colors.border,

        "&:hover": {
          backgroundColor: disabled ? "#E0E0E0" : colors.hoverBg,
          color: disabled ? "var(--button-disabled-color)" : colors.hoverText,
          border: disabled ? "none" : colors.hoverBorder,
        },

        "&.Mui-disabled": {
          backgroundColor: "var(--button-disabled-bg)", // 👈 disabled background
          color: "var(--button-disabled-color)",          // 👈 disabled text
          cursor: "not-allowed",
        },

        ...sx,
      }}
    >
      {children || label}
    </Button>
  );
};

export default ButtonComp;
