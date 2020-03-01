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
  rect(color, x, y, w, h) {
    this.validate(color, x, y, w, h);
    this.context.fillStyle = color;
    this.context.fillRect(x, y, w, h);
  }
  line(color, x1, y1, x2, y2, lineWidth) {
    this.validate(color, x1, y2, x2, y2);
    this.context.strokeStyle = color;
    this.context.beginPath();
    this.context.lineWidth = lineWidth || 1;
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
  }
  circle(color, x, y, radius) {
    this.validate(color, x, y, radius);
    this.context.fillStyle = color;
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, 2 * Math.PI);
    this.context.fill();
  }
}

export default Graphics;
