import ToolboxContext from "./toolbox-context";
import { COLORS, TOOLBOX_ACTIONS, TOOL_ITEMS } from "../constants";
import { useReducer } from "react";

const initialToolBoxState = {
  [TOOL_ITEMS.LINE]: {
    stroke: COLORS.BLACK,
  },
  [TOOL_ITEMS.PENCIL]: {
    stroke: COLORS.BLACK,
  },
  [TOOL_ITEMS.RECTANGLE]: {
    stroke: COLORS.BLACK,
    fill: "",
  },
  [TOOL_ITEMS.CIRCLE]: {
    stroke: COLORS.BLACK,
    fill: "",
  },
  [TOOL_ITEMS.ERASER]: {
    stroke: COLORS.WHITE,
  },
};

const toolboxReducer = (state, action) => {
  switch (action.type) {
    case TOOLBOX_ACTIONS.CHANGE_STROKE:
      const toolObjectCopy = state[action.payload.tool];
      toolObjectCopy.stroke = action.payload.stroke;
      return {
        ...state,
        [action.payload.tool]: toolObjectCopy,
      };
    default:
      return state;
  }
};

export const ToolboxContextProvider = ({ children }) => {
  const [toolboxState, dispatchToolboxAction] = useReducer(
    toolboxReducer,
    initialToolBoxState
  );

  const changeStrokeHandler = (tool, stroke) => {
    dispatchToolboxAction({
      type: TOOLBOX_ACTIONS.CHANGE_STROKE,
      payload: {
        tool,
        stroke,
      },
    });
  };

  const toolboxContext = {
    toolboxState,
    changeStroke: changeStrokeHandler,
  };

  return (
    <ToolboxContext.Provider value={toolboxContext}>
      {children}
    </ToolboxContext.Provider>
  );
};
