export function initFillBoardWithChars(boardSize, fillPercentage) {
  fillPercentage = Math.min(Math.max(0, fillPercentage), 1);
  const n_fill = Math.max(
    Math.floor(boardSize * boardSize * fillPercentage),
    3
  );
  // Set up availability object for board
  let avail_cells_array = Array(boardSize * boardSize)
    .fill(null)
    .map((_, idx) => idx);
  let n_avail_cells = boardSize * boardSize;
  let cell_2_idx_hashmap = Array(boardSize * boardSize)
    .fill(null)
    .map((_, idx) => idx);
  // Initialize availability object
  let availability_object = {
    avail_cells_array,
    n_avail_cells,
    cell_2_idx_hashmap,
  };
  // make center of board unavailable (assuming the snake will be there)
  const cell_center = Math.floor((boardSize * boardSize) / 2);
  availability_object = removeCellAvailability(
    cell_center,
    availability_object
  );
  let output = [];
  let fill_row, fill_col, fill_char;
  for (let i = 0; i < n_fill; i++) {
    ({ availability_object, fill_row, fill_col, fill_char } =
      fillCellWithChar(availability_object));
    output.push({ row: fill_row, col: fill_col, char: fill_char });
  }
  return { fillSpots: output, availabilityObject: availability_object };
}

export function fillCellWithChar(availability_object) {
  // Check if any are still available
  if (availability_object.n_avail_cells == 0) {
    return {
      availability_object: availability_object,
      fill_row: null,
      fill_col: null,
      fill_char: null,
    };
  }
  // Of available cells get a random one
  const min_idx = 0;
  const max_idx = availability_object.n_avail_cells - 1;
  const rand_idx =
    Math.floor(Math.random() * (max_idx - min_idx + 1)) + min_idx;
  const cell_num = availability_object.avail_cells_array[rand_idx];
  // Remove random cell from being available
  availability_object = removeCellAvailability(cell_num, availability_object);
  // Convert cell index to a row and column
  const boardSize = Math.sqrt(availability_object.avail_cells_array.length);
  const row = Math.floor(cell_num / boardSize);
  const col = cell_num % boardSize;
  // Get random number representing ASCII character with offset of two
  const A = 65; // ASCII
  const Z = 90; // ASCII
  const char = Math.floor(Math.random() * (Z - A + 1)) + A + 2;
  return {
    availability_object: availability_object,
    fill_row: row,
    fill_col: col,
    fill_char: char,
  };
}

export function removeCellAvailability(cell_num, availability_object) {
  let { avail_cells_array, n_avail_cells, cell_2_idx_hashmap } =
    availability_object;
  // Decrement number of available cells
  n_avail_cells -= 1;
  // get index of cell that is losing availability and cell that still has availability
  const still_avail_idx = cell_2_idx_hashmap[cell_num];
  const unavailable_idx = n_avail_cells;
  // Move cell that fell into unavailble index back to an available index
  const cell_num_avail_still = avail_cells_array[unavailable_idx];
  avail_cells_array[still_avail_idx] = cell_num_avail_still;
  cell_2_idx_hashmap[cell_num_avail_still] = still_avail_idx;
  // Remove availability of inputted cell number
  avail_cells_array[unavailable_idx] = cell_num;
  cell_2_idx_hashmap[cell_num] = unavailable_idx;
  return { avail_cells_array, n_avail_cells, cell_2_idx_hashmap };
}

export function addCellAvailability(cell_num, availability_object) {
  let { avail_cells_array, n_avail_cells, cell_2_idx_hashmap } =
    availability_object;
  // get index of cell that is gaining availability and cell that still does not have availability
  const unavailable_idx = cell_2_idx_hashmap[cell_num];
  const now_available_idx = n_avail_cells;
  // Increment number of available cells
  n_avail_cells += 1;
  // Move cell that fell into availble index back to an unavailable index
  const cell_num_unavail_still = avail_cells_array[now_available_idx];
  avail_cells_array[unavailable_idx] = cell_num_unavail_still;
  cell_2_idx_hashmap[cell_num_unavail_still] = unavailable_idx;
  // Add availability to inputted cell number
  avail_cells_array[now_available_idx] = cell_num;
  cell_2_idx_hashmap[cell_num] = now_available_idx;
  return { avail_cells_array, n_avail_cells, cell_2_idx_hashmap };
}
