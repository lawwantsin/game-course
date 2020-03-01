import { blank
 } from "./map-data"

class Map {
  constructor(G, grid) {
    this.graphics = G;
    this.grid = grid;
    this.playerTiles = [...blank];
    window.addEventListener('resize', () => this.resize());
    this.resize();
  }

  hitOuterWall(x, y, r) {
    const width = this.graphics.canvas.width;
    const height = this.graphics.canvas.height;
    const left = (x - r < this.TILE_WIDTH);
    const right = (x + r > width - this.TILE_WIDTH);
    const top = (y - r < this.TILE_HEIGHT);
    const bottom = (y + r > height - this.TILE_HEIGHT);
    return { left, right, top, bottom };
  }

  hitInnerWalls(x, y, r) {
    const width = this.graphics.canvas.width;
    const height = this.graphics.canvas.height;

    // Bottom
    const row1 = Math.floor((y + r) / this.TILE_HEIGHT );
    const col1 = Math.floor(x / this.TILE_WIDTH );

    // Top
    const row2 = Math.floor((y - r) / this.TILE_HEIGHT );
    const col2 = Math.floor(x / this.TILE_WIDTH );

    // Left
    const row3 = Math.floor(y / this.TILE_HEIGHT );
    const col3 = Math.floor((x - r) / this.TILE_WIDTH );

    // Right
    const row4 = Math.floor(y / this.TILE_HEIGHT );
    const col4 = Math.floor((x + r) / this.TILE_WIDTH );

    const GREEN = 1, RED = 2, BLUE = 3, YELLOW = 4;

    this.playerTiles = this.playerTiles.map(f => f.map(g => 0)) // Clear
    this.playerTiles[row1][col1] = GREEN;   // Bottom
    this.playerTiles[row2][col2] = RED;     // Top
    this.playerTiles[row3][col3] = BLUE;    // Left
    this.playerTiles[row4][col4] = YELLOW;  // Right
    if (this.grid[row1][col1] > 0 || this.grid[row2][col2] > 0 ||
        this.grid[row3][col3] > 0 || this.grid[row4][col4] > 0) {
      const right = (x + r < col4 * this.TILE_WIDTH + this.TILE_WIDTH);
      const left = (x + r > col2 * this.TILE_WIDTH);
      const bottom = (y + r < row1 * this.TILE_HEIGHT + this.TILE_HEIGHT);
      const top = (y + r > row2 * this.TILE_HEIGHT);
      if (this.playerTiles[row1][col1] === 1 && this.grid[row1][col1] === 1) this.grid[row1][col1] = 2;
      if (this.playerTiles[row2][col2] === 1 && this.grid[row2][col2] === 1) this.grid[row2][col2] = 2;
      if (this.playerTiles[row3][col3] === 1 && this.grid[row3][col3] === 1) this.grid[row3][col3] = 2;
      if (this.playerTiles[row4][col4] === 1 && this.grid[row4][col4] === 1) this.grid[row4][col4] = 2;
      return { left, right, top, bottom };
    }
    return { left: false, right: false, top: false, bottom: false };
  }

  resize() {
    this.MAP_NUM_ROWS = this.grid.length;
    this.MAP_NUM_COLS = this.grid[0].length;
    this.TILE_HEIGHT = Math.floor(this.graphics.canvas.height / this.MAP_NUM_ROWS);
    this.TILE_WIDTH = Math.floor(this.graphics.canvas.width / this.MAP_NUM_COLS);
  }

  render() {
    for (var i = 0; i < this.MAP_NUM_ROWS; i++) {
      for (var j = 0; j < this.MAP_NUM_COLS; j++) {
        var tileX = j * this.TILE_WIDTH;
        var tileY = i * this.TILE_HEIGHT;
        var tileColor = ["transparent", "#222", "red"][this.grid[i][j]];
        var playerTileColor = ["transparent", "rgba(0,128,0,0.4)", "rgba(128,0,0,0.4)", "rgba(0,0,128,0.4)", "rgba(255,255,0,0.4)"][this.playerTiles[i][j]];
        this.graphics.rect(playerTileColor, tileX, tileY, this.TILE_WIDTH, this.TILE_HEIGHT);
        this.graphics.rect(tileColor, tileX, tileY, this.TILE_WIDTH, this.TILE_HEIGHT);
      }
    }
  }
}

export default Map;
