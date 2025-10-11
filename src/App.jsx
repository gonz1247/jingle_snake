import { useState } from "react";
import Header from "./components/Header";
import GameInputs from "./components/GameInputs";
import Board from "./game_objects/Board";
import BoardDisplay from "./components/BoardDisplay";
import runJingleSnake from "./hooks/runJingleSnake";

function App() {
  // Game Settings
  const [boardSize, setBoardSize] = useState(9);
  const [difficulty, setDifficulty] = useState("easy");

  // Actual board that will be used for the game
  const { board, startGame, isPlaying } = runJingleSnake(boardSize);
  // Preview board that can be updated in real time when selecting board size
  const boardPreview = new Board(boardSize);
  boardPreview.updateCellValue(
    Math.floor(boardSize / 2),
    Math.floor(boardSize / 2),
    1
  );

  return (
    <>
      <Header>Jingle Snake</Header>
      <br></br>
      {isPlaying ? (
        <p className="d-flex justify-content-center">Have Fun Playing!</p>
      ) : (
        <GameInputs
          boardSize={boardSize}
          setBoardSize={setBoardSize}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          startGame={startGame}
        />
      )}
      <br></br>
      {isPlaying ? (
        <BoardDisplay board={board} />
      ) : (
        <BoardDisplay board={boardPreview} />
      )}
    </>
  );
}

export default App;
