const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const session = require('express-session');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extend: true}));

// Konfigurasi session
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
}));

let usersOnline = {}; // Menyimpan daftar pengguna online

// Endpoint login sederhana
app.post('/login', (req, res) => {
  console.log("berhasil login");
  const { username } = req.body;
  if (!username) return res.status(400).send("Username diperlukan");

  req.session.username = username;
  res.redirect('/');
});

// Endpoint logout
app.get('/logout', (req, res) => {
  console.log("berhasil logout");
  delete usersOnline[req.session.username];
  io.emit("user list", Object.keys(usersOnline));
  req.session.destroy();
  res.redirect('/');
});

// Mengelola koneksi WebSocket
io.on('connection', (socket) => {
  let username = socket.handshake.auth.username;
  
  if (username) {
    usersOnline[username] = socket.id;
    io.emit("user list", Object.keys(usersOnline));
  }

  socket.on('disconnect', () => {
    if (username) {
      delete usersOnline[username];
      io.emit("user list", Object.keys(usersOnline));
    }
  });
});

server.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});