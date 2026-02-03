import { Box } from "@mui/material";
import ButtonComp from "../common/Buton/Button";

export default function Controls({ onSave, onCancel }) {
  return (
    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
      <ButtonComp onClick={onSave} colorType="primary">
        Save
      </ButtonComp>
      <ButtonComp onClick={onCancel} colorType="secondary">
        Cancel
      </ButtonComp>
    </Box>
  );
}
