import "./index.css"
import Vector from "./vector"
import Player from "./topdown"
import Loop from "./loop"
import Input from "./input"
import Map from "./map"
import Graphics from "./graphics"
import Collisions from "./collisions"
import { Box, Circle } from "./shapes"
import { one, room, maze } from "./map-data"

const boot = () => {
  let G, M, P, L, C, I, E;
  G = new Graphics()
  C = Collisions;
  I = new Input()
  const w = G.canvas.width;
  const h = G.canvas.height;
  const SIZE = 200;
  const x = w/2-SIZE/2;
  const y = h/2-SIZE/2;
  const r = SIZE/2
  E = [new Box(x, y, SIZE, SIZE), new Circle(x + r, y + r, r)]
  L = new Loop(G, E, M, I, C)
  L.start();
}

window.onload = boot
