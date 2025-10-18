import { useReducer } from "react";
import SnakeNode from "../game_objects/Snake";

function boardReducer(state, action) {
  switch (action.type) {
    case "start":
      let newBoard = Array(action.newBoardSize)
        .fill(null)
        .map(() => Array(action.newBoardSize).fill(0));
      // Populate board with random letters
      for (let i = 0; i < action.fillSpots.length; i++) {
        let char_row = action.fillSpots[i].row;
        let char_col = action.fillSpots[i].col;
        let char = action.fillSpots[i].char;
        newBoard = newBoard.map((row, r_idx) =>
          r_idx === char_row
            ? row.map((cell, c_idx) => (c_idx === char_col ? char : cell))
            : row
        );
      }
      // Add snake marker at center of board (this could override a character which is okay for now)
      const newRow = Math.floor(action.newBoardSize / 2);
      const newCol = Math.floor(action.newBoardSize / 2);
      newBoard = newBoard.map((row, r_idx) =>
        r_idx === newRow
          ? row.map((cell, c_idx) => (c_idx === newCol ? 1 : cell))
          : row
      );
      // Create first node of a snake
      let newNode = new SnakeNode(newRow, newCol);
      return {
        ...state,
        board: newBoard,
        snake_head: newNode,
        snake_tail: newNode,
      };
    case "move":
      // Get previous board state
      let updatedBoard = state.board;
      // Move snake head to next spot on the board
      updatedBoard = updatedBoard.map((row, r_idx) =>
        r_idx === action.next_row
          ? row.map((cell, c_idx) => (c_idx === action.next_col ? 1 : cell))
          : row
      );
      // Remove tail from previous spot on the board
      let [prev_row, prev_col] = state.snake_tail.coord;
      // Remove snake tail spot on board
      updatedBoard = updatedBoard.map((row, r_idx) =>
        r_idx === prev_row
          ? row.map((cell, c_idx) => (c_idx === prev_col ? 0 : cell))
          : row
      );
      // Update snake head and tail
      let new_head = new SnakeNode(action.next_row, action.next_col);
      state.snake_head.prev = new_head;
      let new_tail = state.snake_tail.prev;
      state.snake_tail.prev = null;
      return {
        ...state,
        board: updatedBoard,
        snake_head: new_head,
        snake_tail: new_tail,
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
    snake_head: null,
    snake_tail: null,
  });
  return [boardState, dispatchBoardState];
}

export default runJingleSnakeBoard;
