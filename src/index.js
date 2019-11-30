import "./index.css"

const boot = () => {
  const canvas = document.querySelector("canvas");
  const context = canvas.getContext("2d");

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();
  context.fillStyle = 'green';
  context.fillRect(0, 0, canvas.width, canvas.height);
}

window.onload = boot
