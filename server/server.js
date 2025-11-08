import express from "express";
import dotenv from "dotenv";
import request from "request";
import cors from "cors";

// Spotify API Credentials
dotenv.config();
const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

// Server setup
const app = express();

// Setup server to accept request from front-end
const corsOptions = {
  origin: `${process.env.JINGLE_SNAKE_DOMAIN}`,
};
app.use(cors(corsOptions));

// Random state string
const generateRandomString = (length) => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const spotify_redirect_uri = `${process.env.JINGLE_SNAKE_DOMAIN}/auth/callback`;
// User approval of application
app.get("/auth/login", (req, res) => {
  const scope =
    "streaming user-read-email user-read-private user-modify-playback-state playlist-read-private";

  const state = generateRandomString(16);

  const auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: spotify_redirect_uri,
    state: state,
  });

  res.redirect(
    "https://accounts.spotify.com/authorize/?" +
      auth_query_parameters.toString()
  );
});

// Generate access token
global.access_token = null;
app.get("/auth/callback", (req, res) => {
  const code = req.query.code;

  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri: spotify_redirect_uri,
      grant_type: "authorization_code",
    },
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString(
          "base64"
        ),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    json: true,
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token;
      res.redirect("/");
    }
  });
});

// Get current access token
app.get("/auth/token", (req, res) => {
  res.json({
    access_token: access_token,
  });
});

// Set up listener
app.listen(parseInt(process.env.SERVER_PORT), () => {
  console.log(`Listening at port ${process.env.SERVER_PORT}`);
});
