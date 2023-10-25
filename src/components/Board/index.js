import React, { useContext, useRef, useEffect } from "react";
import BoardContext from "../../store/board-context";
import rough from "roughjs/bundled/rough.esm";
import { midPointBtw } from "../../utils/math";
import ToolboxContext from "../../store/toolbox-context";

const Board = () => {
  const canvasRef = useRef(null);
  const { elements, path, boardMouseDown, boardMouseUp, boardMouseMove } =
    useContext(BoardContext);
  const { toolboxState } = useContext(ToolboxContext);

  useEffect(() => {
    const canvas = canvasRef.current;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.lineJoin = "round";

    context.save();

    const drawPath = () => {
      path.forEach((stroke) => {
        context.beginPath();

        stroke.forEach((point) => {
          const midPoint = midPointBtw(point.clientX, point.clientY);

          context.quadraticCurveTo(
            point.clientX,
            point.clientY,
            midPoint.x,
            midPoint.y
          );
          context.lineTo(point.clientX, point.clientY);
          context.strokeStyle = point.stroke;
          context.lineWidth = point.strokeWidth;
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
      roughCanvas.draw(roughEle);
    });

    return () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [elements, path]);

  const handleMouseDown = (event) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    boardMouseDown(event, context, toolboxState);
  };

  const handleMouseMove = (event) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    boardMouseMove(event, context, toolboxState);
  };

  const handleMouseUp = (event) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    boardMouseUp(event, context, toolboxState);
  };

  return (
    <div className="z-10">
      <canvas
        ref={canvasRef}
        id="canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      ></canvas>
    </div>
  );
};

export default Board;
