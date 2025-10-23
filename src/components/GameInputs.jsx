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

function GameInputs({ boardSize, setBoardSize, difficulty, setDifficulty }) {
  return (
    <div className="d-flex justify-content-center gap-3 above_board">
      <BoardSize boardSize={boardSize} setBoardSize={setBoardSize} />
      <Difficulty difficulty={difficulty} setDifficulty={setDifficulty} />
    </div>
  );
}

export default GameInputs;
