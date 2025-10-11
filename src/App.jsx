import { useState } from "react";
import Header from "./components/Header";
import GameInputs from "./components/GameInputs";
import BoardDisplay from "./components/BoardDisplay";
import Board from "./game_objects/Board";
import Snake from "./game_objects/Snake";

function MoveSnakeWrapper(row, col, snake, board) {
  // Three scenarios
  // 1) Cell is empty to just move snake
  // 2) Cell has a character so grow snake
  // 3) Cell is another part of the snake so game is over

  // Do board wrapping at edges
  row = (row + board.boardSize) % board.boardSize;
  col = (col + board.boardSize) % board.boardSize;
  const cell_val = board.cells[row][col];
  if (cell_val === 1) {
  } else if (cell_val === 0) {
    board.updateCellValue(row, col, 1);
    [row, col] = snake.move_to(row, col);
    board.restoreCellAvailability(row, col);
  } else {
    board.updateCellValue(row, col, 1);
    snake.grow_at(row, col);
  }
  return;
}

function App() {
  // Game Settings
  const [boardSize, setBoardSize] = useState(10);
  const [difficulty, setDifficulty] = useState("easy");

  // Populate board with zeros
  const board = new Board(boardSize);
  // Create a snake that starts at center of board
  let row = Math.floor(boardSize/2)
  let col = row;
  const snake = new Snake();
  snake.grow_at(row, col);
  board.updateCellValue(row, col, 1);

  // Move snake around
  row = row - 1;
  MoveSnakeWrapper(row, col, snake, board);
  row = row - 1;
  MoveSnakeWrapper(row, col, snake, board);
  col = col + 1;
  MoveSnakeWrapper(row, col, snake, board);
  board.updateCellValue(row, col + 1, 68);
  MoveSnakeWrapper(row, col + 1, snake, board);

  // Add random letter to board
  [row, col] = board.getAvailableCellCoord();
  board.updateCellValue(row, col, 67);

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
