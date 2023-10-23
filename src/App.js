import Board from "./components/Board";
import Toolbar from "./components/Toolbar";
import { BoardContextProvider } from "./store/BoardProvider";
import Toolbox from "./components/Toolbox";

const App = () => {
  return (
    <BoardContextProvider>
      <Toolbar />
      <Toolbox />
      <Board />
    </BoardContextProvider>
  );
};

export default App;
