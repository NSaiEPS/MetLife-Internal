import { Button } from "@mui/material";
import React from "react";
import { navigateTo } from "../../../utils/navigate";
import { IoArrowForwardCircleOutline } from "react-icons/io5";

const NextButton = ({ route }: { route: string }) => {
  return (
    <Button
      onClick={() => navigateTo(route)}
      sx={{
        display: "flex",
        alignItems: "center",
        color: "#005f9f",
        gap: "5px",
        marginBottom: "15px",
        paddingX: 0,
      }}
    >
      <span style={{ lineHeight: "normal" }}>Next</span>
      <IoArrowForwardCircleOutline size={30} />
    </Button>
  );
};

export default NextButton;
