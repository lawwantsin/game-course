let error;
class Graphics {
  constructor() {
    this.canvas = document.querySelector("canvas");
    this.context = this.canvas.getContext("2d");
    window.addEventListener('resize', () => this.resize());
    this.resize();
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
  text(text, x, y, color = 'white') {
    this.context.fillStyle = color;
    this.context.font = "14px Arial";
    this.context.fillText(text, x, y);
  }
  rect(color, x, y, w, h, fill) {
    const c = this.context;
    this.validate(color, x, y, w, h);
    c.lineWidth = 5
    c.fillStyle = c.strokeStyle = color;
    if (fill) c.fillRect(x, y, w, h);
    else c.strokeRect(x, y, w, h);
  }
  line(color, x1, y1, x2, y2, lineWidth) {
    const c = this.context;
    this.validate(color, x1, y2, x2, y2);
    c.strokeStyle = color;
    c.beginPath();
    c.lineWidth = lineWidth || 1;
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.stroke();
  }
  circle(color, x, y, radius, fill) {
    const c = this.context;
    this.validate(color, x, y, radius);
    c.lineWidth = 5
    c.fillStyle = c.strokeStyle = color;
    c.beginPath();
    c.arc(x, y, radius, 0, 2 * Math.PI);
    if (fill) c.fill()
    else c.stroke();
  }
}

export default Graphics;
