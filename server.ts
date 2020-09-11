import express from 'express';
import { v4 } from 'uuid';
const app = express();
import { createServer } from 'http';
const server = createServer(app);
import socket from 'socket.io';
const io = socket(server);

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect(`/${v4()}`);
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(3333);
