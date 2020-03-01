import "./index.css"
import Vector from "./vector"
import Player from "./topdown"
import Loop from "./loop"
import Map from "./map"
import Graphics from "./graphics"
import { room, maze } from "./map-data"

window.KEYS_PRESSED = {}

const boot = () => {
  let G, M, P, L;
  G = new Graphics()
  M = new Map(G, maze);
  P = new Player(G, M);
  L = new Loop(G, P, M)
  L.start();
}

window.onload = boot
