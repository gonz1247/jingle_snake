export default class SnakeNode {
  // Reverse link list node
  constructor(row, col) {
    this.coord = [row, col];
    this.prev = null;
  }
}

class Snake {
  // Reverse link list to represent snake. Start at tail and move backwards up to head
  constructor() {
    this.tail = null;
    this.head = null;
    this.length = 0;
  }

  grow_at(row, col) {
    // Create new node to attach to snake
    const node = new SnakeNode(row, col);
    this.length += 1;
    // If no tail then this is first element
    if (this.tail === null) {
      this.tail = node;
      this.head = node;
      return;
    }
    // Attach node to head of snake (leave tail as is)
    this.head.prev = node;
    this.head = node;
  }

  move_to(row, col) {
    // If no tail then this is first element
    if (this.tail === null) {
      // Snake has no nodes so grow instead
      this.grow_at(row, col);
      return [null, null];
    }
    // Update tail node to have new coordinates
    const old_coord = this.tail.coord;
    this.tail.coord = [row, col];
    // Check if single node snake
    if (this.tail.prev === null) {
      // No need to update references since just a single node
      return old_coord;
    }
    // detach tail node
    const new_tail = this.tail.prev;
    this.tail.prev = null;
    // Reattach tail node to head node
    this.head.prev = this.tail;
    // Update tail and head poiners
    this.head = this.tail;
    this.tail = new_tail;
    return old_coord;
  }
}
