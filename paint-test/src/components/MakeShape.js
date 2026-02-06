import React, { useState } from "react";
import { DrawArea } from "react-svg-draw";

const MakeShape = () => {
  const [shapes, setShapes] = useState([]);

  const handleShapeChange = (newShapes) => {
    setShapes(newShapes);
  };

  return <DrawArea width={800} height={600} shapes={shapes} onChange={handleShapeChange} style={{ border: "1px solid black" }} />;
};

export default MakeShape;
