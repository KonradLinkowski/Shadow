let positions = []
let id = null

export function connect(position) {
  const socket = io.connect()
  id = Date.now()
  socket.emit('start', id)

  socket.on('positions', p => positions = p)

  setInterval(() => {
    socket.emit('position', position)
  }, 10)
}

export function getPositions() {
  return positions.filter(p => p.id !== id)
}
