import { useEffect } from "react";

export default function ImageCanvas({
  canvasRef,
  imageObj,
  rect,
  onMouseDown,
  onMouseMove,
  onMouseUp,
}) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw image
    if (imageObj) {
      ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
    }
    // draw rectangle
    // draw rectangle (Konva-like)
    if (rect) {
      const x = rect.startX;
      const y = rect.startY;
      const w = rect.endX - rect.startX;
      const h = rect.endY - rect.startY;

      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);
    }
  }, [imageObj, rect]);

  const getMousePos = (e) => {
    const box = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - box.left,
      y: e.clientY - box.top,
    };
  };

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={400}
      // width="100%"
      // height="100%"
      className="border border-gray-400"
      onMouseDown={(e) => onMouseDown(getMousePos(e))}
      onMouseMove={(e) => onMouseMove(getMousePos(e))}
      onMouseUp={onMouseUp}
    />
  );
}
