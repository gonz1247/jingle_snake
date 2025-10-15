import { useCallback, useState } from "react";
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

  // Intialize board
  const [{ board, snake, row, col }, dispatchBoardState] =
    runJingleSnakeBoard();

  // Initialize game start
  const startGame = useCallback(() => {
    setIsPlaying(true);
    dispatchBoardState({ type: "start", newBoardSize: boardSize });
    setGameSpeed(GameSpeed.Normal);
  }, [dispatchBoardState, boardSize]);

  // Interval for running game
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
  }, [dispatchBoardState, board, row, col, moveDirection]);

  useInterval(() => {
    if (!isPlaying) {
      return;
    }
    gameTick();
  }, gameSpeed);

  // Return current state of the game
  return { board, startGame, isPlaying };
}

export default runJingleSnake;
