import "./index.css"
import Vector from "./vector"

let KEYS_PRESSED = {}

let G, M, error;

class Graphics {
  constructor() {
    this.canvas = document.querySelector("canvas");
    this.context = this.canvas.getContext("2d");
    window.addEventListener('resize', () => this.resize());
  }
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    M.resize();
  }
  validate() {
    const args = Array.from(arguments);
    args.map((a, i) => {
      if ((typeof a === 'undefined' || a == null) && !error) {
        console.error(`Canvas Draw argument missing (${args.join(', ')})`);
        error = true;
      }
    });
  }
  text(text, x, y, color = 'white') {
    this.context.fillStyle = color;
    this.context.font = "18px Arial";
    this.context.fillText(text, x, y);
  }
  rect(color, x, y, w, h) {
    this.validate(color, x, y, w, h);
    this.context.fillStyle = color;
    this.context.fillRect(x, y, w, h);
  }
  line(color, x1, y1, x2, y2) {
    this.validate(color, x1, y2, x2, y2);
    this.context.strokeStyle = color;
    this.context.beginPath();
    this.context.lineWidth = 2
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
  }
  circle(color, x, y, radius) {
    this.validate(color, x, y, radius);
    this.context.fillStyle = color;
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, 2 * Math.PI);
    this.context.fill();
  }
}

class Loop {
  constructor(G) {
    this.graphics = G;
    this.animation = {}
    this.mode = true;
    const w = G.canvas.width;
    const h = G.canvas.height;
    this.player = new Player(this.graphics);
    this.map = new Map(G)
    window.addEventListener('keyup', e => this.handleUp(e))
    window.addEventListener('keydown', e => this.handleDown(e))
  }

  handleUp(e) {
    KEYS_PRESSED[e.key] = false;
  }

  handleDown(e) {
    console.log("KEY", e.key);
    KEYS_PRESSED[e.key] = true;
    if (e.key == "]") {
      this.animation.fps *= 2
      this.start(this.animation.fps)
    }
    if (e.key == "[") {
      this.animation.fps /= 2
      this.start(this.animation.fps)
    }
    if (e.key == "CapsLock") {
      this.animation.stop = !this.animation.stop;
        this.start(this.animation.fps)
    }
    if (e.key == "Escape") {
      this.mode = !this.mode;
    }
  }

  movePF() {
    this.player.inputPF();
    this.player.updatePF();
    this.player.renderPF();
  }

  moveTD() {
    this.player.inputTD();
    this.player.updateTD();
    this.player.renderTD();
  }

  drawBG() {
    const G = this.graphics;
    const cw = G.canvas.width;
    const ch = G.canvas.height;
    G.rect('black', 0, 0, cw, ch)
  }

  doOneFrame() {
    const G = this.graphics;
    this.drawBG();
    M.render();
    if (this.mode) this.moveTD();
    else this.movePF();
  }

  start(fps) {
    cancelAnimationFrame(this.animation.id);
    this.animation.fps = fps || 60
    this.animation.fpsInterval = 1000 / this.animation.fps;
    this.animation.then = Date.now();
    this.animation.startTime = this.animation.then;
    this.animation.frameCount = 0;
    this.animation.id = requestAnimationFrame(() => this.loop());
  }

  loop() {
    this.animation.now = Date.now();
    this.animation.elapsed = this.animation.now - this.animation.then;
    this.animation.sinceStart = this.animation.now - this.animation.startTime;
    this.animation.currentFPS = (Math.round(1000 / (this.animation.sinceStart / ++this.animation.frameCount) * 100) / 100).toFixed(2);
    if (this.animation.elapsed > this.animation.fpsInterval) {
      this.doOneFrame()
      this.animation.then = this.animation.now - (this.animation.elapsed % this.animation.fpsInterval);
      if (this.animation.stop) return;
    }
    this.animation.id = requestAnimationFrame(() => this.loop());
  }
}

const boot = () => {
  G = new Graphics()
  M = new Map(G);

  G.resize();
  M.resize();
  const L = new Loop(G)
  L.start();
}

const maze = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]

const room = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]

class Map {
  constructor(G) {
    this.graphics = G;
    this.grid = room;
  }

  hitOuter(x, y, r) {
    var a = ((x - r < this.TILE_WIDTH) ||
        (x + r > this.graphics.canvas.width - this.TILE_WIDTH) ||
        (y - r < this.TILE_HEIGHT) ||
        (y + r > this.graphics.canvas.height - this.TILE_HEIGHT))
    return a;
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

window.onload = boot
