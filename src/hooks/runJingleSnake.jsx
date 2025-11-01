import { useCallback, useEffect, useState } from "react";
import gameStateManager, {
  determineEventAtNextCell,
  nextLetterForBoard,
} from "./gameStateManagement";
import useInterval from "./useInterval";

async function clearSpotifyQueue(token, deviceID, player, add_dummy = true) {
  const dummy_track_uri = "spotify:track:5XSKC4d0y0DfcGbvDOiL93";
  if (add_dummy) {
    // Add dummy track to end of queue so can have reference for when queue has been cleared
    fetch(
      "https://api.spotify.com/v1/me/player/queue?uri=" +
        encodeURIComponent(dummy_track_uri) +
        "&device_id=" +
        deviceID,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    ).then(() => {
      return clearSpotifyQueue(token, deviceID, player, false);
    });
  } else {
    // Check what current song is playing
    player.getCurrentState().then((state) => {
      if (!state) {
        console.error("User is not playing music through the Web Playback SDK");
        return;
      }
      const current_track_uri = state.track_window.current_track.uri;
      if (current_track_uri === dummy_track_uri) {
        // queue has been cleared out, pause spotify (delay so that make sure all songs cleared first)
        setTimeout(() => {
          player.pause();
        }, 2000);
        return;
      } else {
        // Skip over song and continue clearing queue
        player.nextTrack().then(() => {
          return clearSpotifyQueue(token, deviceID, player, false);
        });
      }
    });
  }
}

// Used for setting time in ms that interval will use
const GameSpeed = Object.freeze({
  Play: 150,
  Pause: null,
});

function runJingleSnake(
  boardSize,
  initFillSpots,
  initAvailabilityObject,
  token,
  playlist
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
  const [deviceID, setDeviceID] = useState(null);
  const [playlistLength, setPlaylistLength] = useState(null);

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
        setDeviceID(device_id);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
        setDeviceID(null);
      });

      player.connect();
    };
  }, [token]);

  // Setup playlist
  useEffect(() => {
    if (!deviceID) {
      // Spotify not connected
      return;
    }
    // Get info about playlist
    fetch(
      "https://api.spotify.com/v1/playlists/" +
        playlist +
        "?fields=tracks.total",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((result) => {
        if (!result.ok) {
          console.error("playlist not found");
          return;
        }
        return result.json();
      })
      .then((data) => {
        setPlaylistLength(data.tracks.total);
      });
  }, [deviceID, token, playlist]);

  // Actions to initialize game start
  const startGame = useCallback(() => {
    const offset = Math.floor(Math.random() * (playlistLength - 1));
    // Skip over next track
    player
      .nextTrack()
      .then(() => {
        // Get random song to queue
        return fetch(
          "https://api.spotify.com/v1/playlists/" +
            playlist +
            "/tracks?fields=items.track%28uri%2Cname%29&limit=1&offset=" +
            offset,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
      })
      .then((result) => {
        // Check that getting song from playlist was successful
        if (!result.ok) {
          console.error("Could not get song from playlist");
          return;
        }
        return result.json();
      })
      .then((data) => {
        // Save information for songs to queue
        const first_track_uri = data.items[0].track.uri;
        const first_track_name = data.items[0].track.name;
        // Write out song title to console for debugging
        console.clear();
        console.log(first_track_name);
        // Queue first song
        fetch(
          "https://api.spotify.com/v1/me/player/queue?uri=" +
            encodeURIComponent(first_track_uri) +
            "&device_id=" +
            deviceID,
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        // Initialize score and initial song title
        setSongTitle(first_track_name);
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
          firstLetter: first_track_name[0],
        });
        // Turn game speed to normal and start game
        setGameSpeed(GameSpeed.Play);
        setIsPlaying(true);
      })
      .then(() => {
        // Add delay to try to ensure song added to queue before switching song
        setTimeout(() => {
          player.nextTrack();
        }, 2000);
      })
      .then(() => {
        setTimeout(() => {
          // Set song to repeat (delay ensure it happens after song was been switched)
          fetch(
            "https://api.spotify.com/v1/me/player/repeat?state=track&device_id=" +
              deviceID,
            {
              method: "PUT",
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
        }, 15000);
      });
  }, [boardSize, initFillSpots, isPlaying, player, token, deviceID]);

  // Actions to end game and restart it
  const restartGame = useCallback(() => {
    // Reset game state
    setGameSpeed(GameSpeed.Pause);
    setIsPlaying(false);
    setMoveDirection("right");
    // Turn music off
    player.pause();
  }, [player]);

  const clearQueue = useCallback(() => {
    clearSpotifyQueue(token, deviceID, player);
  }, [player, token, deviceID]);

  // Controls what happens on each render of the running game
  const gameTick = useCallback(() => {
    // Check that next song is queued
    if (nextSongTitle === null) {
      // Switch from null so that this doesn't run multiple times if rendering faster than API calls
      setNextSongTitle("in-progress");
      const offset = Math.floor(Math.random() * (playlistLength - 1));
      fetch(
        "https://api.spotify.com/v1/playlists/" +
          playlist +
          "/tracks?fields=items.track%28uri%2Cname%29&limit=1&offset=" +
          offset,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
        .then((result) => {
          // Check that getting song from playlist was successful
          if (!result.ok) {
            console.error("Could not get song from playlist");
            return;
          }
          return result.json();
        })
        .then((data) => {
          // Save information for song to queue
          let track_uri = data.items[0].track.uri;
          let track_name = data.items[0].track.name;
          // Update next song title
          setNextSongTitle(track_name);
          // Print to console for debugging
          console.log(track_name);
          // Queue song
          fetch(
            "https://api.spotify.com/v1/me/player/queue?uri=" +
              encodeURIComponent(track_uri) +
              "&device_id=" +
              deviceID,
            {
              method: "POST",
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
        });
    }
    // Check state of title guessing
    if (nCharsCorrect >= songTitle.length) {
      // Finished the song title so skip to next song
      player
        .nextTrack()
        .then(() => {
          // update current and next song title states
          setSongTitle(nextSongTitle);
          setNextSongTitle(null);
        })
        .then(() => {
          setTimeout(() => {
            // Set song to repeat (delay ensure it happens after song was been switched)
            fetch(
              "https://api.spotify.com/v1/me/player/repeat?state=track&device_id=" +
                deviceID,
              {
                method: "PUT",
                headers: {
                  Authorization: "Bearer " + token,
                },
              }
            );
          }, 15000);
        });
      // Increment score
      setScore((prevScore) => prevScore + 1);
      // Reset number of characters guessed
      nCharsCorrect = 0;
      setNLettersGuessed(nCharsCorrect);
    } else if (nCharsCorrect != nLettersGuessed) {
      // Increment score
      setScore((prevScore) => prevScore + 1);
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
    nextSongTitle,
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
    clearQueue,
  };
}

export default runJingleSnake;
