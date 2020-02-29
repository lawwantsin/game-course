import "./index.css"
import Vector from "./vector"
import Player from "./player"
import Loop from "./loop"
import Map from "./map"
import Graphics from "./graphics"
import { room } from "./map-data"

window.KEYS_PRESSED = {}

let G, M, P, error;

const boot = () => {
  G = new Graphics()
  M = new Map(G, room);
  P = new Player(G);

  G.resize();
  M.resize();
  const L = new Loop(G, P, M)
  L.start();
}

window.onload = boot
