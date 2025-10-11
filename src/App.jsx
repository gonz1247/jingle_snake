import { useState } from "react";
import Header from "./components/Header";
import GameInputs from "./components/GameInputs";
import BoardDisplay from "./components/BoardDisplay";
import runJingleSnake from "./hooks/runJingleSnake";

function App() {
  // Game Settings
  const [boardSize, setBoardSize] = useState(10);
  const [difficulty, setDifficulty] = useState("easy");

  const {board, startGame, isPlaying} = runJingleSnake(boardSize);

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
      <div className="controls">
        {isPlaying ? null : <button onClick={startGame}>New Game</button>}
      </div>
      <BoardDisplay board={board} />
    </>
  );
}

export default App;
