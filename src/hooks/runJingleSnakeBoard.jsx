import { useReducer } from "react";
import Board from "../game_objects/Board";
import Snake from "../game_objects/Snake";

function boardReducer(state, action) {
  let newState = { ...state };
  switch (action.type) {
    case "start":
      newState.snake.grow_at(newState.row, newState.col);
      newState.board.updateCellValue(newState.row, newState.col, 1);
      break;
    case "move_straight":
      let next_row = newState.row;
      let next_col = newState.col;
      switch (newState.direction) {
        case "up":
          next_row -= 1;
          break;
        case "down":
          next_row += 1;
          break;
        case "right":
          next_col += 1;
          break;
        case "left":
          next_col -= 1;
          break;
        default:
          throw new Error(`Unrecognized direction: ${newState.direction}`);
      }
      // Do board wrapping at edges
      newState.row =
        (next_row + newState.board.boardSize) % newState.board.boardSize;
      newState.col =
        (next_col + newState.board.boardSize) % newState.board.boardSize;
      // Move snake to next cell
      const [clear_row, clear_col] = newState.snake.move_to(
        newState.row,
        newState.col
      );
      newState.board.updateCellValue(newState.row, newState.col, 1);
      newState.board.restoreCellAvailability(clear_row, clear_col);
      break;
    case "change_dir":
    case "grow":
    case "collide":
    default:
      throw new Error(`Unrecognized action type: ${action.type}`);
  }
  return newState;
}

function runJingleSnakeBoard(boardSize) {
  const [boardState, dispatchBoardState] = useReducer(boardReducer, {
    board: new Board(boardSize),
    snake: new Snake(),
    direction: "right",
    row: Math.floor(boardSize / 2),
    col: Math.floor(boardSize / 2),
  });
  return [boardState, dispatchBoardState];
}

export default runJingleSnakeBoard;
