const { join } = require('path')
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use(express.static(join(__dirname, '..', 'public')))

http.listen(3000)

const sockets = []
io.on('connection', socket => {
  socket.on('start', clientID => {
    socket.clientID = clientID
    sockets.push(socket)
  })
  
  socket.on('position', position => {
    socket.position = position
  })

  socket.on('disconnect', () => {
    const index = sockets.findIndex(s => s === socket)
    sockets.splice(index, 1)
  })
})

setInterval(() => io.emit('positions', sockets.map(s => ({ ...s.position, id: s.clientID }))), 10)
