export const position = {
  x: 0,
  y: 0
}

export function mousemove(event) {
  const pos = getMousePos(event.target, event.clientX, event.clientY)
  position.x = pos.x;
  position.y = pos.y;
};

export function touchstart(event) {
  const pos = getMousePos(event.target, event.touches[0].clientX, event.touches[0].clientY)
  position.x = pos.x;
  position.y = pos.y;
};

export function touchmove(event) {
  const pos = getMousePos(event.target, event.touches[0].clientX, event.touches[0].clientY)
  position.x = pos.x;
  position.y = pos.y;
};

export function getMousePos(element, x, y) {
  const rect = element.getBoundingClientRect();
  return {
    x: x - rect.left,
    y: y - rect.top
  };
}
