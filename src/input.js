class Input {
  constructor() {
    this.mouse = {};
    this.timeout;
    this.KEYS_PRESSED = {};
    window.addEventListener('mousemove', e => this.handleMouseMove(e))
    window.addEventListener('keyup', e => this.handleUp(e))
    window.addEventListener('keydown', e => this.handleDown(e))
  }

  handleUp(e) {
    this.KEYS_PRESSED[e.key] = false;
  }

  handleDown(e) {
    console.log("KEY", e.key);
    this.KEYS_PRESSED[e.key] = true;
  }

  handleMouseMove(e) {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      const { buttons } = e;
      const x = e.clientX;
      const y = e.clientY;
      this.mouse = { x, y, buttons };
    }, 5);
  }
}
export default Input
