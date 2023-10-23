import React from "react";
import { COLORS } from "../../constants";

import classes from "./index.module.css";

const PickColor = ({ labelText }) => {
  return (
    <div className={classes.selectOptionContainer}>
      <label className={classes.toolBoxLabel}>{labelText}</label>
      <div className={classes.colorsContainer}>
        <div
          className={classes.colorBox}
          style={{ backgroundColor: COLORS.BLACK }}
        ></div>
        <div
          className={classes.colorBox}
          style={{ backgroundColor: COLORS.RED }}
        ></div>
        <div
          className={classes.colorBox}
          style={{ backgroundColor: COLORS.GREEN }}
        ></div>
        <div
          className={classes.colorBox}
          style={{ backgroundColor: COLORS.BLUE }}
        ></div>
        <div
          className={classes.colorBox}
          style={{ backgroundColor: COLORS.ORANGE }}
        ></div>
        <div
          className={classes.colorBox}
          style={{ backgroundColor: COLORS.WHITE }}
        ></div>
        <div
          className={classes.colorBox}
          style={{ backgroundColor: COLORS.YELLOW }}
        ></div>
      </div>
    </div>
  );
};

export default PickColor;
