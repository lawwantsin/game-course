import "./index.css"

let KEYS_PRESSED = {}
class Loop {
  constructor(graphics) {
    this.graphics = graphics;
    this.animation = {}
    const G = this.graphics;
    const w = G.canvas.width;
    const h = G.canvas.height;
    this.box = {
      x: w/2,
      y: h/2,
      h: 90,
      w: 90,
      vx: 0,
      vy: 0,
      jumping: false
     };
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

  doOneFrame() {
    const G = this.graphics;
    const cw = G.canvas.width;
    const ch = G.canvas.height;
    this.move();
    const { x, y, h, w } = this.box;
    G.rect('black', 0, 0, cw, ch)
    G.rect('red', x, y, w, h)
    G.rect('white', 0, ch - 10, cw, 10)
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
}


const boot = () => {
  const G = new Graphics()
  G.resize();
  const L = new Loop(G)
  L.start();
}

window.onload = boot
