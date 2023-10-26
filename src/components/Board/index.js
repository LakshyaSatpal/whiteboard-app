import React, { useContext, useRef, useEffect } from "react";
import BoardContext from "../../store/board-context";
import rough from "roughjs/bundled/rough.esm";
import { midPointBtw } from "../../utils/math";
import ToolboxContext from "../../store/toolbox-context";
import { drawElement } from "../../utils/element";
import { TOOL_ACTION_TYPES } from "../../constants";

import classes from "./index.module.css";

const Board = () => {
  const canvasRef = useRef();
  const textAreaRef = useRef();
  const {
    elements,
    path,
    boardMouseDown,
    boardMouseUp,
    boardMouseMove,
    toolActionType,
    selectedElement,
    textAreaBlur,
  } = useContext(BoardContext);
  const { toolboxState } = useContext(ToolboxContext);

  useEffect(() => {
    const canvas = canvasRef.current;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
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

    elements.forEach((element) => {
      drawElement(roughCanvas, context, element);
    });

    return () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [elements, path]);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (toolActionType === TOOL_ACTION_TYPES.WRITING) {
      setTimeout(() => {
        textArea.focus();
      }, 0);
    }
  }, [toolActionType, selectedElement]);

  const handleMouseDown = (event) => {
    if (toolActionType === TOOL_ACTION_TYPES.WRITING) return;
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
    <>
      {toolActionType === TOOL_ACTION_TYPES.WRITING ? (
        <textarea
          ref={textAreaRef}
          type="text"
          className={classes.textElementBox}
          style={{
            top: selectedElement.y1,
            left: selectedElement.x1,
            fontSize: `${selectedElement.textEle?.size}px`,
            color: selectedElement.textEle?.stroke,
          }}
          onBlur={(event) => textAreaBlur(event, toolboxState)}
        />
      ) : null}
      <div>
        <canvas
          ref={canvasRef}
          id="canvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        ></canvas>
      </div>
    </>
  );
};

export default Board;
