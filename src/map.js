import { blank
 } from "./map-data"
import { Box, Circle } from "./shapes"
import Vector from "./vector";
import Collisions from "./collisions"
const OPEN = 0, WALL = 1;

class Map {
  constructor(G, grid) {
    this.graphics = G;
    this.width = G.canvas.width;
    this.height = G.canvas.height;
    this.grid = grid;
    this.playerTiles = [...blank];
    window.addEventListener('resize', () => this.resize());
    this.resize();
  }

  collision(rect, circle, circleV){
    const nearestX = Math.max(rect.position.x, Math.min(circle.position.x, rect.position.x + rect.w));
    const nearestY = Math.max(rect.y, Math.min(circle.position.y, rect.position.y + rect.h));
    const dist = new Vector(circle.position.x - nearestX, circle.position.y - nearestY);
    if (circleV.dot(dist) < 0) { //if circle is moving toward the rect
      return false;
    }
    const penetrationDepth = circle.r - dist.length();
    const penetrationVector = dist.normalize().multiply(penetrationDepth);
    const pos = circle.position.subtract(penetrationVector);
    circle.position = pos;
    return { pos: circle.position, vel: penetrationVector};
  }

  hasWallAt(circle, circleV) {
    const x = circle.position.x;
    const y = circle.position.y;
    const w = this.TILE_WIDTH
    const h = this.TILE_HEIGHT
    if (x < w || x > this.width - w ||
        y < h || y > this.height - h) {
      return true;
    }
    var gridIndX = Math.floor(x / w);
    var gridIndY = Math.floor(y / h);
    if (this.grid[gridIndY][gridIndX] !== 0) {
      const wy = gridIndY * h;
      const wx = gridIndX * w;
      const box = new Box(wx, wy, wx+w, wy+h);
      const hit = this.collision(circle, box, circleV)
      return hit;
    }
  }

  resize() {
    this.height = this.graphics.canvas.height;
    this.width = this.graphics.canvas.width;
    this.MAP_NUM_ROWS = this.grid.length;
    this.MAP_NUM_COLS = this.grid[0].length;
    this.TILE_HEIGHT = Math.floor(this.height / this.MAP_NUM_ROWS);
    this.TILE_WIDTH = Math.floor(this.width / this.MAP_NUM_COLS);
  }

  render() {
    for (var i = 0; i < this.MAP_NUM_ROWS; i++) {
      for (var j = 0; j < this.MAP_NUM_COLS; j++) {
        var tileX = j * this.TILE_WIDTH;
        var tileY = i * this.TILE_HEIGHT;
        var tileColor = ["transparent", "#222", "red"][this.grid[i][j]];
        var playerTileColor = ["transparent", "rgba(0,128,0,0.4)", "rgba(128,0,0,0.4)", "rgba(0,0,128,0.4)", "rgba(255,255,0,0.4)"][this.playerTiles[i][j]];
        this.graphics.rect(playerTileColor, tileX, tileY, this.TILE_WIDTH, this.TILE_HEIGHT, true);
        this.graphics.rect(tileColor, tileX, tileY, this.TILE_WIDTH, this.TILE_HEIGHT, true);
      }
    }
  }
}

export default Map;
