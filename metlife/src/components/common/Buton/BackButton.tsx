import { Button } from "@mui/material";
import React from "react";
import { navigateTo } from "../../../utils/navigate";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router";

const BackButton = ({ route }: { route: string }) => {
  const navigate = useNavigate();

  return (
    <Button
      // onClick={() => navigateTo(route)}
      onClick={() => navigate(-1)}
      sx={{
        display: "flex",
        alignItems: "center",
        color: "var(--primary-color)",
        gap: "5px",
        marginBottom: "15px",
        paddingX: 0,
      }}
    >
      <IoArrowBackCircleOutline size={30} />
      <span style={{ lineHeight: "normal" }}>Back</span>
    </Button>
  );
};

export default BackButton;
