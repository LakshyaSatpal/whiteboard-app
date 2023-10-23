import React, { useContext } from "react";
import cx from "classnames";
import ToolboxContext from "../../store/toolbox-context";
import { COLORS } from "../../constants";

import classes from "./index.module.css";
import BoardContext from "../../store/board-context";

const PickColor = ({ labelText }) => {
  const { toolboxState, changeStroke } = useContext(ToolboxContext);
  const { activeToolItem } = useContext(BoardContext);
  const color = toolboxState[activeToolItem].stroke;

  const colorClickHandler = (newColor) => {
    changeStroke(activeToolItem, newColor);
  };

  return (
    <div className={classes.selectOptionContainer}>
      <label className={classes.toolBoxLabel}>{labelText}</label>
      <div className={classes.colorsContainer}>
        <div
          className={cx(classes.colorBox, {
            [classes.activeColorBox]: color === COLORS.BLACK,
          })}
          style={{ backgroundColor: COLORS.BLACK }}
          onClick={() => colorClickHandler(COLORS.BLACK)}
        ></div>
        <div
          className={cx(classes.colorBox, {
            [classes.activeColorBox]: color === COLORS.RED,
          })}
          style={{ backgroundColor: COLORS.RED }}
          onClick={() => colorClickHandler(COLORS.RED)}
        ></div>
        <div
          className={cx(classes.colorBox, {
            [classes.activeColorBox]: color === COLORS.GREEN,
          })}
          style={{ backgroundColor: COLORS.GREEN }}
          onClick={() => colorClickHandler(COLORS.GREEN)}
        ></div>
        <div
          className={cx(classes.colorBox, {
            [classes.activeColorBox]: color === COLORS.BLUE,
          })}
          style={{ backgroundColor: COLORS.BLUE }}
          onClick={() => colorClickHandler(COLORS.BLUE)}
        ></div>
        <div
          className={cx(classes.colorBox, {
            [classes.activeColorBox]: color === COLORS.ORANGE,
          })}
          style={{ backgroundColor: COLORS.ORANGE }}
          onClick={() => colorClickHandler(COLORS.ORANGE)}
        ></div>
        <div
          className={cx(classes.colorBox, {
            [classes.activeColorBox]: color === COLORS.YELLOW,
          })}
          style={{ backgroundColor: COLORS.YELLOW }}
          onClick={() => colorClickHandler(COLORS.YELLOW)}
        ></div>
      </div>
    </div>
  );
};

export default PickColor;
