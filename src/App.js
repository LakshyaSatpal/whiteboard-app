import Board from "./components/Board";
import Toolbar from "./components/Toolbar";
import { BoardContextProvider } from "./store/BoardProvider";

const App = () => {
  return (
    <BoardContextProvider>
      <Toolbar />
      <Board />
    </BoardContextProvider>
  );
};

export default App;
