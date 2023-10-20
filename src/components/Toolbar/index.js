import React, { useContext } from "react";
import { FaPen, FaSlash } from "react-icons/fa";
import cx from "classnames";

import BoardContext from "../../store/board-context";
import classes from "./index.module.css";
import { TOOL_ITEMS } from "../../constants";

const Toolbar = () => {
  const { state, dispatch } = useContext(BoardContext);
  // const [activeToolItem, setActiveToolItem] = useState(TOOL_ITEMS.LINE);

  const handleToolClick = (tool) => {
    dispatch({ type: "CHANGE_TOOL", tool: tool });
  };

  return (
    <div className={classes.wrapper}>
      <div
        className={cx(classes.toolItem, {
          [classes.active]: state.activeToolItem === TOOL_ITEMS.LINE,
        })}
        onClick={() => handleToolClick(TOOL_ITEMS.LINE)}
      >
        <FaSlash />
      </div>
      <div
        className={cx(classes.toolItem, {
          [classes.active]: state.activeToolItem === TOOL_ITEMS.PENCIL,
        })}
        onClick={() => handleToolClick(TOOL_ITEMS.PENCIL)}
      >
        <FaPen />
      </div>
    </div>
  );
};

export default Toolbar;
