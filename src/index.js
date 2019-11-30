import "./index.css"

class Graphics {
  constructor() {
    this.canvas = document.querySelector("canvas");
    this.context = this.canvas.getContext("2d");
    window.addEventListener('resize', this.resize);
  }
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  validate() {
    const args = Array.from(arguments);
    args.map((a, i) => {
      if (typeof a === 'undefined' || a == null) {
        console.error(`Canvas Draw argument missing (${args.join(', ')})`);
      }
    });
  }
  rect(color, x, y, w, h) {
    this.validate(color, x, y, w, h);
    this.context.fillStyle = color;
    this.context.fillRect(x, y, w, h);
  }
}


const boot = () => {
  const G = new Graphics()
  const w = G.canvas.width
  const h = G.canvas.height
  G.resize();
  G.rect('black', 0, 0, w, h)
  G.rect('red', w/2, h/2, 100, 100)
}

window.onload = boot
