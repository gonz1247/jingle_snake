import { useReducer } from "react";

function boardReducer(state, action) {
  switch (action.type) {
    case "start":
      let newBoard = Array(action.newBoardSize)
        .fill(null)
        .map(() => Array(action.newBoardSize).fill(0));
      // Add snake at center of board
      const newRow = Math.floor(action.newBoardSize / 2);
      const newCol = Math.floor(action.newBoardSize / 2);
      newBoard = newBoard.map((row, r_idx) =>
        r_idx === newRow
          ? row.map((cell, c_idx) => (c_idx === newCol ? 1 : cell))
          : row
      );
      return {
        ...state,
        board: newBoard,
        row: newRow,
        col: newCol,
      };
    case "move":
      // Get previous state
      let prev_row = state.row;
      let prev_col = state.col;
      let updatedBoard = state.board;
      // Add snake at next spot
      updatedBoard = updatedBoard.map((row, r_idx) =>
        r_idx === action.next_row
          ? row.map((cell, c_idx) => (c_idx === action.next_col ? 1 : cell))
          : row
      );
      // Remove snake at previous spot
      updatedBoard = updatedBoard.map((row, r_idx) =>
        r_idx === prev_row
          ? row.map((cell, c_idx) => (c_idx === prev_col ? 0 : cell))
          : row
      );
      console.log(updatedBoard);
      return {
        ...state,
        board: updatedBoard,
        row: action.next_row,
        col: action.next_col,
      };
    case "grow":
      // Grow snake at next cell
      break;
    default:
      throw new Error(`Unrecognized action type: ${action.type}`);
  }
}

export function determineEventAtNextCell(board, curr_row, curr_col, direction) {
  // get next cell based on current position and travel direction
  let next_row = curr_row;
  let next_col = curr_col;
  switch (direction) {
    case "up":
      next_row = curr_row - 1;
      break;
    case "down":
      next_row = curr_row + 1;
      break;
    case "right":
      next_col = curr_col + 1;
      break;
    case "left":
      next_col = curr_col - 1;
      break;
    default:
      throw new Error(`Unrecognized direction: ${direction}`);
  }
  // Do board wrapping at edges
  next_row = (next_row + board.length) % board.length;
  next_col = (next_col + board.length) % board.length;

  // Evaluate value of next cell and what event will occur there
  const next_cell_val = board[next_row][next_col];
  if (next_cell_val == 0) {
    // open space
    return { next_event: "move", next_row: next_row, next_col: next_col };
  } else if (next_cell_val == 1) {
    // collision with body of snake
    return { next_event: "game over", next_row: next_row, next_col: next_col };
  } else if (next_cell_val <= 0) {
    // A bug must exist somewhere
    throw new Error("Board has a negative cell value");
  } else {
    // Next cell has a character that snake will eat
    return { next_event: "grow", next_row: next_row, next_col: next_col };
  }
}

function runJingleSnakeBoard() {
  const [boardState, dispatchBoardState] = useReducer(boardReducer, {
    board: null,
    snake: null,
    row: 0,
    col: 0,
  });
  return [boardState, dispatchBoardState];
}

export default runJingleSnakeBoard;
