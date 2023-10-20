import React, { useContext, useLayoutEffect, useRef } from "react";
import rough from "roughjs/bundled/rough.esm";
import BoardContext from "../../store/board-context";
import { BOARD_ACTIONS } from "../../store/actions";

const gen = rough.generator();

const createRoughElement = (x1, y1, x2, y2) => {
  const roughEle = gen.line(x1, y1, x2, y2);

  return { x1, y1, x2, y2, roughEle };
};

const Board = () => {
  const canvasRef = useRef(null);
  const { state, dispatch } = useContext(BoardContext);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const rc = rough.canvas(canvas);

    state.lineToolElements.forEach((ele) => rc.draw(ele.roughEle));
  }, [state.lineToolElements]);

  const startDrawing = (event) => {
    dispatch({ type: BOARD_ACTIONS.START_DRAWING });
    const { clientX, clientY } = event;
    const newElement = createRoughElement(clientX, clientY, clientX, clientY);
    dispatch({
      type: BOARD_ACTIONS.ADD_NEW_LINE_ELEMENT,
      element: newElement,
    });
  };

  const finishDrawing = () => {
    dispatch({ type: BOARD_ACTIONS.FINISH_DRAWING });
  };

  const draw = (event) => {
    if (!state.drawing) return;

    const { clientX, clientY } = event;
    const lastIndex = state.lineToolElements.length - 1;
    const lastElement = state.lineToolElements[lastIndex];
    const { x1, y1 } = lastElement;
    const updatedElement = createRoughElement(x1, y1, clientX, clientY);

    dispatch({
      type: BOARD_ACTIONS.UPDATE_LAST_LINE_ELEMENT,
      element: updatedElement,
    });
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
