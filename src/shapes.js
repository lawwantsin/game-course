class Box {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h
    this.fill = false;
  }
  update(fill) {
    if (typeof fill === 'boolean') this.fill = fill;
    return this;
  }
  render(G, color) {
    const { x, y, w, h } = this;
    G.rect(color, x, y, w, h, this.fill);
    return this;
  }
}

class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r
    this.fill = false;
  }
  update(fill) {
    if (typeof fill === 'boolean') this.fill = fill;
    return this;
  }
  render(G, color) {
    const { x, y, r } = this;
    G.circle(color, x, y, r, this.fill);
    return this;
  }
}
export { Circle, Box }
