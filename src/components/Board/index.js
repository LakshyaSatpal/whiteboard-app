import React, { useContext, useRef, useEffect } from "react";
import rough from "roughjs/bundled/rough.esm";
import BoardContext from "../../store/board-context";
import { TOOL_ITEMS } from "../../constants";

const gen = rough.generator();

export const createRoughElement = (index, x1, y1, x2, y2, type) => {
  let roughEle = {};
  if (type === TOOL_ITEMS.LINE) {
    roughEle = gen.line(x1, y1, x2, y2);
  } else if (type === TOOL_ITEMS.RECTANGLE) {
    roughEle = gen.rectangle(x1, y1, x2 - x1, y2 - y1);
  } else if (type === TOOL_ITEMS.CIRCLE) {
    const diam = 2 * (x2 - x1 + y2 - y1);
    roughEle = gen.circle(x1, y1, diam);
  }
  return { id: index, type, x1, y1, x2, y2, roughEle };
};

const midPointBtw = (p1, p2) => {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
  };
};

export const adjustElementCoordinates = (element) => {
  const { x1, y1, x2, y2 } = element;
  if (x1 < x2 || (x1 === x2 && y1 < y2)) {
    return { x1, y1, x2, y2 };
  } else {
    return { x1: x2, y1: y2, x2: x1, y2: y1 };
  }
};

const Board = () => {
  const canvasRef = useRef(null);
  const { elements, path, boardMouseDown, boardMouseUp, boardMouseMove } =
    useContext(BoardContext);

  useEffect(() => {
    const canvas = canvasRef.current;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.lineJoin = "round";

    context.save();

    const drawPath = () => {
      path.forEach((stroke, index) => {
        context.beginPath();

        stroke.forEach((point, i) => {
          const midPoint = midPointBtw(point.clientX, point.clientY);

          context.quadraticCurveTo(
            point.clientX,
            point.clientY,
            midPoint.x,
            midPoint.y
          );
          context.lineTo(point.clientX, point.clientY);
          context.stroke();
        });
        context.closePath();
        context.save();
      });
    };
    const roughCanvas = rough.canvas(canvas);

    if (path !== undefined) {
      drawPath();
    }
    elements.forEach(({ roughEle }) => {
      context.globalAlpha = "1";
      roughCanvas.draw(roughEle);
    });

    return () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [elements, path]);

  const handleMouseDown = (event) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    boardMouseDown(event, context);
  };

  const handleMouseMove = (event) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    boardMouseMove(event, context);
  };

  const handleMouseUp = (event) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    boardMouseUp(event, context);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      ></canvas>
    </div>
  );
};

export default Board;
