import React, { ChangeEvent } from "react";

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
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        marginBottom: "15px",
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
      />
      {errors && <p className={errorClass}>{errors}</p>}
    </div>
  );
};

export default Input;
