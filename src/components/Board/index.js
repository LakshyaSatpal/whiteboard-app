import React, { useContext, useRef, useEffect } from "react";
import rough from "roughjs/bundled/rough.esm";
import BoardContext from "../../store/board-context";
import { BOARD_ACTIONS } from "../../store/actions";
import { TOOL_ACTIONS, TOOL_ITEMS } from "../../constants";

const gen = rough.generator();

const createRoughElement = (index, x1, y1, x2, y2) => {
  const roughEle = gen.line(x1, y1, x2, y2);

  return { id: index, x1, y1, x2, y2, roughEle };
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
  const { state, dispatch } = useContext(BoardContext);

  useEffect(() => {
    const canvas = canvasRef.current;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.lineJoin = "round";

    context.save();

    const drawPath = () => {
      state.path.forEach((stroke, index) => {
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

    if (state.path !== undefined) {
      drawPath();
    }

    state.lineToolElements.forEach(({ roughEle }) => {
      context.globalAlpha = "1";
      roughCanvas.draw(roughEle);
    });

    return () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [state.lineToolElements, state.path]);

  const handleMouseDown = (event) => {
    const { clientX, clientY } = event;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const id = state.lineToolElements.length;
    if (state.activeToolItem === TOOL_ITEMS.PENCIL) {
      dispatch({
        type: BOARD_ACTIONS.SET_TOOL_ACTION,
        toolAction: TOOL_ACTIONS.SKETCHING,
      });
      dispatch({ type: BOARD_ACTIONS.START_DRAWING });
      const transparency = "1.0";
      const newEle = {
        clientX,
        clientY,
        transparency,
      };
      dispatch({ type: BOARD_ACTIONS.ADD_PENCIL_POINT, pos: newEle });

      context.lineCap = 5;
      context.moveTo(clientX, clientY);
      context.beginPath();
      // console.log(state.pencilToolPoints);
    } else if (state.activeToolItem === TOOL_ITEMS.LINE) {
      dispatch({
        type: BOARD_ACTIONS.SET_TOOL_ACTION,
        toolAction: TOOL_ACTIONS.DRAWING,
      });
      const element = createRoughElement(
        id,
        clientX,
        clientY,
        clientX,
        clientY
      );
      dispatch({ type: BOARD_ACTIONS.ADD_NEW_LINE_ELEMENT, element });
      dispatch({ type: BOARD_ACTIONS.SET_SELECTED_ELEMENT, element });
      console.log(state.lineToolElements);
    }
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const { clientX, clientY } = e;

    if (state.toolAction === TOOL_ACTIONS.SKETCHING) {
      if (!state.drawing) return;
      const points = state.pencilToolPoints;
      const transparency = points[points.length - 1].transparency;
      const newEle = { clientX, clientY, transparency };

      dispatch({ type: BOARD_ACTIONS.ADD_PENCIL_POINT, pos: newEle });
      const midPoint = midPointBtw(clientX, clientY);
      context.quadraticCurveTo(clientX, clientY, midPoint.x, midPoint.y);
      context.lineTo(clientX, clientY);
      context.stroke();
    } else if (state.toolAction === TOOL_ACTIONS.DRAWING) {
      const index = state.lineToolElements.length - 1;
      const { x1, y1 } = state.lineToolElements[index];
      const newEle = createRoughElement(index, x1, y1, clientX, clientY);
      dispatch({
        type: BOARD_ACTIONS.UPDATE_LINE_ELEMENT,
        payload: {
          index,
          element: newEle,
        },
      });
    }
  };

  const handleMouseUp = () => {
    if (state.toolAction === TOOL_ACTIONS.DRAWING) {
      const index = state.selectedElement.id;
      const elements = state.lineToolElements;
      const { id } = elements[index];
      const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
      const newEle = createRoughElement(id, x1, y1, x2, y2);
      dispatch({
        type: BOARD_ACTIONS.UPDATE_LINE_ELEMENT,
        payload: {
          index: id,
          element: newEle,
        },
      });
    } else if (state.toolAction === TOOL_ACTIONS.SKETCHING) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.closePath();
      dispatch({
        type: BOARD_ACTIONS.FINISH_SKETCHING,
      });
    }
    dispatch({
      type: BOARD_ACTIONS.SET_TOOL_ACTION,
      toolAction: TOOL_ACTIONS.NONE,
    });
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
