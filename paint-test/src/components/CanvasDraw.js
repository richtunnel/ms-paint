import React from "react";
import CanvasDraw from "react-canvas-draw";

const ShapeCreator = () => {
  return <CanvasDraw canvasWidth={800} canvasHeight={600} brushRadius={5} brushColor="rgba(0,0,255,0.3)" />;
};

export default ShapeCreator;
