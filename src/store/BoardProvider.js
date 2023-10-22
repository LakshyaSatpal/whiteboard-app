import { useReducer } from "react";
import { BOARD_ACTIONS, TOOL_ACTION_TYPES, TOOL_ITEMS } from "../constants";
import { createRoughElement } from "../components/Board";
import { adjustElementCoordinates } from "../components/Board";
import BoardContext from "./board-context";

const initialBoardState = {
  activeToolItem: TOOL_ITEMS.LINE,
  toolActionType: TOOL_ACTION_TYPES.NONE,
  drawing: false,
  elements: [],
  points: [],
  path: [],
  selectedElement: null,
};

const midPointBtw = (p1, p2) => {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
  };
};

const boardReducer = (state, action) => {
  switch (action.type) {
    case BOARD_ACTIONS.CHANGE_TOOL:
      return { ...state, activeToolItem: action.payload.tool };
    case BOARD_ACTIONS.SKETCH_DOWN: {
      const transparency = "1.0";
      const newEle = {
        clientX: action.payload.clientX,
        clientY: action.payload.clientY,
        transparency,
      };
      const newPencilToolPoints = [...state.points, newEle];
      return {
        ...state,
        points: newPencilToolPoints,
        toolActionType: TOOL_ACTION_TYPES.SKETCHING,
        drawing: true,
      };
    }
    case BOARD_ACTIONS.DRAW_DOWN: {
      const id = state.elements.length;
      const { clientX, clientY } = action.payload;
      const newElement = createRoughElement(
        id,
        clientX,
        clientY,
        clientX,
        clientY,
        state.activeToolItem
      );
      const newLineToolElements = [...state.elements, newElement];
      return {
        ...state,
        elements: newLineToolElements,
        toolActionType: TOOL_ACTION_TYPES.DRAWING,
        selectedElement: newElement,
      };
    }
    case BOARD_ACTIONS.SKETCH_MOVE: {
      const curPoints = state.points;
      const transparency = curPoints[curPoints.length - 1].transparency;
      const newEle = {
        clientX: action.payload.clientX,
        clientY: action.payload.clientY,
        transparency,
      };
      const newPencilToolPoints = [...state.points, newEle];
      return { ...state, points: newPencilToolPoints };
    }
    case BOARD_ACTIONS.DRAW_MOVE: {
      const { clientX, clientY } = action.payload;
      const index = state.elements.length - 1;
      const { x1, y1, type } = state.elements[index];
      const newEle = createRoughElement(index, x1, y1, clientX, clientY, type);
      const elementsCopy = [...state.elements];
      elementsCopy[index] = newEle;
      return { ...state, elements: elementsCopy };
    }
    case BOARD_ACTIONS.DRAW_UP: {
      const index = state.selectedElement.id;
      const elements = state.elements;
      const { id, type } = elements[index];
      const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
      const newEle = createRoughElement(id, x1, y1, x2, y2, type);
      const elementsCopy = [...state.elements];
      elementsCopy[id] = newEle;

      return {
        ...state,
        elements: elementsCopy,
        toolActionType: TOOL_ACTION_TYPES.NONE,
      };
    }
    case BOARD_ACTIONS.SKETCH_UP: {
      const curPoints = state.points;
      return {
        ...state,
        path: [...state.path, curPoints],
        points: [],
        drawing: false,
        toolActionType: TOOL_ACTION_TYPES.NONE,
      };
    }
    default: {
      return state;
    }
  }
};

export const BoardContextProvider = ({ children }) => {
  const [boardState, dispatchBoardAction] = useReducer(
    boardReducer,
    initialBoardState
  );

  const changeToolHandler = (tool) => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.CHANGE_TOOL,
      payload: { tool },
    });
  };

  const boardMouseDownHandler = (event, context) => {
    const { clientX, clientY } = event;
    if (boardState.activeToolItem === TOOL_ITEMS.PENCIL) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.SKETCH_DOWN,
        payload: {
          clientX,
          clientY,
        },
      });
      context.lineCap = 5;
      context.moveTo(clientX, clientY);
      context.beginPath();
    } else if (
      boardState.activeToolItem === TOOL_ITEMS.LINE ||
      boardState.activeToolItem === TOOL_ITEMS.RECTANGLE ||
      boardState.activeToolItem === TOOL_ITEMS.CIRCLE
    ) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.DRAW_DOWN,
        payload: {
          clientX,
          clientY,
        },
      });
    }
  };

  const boardMouseUpHandler = (event, context) => {
    if (boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING) {
      dispatchBoardAction({ type: BOARD_ACTIONS.DRAW_UP });
    } else if (boardState.toolActionType === TOOL_ACTION_TYPES.SKETCHING) {
      context.closePath();
      dispatchBoardAction({
        type: BOARD_ACTIONS.SKETCH_UP,
      });
    }
  };

  const boardMouseMoveHandler = (event, context) => {
    const { clientX, clientY } = event;
    if (boardState.toolActionType === TOOL_ACTION_TYPES.SKETCHING) {
      if (!boardState.drawing) return;
      dispatchBoardAction({
        type: BOARD_ACTIONS.SKETCH_MOVE,
        payload: {
          clientX,
          clientY,
        },
      });
      const midPoint = midPointBtw(clientX, clientY);
      context.quadraticCurveTo(clientX, clientY, midPoint.x, midPoint.y);
      context.lineTo(clientX, clientY);
      context.stroke();
    } else if (boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.DRAW_MOVE,
        payload: {
          clientX,
          clientY,
        },
      });
    }
  };

  const boardContext = {
    activeToolItem: boardState.activeToolItem,
    toolActionType: boardState.toolActionType,
    drawing: boardState.drawing,
    elements: boardState.elements,
    points: boardState.points,
    path: boardState.path,
    selectedElement: boardState.selectedElement,
    changeTool: changeToolHandler,
    boardMouseDown: boardMouseDownHandler,
    boardMouseMove: boardMouseMoveHandler,
    boardMouseUp: boardMouseUpHandler,
  };

  return (
    <BoardContext.Provider value={boardContext}>
      {children}
    </BoardContext.Provider>
  );
};
