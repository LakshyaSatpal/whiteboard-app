import React, { useContext } from "react";
import BoardContext from "../../store/board-context";
import {
  STROKE_TOOL_ITEMS,
  FILL_TOOL_ITEMS,
  COLOR_CONFIG_TYPES,
} from "../../constants";

import classes from "./index.module.css";
import PickColor from "./PickColor";

const Toolbox = () => {
  const { activeToolItem } = useContext(BoardContext);
  return (
    <div className={classes.container}>
      {STROKE_TOOL_ITEMS.includes(activeToolItem) && (
        <PickColor labelText="Stroke Color" type={COLOR_CONFIG_TYPES.STROKE} />
      )}
      {FILL_TOOL_ITEMS.includes(activeToolItem) && (
        <PickColor labelText="Fill Color" type={COLOR_CONFIG_TYPES.FILL} />
      )}
      <div className={classes.selectOptionContainer}>
        <label className={classes.toolBoxLabel}>Brush Size</label>
        <input type="range"></input>
      </div>
    </div>
  );
};

export default Toolbox;
