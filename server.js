const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

// Menyajikan file statis dari folder "public".
  // Misal, ada index.html di public, maka index.html akan disajikan sbg tampilan dari  http://localhost:3000/
  // Nama file statis tdk akan masuk ke struktur URL.
app.use(express.static('public'));

// Kode dijalankan setiap kali ada client/pengguna yg terhubung ke server.
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // 1. Terima pesan dari client.
    // Pesan ini dikirim dari klien melalui socket.emit('chat message', { username, message: msg });
  socket.on('chat message', (data) => {
    console.log('Pesan diterima:', `${data.username}: ${data.message}`);
    // 2. Kirim pesan ke SEMUA client lain yg terhubung dengan server.
    io.emit('chat message', `${data.username}: ${data.message}`);
  });

  // Kode dijalankan ketika client/pengguna terputus dari server (misal: user menutup tab, koneksi internet putus, atau refresh halaman).
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});