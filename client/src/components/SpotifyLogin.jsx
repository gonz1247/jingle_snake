const server_target = import.meta.env.VITE_SERVER_TARGET;

export default function SpotifyLogin() {
  return (
    <div className="d-flex justify-content-center">
      <a className="btn btn-primary" href={`${server_target}/auth/login`}>
        Login with Spotify
      </a>
    </div>
  );
}
