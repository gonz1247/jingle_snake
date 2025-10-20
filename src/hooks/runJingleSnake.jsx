import { useCallback, useEffect, useState } from "react";
import runJingleSnakeBoard from "./runJingleSnakeBoard";
import { determineEventAtNextCell } from "./runJingleSnakeBoard";
import useInterval from "./useInterval";
import { fillCellWithChar } from "../game_objects/BoardPopulator";

// Used for setting time in ms that interval will use
const GameSpeed = Object.freeze({
  Normal: 200,
  Slow: 400,
  Pause: null,
});

function runJingleSnake(boardSize, initFillSpots, initAvailabilityObject) {
  // Set up state variables
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(GameSpeed.Pause);
  const [moveDirection, setMoveDirection] = useState("right");
  const [keyDownHandled, setKeyDownHandled] = useState(false);

  // Intialize board
  let [{ board, snake, availabilityObject }, dispatchBoardState] =
    runJingleSnakeBoard();

  // Initialize game start
  const startGame = useCallback(() => {
    // update board to be right size and have initial characters
    dispatchBoardState({
      type: "start",
      newBoardSize: boardSize,
      fillSpots: initFillSpots,
      availabilityObject: initAvailabilityObject,
    });
    // Turn game speed to normal and start game
    setGameSpeed(GameSpeed.Normal);
    setIsPlaying(true);
  }, [boardSize, initFillSpots]);

  // Controls what happens on each render of the running game
  const gameTick = useCallback(() => {
    const { next_event, next_row, next_col } = determineEventAtNextCell(
      board,
      snake[0][0],
      snake[0][1],
      moveDirection
    );
    if (next_event === "move") {
      dispatchBoardState({
        type: next_event,
        next_row: next_row,
        next_col: next_col,
      });
    } else if (next_event === "grow") {
      let fill_row, fill_col, fill_char;
      // get new character to add to board after snake eats character
      ({
        availability_object: availabilityObject,
        fill_row,
        fill_col,
        fill_char,
      } = fillCellWithChar(availabilityObject));
      dispatchBoardState({
        type: next_event,
        next_row: next_row,
        next_col: next_col,
        availabilityObject: availabilityObject,
        fill_row: fill_row,
        fill_col: fill_col,
        fill_char: fill_char,
      });
    } else {
      // Game over, reset to defaults
      setIsPlaying(false);
      setMoveDirection("right");
      setGameSpeed(GameSpeed.Pause);
    }
    setKeyDownHandled(true);
  }, [board, snake, availabilityObject, moveDirection]);

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
