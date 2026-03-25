import { useEffect, useRef, useState } from "react";
import ImageCanvas from "./ImageCanvas";
import Controls from "./Controls";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { postImageCoordinates } from "../../redux/features/scriptSlice";

export default function RectangleDrawer({
  imgSrc,
  projectId,
  setStep,
  STEPS,
  // setStartTimer3,
  // setShowRectangleCanvas,
}) {
  const canvasRef = useRef(null);
  const [imageObj, setImageObj] = useState(null);
  const [rect, setRect] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // load image once
  useEffect(() => {
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => setImageObj(img);
  }, []);

  const handleMouseDown = (pos) => {
    setIsDrawing(true);
    setRect({
      startX: pos.x,
      startY: pos.y,
      endX: pos.x,
      endY: pos.y,
    });
  };

  const handleMouseMove = (pos) => {
    if (!isDrawing || !rect) return;

    setRect({
      ...rect,
      endX: Math.max(pos.x, rect.startX),
      endY: Math.max(pos.y, rect.startY),
    });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const dispatch = useDispatch();
  const handleSave = () => {
    if (!rect) return;

    const x1 = rect.startX;
    const y1 = rect.startY;
    const x2 = rect.endX;
    const y2 = rect.endY;

    // normalize rectangle
    const x = Math.min(x1, x2);
    const y = Math.min(y1, y2);
    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);

    const result = [x, y, width, height];

    // console.log(result, "=> [x, y, width, height]");
    const id = projectId || localStorage.getItem("project_id");

    dispatch(postImageCoordinates(id, result, successCallback));

    // setStartTimer3(true);
    // setShowRectangleCanvas(false);
    setRect(null);
  };

  const successCallback = (data) => {
    // console.log(data, "data_check");
    if (data?.status) {
      const duration = Number(data?.estimated_time_seconds);
      const endTime = Date.now() + duration * 1000;

      localStorage.setItem(
        "estimated_remaining_time",
        JSON.stringify({ endTime }),
      );

      setStep(STEPS.TIMER3);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        padding: 3,
      }}
    >
      <ImageCanvas
        canvasRef={canvasRef}
        imageObj={imageObj}
        rect={rect}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />

      <Controls onSave={handleSave} onCancel={() => setRect(null)} />
    </Box>
  );
}
