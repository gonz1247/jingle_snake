import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GameInputs from "../components/GameInputs";
import WordProgessDisplay from "../components/WordProgessDisplay";
import BoardDisplay from "../components/BoardDisplay";
import useRunJingleSnake from "../hooks/useRunJingleSnake";
import { initFillBoardWithChars } from "../utilities/BoardPopulator";
import SpotifyLogin from "../components/SpotifyLogin";

const server_target = import.meta.env.VITE_SERVER_TARGET;

export default function MainPage() {
  // Game Settings
  const [boardSize, setBoardSize] = useState(13);
  const [difficulty, setDifficulty] = useState("easy");
  const [playlist, setPlaylist] = useState("1WH6WVBwPBz35ZbWsgCpgr");

  // Fill board with initial characters based on difficulty
  let fillPercentage;
  if (difficulty === "easy") {
    fillPercentage = 0.03;
  } else if (difficulty === "medium") {
    fillPercentage = 0.05;
  } else if (difficulty === "hard") {
    fillPercentage = 0.1;
  }
  let { fillSpots: initFillSpots, availabilityObject: initAvailabilityObject } =
    initFillBoardWithChars(boardSize, fillPercentage);

  // Preview board that can be updated in real time when selecting board size and difficulty
  const boardPreview = Array(boardSize)
    .fill(null)
    .map(() => Array(boardSize).fill(-1));
  // Populate board with random letters
  for (let i = 0; i < initFillSpots.length; i++) {
    let char_row = initFillSpots[i].row;
    let char_col = initFillSpots[i].col;
    // Add random placeholder for now
    boardPreview[char_row][char_col] = "#";
  }
  // Add snake head at center of the preview board
  boardPreview[Math.floor(boardSize / 2)][Math.floor(boardSize / 2)] = -2;

  // Get Spotify API access token
  const [token, setToken] = useState(null);
  useEffect(() => {
    async function getToken() {
      const response = await fetch(`${server_target}/auth/token`);
      const json = await response.json();
      setToken(json.access_token);
    }
    getToken();
  }, []);

  // Hook used to run the game
  const {
    board,
    startGame,
    isPlaying,
    songTitle,
    score,
    highestScore,
    nLettersGuessed,
    restartGame,
    clearQueue,
  } = useRunJingleSnake(
    boardSize,
    initFillSpots,
    initAvailabilityObject,
    token,
    playlist
  );

  // Render page
  if (token === null) {
    // Enable Spotify API before game can launch
    return (
      <>
        <Header>Jingle Snake</Header>
        <SpotifyLogin />
      </>
    );
  } else {
    // launch game since Spotify API has been enabled
    return (
      <>
        <Header>Jingle Snake</Header>
        <br></br>
        {isPlaying ? (
          <WordProgessDisplay word={songTitle} n_letters={nLettersGuessed} />
        ) : (
          <GameInputs
            boardSize={boardSize}
            setBoardSize={setBoardSize}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            playlist={playlist}
            setPlaylist={setPlaylist}
          />
        )}
        <br></br>
        {isPlaying ? (
          <div className="d-flex justify-content-center gap-3">
            <div className="side_of_board">
              <p className="d-flex justify-content-center">Current Score</p>
              <p className="d-flex justify-content-center">{score}</p>
            </div>
            <div>
              <BoardDisplay board={board} />
            </div>
            <div className="side_of_board">
              <button
                type="button"
                className="btn btn-primary"
                onClick={restartGame}
              >
                Reset Game
              </button>
            </div>
          </div>
        ) : (
          <div className="d-flex justify-content-center gap-3">
            <div className="side_of_board">
              <p className="d-flex justify-content-center">Highest Score</p>
              <p className="d-flex justify-content-center">{highestScore}</p>
            </div>
            <div>
              <BoardDisplay board={boardPreview} />
            </div>
            <div className="side_of_board">
              <button
                type="button"
                className="btn btn-primary"
                onClick={startGame}
              >
                Start New Game
              </button>
              <br></br>
              <br></br>
              <button
                type="button"
                className="btn btn-primary"
                onClick={clearQueue}
              >
                Reset Spotify
              </button>
            </div>
          </div>
        )}
        <Footer />
      </>
    );
  }
}
