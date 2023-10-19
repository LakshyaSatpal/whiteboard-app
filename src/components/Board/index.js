import React, { useLayoutEffect, useRef, useState } from "react";
import rough from "roughjs/bundled/rough.esm";

const gen = rough.generator();

const createRoughElement = (x1, y1, x2, y2) => {
  const roughEle = gen.line(x1, y1, x2, y2);

  return { x1, y1, x2, y2, roughEle };
};

const Board = () => {
  const canvasRef = useRef(null);
  const [elements, setElements] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const rc = rough.canvas(canvas);

    elements.forEach((ele) => rc.draw(ele.roughEle));
  }, [elements]);

  const startDrawing = (event) => {
    setIsDrawing(true);
    const { clientX, clientY } = event;
    const newElement = createRoughElement(clientX, clientY, clientX, clientY);
    setElements((state) => [...state, newElement]);
  };

  const finishDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (event) => {
    if (!isDrawing) return;

    const { clientX, clientY } = event;

    const lastElement = elements[elements.length - 1];
    const { x1, y1 } = lastElement;
    const updatedElement = createRoughElement(x1, y1, clientX, clientY);

    const elementsCopy = [...elements];
    elementsCopy[elementsCopy.length - 1] = updatedElement;
    setElements(elementsCopy);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
      ></canvas>
    </div>
  );
};

export default Board;
