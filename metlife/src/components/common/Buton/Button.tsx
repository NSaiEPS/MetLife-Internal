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
  small?: boolean;
  action?: any;
  onClick?: () => void;
  disabled?: boolean;
  padding?: string;
  fullWidth?: boolean;
  colorType?: "primary" | "secondary" | "download" | "warning" | "error" | "outlined"; // 🔥 NEW
}

const COLOR_CONFIG = {
  primary: {
    bg: "var(--gradient-gold)",  // Use CSS variable for primary color
    text: "#000000", // Use CSS variable for text color
    border: "2px solid var(--button-border)",
    hoverBg: "var(--gradient-gold)", // Use CSS variable for hover background
    hoverText: "#000", // Use CSS variable for hover text color
    hoverBorder: "2px solid var(--button-hover-border)", // Use CSS variable for hover border
  },
  secondary: {
    bg: "transparent",
    text: "#fff",
    border: "2px solid var(--border-dark)",
    hoverBg: "transparent",
    hoverText: "var(--gold)",
    hoverBorder: "2px solid var(--gold)",
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
    text: "var(--text-secondary)",
    border: "2px solid var(--border-dark)",
    hoverBg: "transparent",
    hoverText: "#fff",
    hoverBorder: "2px solid #fff",
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
  small,
  sx,
  action,
  onClick,
  disabled = false,
  colorType = "primary",
  padding,
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
        borderRadius: "12px",
        textTransform: transform,
        fontSize: small ? "12px" : "14px",
        fontWeight: 600,
        padding: padding ? padding : small ? "8px 8px" : "12px 24px",

        background: disabled ? "#E0E0E0" : colors.bg,
        color: disabled ? "var(--button-disabled-color)" : colors.text,
        border: disabled ? "none" : colors.border,

        "&:hover": {
          background: disabled ? "#E0E0E0" : colors.hoverBg,
          color: disabled ? "var(--button-disabled-color)" : colors.hoverText,
          border: disabled ? "none" : colors.hoverBorder,
          filter: "brightness(1.1)", transform: "translateY(-1px)",
        },

        "&.Mui-disabled": {
          background: "var(--text-primary)", // 👈 disabled background
          color: "var(--text-secondary)",          // 👈 disabled text
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
