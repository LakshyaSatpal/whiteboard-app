import rough from "roughjs/bundled/rough.esm";
import { TOOL_ITEMS } from "./constants";

const gen = rough.generator();

export const createRoughElement = (
  index,
  x1,
  y1,
  x2,
  y2,
  { type, stroke, fill, size }
) => {
  let roughEle = {},
    options = {
      strokeWidth: 3,
    };
  if (stroke && stroke.length > 0) options.stroke = stroke;
  if (fill && fill.length > 0) {
    options.fill = fill;
    options.fillStyle = "solid";
  }
  if (size) options.strokeWidth = size;
  if (type === TOOL_ITEMS.LINE) {
    roughEle = gen.line(x1, y1, x2, y2, options);
  } else if (type === TOOL_ITEMS.RECTANGLE) {
    roughEle = gen.rectangle(x1, y1, x2 - x1, y2 - y1, options);
  } else if (type === TOOL_ITEMS.CIRCLE) {
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;
    const width = x2 - x1,
      height = y2 - y1;
    roughEle = gen.ellipse(cx, cy, width, height, options);
  }
  return { id: index, type, x1, y1, x2, y2, roughEle };
};

export const midPointBtw = (p1, p2) => {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
  };
};

export const adjustElementCoordinates = (element) => {
  const { x1, y1, x2, y2 } = element;
  if (x1 < x2 || (x1 === x2 && y1 < y2)) {
    return { x1, y1, x2, y2 };
  } else {
    return { x1: x2, y1: y2, x2: x1, y2: y1 };
  }
};
