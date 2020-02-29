import Vector from "./vector";

class Player {
  constructor(G) {
    this.graphics = G;
    this.jumping = false;
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
    this.rotationSpeed = .2 * (Math.PI / 180);
    this.color = 'green'
  }

  input() {
    if (KEYS_PRESSED["ArrowUp"] && !this.jumping) {
      this.vy += -50;
      this.jumping = true;
    }
    if (KEYS_PRESSED["ArrowLeft"]) {
      if (this.vx < 0) this.vx = -.5;
      this.vx -= 10;
    }
    if (KEYS_PRESSED["ArrowRight"]) {
      if (this.vx > 0) this.vx = .5;
      this.vx += 10;
    }
    if (KEYS_PRESSED["ArrowDown"]) {
      this.vy += 2;
    }
  }

  update() {
    this.vy += 1;  // Gravity
    this.h = this.w = 40;

    // Collision
    const G = this.graphics;
    const floor = G.canvas.height - 10 - this.h

    if (this.y > floor) {  // On floor.
      this.vy = 0;
      this.vx *= .8       // Floor friction
      this.jumping = false;
      this.y = floor
    }
    else {
      this.vy *= .9   // Air friction
      this.vx *= .9
    }
    this.x += this.vx;  // Move box
    this.y += this.vy;
  }

  render() {
    const { x, y, h, w } = this;
    G.rect('red', x, y, w, h)
  }
}

export default Player;
