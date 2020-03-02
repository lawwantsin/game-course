import Vector from "./vector";
const NORMAL = 0, DEBUG = 1;

class Player {
  constructor(G, M, I) {
    this.map = M;
    this.inputData = I;
    this.graphics = G;
    this.vx = 0;
    this.vy = 0;
    this.h = 60;
    this.w = 60;
    this.x = Math.floor(G.canvas.width / 2.0);
    this.y = Math.floor(G.canvas.height / 2.0);

    this.pos = new Vector(this.x, this.y);
    this.vel = new Vector(this.vx, this.vy);

    this.r = 30;
    this.rotationAngle = Math.PI / 2;
    this.moveSpeed = .3;
    this.rotationSpeed = .3;
    this.color = 'green'
  }

  input() {
    const WALKSPEED = .3;
    const GROUND_FRICTION = .97
    const K = this.inputData.KEYS_PRESSED;
    if (K["ArrowUp"]) {
      this.vy -= WALKSPEED;
    }
    else if (K["ArrowDown"]) {
      this.vy += WALKSPEED;
    }
    else {
      this.vy *= GROUND_FRICTION;
    }
    if (K["ArrowLeft"]) {
      this.vx -= WALKSPEED;
    }
    else if (K["ArrowRight"]) {
      this.vx += WALKSPEED;
    }
    else {
      this.vx *= GROUND_FRICTION;
    }
    return this;
  }

  update() {
    const BOUNCE = .3
    this.color = 'green';

    if (Math.abs(this.vx) < .1) this.vx = 0;
    if (Math.abs(this.vy) < .1) this.vy = 0;

    let hitWall = this.map.hitOuterWall(this.x + this.vx, this.y + this.vy, this.r);
    let hitAnyWalls = (hitWall.top || hitWall.left || hitWall.right || hitWall.bottom);
    // if (!hitAnyWalls) {
    //   hitWall = this.map.hitInnerWalls(this.x + this.vx, this.y + this.vy, this.r);
    //   hitAnyWalls = (hitWall.top || hitWall.left || hitWall.right || hitWall.bottom);
    // }
    // const hitAnyWalls = this.map.detectCollisions(this.x+this.vx, this.vy+this.vy, this.r);
    if (hitWall.top || hitWall.bottom) this.vy *= -1;
    if (hitWall.left || hitWall.right) this.vx *= -1;
    this.rotationAngle = -Math.atan2(-this.vy, this.vx);
    this.x += this.vx;
    this.y += this.vy;
    return this;
  }

  render(g) {
    g.circle(this.color, this.x, this.y, this.r, true);
    g.line('black', this.x, this.y,
      this.x + Math.cos(this.rotationAngle) * 30,
      this.y + Math.sin(this.rotationAngle) * 30, 4);
    const newX = this.x + this.vx * 100;
    const newY = this.y + this.vy * 100;
    const vel = Math.sqrt((Math.abs(this.vx)*2) + (Math.abs(this.vy)*2));
    if (this.mode == DEBUG) {
      g.text(this.rotationAngle.toPrecision(3), this.x, this.y);
      g.text(vel.toPrecision(3), newX, newY, 'black');
      g.line('black', newX, newY, this.x, newY);
      g.line('blue', this.x, newY, this.x, this.y);
      g.line('red', this.x, this.y, newX, newY);
    }
  }
}

export default Player;
