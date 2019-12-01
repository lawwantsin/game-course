import "./index.css"


class Loop {
  constructor(graphics) {
    this.graphics = graphics;
    const G = this.graphics;
    const w = G.canvas.width;
    const h = G.canvas.height;
    this.animation = {}
    this.box = { x: w/2, y: h/2 };
  }

  handleInput(e) {
    console.log("KEY", e.key);
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

  doOneFrame() {
    const G = this.graphics;
    const w = G.canvas.width;
    const h = G.canvas.height;
    G.rect('black', 0, 0, w, h)
    this.box.x += Math.random() * 2;
    this.box.y += Math.random() * 2;
    G.rect('red', this.box.x, this.box.y, 100, 100)
  }

  start(fps) {
    const G = this.graphics;
    Input.setup(this);
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

let KEYS_PRESSED = {}
class Input {
  constructor() {
    console.error("Please use as Singleton");
  }

  static setup(loop) {
    window.addEventListener('keydown', e => {
      this.keyDown(e);
      loop.handleInput(e);
    }, false)
    window.addEventListener('keyup', e => {
      this.keyUp(e);
      loop.handleInput(e);
    }, false)
  }

  static keyDown(e) {
    KEYS_PRESSED[e.key] = true;
    console.log("KEY: ", Object.keys(KEYS_PRESSED).join(", "));
  }

  static keyUp(e) {
    KEYS_PRESSED[e.key] = false;
  }

  static isPressed(key) {
    return KEYS_PRESSED[key]
  }
}

const boot = () => {
  const G = new Graphics()
  G.resize();
  const L = new Loop(G)
  L.start();
}

window.onload = boot
