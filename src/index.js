import "./index.css"


let KEYS_PRESSED = {}, G, error, before = Date.now();
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
    this.validate(color, x, y);
    this.circle(color, x, y, 3);
  }
  rect(color, x, y, w, h) {
    this.validate(color, x, y, w, h);
    this.c.fillStyle = color;
    this.c.fillRect(x, y, w, h);
  }
  outlineRect(color, x, y, w, h) {
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    this.validate(color, x, y, w, h);
    this.c.strokeStyle = color;
    this.c.lineWidth = .25;
    this.c.save();
    this.c.translate(x, y);
    this.c.strokeRect(0, 0, w, h);
    this.c.restore();
  }
  text(text, x, y, color = 'white') {
    this.c.fillStyle = color;
    this.c.font = "12px Hack";
    this.c.fillText(text, x, y);
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
      this.point('red', p.x, p.y);
    })
  }
  drawQuadTree(qt, color = 'silver') {
    const { x, y, w, h } = qt.boundary;
    this.outlineRect('rgba(155,155,155,0.25)', x, y, w, h);
    this.drawPoints(qt.points);
    if (qt.divided) {
      this.drawQuadTree(qt.northeast, 'yellow');
      this.drawQuadTree(qt.northwest, 'green');
      this.drawQuadTree(qt.southeast, 'blue');
      this.drawQuadTree(qt.southwest, 'purple');
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
    let boundary = new Bounds(0, 0, w, h);
    this.qt = new QuadTree(boundary, 8);

    window.addEventListener('mousemove', e => this.handleMouseDown(e))
    window.addEventListener('keyup', e => this.handleUp(e))
    window.addEventListener('keydown', e => this.handleDown(e))
  }

  handleMouseDown(e) {
    const x = e.clientX;
    const y = e.clientY;
    const now = Date.now();
    if ((now - before > 25) && e.buttons) {
      const p = new Point(x, y)
      this.qt.insert(p);
      before = Date.now();
    }
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
    this.move(this.points);
    G.drawQuadTree(this.qt, 'white');
  }

  move(points) {
    for (var i = 0; i < this.points.length; i++) {
      this.points[i].x += 1
      this.points[i].y += 1
    }
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

class Bounds {
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
  intersects(range) {
    return (
      range.x - range.w > this.x + this.w ||
      range.x + this.w < this.x - this.w ||
      range.y - range.h > this.y + this.h ||
      range.y + this.h < this.y - this.h
    )
  }
}

class QuadTree {
  constructor(boundary, capacity) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.points = [];
    this.divided = false;
  }

  subdivide() {
    const c = this.capacity;
    let { x, y, w, h } = this.boundary;
    h = h/2;
    w = w/2;
    let ne = new Bounds(x + w, y, w, h);
    this.northeast = new QuadTree(ne, this.capacity);
    let nw = new Bounds(x, y, w, h);
    this.northwest = new QuadTree(nw, this.capacity);
    let se = new Bounds(x + w, y + h, w, h);
    this.southeast = new QuadTree(se, this.capacity);
    let sw = new Bounds(x, y + h, w, h);
    this.southwest = new QuadTree(sw, this.capacity);
    this.divided = true;
  }

  insert(point) {
    if (!this.boundary.contains(point)) return false;

    if (this.points.length < this.capacity) {
      this.points.push(point);
    } else {
      if (!this.divided) {
        this.subdivide();
      }
      return (this.northeast.insert(point) ||
              this.northwest.insert(point) ||
              this.southeast.insert(point) ||
              this.southwest.insert(point));
    }
  }

  query(range, found) {
    if (!found) found = [];
    if (!range.intersects(this.boundary)) return found;
    for (let p of this.points) {
      if (range.contains(p)) {
        found.push(p);
      }
    }
    if (this.divided) {
      this.northwest.query(range, found);
      this.northeast.query(range, found);
      this.southwest.query(range, found);
      this.southeast.query(range, found);
    }
    return found;
  }
}


const boot = () => {
  G = new Graphics()
  G.resize();
  const L = new Loop(G)
  L.start();
}


window.onload = boot
