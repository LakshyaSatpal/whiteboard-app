import React, { useContext } from "react";
import cx from "classnames";
import ToolboxContext from "../../store/toolbox-context";
import { COLORS, COLOR_CONFIG_TYPES } from "../../constants";

import classes from "./index.module.css";
import BoardContext from "../../store/board-context";

const PickColor = ({ labelText, type }) => {
  const { toolboxState, changeStroke, changeFill } = useContext(ToolboxContext);
  const { activeToolItem } = useContext(BoardContext);
  const strokeColor = toolboxState[activeToolItem]?.stroke;
  const fillColor = toolboxState[activeToolItem]?.fill;

  const colorClickHandler = (newColor) => {
    if (type === COLOR_CONFIG_TYPES.STROKE) {
      changeStroke(activeToolItem, newColor);
    } else if (type === COLOR_CONFIG_TYPES.FILL) {
      changeFill(activeToolItem, newColor);
    }
  };

  return (
    <div className={classes.selectOptionContainer}>
      <label className={classes.toolBoxLabel}>{labelText}</label>
      <div className={classes.colorsContainer}>
        <div
          className={cx(classes.colorBox, {
            [classes.activeColorBox]:
              type === COLOR_CONFIG_TYPES.STROKE
                ? strokeColor === COLORS.BLACK
                : fillColor === COLORS.BLACK,
          })}
          style={{ backgroundColor: COLORS.BLACK }}
          onClick={() => colorClickHandler(COLORS.BLACK)}
        ></div>
        <div
          className={cx(classes.colorBox, {
            [classes.activeColorBox]:
              type === COLOR_CONFIG_TYPES.STROKE
                ? strokeColor === COLORS.RED
                : fillColor === COLORS.RED,
          })}
          style={{ backgroundColor: COLORS.RED }}
          onClick={() => colorClickHandler(COLORS.RED)}
        ></div>
        <div
          className={cx(classes.colorBox, {
            [classes.activeColorBox]:
              type === COLOR_CONFIG_TYPES.STROKE
                ? strokeColor === COLORS.GREEN
                : fillColor === COLORS.GREEN,
          })}
          style={{ backgroundColor: COLORS.GREEN }}
          onClick={() => colorClickHandler(COLORS.GREEN)}
        ></div>
        <div
          className={cx(classes.colorBox, {
            [classes.activeColorBox]:
              type === COLOR_CONFIG_TYPES.STROKE
                ? strokeColor === COLORS.BLUE
                : fillColor === COLORS.BLUE,
          })}
          style={{ backgroundColor: COLORS.BLUE }}
          onClick={() => colorClickHandler(COLORS.BLUE)}
        ></div>
        <div
          className={cx(classes.colorBox, {
            [classes.activeColorBox]:
              type === COLOR_CONFIG_TYPES.STROKE
                ? strokeColor === COLORS.ORANGE
                : fillColor === COLORS.ORANGE,
          })}
          style={{ backgroundColor: COLORS.ORANGE }}
          onClick={() => colorClickHandler(COLORS.ORANGE)}
        ></div>
        <div
          className={cx(classes.colorBox, {
            [classes.activeColorBox]:
              type === COLOR_CONFIG_TYPES.STROKE
                ? strokeColor === COLORS.YELLOW
                : fillColor === COLORS.YELLOW,
          })}
          style={{ backgroundColor: COLORS.YELLOW }}
          onClick={() => colorClickHandler(COLORS.YELLOW)}
        ></div>
      </div>
    </div>
  );
};

export default PickColor;
