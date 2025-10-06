import { useState } from "react";
import Header from "./components/Header";
import GameInputs from "./components/GameInputs";
import BoardDisplay from "./components/BoardDisplay";
import Board from "./game_objects/Board";

function App() {
  // Game Settings
  const [boardSize, setBoardSize] = useState(10);
  const [difficulty, setDifficulty] = useState("easy");

  // Populate board with zeros
  const board = new Board(boardSize);
  let [row, col] = board.getAvailableCellCoord();
  board.updateCellValue(row, col, 67);
  [row, col] = board.getAvailableCellCoord();
  board.updateCellValue(row, col, 1);

  return (
    <>
      <Header>Jingle Snake</Header>
      <GameInputs
        boardSize={boardSize}
        setBoardSize={setBoardSize}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
      />
      <br></br>
      <BoardDisplay board={board} />
    </>
  );
}

export default App;
