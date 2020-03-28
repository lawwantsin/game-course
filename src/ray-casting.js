const distance = (x1, y1, x2, y2) => {
  return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
}

class Ray {
  constructor(center, rayAngle, map) {
    this.map = map;
    this.rayAngle = this.normalizeAngle(rayAngle);
    this.rayLength = 140;
    this.rayColor = 'rgba(255,255,0,0.3)'
    this.center = center;
    this.wallHits = {};
    this.wallHit = {};
    this.hitVert;
    this.distance = 0;
    this.pointingDown = this.rayAngle > 0 && this.rayAngle < Math.PI; // > 0 && < 180
    this.pointingUp = !this.pointingDown;
    this.pointingRight = this.rayAngle < Math.PI * 5 || this.rayAngle > Math.PI * 1.5; // < 90 || > 270
    this.pointingLeft = !this.pointingRight;
  }
  normalizeAngle(angle) {
    angle = angle % (2 * Math.PI);
    if (angle < 0) {
        angle = (2 * Math.PI) + angle;
    }
    return angle;
  }
  calcHit(a) {
    const t = this.map.TILE_SIZE
    let xIntercept, yIntercept;
    let xStep, yStep;
    if (a === 'h') {
      yIntercept = Math.floor(this.center.y / t * t);
      yIntercept += this.pointingDown ? t : 0;
      xIntercept = this.center.x + (yIntercept - this.center.y) / Math.tan(this.rayAngle);

      yStep = t;
      yStep *= this.pointingUp ? -1 : 1;

      xStep = t / Math.tan(this.rayAngle);
      xStep *= this.pointingLeft && xStep > 0 ? -1 : 1;
      xStep *= this.pointingRight && xStep < 0 ? -1 : 1;
    }
    else {
      xIntercept = Math.floor(this.center.x / t * t);
      xIntercept += this.pointingRight ? t : 0;
      yIntercept = this.center.y + (xIntercept - this.center.x) / Math.tan(this.rayAngle);

      xStep = t;
      xStep *= this.pointingLeft ? -1 : 1;

      yStep = t * Math.tan(this.rayAngle);
      yStep *= this.pointingUp && yStep > 0 ? -1 : 1;
      yStep *= this.pointingDown && yStep < 0 ? -1 : 1;
    }
    let nextX = xIntercept;
    let nextY = yIntercept;
    if (this.pointingUp) nextY--;
    if (this.pointingLeft) nextX--;
    while (nextX >= 0 && nextX < this.map.width &&
           nextY >= 0 && nextY < this.map.height) {
      if (this.map.hasWallAt(nextX, nextY)) {
        return new Vector(nextX, nextY)
      }
      else {
        nextX += xStep;
        nextY += yStep;
      }
    }
  }
  cast(columnId) {
    this.wallHits.v = this.calcHit('v')
    this.wallHits.h = this.calcHit('h')
    const hHitDist = this.wallHits.h ? distance(this.center.x, this.center.y, this.wallHits.h.x, this.wallHits.h.y) : Number.MAX_VALUE;
    const vHitDist = this.wallHits.v ? distance(this.center.x, this.center.y, this.wallHits.v.x, this.wallHits.h.y) : Number.MAX_VALUE;
    if (this.wallHits.h && this.wallHits.v) {
      this.wallHit.x = (hHitDist < vHitDist) ? this.wallHits.h.x : this.wallHits.h.y;
      this.wallHit.y = (hHitDist < vHitDist) ? this.wallHits.h.y : this.wallHits.h.x;
      this.distance = (hHitDist < vHitDist) ? hHitDist : vHitDist;
      this.hitVert = (vHitDist < hHitDist);
    }
  }
  render(G) {
    if (this.wallHit.x && this.wallHit.y) {
      const c = this.center;
      G.line(this.rayColor,
        c.x,
        c.y,
        this.wallHit.x,
        this.wallHit.y
      )
    }
  }
}

export default Ray;
