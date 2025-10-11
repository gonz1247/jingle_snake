import { useCallback, useState } from "react";
import runJingleSnakeBoard from "./runJingleSnakeBoard";
import useInterval from "./useInterval";

const GameSpeed = Object.freeze({
  Normal: 800,
  Slow: 400,
  Pause: 0,
});

function runJingleSnake(boardSize) {
  // Set up state variables
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(null);
  // Intialize board
  const [{ board, snake, direction, row, col }, dispatchBoardState] =
    runJingleSnakeBoard(boardSize);

  // Initialize game start
  const startGame = useCallback(() => {
    setIsPlaying(true);
    setGameSpeed(GameSpeed.Normal);
    dispatchBoardState({ type: "start" });
  }, [dispatchBoardState]);

  // Interval for running game
  const gameTick = useCallback(() => {
    dispatchBoardState({ type: "move_straight" });
  }, [dispatchBoardState]);

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
