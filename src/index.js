import "./index.css"

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

class Map {
  constructor(G) {
    this.graphics = G;
    this.grid = [
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
    ];
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

class Player {
  constructor(G) {
    this.graphics = G;
    this.jumping = false;
    this.vx = 0;
    this.vy = 0;
    this.h = 30;
    this.w = 30;
    this.x = G.canvas.width / 2;
    this.y = G.canvas.height / 2;
    this.radius = 30;
    this.turnDirection = 0;
    this.walkDirection = 0;
    this.rotationAngle = Math.PI / 2;
    this.moveSpeed = .3;
    this.rotationSpeed = .2 * (Math.PI / 180);
  }

  inputTD() {
    if (KEYS_PRESSED["ArrowUp"]) {
      this.walkDirection += .3;
    }
    else if (KEYS_PRESSED["ArrowDown"]) {
      this.walkDirection -= .3;
    }
    else {
      this.walkDirection *= 0.99;
    }
    if (KEYS_PRESSED["ArrowLeft"]) {
      this.turnDirection -= 1;
    }
    else if (KEYS_PRESSED["ArrowRight"]) {
      this.turnDirection += 1;
    }
    else {
      this.turnDirection *= .5
    }
  }

  inputPF() {
    if (KEYS_PRESSED["ArrowUp"] && !this.jumping) {
      this.vy += -50;
      this.jumping = true;
    }
    if (KEYS_PRESSED["ArrowLeft"]) {
      if (this.vx < 0) this.vx = -.5;
      this.vx -= 10;
    }
    if (KEYS_PRESSED["ArrowRight"]) {
      if (this.vx > 0) this.vx = .5;
      this.vx += 10;
    }
    if (KEYS_PRESSED["ArrowDown"]) {
      this.vy += 2;
    }
  }

  updateTD() {
    this.rotationAngle += this.turnDirection * this.rotationSpeed;
    var moveStep = this.walkDirection * this.moveSpeed;
    else {
      this.x += Math.cos(this.rotationAngle) * moveStep;
      this.y += Math.sin(this.rotationAngle) * moveStep;
    }
  }

  renderPF() {
    const { x, y, h, w } = this;
    G.rect('red', x, y, w, h)
  }

  updatePF() {
    this.vy += 1;  // Gravity
    this.h = this.w = 40;

    // Collision
    const G = this.graphics;
    const floor = G.canvas.height - 10 - this.h

    if (this.y > floor) {  // On floor.
      this.vy = 0;
      this.vx *= .8       // Floor friction
      this.jumping = false;
      this.y = floor
    }
    else {
      this.vy *= .9   // Air friction
      this.vx *= .9
    }
    this.x += this.vx;  // Move box
    this.y += this.vy;
  }

  renderTD() {
    this.graphics.circle('red', this.x, this.y, this.radius);
    this.graphics.line('black', this.x, this.y,
      this.x + Math.cos(this.rotationAngle) * 30,
      this.y + Math.sin(this.rotationAngle) * 30)
  }
}

window.onload = boot
