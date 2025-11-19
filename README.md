# jingle_snake
Classic snake game with a musical twist

## Premise
Inspired by classic [Snake game](https://en.wikipedia.org/wiki/Snake_(video_game_genre)) and newer [Hitser game](https://hitstergame.com/en-us/).

Objective of the game is guess the song title by spelling out the word by eating the correct letters. Eating wrong letters will grow the snake and potentially make it harder to get to next correct letter.

## Setup to run locally
- Clone repository to your local machine 
- Install dependencies
  - Navigate to `jingle_snake` directory and run `npm install` 
  - Navigate to `client` directory and run `npm install`
  - Navigate to `server` directory and run `npm install`
- Setup local server proxy
  - Within the `client` directory, create a `.env` file that is a copy of the `.env.example` file
- Setup Spotify API credentials
  - Go to [Spotify API Dashboard](https://developer.spotify.com/dashboard)
  - Create a new app (likely name it jingle_snake)
  - Within the `server` directory, create a `.env` file that copies the format of the `.env.example` file
    - Update `.env` to contain `Client ID` and `Client secret` from Spotify API Dashboard
  - On Spotify API Dashboard, update `Redirect URIs` to include `http://127.0.0.1:5000/auth/callback`
- From the `jingle_snake` directory, use the command `npm run dev` to run Jingle Snake locally
- Click link or manually open in browser
- Have fun playing or expanding on base code provided!

## Notes for deploying on Render
Can use [render.com](https://dashboard.render.com/) for deploying live version on Jingle Snake. Below are a few reminders when deploying (note that the client and server need to be setup in tandem since the domain names of each are needed to set up the other).

### Tips for server deploy
- Jingle Snake server (i.e., source code in `server` directory) should be launched as a web service
- The `.env` file from local development should be uploaded as part of `Secret Files` after neccessary updates are done
  - Need to update `JINGLE_SNAKE_DOMAIN` to be domain name of Jingle Snake client deploy 
  - Need to update `CALLBACK_BASE` to be domain name of Jingel Snake server deploy
  - Update `SERVER_PORT` to whichever port you want to use for listening to request (e.g., 4000)
- Need to add Redirect URI for deployed version on Jingle Snake to Spotify API. Should be `<CALLBACK_BASE>/auth/callback`

### Tips for client deploy 
- Jingle Snake client (i.e., source code in `client` directory) should be launched as a static side 
- `VITE_SERVER_TARGET` needs to added as part of `Environment Variables` not uploaded as part of an .env file
  - This should point to the domain name for the Jingle Snake server deploy
