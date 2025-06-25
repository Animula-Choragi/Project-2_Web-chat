const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const session = require('express-session');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
}));

let usersOnline = {}; // daftar pengguna online
let groups = {}; // daftar grup dan anggotanya

// Endpoint login
app.post('/login', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).send("Username diperlukan");
  req.session.username = username;
  res.redirect('/');
});

// Endpoint logout
app.get('/logout', (req, res) => {
  delete usersOnline[req.session.username]; 
  io.emit("user list", Object.keys(usersOnline)); 
  req.session.destroy(() => {});
  res.redirect('/'); 
});

// Kelola koneksi websocket
io.on('connection', (socket) => {
  let username = socket.handshake.auth.username;
  if (!username) return;

  usersOnline[username] = socket.id;
  io.emit("user list", Object.keys(usersOnline));

  socket.on("join group", (group) => {
    socket.join(group);
    if (!groups[group]) groups[group] = [];
    groups[group].push(username);
    io.to(group).emit("group users", groups[group]);
    io.to(group).emit("chat message", `${username} bergabung ke grup ${group}`)
  });

  socket.on('send message', ({ group, message }) => {
    io.to(group).emit('chat message', `${username}:${message}`);
  });

  socket.on('disconnect', () => {
    delete usersOnline[username];
    for (let group in groups) {
      groups[group] = groups[group].filter(user => user !== username);
      io.to(group).emit("group users", groups[group]);
    };
  });
});

server.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});
