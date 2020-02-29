const NORMAL = 0, DEBUG = 1;
class Loop {
  constructor(G, player, map) {
    this.graphics = G;
    this.animation = {}
    this.mode = DEBUG;

    const w = G.canvas.width;
    const h = G.canvas.height;
    this.map = map;
    this.player = player;
    this.player.mode = this.mode;
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
      this.player.mode = !this.mode;
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

  move() {
    this.player.input();
    this.player.update();
    this.player.render();
  }

  drawBG() {
    const G = this.graphics;
    const cw = G.canvas.width;
    const ch = G.canvas.height;
    G.rect('white', 0, 0, cw, ch)
  }

  doOneFrame() {
    const G = this.graphics;
    this.drawBG();
    this.map.render();
    this.move();
    // if (this.mode) this.moveTD();
    // else this.movePF();
  }

  start(fps) {
    cancelAnimationFrame(this.animation.id);
    this.animation.fps = fps || 60;
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

export default Loop;
