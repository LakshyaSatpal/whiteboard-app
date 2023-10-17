import { useEffect } from "react";
import rough from "roughjs/bundled/rough.esm";

const gen = rough.generator();

const App = () => {
  useEffect(() => {
    console.log("App running");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

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
      <h1>Virtual Whiteboard</h1>
      <canvas
        id="canvas"
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
    </div>
  );
};

export default App;
