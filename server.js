const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.send('<h1>Server Web Chat Berjalan!</h1>');
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Kirim pesan ke pengguna baru
  socket.emit('welcome message', 'Selamat datang di Web Chat!');

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});