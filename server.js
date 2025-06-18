const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const session = require('express-session');

// Menyajikan file statis dari folder "public".
  // Misal, ada index.html di public, maka index.html akan disajikan sbg tampilan dari  http://localhost:3000/
  // Nama file statis tdk akan masuk ke struktur URL.
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Konfigurasi session
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
}));

// Menyimpan daftar pengguna online
let usersOnline = {}; 

// Endpoint login sederhana
app.post('/login', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).send("Username diperlukan");
  // console.log("Berhasil post");
  
  req.session.username = username;
  res.redirect('/');
});

// Endpoint logout
app.get('/logout', (req, res) => {

  // Hapus user dari daftar online
  delete usersOnline[req.session.username]; 

  // Broadcast daftar user online terbaru ke semua client
  io.emit("user list", Object.keys(usersOnline)); 

  // Log proses logout berhasil
  // console.log("Sebelum destroy:", req.session);

  // Hancurkan session user
  req.session.destroy(() => {
    // console.log("Session berhasil di-destroy");
  });

  // Redirect ke halaman utama
  res.redirect('/'); 

});


// Setiap kali ada client/pengguna yg terhubung ke server.
io.on('connection', (socket) => {
  console.log('Terhubung dengan socket ID:', socket.id);
  // console.log("Username:", username);
  let username = socket.handshake.auth.username;
  if (username) {
    usersOnline[username] = socket.id;
    io.emit("user list", Object.keys(usersOnline));
  };

  // Tambahan untuk sesi 10 (kelola chatbox)
  socket.on('client send', (msg) => {
    // console.log('Pesan diterima:', msg);
    io.emit('server send', `${username} : ` + msg);
  });

  // Client/pengguna terputus dari server (misal: user menutup tab, koneksi internet putus, atau refresh halaman).
  socket.on('disconnect', () => {
    if (username) {
      delete usersOnline[username];
      io.emit("user list", Object.keys(usersOnline));
    };
  });
});

server.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});