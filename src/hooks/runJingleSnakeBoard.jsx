import { useReducer } from "react";

function boardReducer(state, action) {
  switch (action.type) {
    case "start": {
      // Initialize empty board
      let newBoard = Array(action.newBoardSize)
        .fill(null)
        .map(() => Array(action.newBoardSize).fill(0));
      // Populate board with random letters
      for (let i = 0; i < action.fillSpots.length; i++) {
        let char_row = action.fillSpots[i].row;
        let char_col = action.fillSpots[i].col;
        let char = action.fillSpots[i].char;
        newBoard[char_row][char_col] = char;
      }
      // Add snake marker at center of board (this could override a character which is okay for now)
      const newRow = Math.floor(action.newBoardSize / 2);
      const newCol = Math.floor(action.newBoardSize / 2);
      newBoard[newRow][newCol] = 1;
      // Create snake deque
      let newSnake = [[newRow, newCol]];
      // Assume initial availability object is representative of what gave initial fill spots and snake location
      let newAvailabilityObject = action.availabilityObject;
      return {
        ...state,
        board: newBoard,
        snake: newSnake,
        availabilityObject: newAvailabilityObject,
      };
    }
    case "move": {
      // Get previous state
      let updatedBoard = state.board.map((row) => [...row]);
      let updatedSnake = state.snake.map((node) => [...node]);
      // Move snake head to next spot on the board
      updatedSnake.unshift([action.next_row, action.next_col]);
      updatedBoard[action.next_row][action.next_col] = 1;
      // Remove snake tail from previous spot on the board
      const [prev_row, prev_col] = updatedSnake.pop();
      updatedBoard[prev_row][prev_col] = 0;
      return {
        ...state,
        board: updatedBoard,
        snake: updatedSnake,
      };
    }
    case "grow": {
      // Get previous state
      let updatedBoard = state.board.map((row) => [...row]);
      let updatedSnake = state.snake.map((node) => [...node]);
      // Move snake head to next spot on the board
      updatedSnake.unshift([action.next_row, action.next_col]);
      updatedBoard[action.next_row][action.next_col] = 1;
      // Leave snake tail as is
      return {
        ...state,
        board: updatedBoard,
        snake: updatedSnake,
      };
    }
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
    availabilityObject: null,
  });
  return [boardState, dispatchBoardState];
}

export default runJingleSnakeBoard;
