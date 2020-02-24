import "./index.css"

let KEYS_PRESSED = {}, G, error;
class Graphics {
  constructor() {
    this.canvas = document.querySelector("canvas");
    this.c = this.canvas.getContext("2d");
    window.addEventListener('resize', () => this.resize());
  }
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
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
  drawBG() {
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    this.c.rect('black', 0, 0, cw, ch)
  }
  point(color, x, y) {
    this.circle(color, x, y, 2, 2);
  }
  rect(color, x, y, w, h) {
    this.validate(color, x, y, w, h);
    this.c.fillStyle = color;
    this.c.fillRect(x, y, w, h);
  }
  outlineRect(color, x, y, w, h) {
    this.validate(color, x, y, w, h);
    this.c.strokeStyle = color;
    this.c.lineWidth = 1;
    // this.c.save();
    // this.c.translate(-w/2, -h/2);
    this.c.strokeRect(x, y, w, h);
    // this.c.restore();
  }
  line(color, x1, y1, x2, y2) {
    this.validate(color, x1, y2, x2, y2);
    this.c.strokeStyle = color;
    this.c.beginPath();
    this.c.lineWidth = 2
    this.c.moveTo(x1, y1);
    this.c.lineTo(x2, y2);
    this.c.stroke();
  }
  circle(color, x, y, radius) {
    this.validate(color, x, y, radius);
    this.c.fillStyle = color;
    this.c.beginPath();
    this.c.arc(x, y, radius, 0, 2 * Math.PI);
    this.c.fill();
  }
  drawPoints(points) {
    points.map((p, i) => {
      this.point('green', p.x, p.y);
    })
  }
  drawQuadTree(qt) {
    const { x, y, w, h } = qt.boundary;
    this.outlineRect('green', x, y, w, h);
    this.drawPoints(qt.points);
    if (qt.divided) {
      this.drawQuadTree(qt.northeast);
      this.drawQuadTree(qt.northwest);
      this.drawQuadTree(qt.southeast);
      this.drawQuadTree(qt.southwest);
    }
  }
}

class Loop {
  constructor(G) {
    this.graphics = G;
    this.animation = {}
    this.points = [];
    this.mode = true;
    const w = G.canvas.width;
    const h = G.canvas.height;
    const cw = w/2
    const ch = h/2

    let boundary = new Rect(cw, ch, w, h);
    this.qt = new QuadTree(boundary, 1);

    for (var i = 0; i < 100; i++) {
      let p = new Point(Math.random()*w, Math.random()*h);
      this.points.push(p);
      this.qt.insert(p);
    }

    window.addEventListener('keyup', e => this.handleUp(e))
    window.addEventListener('keydown', e => this.handleDown(e))
  }

  handleUp(e) {
    KEYS_PRESSED[e.key] = false;
  }

  handleDown(e) {
    console.log("KEY", e.key);
    KEYS_PRESSED[e.key] = true;

    // Special keys that toggle Game Engine states
    if (e.key == "]") {  // Double FPS. Max 60.
      this.animation.fps *= 2
      this.start(this.animation.fps)
    }
    // Half FPS.
    if (e.key == "[") {
      this.animation.fps /= 2
      this.start(this.animation.fps)
    }
    // Pause Loop.
    if (e.key == "CapsLock") {
      this.animation.stop = !this.animation.stop;
        this.start(this.animation.fps)
    }
    // Toggle Between Town Down and Platformer modes
    if (e.key == "Escape") {
      this.mode = !this.mode;
    }
  }

  // Where it all happens!!
  doOneFrame() {
    const G = this.graphics;
    G.drawBG();
    // G.drawPoints(this.points);
    G.drawQuadTree(this.qt);
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


// Collisions
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Rect {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  contains(point) {
    const { x, y, w, h } = this;
    return (
      point.x > x - w &&
      point.x < x + w &&
      point.y > y - h &&
      point.y < y + h
    )
  }
}

class QuadTree {
  constructor(boundary, capacity) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.points = [];
    this.divided = false;
    this.northeast
  }

  subdivide() {
    const c = this.capacity;
    let { x, y, w, h } = this.boundary;
    w = w/2;
    h = h/2;
    let ne = new Rect(x + w, y - h, w, h);
    this.northeast = new QuadTree(ne, c);
    let nw = new Rect(x - w, y - h, w, h);
    this.northwest = new QuadTree(nw, c);
    let se = new Rect(x + w, y + h, w, h);
    this.southeast = new QuadTree(se, c);
    let sw = new Rect(x - w, y + h, w, h);
    this.southwest = new QuadTree(sw, c);
    this.divided = true;
  }

  insert(point) {
    if (!this.boundary.contains(point)) return false;

    if (this.points.length < this.capacity) {
      this.points.push(point);
    } else {
      if (!this.divided) {
        this.subdivide();
        return (this.northeast.insert(point) ||
                this.northwest.insert(point) ||
                this.southeast.insert(point) ||
                this.southwest.insert(point))
      }
    }
  }
}


const boot = () => {
  G = new Graphics()
  G.resize();
  const L = new Loop(G)
  L.start();
}


window.onload = boot
