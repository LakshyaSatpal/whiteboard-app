import React, {
  createElement,
  useContext,
  useLayoutEffect,
  useRef,
} from "react";
import rough from "roughjs/bundled/rough.esm";
import BoardContext from "../../store/board-context";
import { BOARD_ACTIONS } from "../../store/actions";
import { TOOL_ACTIONS, TOOL_ITEMS } from "../../constants";

const gen = rough.generator();

const createRoughElement = (x1, y1, x2, y2) => {
  const roughEle = gen.line(x1, y1, x2, y2);

  return { x1, y1, x2, y2, roughEle };
};

const midPointBtw = (p1, p2) => {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
  };
};

export const adjustElementCoordinates = (element) => {
  const { type, x1, y1, x2, y2 } = element;
  if (x1 < x2 || (x1 === x2 && y1 < y2)) {
    return { x1, y1, x2, y2 };
  } else {
    return { x1: x2, y1: y2, x2: x1, y2: y1 };
  }
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

    if (state.activeToolItem === TOOL_ITEMS.LINE) {
      state.lineToolElements.forEach((ele) => rc.draw(ele.roughEle));
    } else if (state.activeToolItem === TOOL_ITEMS.PENCIL) {
      ctx.lineCap = "round";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;

      state.pencilToolPoints.forEach((ele) => {
        contextRef.current.lineTo(ele.x, ele.y);
        contextRef.current.stroke();
      });
    }
  }, [state.lineToolElements, state.pencilToolPoints, state.activeToolItem]);

  const startDrawing = (event) => {
    dispatch({ type: BOARD_ACTIONS.START_DRAWING });
    const { clientX, clientY } = event;
    if (state.activeToolItem === TOOL_ITEMS.LINE) {
      const newElement = createRoughElement(clientX, clientY, clientX, clientY);
      dispatch({
        type: BOARD_ACTIONS.ADD_NEW_LINE_ELEMENT,
        element: newElement,
      });
    }
  };

  const finishDrawing = () => {
    dispatch({ type: BOARD_ACTIONS.FINISH_DRAWING });
  };

  const draw = (event) => {
    if (!state.drawing) return;

    const { clientX, clientY } = event;

    if (state.activeToolItem === TOOL_ITEMS.LINE) {
      const lastIndex = state.lineToolElements.length - 1;
      const lastElement = state.lineToolElements[lastIndex];
      const { x1, y1 } = lastElement;
      const updatedElement = createRoughElement(x1, y1, clientX, clientY);

      dispatch({
        type: BOARD_ACTIONS.UPDATE_LAST_LINE_ELEMENT,
        element: updatedElement,
      });
    }
  };

  const handleMouseDown = (event) => {
    const { clientX, clientY } = event;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const id = state.lineToolElements.length;
    if (state.activeToolItem === TOOL_ITEMS.PENCIL) {
      dispatch({
        type: BOARD_ACTIONS.SET_TOOL_ACTION,
        toolAction: TOOL_ACTIONS.USING_PENCIL_TOOL,
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
    } else if (state.activeToolItem === TOOL_ITEMS.LINE) {
      dispatch({
        type: BOARD_ACTIONS.SET_TOOL_ACTION,
        toolAction: TOOL_ACTIONS.USING_LINE_TOOL,
      });
      const element = createRoughElement(clientX, clientY, clientX, clientY);
      dispatch({ type: BOARD_ACTIONS.ADD_NEW_LINE_ELEMENT, element });
      dispatch({ type: BOARD_ACTIONS.SET_SELECTED_ELEMENT, element });
      console.log(state.lineToolElements);
    }
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const { clientX, clientY } = e;

    if (state.toolAction === TOOL_ACTIONS.USING_PENCIL_TOOL) {
      if (!state.drawing) return;
      const points = state.pencilToolPoints;
      const transparency = points[points.length - 1].transparency;
      const newEle = { clientX, clientY, transparency };

      dispatch({ type: BOARD_ACTIONS.ADD_PENCIL_POINT, pos: newEle });
      const midPoint = midPointBtw(clientX, clientY);
      context.quadraticCurveTo(clientX, clientY, midPoint.x, midPoint.y);
      context.lineTo(clientX, clientY);
      context.stroke();
    } else if (state.toolAction === TOOL_ACTIONS.USING_LINE_TOOL) {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      const newEle = createRoughElement(x1, y1, clientX, clientY);
      dispatch({
        type: BOARD_ACTIONS.UPDATE_LAST_LINE_ELEMENT,
        element: newEle,
      });
    }
  };

  const handleMouseUp = () => {
    if (state.toolAction === TOOL_ACTIONS.USING_LINE_TOOL) {
      const index = selectedElement.id;
      const elements = state.lineToolElements;
      const { id, type, strokeWidth } = elements[index];
      const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
      const newEle = createRoughElement(x1, y1, x2, y2);
      dispatch({
        type: BOARD_ACTIONS.UPDATE_LAST_LINE_ELEMENT,
        element: newEle,
      });
    } else if (state.toolAction === TOOL_ACTIONS.USING_PENCIL_TOOL) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.closePath();
      const element = points;
      setPoints([]);
      setPath((prevState) => [...prevState, element]); //tuple
      setIsDrawing(false);
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
        onMouseUp={handleMouseMove}
        onMouseMove={draw}
      ></canvas>
    </div>
  );
};

export default Board;
