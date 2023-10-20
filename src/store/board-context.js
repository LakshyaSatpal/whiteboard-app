import React, { useReducer } from "react";
import { TOOL_ITEMS } from "../constants";
import { BOARD_ACTIONS } from "./actions";

const initialState = {
  activeToolItem: TOOL_ITEMS.LINE,
  drawing: false,
  lineToolElements: [],
  pencilToolPoints: [],
};

const BoardContext = React.createContext({
  activeToolItem: "",
  drawing: false,
  lineToolElements: [],
  pencilToolPoints: [],
});

const boardReducer = (state, action) => {
  switch (action.type) {
    case BOARD_ACTIONS.CHANGE_TOOL:
      return { ...state, activeToolItem: action.tool };
    case BOARD_ACTIONS.START_DRAWING: {
      return { ...state, drawing: true };
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
    case BOARD_ACTIONS.UPDATE_LAST_LINE_ELEMENT: {
      const elementsCopy = [...state.lineToolElements];
      elementsCopy[elementsCopy.length - 1] = action.element;
      return {
        ...state,
        lineToolElements: elementsCopy,
      };
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
