# jingle_snake
Classic snake game with a musical twist

## Premise
Inspired by classic [Snake game](https://en.wikipedia.org/wiki/Snake_(video_game_genre)) and newer [Hitser game](https://hitstergame.com/en-us/).

Objective of the game is guess the song title by spelling out the word by eating the correct letters. Eating wrong letters will grow the snake and potentially make it harder to get to next correct letter.

## Setup to run locally
- Clone repository to your local machine 
- Install dependencies
  - Navigate to `jingle_snake` directory
  - Run `npm install` 
- Setup Spotify API credentials
  - Go to [Spotify API Dashboard](https://developer.spotify.com/dashboard)
  - Create a new app (likely name it jingle_snake)
  - Create a `.env` file that follows format of `.env.example`
  - Update `.env` to contain `Client ID` and `Client secret` from Spotify API Dashboard
  - Add `Redirect URIs` on Spotify API Dashboard
    - e.g., `http://127.0.0.1:5173/auth/callback` and `http://127.0.0.1:5173/`
- Run Jingle Snake locally using `npm run dev`
- Click link or manually open in browser
- Have fun playing or expanding on base code provided!