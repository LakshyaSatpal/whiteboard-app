import React, { useReducer } from "react";
import { TOOL_ACTIONS, TOOL_ITEMS } from "../constants";
import { BOARD_ACTIONS } from "./actions";

const initialState = {
  activeToolItem: TOOL_ITEMS.LINE,
  toolAction: TOOL_ACTIONS.NONE,
  drawing: false,
  lineToolElements: [],
  pencilToolPoints: [],
  path: [],
  selectedElement: null,
};

const BoardContext = React.createContext({
  activeToolItem: "",
  toolAction: TOOL_ITEMS.NONE,
  drawing: false,
  lineToolElements: [],
  pencilToolPoints: [],
  path: [],
  selectedElement: null,
});

const boardReducer = (state, action) => {
  switch (action.type) {
    case BOARD_ACTIONS.CHANGE_TOOL:
      return { ...state, activeToolItem: action.tool };
    case BOARD_ACTIONS.START_DRAWING: {
      return { ...state, drawing: true };
    }
    case BOARD_ACTIONS.FINISH_SKETCHING: {
      return {
        ...state,
        path: [...state.path, state.pencilToolPoints],
        pencilToolPoints: [],
        drawing: false,
      };
    }
    case BOARD_ACTIONS.FINISH_DRAWING: {
      return { ...state, drawing: false };
    }
    case BOARD_ACTIONS.ADD_NEW_LINE_ELEMENT: {
      return {
        ...state,
        lineToolElements: [...state.lineToolElements, action.element],
      };
    }
    case BOARD_ACTIONS.UPDATE_LINE_ELEMENT: {
      const elementsCopy = [...state.lineToolElements];
      elementsCopy[action.payload.index] = action.payload.element;
      return {
        ...state,
        lineToolElements: elementsCopy,
      };
    }
    case BOARD_ACTIONS.ADD_PENCIL_POINT: {
      const newPencilToolPoints = state.pencilToolPoints.concat(action.pos);
      return { ...state, pencilToolPoints: newPencilToolPoints };
    }
    case BOARD_ACTIONS.SET_TOOL_ACTION: {
      return { ...state, toolAction: action.toolAction };
    }
    case BOARD_ACTIONS.SET_SELECTED_ELEMENT: {
      return { ...state, selectedElement: action.element };
    }
    default:
      return state;
  }
};

export const BoardContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(boardReducer, initialState);
  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
};

export default BoardContext;
