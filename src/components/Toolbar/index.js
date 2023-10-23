import React, { useContext } from "react";
import { FaPen, FaSlash, FaRegCircle, FaEraser } from "react-icons/fa";
import { LuRectangleHorizontal } from "react-icons/lu";
import cx from "classnames";

import BoardContext from "../../store/board-context";
import classes from "./index.module.css";
import { TOOL_ITEMS } from "../../constants";

const Toolbar = () => {
  const { activeToolItem, changeTool } = useContext(BoardContext);

  const handleToolClick = (tool) => {
    changeTool(tool);
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.container}>
        <div
          className={cx(classes.toolItem, {
            [classes.active]: activeToolItem === TOOL_ITEMS.LINE,
          })}
          onClick={() => handleToolClick(TOOL_ITEMS.LINE)}
        >
          <FaSlash />
        </div>
        <div
          className={cx(classes.toolItem, {
            [classes.active]: activeToolItem === TOOL_ITEMS.PENCIL,
          })}
          onClick={() => handleToolClick(TOOL_ITEMS.PENCIL)}
        >
          <FaPen />
        </div>
        <div
          className={cx(classes.toolItem, {
            [classes.active]: activeToolItem === TOOL_ITEMS.RECTANGLE,
          })}
          onClick={() => handleToolClick(TOOL_ITEMS.RECTANGLE)}
        >
          <LuRectangleHorizontal />
        </div>
        <div
          className={cx(classes.toolItem, {
            [classes.active]: activeToolItem === TOOL_ITEMS.CIRCLE,
          })}
          onClick={() => handleToolClick(TOOL_ITEMS.CIRCLE)}
        >
          <FaRegCircle />
        </div>
        <div
          className={cx(classes.toolItem, {
            [classes.active]: activeToolItem === TOOL_ITEMS.ERASER,
          })}
          onClick={() => handleToolClick(TOOL_ITEMS.ERASER)}
        >
          <FaEraser />
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
