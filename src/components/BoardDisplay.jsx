function Cell({ value }) {
  let cellDisplay;
  let cellType;
  if (value === 0) {
    cellDisplay = "";
    cellType = "empty";
  } else if (value === 1) {
    cellDisplay = "";
    cellType = "snake";
  } else if (value === "#") {
    cellDisplay = "#";
    cellType = "char";
  } else {
    cellDisplay = String.fromCharCode(value - 2);
    cellType = "char";
  }
  return <div className={"cell col " + cellType}>{cellDisplay}</div>;
}

function BoardDisplay({ board }) {
  const m_cols = board.length;
  return (
    <>
      <div className="board container text-center">
        {board.map((row, row_idx) => (
          <div className="row" key={row_idx}>
            {row.map((cell, col_idx) => (
              <Cell key={row_idx * m_cols + col_idx} value={cell} />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default BoardDisplay;
