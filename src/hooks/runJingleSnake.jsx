import { useCallback, useEffect, useState } from "react";
import gameStateManager, {
  determineEventAtNextCell,
  nextLetterForBoard,
} from "./gameStateManagement";
import useInterval from "./useInterval";

// Used for setting time in ms that interval will use
const GameSpeed = Object.freeze({
  Play: 150,
  Pause: null,
});

// Empty track object
const track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
};

function runJingleSnake(
  boardSize,
  initFillSpots,
  initAvailabilityObject,
  token
) {
  // Set up state variables
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(GameSpeed.Pause);
  const [moveDirection, setMoveDirection] = useState("right");
  const [keyDownHandled, setKeyDownHandled] = useState(false);
  // Game scoring parameters
  const [songTitle, setSongTitle] = useState(null);
  const [nextSongTitle, setNextSongTitle] = useState(null);
  const [score, setScore] = useState(0);
  const [highestScore, setHighestScore] = useState(0);
  const [nLettersGuessed, setNLettersGuessed] = useState(0);
  // Spotify hooks
  const [player, setPlayer] = useState(undefined);
  const [current_track, setTrack] = useState(track);

  // Game state manager
  let [
    { board, snake, availabilityObject, nCharsCorrect, charsOnBoard },
    dispatchBoardState,
  ] = gameStateManager();

  // Enable Spotify functionality
  useEffect(() => {
    if (token === null) {
      return;
    }
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Jingle Snake Game",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }
        setTrack(state.track_window.current_track);

      });

      player.connect();
    };
  }, [token]);

  // Actions to initialize game start
  const startGame = useCallback(() => {
    // Turn on music player and get new song
    player.nextTrack();
    player.getCurrentState().then((state) => {
      if (!state) {
        console.error("User is not playing music through the Web Playback SDK");
        return;
      }

      // Get song titles of first and second songs in queue
      const first_track = state.track_window.next_tracks[0].name;

      // Initialize score and initial song title
      setSongTitle(first_track);
      setNextSongTitle(null);
      setNLettersGuessed(0);
      setScore(0);

      // update board to be right size and have initial characters
      dispatchBoardState({
        type: "start",
        newBoardSize: boardSize,
        fillSpots: initFillSpots,
        availabilityObject: initAvailabilityObject,
        nLettersGuessed: 0,
        firstLetter: first_track[0],
      });
      // Turn game speed to normal and start game
      setGameSpeed(GameSpeed.Play);
      setIsPlaying(true);
    });
  }, [boardSize, initFillSpots, isPlaying, player]);

  // Actions to end game and restart it
  const restartGame = () => {
    // Reset game state
    setGameSpeed(GameSpeed.Pause);
    setIsPlaying(false);
    setMoveDirection("right");
    // Turn music off
    player.pause();
  };

  // Controls what happens on each render of the running game
  const gameTick = useCallback(() => {
    // Check state of title guessing
    if (nCharsCorrect >= songTitle.length) {
      // Finished the song title so set to next title
      setSongTitle(nextSongTitle);
      setNextSongTitle("Song #3");
      // Increment score (1 for correct letter and 5 for completing title)
      setScore(score + 6);
      // Reset number of characters guessed
      nCharsCorrect = 0;
      setNLettersGuessed(nCharsCorrect);
    } else if (nCharsCorrect != nLettersGuessed) {
      // Increment score (1 for correct letter)
      setScore(score + 1);
      // Update number of characters guessed
      setNLettersGuessed(nCharsCorrect);
    }
    const { next_event, next_row, next_col } = determineEventAtNextCell(
      board,
      snake,
      moveDirection
    );
    if (next_event === "move") {
      // Update game state
      dispatchBoardState({
        type: next_event,
        next_row: next_row,
        next_col: next_col,
        nLettersGuessed: nCharsCorrect,
      });
    } else if (next_event === "grow") {
      // get new character to add to board after snake eats character
      let fill_row, fill_col, fill_char;
      ({ availabilityObject, fill_row, fill_col, fill_char } =
        nextLetterForBoard(
          availabilityObject,
          songTitle,
          nCharsCorrect,
          nextSongTitle,
          charsOnBoard
        ));
      // Update game state
      dispatchBoardState({
        type: next_event,
        next_row: next_row,
        next_col: next_col,
        availabilityObject: availabilityObject,
        fill_row: fill_row,
        fill_col: fill_col,
        fill_char: fill_char,
        songTitle: songTitle,
        nLettersGuessed: nCharsCorrect,
      });
    } else {
      // Game over, reset to defaults
      restartGame();
      // Capture highest score so far
      setHighestScore(Math.max(score, highestScore));
    }
    setKeyDownHandled(true);
  }, [
    board,
    snake,
    nCharsCorrect,
    availabilityObject,
    charsOnBoard,
    moveDirection,
  ]);

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
  return {
    board,
    startGame,
    isPlaying,
    songTitle,
    score,
    highestScore,
    nLettersGuessed,
    restartGame,
  };
}

export default runJingleSnake;
