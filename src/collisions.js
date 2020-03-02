class Collisions {
  static detect(me, them) {
    const meType = me.constructor.name;
    const themType = them.constructor.name;
    if (meType === 'Circle' && themType === 'Circle') {
      const a = me.r + them.r;
      const x = me.x - them.x;
      const y = me.y - them.y;
      return (a > Math.sqrt((x*x) + (y*y)));
    }
    if (meType === 'Box' && themType === 'Box') {
       return (me.x < them.x + them.w &&
       me.x + me.w > them.x &&
       me.y < them.y + them.h &&
       me.y + me.h > them.y)
    }
    if (meType === 'Circle' && themType === 'Box')
      return this.detectCircleBox(me, them);
    if (meType === 'Box' && themType === 'Circle')
      return this.detectCircleBox(them, me);
  }

  static detectCircleBox(circle, box) {
    const distance = {};
    distance.x = Math.abs(circle.x - (box.x + box.w/2));
    distance.y = Math.abs(circle.y - (box.y + box.h/2));
    if (distance.x > (box.w/2 + circle.r)) return false;
    if (distance.y > (box.h/2 + circle.r)) return false;
    if (distance.x <= (box.w/2)) return true;
    if (distance.y <= (box.h/2)) return true;
    const cDistSq = (distance.x - box.w/2)^2 + (distance.y - box.h/2)^2;
    return (cDistSq <= (circle.r^2));
  }
}

export default Collisions;
