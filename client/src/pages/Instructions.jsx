import { Link } from "react-router-dom";

export default function Instructions() {
  return (
    <>
      <h1>Jingle Snake Instructions</h1>
      <Link to="/">Main Page</Link>
      <p>
        Inspired by the classic{" "}
        <Link
          to="https://en.wikipedia.org/wiki/Snake_(video_game_genre)"
          target="_blank"
        >
          Snake game
        </Link>{" "}
        and newer{" "}
        <Link to="https://hitstergame.com/en-us/" target="_blank">
          Hitser game
        </Link>
        {"."}
        <br></br>
        <br></br>
        The objective of Jingle Snake is to guess the title of the song playing
        by spelling it out. To spell out the song title, use the directional
        keys on your keyboard to control the snake and eat the letters in the
        correct order that spell out the song title. Eating correct letters
        gives you points and grows the snake. Eating wrong letters will also
        grow the snake, but no points are rewared. Jingle Snake will switch
        songs everytime you spell out an entire song title, so see how many song
        titles you can spell out before crashing the snake into itself!
      </p>
    </>
  );
}
