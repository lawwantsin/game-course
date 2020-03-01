import Vector from "./vector";
const NORMAL = 0, DEBUG = 1;

class Player {
  constructor(G, M) {
    this.map = M;
    this.graphics = G;
    this.vx = 0;
    this.vy = 0;
    this.h = 60;
    this.w = 60;
    this.x = Math.floor(G.canvas.width / 2.0);
    this.y = Math.floor(G.canvas.height / 2.0);

    this.pos = new Vector(this.x, this.y);
    this.vel = new Vector(this.vx, this.vy);

    this.radius = 30;
    this.turnDirection = 0;
    this.walkDirection = 0;
    this.rotationAngle = Math.PI / 2;
    this.moveSpeed = .3;
    this.rotationSpeed = .3;
    this.color = 'green'
  }

  input() {
    if (KEYS_PRESSED["ArrowUp"]) {
      this.walkDirection += .2;
    }
    else if (KEYS_PRESSED["ArrowDown"]) {
      this.walkDirection -= .2;
    }
    else {
      this.walkDirection *= 0.99;
    }
    if (KEYS_PRESSED["ArrowLeft"]) {
      this.turnDirection += -.01;
    }
    else if (KEYS_PRESSED["ArrowRight"]) {
      this.turnDirection += .01;
    }
    else {
      this.turnDirection *= .93;
    }
  }

  update() {
    this.rotationAngle += this.turnDirection * this.rotationSpeed;
    const moveStep = this.walkDirection * this.moveSpeed;
    this.vx = Math.cos(this.rotationAngle) * moveStep;
    this.vy = Math.sin(this.rotationAngle) * moveStep;
    if (Math.abs(this.vx) < .1) this.vx = 0;
    if (Math.abs(this.vy) < .1) this.vy = 0;
    const hitWall = this.map.hitOuterWall(this.x + this.vx, this.y + this.vy, this.radius);
    this.color = 'green';
    if (hitWall.top || hitWall.left || hitWall.right || hitWall.bottom) {
      this.color = 'red';
      if (hitWall.top || hitWall.bottom) this.vy *= -1;
      if (hitWall.left || hitWall.right) this.vx *= -1;
      this.rotationAngle = -Math.atan2(-this.vy, this.vx);
      this.vx = Math.cos(this.rotationAngle) * moveStep;
      this.vy = Math.sin(this.rotationAngle) * moveStep;
    }
    this.x += this.vx;
    this.y += this.vy;
  }

  render() {
    const g = this.graphics;
    g.circle(this.color, this.x, this.y, this.radius);
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
