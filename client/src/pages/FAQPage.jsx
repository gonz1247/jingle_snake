import { Link } from "react-router-dom";

export default function FAQPage() {
  return (
    <>
      <h1>Frequently Asked Questions</h1>
      <Link to="/">Main Page</Link>
      <details>
        <summary>Do I need a Spotify account to play Jingle Snake?</summary>
        <fieldset>
          <p>
            Yes, a Spotify premium account is required to play JIngle Snake. Log
            into your account by clicking "Login with Spotify" on the main page.
          </p>
        </fieldset>
      </details>
      <details>
        <summary>
          Why does the title of the song playing not match what Jingle Snake
          wants me to guess?
        </summary>
        <fieldset>
          <p>
            Sometimes Jingle Snake and the Spotify API get out of sync. If you
            notice this issue use the "Reset Spotify" button between games to
            mitigate the issue. If the issue persists, manually open up Spotify
            (on any platform) and clear your song queue.
          </p>
        </fieldset>
      </details>
      <details>
        <summary>
          Is there a way to see what song is playing without opening up Spotify?
        </summary>
        <fieldset>
          <p>
            The song titles are printed to the{" "}
            <Link
              to="https://developer.chrome.com/docs/devtools/console"
              target="_blank"
            >
              web console
            </Link>{" "}
            as as they are added to the queue. Console is cleared at the start
            of each game.
          </p>
        </fieldset>
      </details>
    </>
  );
}
