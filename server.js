const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express(); // instance dari fungsi factory modul express (createApplication())
const server = http.createServer(app); // instance dari class modul http (http.Server)
const io = new Server(server); // instance dari class modul socket.io (Server)

// Sajikan file statis dari folder 'public'
app.use(express.static('public'));

// Hanya aktif kalau ada request dari sisi client setelah memuat file index.html (index.html harus ada dlu)
io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  // Terima 'pesan' dri client
  socket.on('client msg', (data) => {
    console.log(`${data.username}: ${data.message}`);
    
    // kirim 'pesan' ke semua client yg terhubung as object
    io.emit('server msg', { username: data.username, message: data.message });
  });

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});