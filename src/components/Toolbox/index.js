import React, { useContext } from "react";
import BoardContext from "../../store/board-context";
import { TOOL_ITEMS } from "../../constants";

import classes from "./index.module.css";
import PickColor from "./PickColor";

const STROKE_TOOL_ITEMS = [
  TOOL_ITEMS.LINE,
  TOOL_ITEMS.PENCIL,
  TOOL_ITEMS.RECTANGLE,
  TOOL_ITEMS.CIRCLE,
];
const FILL_TOOL_ITEMS = [TOOL_ITEMS.RECTANGLE, TOOL_ITEMS.CIRCLE];

const Toolbox = () => {
  const { activeToolItem } = useContext(BoardContext);
  return (
    <div className={classes.wrapper}>
      <div className={classes.container}>
        {STROKE_TOOL_ITEMS.includes(activeToolItem) && (
          <PickColor labelText="Stroke Color" />
        )}
        {FILL_TOOL_ITEMS.includes(activeToolItem) && (
          <PickColor labelText="Fill Color" />
        )}
        <div className={classes.selectOptionContainer}>
          <label className={classes.toolBoxLabel}>Brush Size</label>
          <input type="range"></input>
        </div>
      </div>
    </div>
  );
};

export default Toolbox;
