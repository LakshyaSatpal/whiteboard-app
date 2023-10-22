import React from "react";
import { TOOL_ACTION_TYPES } from "../constants";

const BoardContext = React.createContext({
  activeToolItem: "",
  toolActionType: TOOL_ACTION_TYPES.NONE,
  drawing: false,
  elements: [],
  points: [],
  path: [],
  selectedElement: null,
});

export default BoardContext;
