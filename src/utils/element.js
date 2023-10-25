import rough from "roughjs/bin/rough";
import { ARROW_LENGTH, TOOL_ITEMS } from "../constants";
import { getArrowHeadsCoordinates, isPointCloseToLine } from "./math";

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
      seed: index,
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
  } else if (type === TOOL_ITEMS.ARROW) {
    const { x3, y3, x4, y4 } = getArrowHeadsCoordinates(
      x1,
      y1,
      x2,
      y2,
      ARROW_LENGTH
    );
    const points = [
      [x1, y1],
      [x2, y2],
      [x3, y3],
      [x2, y2],
      [x4, y4],
    ];
    roughEle = gen.linearPath(points, options);
    console.log(roughEle);
  }
  return { id: index, type, x1, y1, x2, y2, roughEle };
};

export const adjustElementCoordinates = (element) => {
  const { x1, y1, x2, y2 } = element;
  if (x1 < x2 || (x1 === x2 && y1 < y2)) {
    return { x1, y1, x2, y2 };
  } else {
    return { x1: x2, y1: y2, x2: x1, y2: y1 };
  }
};

export const isPointNearElement = (element, { pointX, pointY }) => {
  const { x1, y1, x2, y2, type } = element;
  if (type === TOOL_ITEMS.LINE) {
    return isPointCloseToLine(x1, y1, x2, y2, pointX, pointY);
  } else if (type === TOOL_ITEMS.RECTANGLE) {
    return (
      isPointCloseToLine(x1, y1, x2, y1, pointX, pointY) ||
      isPointCloseToLine(x2, y1, x2, y2, pointX, pointY) ||
      isPointCloseToLine(x2, y2, x1, y2, pointX, pointY) ||
      isPointCloseToLine(x1, y2, x1, y1, pointX, pointY)
    );
  }
};
