import { useReducer } from "react";
import { BOARD_ACTIONS, TOOL_ACTION_TYPES, TOOL_ITEMS } from "../constants";
import { createRoughElement } from "../components/Board";
import { adjustElementCoordinates } from "../components/Board";
import BoardContext from "./board-context";

const initialBoardState = {
  activeToolItem: TOOL_ITEMS.LINE,
  toolActionType: TOOL_ACTION_TYPES.NONE,
  drawing: false,
  lineToolElements: [],
  pencilToolPoints: [],
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
    case BOARD_ACTIONS.PENCIL_DOWN: {
      const transparency = "1.0";
      const newEle = {
        clientX: action.payload.clientX,
        clientY: action.payload.clientY,
        transparency,
      };
      const newPencilToolPoints = [...state.pencilToolPoints, newEle];
      return {
        ...state,
        pencilToolPoints: newPencilToolPoints,
        toolActionType: TOOL_ACTION_TYPES.SKETCHING,
        drawing: true,
      };
    }
    case BOARD_ACTIONS.LINE_DOWN: {
      const id = state.lineToolElements.length;
      const { clientX, clientY } = action.payload;
      const newElement = createRoughElement(
        id,
        clientX,
        clientY,
        clientX,
        clientY
      );
      const newLineToolElements = [...state.lineToolElements, newElement];
      return {
        ...state,
        lineToolElements: newLineToolElements,
        toolActionType: TOOL_ACTION_TYPES.DRAWING,
        selectedElement: newElement,
      };
    }
    case BOARD_ACTIONS.SKETCH_MOVE: {
      const points = state.pencilToolPoints;
      const transparency = points[points.length - 1].transparency;
      const newEle = {
        clientX: action.payload.clientX,
        clientY: action.payload.clientY,
        transparency,
      };
      const newPencilToolPoints = [...state.pencilToolPoints, newEle];
      return { ...state, pencilToolPoints: newPencilToolPoints };
    }
    case BOARD_ACTIONS.DRAW_MOVE: {
      const { clientX, clientY } = action.payload;
      const index = state.lineToolElements.length - 1;
      const { x1, y1 } = state.lineToolElements[index];
      const newEle = createRoughElement(index, x1, y1, clientX, clientY);
      const elementsCopy = [...state.lineToolElements];
      elementsCopy[index] = newEle;
      return { ...state, lineToolElements: elementsCopy };
    }
    case BOARD_ACTIONS.DRAW_UP: {
      const index = state.selectedElement.id;
      const elements = state.lineToolElements;
      const { id } = elements[index];
      const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
      const newEle = createRoughElement(id, x1, y1, x2, y2);
      const elementsCopy = [...state.lineToolElements];
      elementsCopy[id] = newEle;

      return {
        ...state,
        lineToolElements: elementsCopy,
        toolActionType: TOOL_ACTION_TYPES.NONE,
      };
    }
    case BOARD_ACTIONS.SKETCH_UP: {
      const points = state.pencilToolPoints;
      return {
        ...state,
        path: [...state.path, points],
        pencilToolPoints: [],
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
        type: BOARD_ACTIONS.PENCIL_DOWN,
        payload: {
          clientX,
          clientY,
        },
      });
      context.lineCap = 5;
      context.moveTo(clientX, clientY);
      context.beginPath();
    } else if (boardState.activeToolItem === TOOL_ITEMS.LINE) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.LINE_DOWN,
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
    lineToolElements: boardState.lineToolElements,
    pencilToolPoints: boardState.pencilToolPoints,
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
