import { World } from "./world.js";
import { touchstart, mousemove, touchmove, position }from './player.js';
import { connect, getPositions } from "./socket.js";

connect(position)

const world = new World({
  selector: 'body',
  width: 640,
  height: 360
})
world.bindEvents({ mousemove, touchmove, touchstart })

drawLoop()

function drawLoop() {
  requestAnimationFrame(drawLoop);
  world.draw([position, ...getPositions()]);
}
