import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import runJingleSnakeBoard from "./runJingleSnakeBoard";
import { determineEventAtNextCell } from "./runJingleSnakeBoard";
import useInterval from "./useInterval";

// Used for setting time in ms that interval will use
const GameSpeed = Object.freeze({
  Normal: 200,
  Slow: 400,
  Pause: null,
});

function runJingleSnake(boardSize) {
  // Set up state variables
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(GameSpeed.Pause);
  const [moveDirection, setMoveDirection] = useState("right");
  const [keyDownHandled, setKeyDownHandled] = useState(false);

  // Intialize board
  const [{ board, snake, row, col }, dispatchBoardState] =
    runJingleSnakeBoard();

  // Initialize game start
  const startGame = useCallback(() => {
    setIsPlaying(true);
    dispatchBoardState({ type: "start", newBoardSize: boardSize });
    setGameSpeed(GameSpeed.Normal);
  }, [boardSize]);

  // Controls what happens on each render of the running game
  const gameTick = useCallback(() => {
    const { next_event, next_row, next_col } = determineEventAtNextCell(
      board,
      row,
      col,
      moveDirection
    );
    dispatchBoardState({
      type: next_event,
      next_row: next_row,
      next_col: next_col,
    });
    setKeyDownHandled(true);
  }, [board, row, col, moveDirection]);

  // Interval to create continuous re-rendering
  useInterval(() => {
    if (!isPlaying) {
      return;
    }
    gameTick();
  }, gameSpeed);

  // Controling direction of the snake (keyboard events)
  useEffect(() => {
    if (!isPlaying) {
      return;
    } else if (!keyDownHandled) {
      // previous key press has not been rendered yet
      return;
    }
    // Arrow key input
    const handleKeyDown = (event) => {
      // Check for direction and protect from turning directly around and causing instant collision
      if (event.key === "ArrowUp") {
        if (moveDirection != "down") {
          setMoveDirection("up");
          setKeyDownHandled(false);
        }
      } else if (event.key === "ArrowRight") {
        if (moveDirection != "left") {
          setMoveDirection("right");
          setKeyDownHandled(false);
        }
      } else if (event.key === "ArrowDown") {
        if (moveDirection != "up") {
          setMoveDirection("down");
          setKeyDownHandled(false);
        }
      } else if (event.key === "ArrowLeft") {
        if (moveDirection != "right") {
          setMoveDirection("left");
          setKeyDownHandled(false);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    // Clean up function
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlaying, moveDirection, keyDownHandled]);

  // Return current state of the game
  return { board, startGame, isPlaying };
}

export default runJingleSnake;
