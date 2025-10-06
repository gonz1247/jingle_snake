class Board {
  #cell_avail_value = 0;

  constructor(boardSize) {
    this.boardSize = boardSize;
    this.ncells_available = boardSize * boardSize;
    this.cells = Array(boardSize)
      .fill(null)
      .map(() => Array(boardSize).fill(this.#cell_avail_value));
    this.cell_available_array = Array(boardSize * boardSize)
      .fill(null)
      .map((_, idx) => idx);
    this.cell_idx_to_avail_position = Array(boardSize * boardSize)
      .fill(null)
      .map((_, idx) => idx);
  }

  getAvailableCellCoord() {
    // Check if any are still available
    if (this.ncells_available == 0) {
      return [-1, -1];
    }
    // Of available cells get a random one
    const min_idx = 0;
    const max_idx = this.ncells_available - 1;
    const rand_idx =
      Math.floor(Math.random() * (max_idx - min_idx + 1)) + min_idx;
    const cell_idx = this.cell_available_array[rand_idx];
    // Convert cell index to a row and column
    return [Math.floor(cell_idx / this.boardSize), cell_idx % this.boardSize];
  }

  updateCellValue(row, col, value) {
    if (value == this.#cell_avail_value) {
      // Use restoreCellAvailability method instead
      this.restoreCellAvailability(row, col);
      return;
    }
    // update value
    this.cells[row][col] = value;
    // get cell index indicated by coordinate
    const cell_idx = row * this.boardSize + col;
    const cell_idx_avail_pos = this.cell_idx_to_avail_position[cell_idx];
    // Check if cell was previouly unavailable
    if (cell_idx_avail_pos >= this.ncells_available) {
      // Was already unavailable so no update needed
      return;
    }
    // Decrement number of available cells
    this.ncells_available -= 1;

    // Get random current available to switch places with cell that is now unavailable
    const rand_cell_idx = this.cell_available_array[this.ncells_available];
    this.cell_available_array[cell_idx_avail_pos] = rand_cell_idx;
    this.cell_idx_to_avail_position[rand_cell_idx] = cell_idx_avail_pos;

    // Move updated cell to unavailable
    this.cell_available_array[this.ncells_available] = cell_idx;
    this.cell_idx_to_avail_position[cell_idx] = this.ncells_available;
  }

  restoreCellAvailability(row, col) {
    // update value
    this.cells[row][col] = this.#cell_avail_value;
    // get cell index indicated by coordinate
    const cell_idx = row * this.boardSize + col;
    const cell_idx_avail_pos = this.cell_idx_to_avail_position[cell_idx];
    // Check if cell was already available
    if (cell_idx_avail_pos < this.ncells_available) {
      // Was already available so no update needed
      return;
    }

    // Get random current unavailable to switch places with cell that is now available
    const rand_cell_idx = this.cell_available_array[this.ncells_available];
    this.cell_available_array[cell_idx_avail_pos] = rand_cell_idx;
    this.cell_idx_to_avail_position[rand_cell_idx] = cell_idx_avail_pos;

    // Move restored cell to available
    this.cell_available_array[this.ncells_available] = cell_idx;
    this.cell_idx_to_avail_position[cell_idx] = this.ncells_available;

    // Increment number of available cells
    this.ncells_available += 1;
  }
}

export default Board;
