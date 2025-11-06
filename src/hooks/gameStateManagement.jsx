import { useReducer } from "react";
import {
  fillCellWithChar,
  removeCellAvailability,
  addCellAvailability,
  invalid_chars,
} from "../utilities/BoardPopulator";

function boardReducer(state, action) {
  switch (action.type) {
    case "start": {
      // Initialize empty board
      let newBoard = Array(action.newBoardSize)
        .fill(null)
        .map(() => Array(action.newBoardSize).fill(-1));
      // Initialize object (i.e., hash map) of letters on board
      let newCharsOnBoard = {};
      // Populate board with random letterslet char_row = action.fillSpots[i].row;
      let char_row, char_col, char;
      for (let i = 0; i < action.fillSpots.length; i++) {
        char_row = action.fillSpots[i].row;
        char_col = action.fillSpots[i].col;
        char = action.fillSpots[i].char;
        newBoard[char_row][char_col] = char;
        if (newCharsOnBoard.hasOwnProperty(char)) {
          newCharsOnBoard[char] += 1;
        } else {
          newCharsOnBoard[char] = 1;
        }
      }
      // Make sure first letter is on the board
      let firstLetter = action.firstLetter.toUpperCase().charCodeAt(0);
      if (!newCharsOnBoard.hasOwnProperty(firstLetter)) {
        // Replace last letter added to board with first letter
        newCharsOnBoard[char] -= 1;
        if (newCharsOnBoard[char] === 0) {
          delete newCharsOnBoard[char];
        }
        newBoard[char_row][char_col] = firstLetter;
        newCharsOnBoard[firstLetter] = 1;
      }
      // Add snake head marker at center of board
      const newRow = Math.floor(action.newBoardSize / 2);
      const newCol = Math.floor(action.newBoardSize / 2);
      newBoard[newRow][newCol] = -2;
      // Create snake deque
      let newSnake = [[newRow, newCol]];
      // Assume initial availability object is representative of what gave initial fill spots and snake location
      let newAvailabilityObject = action.availabilityObject;
      // Initiate progress
      let newNLettersGuessed = action.nLettersGuessed;
      return {
        ...state,
        board: newBoard,
        snake: newSnake,
        availabilityObject: newAvailabilityObject,
        nCharsCorrect: newNLettersGuessed,
        charsOnBoard: newCharsOnBoard,
      };
    }
    case "move": {
      // Get previous state
      let updatedBoard = state.board.map((row) => [...row]);
      let updatedSnake = state.snake.map((node) => [...node]);
      let updatedAvailabilityObject = {
        avail_cells_array: [...state.availabilityObject.avail_cells_array],
        n_avail_cells: state.availabilityObject.n_avail_cells,
        cell_2_idx_hashmap: [...state.availabilityObject.cell_2_idx_hashmap],
      };
      // Remove snake tail from previous spot on the board
      const [prev_row, prev_col] = updatedSnake.pop();
      updatedBoard[prev_row][prev_col] = -1;
      let cell_num = prev_row * updatedBoard.length + prev_col;
      updatedAvailabilityObject = addCellAvailability(
        cell_num,
        updatedAvailabilityObject
      );
      // Move snake head to next spot on the board
      updatedSnake.unshift([action.next_row, action.next_col]);
      updatedBoard[action.next_row][action.next_col] = -2;
      if (updatedSnake.length > 1) {
        // update previous head to be body now
        updatedBoard[updatedSnake[1][0]][updatedSnake[1][1]] = -3;
      }
      cell_num = action.next_row * updatedBoard.length + action.next_col;
      updatedAvailabilityObject = removeCellAvailability(
        cell_num,
        updatedAvailabilityObject
      );
      // Set letters guessed in case updated during last render
      let nLettersGuessed = action.nLettersGuessed;
      return {
        ...state,
        board: updatedBoard,
        snake: updatedSnake,
        availabilityObject: updatedAvailabilityObject,
        nCharsCorrect: nLettersGuessed,
      };
    }
    case "grow": {
      // Get previous state
      let updatedBoard = state.board.map((row) => [...row]);
      let updatedSnake = state.snake.map((node) => [...node]);
      let updatedCharsOnBoard = { ...state.charsOnBoard };
      // Get song title and current letters guessed
      let songTitle = action.songTitle.toUpperCase();
      let nLettersGuessed = action.nLettersGuessed;
      // Increment score and progress if applicable
      let eaten_char = String.fromCharCode(
        updatedBoard[action.next_row][action.next_col]
      );
      if (eaten_char === songTitle[nLettersGuessed]) {
        // Skip over any characters that are listed as invalid
        nLettersGuessed += 1;
        while (
          nLettersGuessed < songTitle.length &&
          invalid_chars.includes(songTitle[nLettersGuessed])
        ) {
          nLettersGuessed += 1;
        }
      }
      // Remove eaten char from board character hash map
      updatedCharsOnBoard[updatedBoard[action.next_row][action.next_col]] -= 1;
      if (
        updatedCharsOnBoard[updatedBoard[action.next_row][action.next_col]] == 0
      ) {
        delete updatedCharsOnBoard[
          updatedBoard[action.next_row][action.next_col]
        ];
      }
      // Move snake head to next spot on the board
      updatedSnake.unshift([action.next_row, action.next_col]);
      updatedBoard[action.next_row][action.next_col] = -2;
      if (updatedSnake.length > 1) {
        // update previous head to be body now
        updatedBoard[updatedSnake[1][0]][updatedSnake[1][1]] = -3;
      }
      // No need update snake tail
      // Add new character to the board
      updatedBoard[action.fill_row][action.fill_col] = action.fill_char;
      // Add new char to character hash map
      if (updatedCharsOnBoard.hasOwnProperty(action.fill_char)) {
        updatedCharsOnBoard[action.fill_char] += 1;
      } else {
        updatedCharsOnBoard[action.fill_char] = 1;
      }
      // Set availability object to one sent with action (since it constains history of assigning new fill character)
      let updatedAvailabilityObject = action.availabilityObject;
      return {
        ...state,
        board: updatedBoard,
        snake: updatedSnake,
        availabilityObject: updatedAvailabilityObject,
        nCharsCorrect: nLettersGuessed,
        charsOnBoard: updatedCharsOnBoard,
      };
    }
    default:
      throw new Error(`Unrecognized action type: ${action.type}`);
  }
}

export function determineEventAtNextCell(board, snake, direction) {
  // get next cell based on current position of snake head and travel direction
  let next_row = snake[0][0];
  let next_col = snake[0][1];
  switch (direction) {
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
      throw new Error(`Unrecognized direction: ${direction}`);
  }
  // Do board wrapping at edges
  next_row = (next_row + board.length) % board.length;
  next_col = (next_col + board.length) % board.length;

  // Evaluate value of next cell and what event will occur there
  // -1 -> empty, -2 -> snake head, -3 -> snake body, else character code
  const next_cell_val = board[next_row][next_col];
  if (next_cell_val == -1) {
    // open space
    return { next_event: "move", next_row: next_row, next_col: next_col };
  } else if (next_cell_val == -3) {
    // Check that not colliding with tail
    const tail_row = snake[snake.length - 1][0];
    const tail_col = snake[snake.length - 1][1];
    if (next_row === tail_row && next_col === tail_col) {
      // tail will move before collision so next event is a move
      return {
        next_event: "move",
        next_row: next_row,
        next_col: next_col,
      };
    } else {
      // collision with body of snake
      return {
        next_event: "game over",
        next_row: next_row,
        next_col: next_col,
      };
    }
  } else if (next_cell_val == -2) {
    // A bug must exist somewhere
    throw new Error("Colliding with head");
  } else {
    // Next cell has a character that snake will eat
    return { next_event: "grow", next_row: next_row, next_col: next_col };
  }
}

function nextLetterNeededOnBoard(songTitle, nLettersGuessed, nextSongTitle) {
  // Capital letters only
  songTitle = songTitle.toUpperCase();
  // Skip over any characters that are listed as invalid
  nLettersGuessed += 1;
  while (
    nLettersGuessed < songTitle.length &&
    invalid_chars.includes(songTitle[nLettersGuessed])
  ) {
    nLettersGuessed += 1;
  }
  if (nLettersGuessed >= songTitle.length) {
    // Recursively call funcion on next song instead
    if (nextSongTitle === null) {
      // Somehow the next song contained only invalid chars so just return A
      return "A".charCodeAt(0);
    } else {
      return nextLetterNeededOnBoard(nextSongTitle, -1, null);
    }
  } else {
    return songTitle.charCodeAt(nLettersGuessed);
  }
}

export function nextLetterForBoard(
  availabilityObject,
  songTitle,
  nCharsCorrect,
  nextSongTitle,
  charsOnBoard
) {
  let fill_row, fill_col, fill_char;
  // Get new character and random spot on the board
  ({
    availability_object: availabilityObject,
    fill_row,
    fill_col,
    fill_char,
  } = fillCellWithChar(availabilityObject));
  // Double check that board has next letter on it
  let nextLetter = nextLetterNeededOnBoard(
    songTitle,
    nCharsCorrect,
    nextSongTitle
  );
  if (!charsOnBoard.hasOwnProperty(nextLetter)) {
    fill_char = nextLetter;
  } else if (
    (songTitle.toUpperCase()[nCharsCorrect] ==
      String.fromCharCode(nextLetter)) &
    (charsOnBoard[nextLetter] < 2)
  ) {
    fill_char = nextLetter;
  }
  return { availabilityObject, fill_row, fill_col, fill_char };
}

export default function gameStateManager() {
  const [boardState, dispatchBoardState] = useReducer(boardReducer, {
    board: null,
    snake: null,
    availabilityObject: null,
    nCharsCorrect: null,
    charsOnBoard: null,
  });
  return [boardState, dispatchBoardState];
}
