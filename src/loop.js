const NORMAL = 0, DEBUG = 1;
import { Box, Circle } from "./shapes"

class Loop {
  constructor(G, E, M, I, C) {
    this.map = M;
    this.graphics = G;
    this.inputData = I;
    this.animation = {}
    this.mode = DEBUG;
    this.entities = E;
    this.collisions = C;
  }

  input() {
    const K = this.inputData.KEYS_PRESSED;
    if (K["]"]) {
      this.animation.fps *= 2
      this.start(this.animation.fps)
    }
    if (K["["]) {
      this.animation.fps /= 2
      this.start(this.animation.fps)
    }
    if (K["CapsLock"]) {
      this.animation.stop = !this.animation.stop;
        this.start(this.animation.fps)
    }
    if (K["Escape"]) {
      this.mode = !this.mode;
      this.entities.map(e => e.mode = this.mode);
    }
    return this;
  }

  // renderMe(x, y) {
  //   const C = this.collisions;
  //   const G = this.graphics;
  //   let fill = false;
  //   const me = new Circle(x, y, 100);
  //   this.entities.map(e => {
  //     const them = e;
  //     const fill = C.detectCollision(me, them)
  //     me.update(fill);
  //     them.update(fill);
  //   });
  //   me.render(G, 'green');
  // }


  doOneFrame() {
    this.input();
    const { x, y, buttons } = this.inputData.mouse;
    this.graphics.drawBG('white');
    if (this.map) this.map.render();
    this.entities.map(i => i.input())
        .map(u => u.update())
        .map(r => r.render(this.graphics));
    // if (buttons) {
    //   this.renderMe(x, y);
    // }
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
