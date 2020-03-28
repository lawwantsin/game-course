import Vector from "./vector";

class Box {
  constructor(x, y, w, h) {
    this.position = new Vector(x, y);
    this.w = w;
    this.h = h
    this.fill = false;
  }
  update(fill) {
    if (typeof fill === 'boolean') this.fill = fill;
    return this;
  }
  render(G, color) {
    const { w, h } = this;
    const { x, y } = this.position;
    G.rect(color, x, y, w, h, this.fill);
    return this;
  }
}

class Circle {
  constructor(x, y, r) {
    this.position = new Vector(x, y);
    this.r = r
    this.fill = false;
  }
  update(fill) {
    if (typeof fill === 'boolean') this.fill = fill;
    return this;
  }
  render(G, color) {
    const { r } = this;
    const { x, y } = this.position;
    G.circle(color, x, y, r, this.fill);
    return this;
  }
}
export { Circle, Box }
