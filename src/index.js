import "./index.css"


class Loop {
  constructor(graphics) {
    this.graphics = graphics;
    this.animation = {

    }
  }

  doOneFrame() {
    const G = this.graphics;
    const w = G.canvas.width;
    const h = G.canvas.height;
    G.rect('black', 0, 0, w, h)
    this.box.x += Math.random() * 2;
    this.box.y += Math.random() * 2 - 1;
    G.rect('red', this.box.x, this.box.y, 100, 100)
  }

  start(fps) {
    const G = this.graphics;
    const w = G.canvas.width;
    const h = G.canvas.height;
    this.box = { x: w/2, y: h/2 };
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
  const L = new Loop(G)
  G.resize();
  L.start();
}

window.onload = boot
