const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const game = require('./src/game');

const PORT = 3000;

app.use(express.static('public'));

io.on('connection', socket => {
  console.log(`> User connected: ${socket.id}`);

  socket.emit('setup', game.getState());

  socket.on('movePlayer', cmd => {
    game.movePlayer(cmd, socket);
    // console.log(game.getState());
  });
});

http.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});