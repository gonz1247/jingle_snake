import { useState } from "react";
import Header from "./components/Header";
import GameInputs from "./components/GameInputs";
import BoardDisplay from "./components/BoardDisplay";
import runJingleSnake from "./hooks/runJingleSnake";
import { fillBoardWithChars } from "./game_objects/BoardPopulator";

function App() {
  // Game Settings
  const [boardSize, setBoardSize] = useState(9);
  const [difficulty, setDifficulty] = useState("easy");

  // Fill board with initial characters based on difficulty
  let fill_percentage;
  if (difficulty === "easy") {
    fill_percentage = 0.05;
  } else if (difficulty === "medium") {
    fill_percentage = 0.1;
  } else if (difficulty === "hard") {
    fill_percentage = 0.25;
  }
  let fillSpots = fillBoardWithChars(boardSize, fill_percentage);

  // Actual board that will be used for the game
  const { board, startGame, isPlaying } = runJingleSnake(boardSize, fillSpots);

  // Preview board that can be updated in real time when selecting board size and difficulty
  const boardPreview = Array(boardSize)
    .fill(null)
    .map(() => Array(boardSize).fill(0));
  // Populate board with random letters
  for (let i = 0; i < fillSpots.length; i++) {
    let char_row = fillSpots[i].row;
    let char_col = fillSpots[i].col;
    // Add random placeholder for now
    boardPreview[char_row][char_col] = "#"; 
  }
  // Add snake at center of the board
  boardPreview[Math.floor(boardSize / 2)][Math.floor(boardSize / 2)] = 1;

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
