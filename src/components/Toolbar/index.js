import React from "react";
import { FaPen } from "react-icons/fa";

import classes from "./index.module.css";

const Toolbar = () => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.toolItem}>
        <FaPen />
      </div>
    </div>
  );
};

export default Toolbar;
