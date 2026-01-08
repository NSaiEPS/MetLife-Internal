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
  className?: string;
  sx?: any;
  action?: () => void;
  disabled?: boolean;
  colorType?: "primary" | "secondary"; // 🔥 NEW
}

const ButtonComp: React.FC<ButtonCompProps> = ({
  children,
  variant = "contained",
  icon,
  className,
  sx,
  action,
  disabled = false,
  colorType = "primary", 
  ...rest
}) => {
  return (
    <Button
      variant={variant}
      startIcon={icon ? <img src={icon} alt="icon" /> : undefined}
      className={className}
      onClick={action}
      {...rest}
      disabled={disabled}
      sx={{
        lineHeight: "normal",
        borderRadius: "8px",
        textTransform: "none",
        fontSize: "14px",
        fontWeight: 600,
        padding: "8px 16px",
        backgroundColor:
        colorType === "primary" ? "#007ABC" : "#FFFFFF",
        color:  colorType === "primary" ? "#FFFFFF" : "#2f91c7",
        border: colorType !== "primary" && "2px solid #64add5",
        "&:hover": {
          backgroundColor:
            colorType === "primary" ? "#0061A0" : "#0061A0",
            color:  colorType === "primary" ? "#FFFFFF" : "#FFFFFF",
            border: colorType !== "primary" && "2px solid #64add5",


        },
        ...sx,
      }}
    >
    {children}
    </Button>
  );
};

export default ButtonComp;
