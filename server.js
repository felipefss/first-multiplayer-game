const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = 3000;

app.use(express.static('public'));

io.on('connection', socket => {
  console.log(`> User connected`);
});

http.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});