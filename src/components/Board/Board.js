import React, { useEffect, useRef } from "react";
import rough from "roughjs/bundled/rough.esm";

const gen = rough.generator();

const Board = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const rc = rough.canvas(canvas);
    const rect = gen.rectangle(100, 200, 200, 300);
    const circle = gen.circle(500, 300, 200);
    const line = gen.line(400, 500, 600, 500);
    rc.draw(rect);
    rc.draw(circle);
    rc.draw(line);
  }, []);

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default Board;
