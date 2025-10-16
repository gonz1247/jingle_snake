export function fillBoardWithChars(boardSize, fillPercentage) {
  fillPercentage = Math.min(Math.max(0, fillPercentage), 1);
  const n_fill = Math.floor(boardSize * boardSize * fillPercentage);
  // assume all spaces are available
  let avail_cells = Array(boardSize * boardSize)
    .fill(null)
    .map((_, idx) => idx);
  let n_avail = boardSize * boardSize;
  let output = [];
  for (let i = 0; i < n_fill; i++) {
    // get random cell
    let rand_idx = Math.floor(Math.random() * n_avail);
    let cell_idx = avail_cells[rand_idx];
    let row = Math.floor(cell_idx / boardSize);
    let col = cell_idx % boardSize;
    // Switch random cell with last cell in available array
    n_avail -= 1;
    avail_cells[rand_idx] = avail_cells[n_avail];
    avail_cells[n_avail] = cell_idx;
    // Get random number representing ASCII character with offset of two
    const A = 65; // ASCII
    const Z = 90; // ASCII
    let char = Math.floor(Math.random() * (Z - A + 1)) + A + 2;
    output.push({ row, col, char });
  }
  return output;
}
