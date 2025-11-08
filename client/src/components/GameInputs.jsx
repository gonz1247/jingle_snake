function BoardSize({ boardSize, setBoardSize }) {
  const updateBoardSize = (event) => {
    setBoardSize(Math.floor(event.target.value));
  };
  return (
    <div>
      <label htmlFor="boardSize">Board Size</label>
      <br></br>
      <input
        id="boardSize"
        name="boardSize"
        type="number"
        step="2"
        value={boardSize}
        onChange={updateBoardSize}
      ></input>
    </div>
  );
}

function Difficulty({ difficulty, setDifficulty }) {
  const updateDifficulty = (event) => {
    const availSettings = ["easy", "medium", "hard"];
    let newDifficulty = availSettings.includes(event.target.value)
      ? event.target.value
      : "easy";
    setDifficulty(newDifficulty);
  };
  return (
    <div>
      <label htmlFor="difficulty">Difficulty</label>
      <br></br>
      <select
        name="difficulty"
        id="difficulty"
        value={difficulty}
        onChange={updateDifficulty}
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
    </div>
  );
}

function PlaylistSelect({ playlist, setPlaylist }) {
  const updatePlaylist = (event) => {
    const availSettings = [
      "1WH6WVBwPBz35ZbWsgCpgr",
      "62y3BHKehWnb1hlaPclDAA",
      "6UxCcu2alE2WBSpYeoDfiY",
      "1ti3v0lLrJ4KhSTuxt4loZ",
      "19PgP2QSGPcm6Ve8VhbtpG"
    ];
    let newPlaylist = availSettings.includes(event.target.value)
      ? event.target.value
      : "1WH6WVBwPBz35ZbWsgCpgr";
    setPlaylist(newPlaylist);
  };
  return (
    <div>
      <label htmlFor="playlist">Playlist</label>
      <br></br>
      <select
        name="playlist"
        id="playlist"
        value={playlist}
        onChange={updatePlaylist}
      >
        <option value="1WH6WVBwPBz35ZbWsgCpgr">Pop</option>
        <option value="62y3BHKehWnb1hlaPclDAA">Hip Hop</option>
        <option value="6UxCcu2alE2WBSpYeoDfiY">Country</option>
        <option value="1ti3v0lLrJ4KhSTuxt4loZ">Rock</option>
        <option value="19PgP2QSGPcm6Ve8VhbtpG">80s</option>
      </select>
    </div>
  );
}

function GameInputs({
  boardSize,
  setBoardSize,
  difficulty,
  setDifficulty,
  playlist,
  setPlaylist,
}) {
  return (
    <div className="d-flex justify-content-center gap-3 above_board">
      <BoardSize boardSize={boardSize} setBoardSize={setBoardSize} />
      <Difficulty difficulty={difficulty} setDifficulty={setDifficulty} />
      <PlaylistSelect playlist={playlist} setPlaylist={setPlaylist} />
    </div>
  );
}

export default GameInputs;
