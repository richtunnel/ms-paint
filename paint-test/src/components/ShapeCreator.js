import React, { useState } from "react";

const ShapeCreator = () => {
  const [shapes, setShapes] = useState([]);
  const [selectedShape, setSelectedShape] = useState("circle");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentShape, setCurrentShape] = useState([]);
  const [draggingShape, setDraggingShape] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const addShape = (e) => {
    if (selectedShape === "custom") return; // Skip adding predefined shapes when in custom mode
    const newShape = {
      id: shapes.length + 1,
      type: selectedShape,
      x: e.clientX,
      y: e.clientY,
      coordinates: `(${e.clientX}, ${e.clientY})`,
    };
    setShapes([...shapes, newShape]);
  };

  const handleShapeChange = (e) => {
    setSelectedShape(e.target.value);
  };

  const handleMouseOver = (e) => {
    setIsHovering(true);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  const deleteShape = (id) => {
    setShapes(shapes.filter((shape) => shape.id !== id));
  };

  const removeFirstShape = () => {
    if (shapes.length > 0) {
      setShapes(shapes.slice(1)); // Remove the first shape in the array
    }
  };

  const handleMouseDown = (e, shape = null) => {
    if (shape) {
      // Start dragging the shape
      setDraggingShape(shape);
      setDragOffset({ x: e.clientX - shape.x, y: e.clientY - shape.y });
    } else if (selectedShape === "custom") {
      setIsDrawing(true);
      setCurrentShape([{ x: e.clientX, y: e.clientY }]);
    }
  };

  const handleMouseMove = (e) => {
    const svgRect = e.target.getBoundingClientRect(); // Get the bounding rectangle of the SVG element

    const offsetX = e.clientX - svgRect.left; // Calculate offset relative to the SVG
    const offsetY = e.clientY - svgRect.top; // Calculate offset relative to the SVG

    if (isDrawing) {
      setCurrentShape([...currentShape, { x: offsetX, y: offsetY }]);
    } else if (draggingShape) {
      // Update the position of the dragging shape
      setShapes(
        shapes.map((shape) =>
          shape.id === draggingShape.id
            ? {
                ...shape,
                x: offsetX - dragOffset.x,
                y: offsetY - dragOffset.y,
                coordinates: `(${offsetX - dragOffset.x}, ${offsetY - dragOffset.y})`,
              }
            : shape
        )
      );
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const newShape = {
        id: shapes.length + 1,
        type: "custom",
        points: currentShape,
      };
      setShapes([...shapes, newShape]);
      setCurrentShape([]);
    } else if (draggingShape) {
      setDraggingShape(null); // Stop dragging
    }
  };

  const renderShape = (shape) => {
    const shapeProps = {
      key: shape.id,
      onMouseDown: (e) => handleMouseDown(e, shape),
      onClick: () => deleteShape(shape.id),
      style: { cursor: "pointer" }, // Indicate that the shape is draggable and clickable
    };

    switch (shape.type) {
      case "circle":
        return (
          <g {...shapeProps}>
            <circle cx={shape.x} cy={shape.y} r="20" fill="blue" />
            <text x={shape.x + 25} y={shape.y} fill="black">
              {shape.coordinates}
            </text>
          </g>
        );
      case "rectangle":
        return (
          <g {...shapeProps}>
            <rect x={shape.x - 25} y={shape.y - 25} width="50" height="50" fill="green" />
            <text x={shape.x + 30} y={shape.y} fill="black">
              {shape.coordinates}
            </text>
          </g>
        );
      case "triangle":
        return (
          <g {...shapeProps}>
            <polygon points={`${shape.x},${shape.y - 25} ${shape.x - 25},${shape.y + 25} ${shape.x + 25},${shape.y + 25}`} fill="red" />
            <text x={shape.x + 30} y={shape.y + 25} fill="black">
              {shape.coordinates}
            </text>
          </g>
        );
      case "star":
        const starPoints = calculateStarPoints(shape.x, shape.y, 5, 20, 10);
        return (
          <g {...shapeProps}>
            <polygon points={starPoints} fill="yellow" />
            <text x={shape.x + 30} y={shape.y} fill="black">
              {shape.coordinates}
            </text>
          </g>
        );
      case "custom":
        return (
          <g {...shapeProps}>
            <polyline points={shape.points.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke="purple" strokeWidth="2" />
          </g>
        );
      default:
        return null;
    }
  };

  const calculateStarPoints = (centerX, centerY, spikes, outerRadius, innerRadius) => {
    let points = [];
    let angle = Math.PI / spikes;

    for (let i = 0; i < 2 * spikes; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = centerX + Math.cos(i * angle) * radius;
      const y = centerY + Math.sin(i * angle) * radius;
      points.push(`${x},${y}`);
    }

    return points.join(" ");
  };

  return (
    <div>
      <select onChange={handleShapeChange} value={selectedShape}>
        <option value="circle">Circle</option>
        <option value="rectangle">Rectangle</option>
        <option value="triangle">Triangle</option>
        <option value="star">Star</option>
        <option value="custom">Custom Shape</option>
      </select>
      <button onClick={removeFirstShape} style={{ marginLeft: "10px" }}>
        Remove First Shape
      </button>
      <div
        style={{
          width: "100%",
          height: "500px",
          border: "1px solid black",
          position: "relative",
          marginTop: "10px",
          cursor: isHovering ? "crosshair" : "default",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={addShape}
        onMouseOut={handleMouseOut}
        onMouseOver={handleMouseOver}
      >
        <svg width="100%" height="100%">
          {shapes.map(renderShape)}

          {isDrawing && <polyline points={currentShape.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke="purple" strokeWidth="2" />}

          {isHovering && (
            <text x={mousePosition.x} y={mousePosition.y - 10} fill="black">
              {`(${mousePosition.x}, ${mousePosition.y})`}
            </text>
          )}
        </svg>
      </div>
    </div>
  );
};

export default ShapeCreator;
