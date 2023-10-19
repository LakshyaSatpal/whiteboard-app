import React, { useState } from "react";
import { FaPen, FaSlash } from "react-icons/fa";
import cx from "classnames";

import classes from "./index.module.css";
import { TOOL_ITEMS } from "../../constants";

const Toolbar = () => {
  const [activeToolItem, setActiveToolItem] = useState(TOOL_ITEMS.LINE);

  const handleToolClick = (tool) => {
    setActiveToolItem(tool);
  };

  return (
    <div className={classes.wrapper}>
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
    </div>
  );
};

export default Toolbar;
