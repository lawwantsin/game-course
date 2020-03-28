import Vector from "./vector";
import { Circle } from "./shapes"
import Ray from "./ray-casting";
const NORMAL = 0, DEBUG = 1;
const FOV_ANGLE = 60 * (Math.PI / 180);

let sprung = false;
const er = (msg) => {
  if (!sprung) {
    sprung = true;
    console.error(msg);
  }
}

class Player {
  constructor(G, M, I) {
    this.map = M;
    this.inputData = I;
    this.graphics = G;
    this.h = 60;
    this.w = 60;
    const x = Math.floor(G.canvas.width / 2.0);
    const y = Math.floor(G.canvas.height / 2.0);
    this.position = new Vector(x, y);
    this.velocity = new Vector(0, 0);
    this.r = 30;
    this.rotationAngle = Math.PI / 2;
    this.moveSpeed = .3;
    this.rotationSpeed = .3;
    this.color = 'green'
    this.horRes = 4;
    this.NUM_RAYS = G.canvas.width / this.horRes;
  }

  castRays() {
    let colId = 0;
    this.rays = [];
    let rayAngle = this.rotationAngle - (FOV_ANGLE / 2);
    for (var i = 0; i < this.NUM_RAYS; i++) {
      let ray = new Ray(this.position, rayAngle, this.map);
      ray.cast(colId);
      this.rays.push(ray);
      rayAngle += FOV_ANGLE / this.NUM_RAYS;
      colId++;
    }
  }

  input() {
    const WALKSPEED = .3;
    const GROUND_FRICTION = .98
    const K = this.inputData.KEYS_PRESSED;
    if (K["ArrowUp"]) {
      this.velocity.y -= WALKSPEED;
    }
    else if (K["ArrowDown"]) {
      this.velocity.y += WALKSPEED;
    }
    else {
      this.velocity.y *= GROUND_FRICTION;
    }
    if (K["ArrowLeft"]) {
      this.velocity.x -= WALKSPEED;
    }
    else if (K["ArrowRight"]) {
      this.velocity.x += WALKSPEED;
    }
    else {
      this.velocity.x *= GROUND_FRICTION;
    }
    return this;
  }

  update() {
    const BOUNCE = .3
    this.color = 'green';
    let newPosition = Vector.add(this.position, this.velocity);
    // No snapping to 90s.
    if (Math.abs(this.velocity.x) > .01 && Math.abs(this.velocity.y) > .01
      || (Math.abs(this.velocity.x) > .2 || Math.abs(this.velocity.y) > .2))
      this.rotationAngle = -Math.atan2(-this.velocity.y, this.velocity.x);
    const hit = this.map.hasWallAt(this, this.velocity);
    if (hit) {
      this.position = hit.pos;
      this.velocity = hit.vel;
    }
    else {
      this.position = newPosition;
    }
    // this.castRays();
    return this;
  }

  drawRays(g) {
    for (let ray of this.rays) {
      ray.render(g);
    }
  }

  render(g) {
    const x = this.position.x
    const y = this.position.y
    const vx = this.velocity.x
    const vy = this.velocity.y
    g.circle(this.color, x, y, this.r, true);
    g.line('black', x, y,
      x + Math.cos(this.rotationAngle) * 30,
      y + Math.sin(this.rotationAngle) * 30, 4);
    const newX = x + vx * 10;
    const newY = y + vy * 10;
    const vel = Math.sqrt((Math.abs(vx)*2) + (Math.abs(vy)*2));
    // this.drawRays(g);
    if (this.mode == DEBUG) {
      g.text(this.rotationAngle.toPrecision(3), x, y);
      g.text(vel.toPrecision(3), newX, newY, 'black');
      g.line('black', newX, newY, x, newY);
      g.line('blue', x, newY, x, y);
      g.line('red', x, y, newX, newY);
    }
  }
}

export default Player;
