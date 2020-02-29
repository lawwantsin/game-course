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

  inputTD() {
    if (KEYS_PRESSED["ArrowUp"]) {
      this.walkDirection += .3;
    }
    else if (KEYS_PRESSED["ArrowDown"]) {
      this.walkDirection -= .3;
    }
    else {
      this.walkDirection *= 0.99;
    }
    if (KEYS_PRESSED["ArrowLeft"]) {
      this.turnDirection -= 1;
    }
    else if (KEYS_PRESSED["ArrowRight"]) {
      this.turnDirection += 1;
    }
    else {
      this.turnDirection *= .5;
    }
  }

  inputPF() {
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

  updateTD() {
    this.rotationAngle += this.turnDirection * this.rotationSpeed;
    const moveStep = this.walkDirection * this.moveSpeed;
    this.vx = Math.cos(this.rotationAngle) * moveStep;
    this.vy = Math.sin(this.rotationAngle) * moveStep;
    // const hitWall = this.map.hitOuter(this.x + this.vx, this.y + this.vy, this.radius);
    // console.log(hitWall)
    // if (hitWall) {
      // this.color = 'red';

    // }
    // else {
      this.color = 'green';
    // }
    this.x += this.vx;
    this.y += this.vy;
  }

  renderPF() {
    const { x, y, h, w } = this;
    G.rect('red', x, y, w, h)
  }

  updatePF() {
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

  renderTD() {
    this.graphics.circle(this.color, this.x, this.y, this.radius);
    this.graphics.text(parseInt(this.rotationAngle), this.x, this.y);
    this.graphics.line('black', this.x, this.y,
      this.x + Math.cos(this.rotationAngle) * 30,
      this.y + Math.sin(this.rotationAngle) * 30);
  }
}

export default Player;
