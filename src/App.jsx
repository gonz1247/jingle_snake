import { useState } from "react";
import Header from "./components/Header";
import GameInputs from "./components/GameInputs";
import BoardDisplay from "./components/Board";

function App() {
  // Game Settings
  const [boardSize, setBoardSize] = useState(10);
  const [difficulty, setDifficulty] = useState("easy");

  // Populate board with zeros
  const board = Array(boardSize)
    .fill(null)
    .map(() => Array(boardSize).fill(0));

  board[3][5] = 67;
  board[0][0] = 1;

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
