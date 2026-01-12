import { Button } from "@mui/material";
import React from "react";
import { navigateTo } from "../../../utils/navigate";
import { IoArrowBackCircleOutline } from "react-icons/io5";

const BackButton = ({ route }: { route: string }) => {
  return (
    <Button
      onClick={() => navigateTo(route)}
      sx={{
        display: "flex",
        alignItems: "center",
        color: "#005f9f",
        gap: "5px",
        marginBottom: "12px",
        marginTop: "15px",
        paddingX: 0,
      }}
    >
      <IoArrowBackCircleOutline size={30} />
      <span style={{ lineHeight: "normal" }}>Back</span>
    </Button>
  );
};

export default BackButton;
