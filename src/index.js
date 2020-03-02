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
  M = new Map(G, maze)
  E = [new Player(G, M, I)]
  L = new Loop(G, E, M, I, C)
  L.start();
}

window.onload = boot
