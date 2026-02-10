import React from "react";
import type {ChangeEvent} from "react"

interface InputProps {
  label?: string;
  type?: string;
  name?: string;
  placeholder?: string;
  className?: string;
  value?: string | number;
  handleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  errors?: string;
  errorClass?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  name,
  placeholder,
  className,
  value,
  handleChange,
  errors,
  errorClass,
  marginStyle = true,
  max,
  min,
}) => {
  const marginBottomStyle = marginStyle ? "5px" : "15px";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        marginBottom: marginBottomStyle,
        fontFamily: "Noto_Sans, sans-serif",
      }}
    >
      {label && <label>{label}</label>}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className={className}
        value={value}
        onChange={handleChange}
        max={max ? max : null}
        min={min ? min : null}

      />
      {errors && <p className={errorClass}>{errors}</p>}
    </div>
  );
};

export default Input;
