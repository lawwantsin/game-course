class Map {
  constructor(G, grid) {
    this.graphics = G;
    this.grid = grid;
    window.addEventListener('resize', () => this.resize());
  }

  hitOuterWall(x, y, r) {
    const left = (x - r < this.TILE_WIDTH);
    const right = (x + r > this.graphics.canvas.width - this.TILE_WIDTH);
    const top = (y - r < this.TILE_HEIGHT);
    const bottom = (y + r > this.graphics.canvas.height - this.TILE_HEIGHT);
    return { left, right, top, bottom };
  }

  resize() {
    this.MAP_NUM_ROWS = this.grid.length;
    this.MAP_NUM_COLS = this.grid[0].length;
    this.TILE_HEIGHT = this.graphics.canvas.height / this.MAP_NUM_ROWS;
    this.TILE_WIDTH = this.graphics.canvas.width / this.MAP_NUM_COLS;
  }

  render() {
    for (var i = 0; i < this.MAP_NUM_ROWS; i++) {
      for (var j = 0; j < this.MAP_NUM_COLS; j++) {
        var tileX = j * this.TILE_WIDTH;
        var tileY = i * this.TILE_HEIGHT;
        var tileColor = this.grid[i][j] == 1 ? "#222" : "#fff";
        this.graphics.rect(tileColor, tileX, tileY, this.TILE_WIDTH, this.TILE_HEIGHT);
      }
    }
  }
}

export default Map;
