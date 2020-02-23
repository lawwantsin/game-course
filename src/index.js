import "./index.css"

let KEYS_PRESSED = {}

let G;

class Graphics {
  constructor() {
    this.canvas = document.querySelector("canvas");
    this.context = this.canvas.getContext("2d");
    window.addEventListener('resize', this.resize);
  }
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  validate() {
    const args = Array.from(arguments);
    args.map((a, i) => {
      if (typeof a === 'undefined' || a == null) {
        console.error(`Canvas Draw argument missing (${args.join(', ')})`);
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
    const w = G.canvas.width;
    const h = G.canvas.height;
    this.box = new Player(this.graphics);
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
  }

  move() {
    if (KEYS_PRESSED["ArrowUp"] && !this.box.jumping) {
      this.box.vy += -50;
      this.box.jumping = true;
    }
    if (KEYS_PRESSED["ArrowLeft"]) {
      if (this.box.vx < 0) this.box.vx = -.5;
      this.box.vx -= 10;
    }
    if (KEYS_PRESSED["ArrowRight"]) {
      if (this.box.vx > 0) this.box.vx = .5;
      this.box.vx += 10;
    }
    if (KEYS_PRESSED["ArrowDown"]) {
      this.box.vy += 2;
    }
    this.box.vy += 1;  // Gravity

    // Collision
    const G = this.graphics;
    const floor = G.canvas.height - 10 - this.box.h

    if (this.box.y > floor) {  // On floor.
      this.box.vy = 0;
      this.box.vx *= .8       // Floor friction
      this.box.jumping = false;
      this.box.y = floor
    }
    else {
      this.box.vy *= .9   // Air friction
      this.box.vx *= .9
    }
    this.box.x += this.box.vx;  // Move box
    this.box.y += this.box.vy;
  }

  moveTD() {
    if (KEYS_PRESSED["ArrowUp"] && !this.box.jumping) {
      this.box.walkDirection += .3;
    }
    else if (KEYS_PRESSED["ArrowDown"]) {
      this.box.walkDirection -= .3;
    }
    else {
      this.box.walkDirection *= 0.99;
    }
    if (KEYS_PRESSED["ArrowLeft"]) {
      this.box.turnDirection -= 1;
    }
    else if (KEYS_PRESSED["ArrowRight"]) {
      this.box.turnDirection += 1;
    }
    else {
      this.box.turnDirection *= .5
    }
    this.box.update();
    this.box.render();
  }

  doOneFrame() {
    const G = this.graphics;
    const cw = G.canvas.width;
    const ch = G.canvas.height;
    G.rect('black', 0, 0, cw, ch)
    this.moveTD(G);
    // const { x, y, h, w } = this.box;
    // G.rect('red', x, y, w, h)
    // G.rect('white', 0, ch - 10, cw, 10)
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
  G.resize();
  const L = new Loop(G)
  L.start();
}

class Player {
  constructor(G) {
    this.graphics = G;
    this.x = G.canvas.width / 2;
    this.y = G.canvas.height / 2;
    this.radius = 30;
    this.turnDirection = 0;
    this.walkDirection = 0;
    this.rotationAngle = Math.PI / 2;
    this.moveSpeed = .3;
    this.rotationSpeed = .2 * (Math.PI / 180);
  }

  update() {
    this.rotationAngle += this.turnDirection * this.rotationSpeed;
    var moveStep = this.walkDirection * this.moveSpeed;
    this.x += Math.cos(this.rotationAngle) * moveStep;
    this.y += Math.sin(this.rotationAngle) * moveStep;
  }

  render() {
    this.graphics.circle('red', this.x, this.y, this.radius);
    this.graphics.line('black', this.x, this.y,
      this.x + Math.cos(this.rotationAngle) * 30,
      this.y + Math.sin(this.rotationAngle) * 30)
  }
}

window.onload = boot
