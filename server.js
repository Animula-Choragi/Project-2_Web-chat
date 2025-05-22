const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Sajikan file statis dari folder "public"
app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Menerima pesan dari klien dan menyebarkan ke semua klien lain
  socket.on('chat message', (msg) => {
    console.log('Pesan diterima:' , msg);
    io.emit('chat message', msg); // Mengirim pesan ke semua pengguna
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});