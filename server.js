const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session');

const app = express(); // instance dari fungsi factory modul express (createApplication())
const server = http.createServer(app); // instance dari class modul http (http.Server)
const io = new Server(server); // instance dari class modul socket.io (Server)


app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
}));

let usersOnline = {} // Simpan daftar pengguna online sebagai objek
let groups = {};

// Endpoint login
app.post('/login', ( req, res ) => {
  const { username } = req.body;
  if (!username) return res.status(400).send("Username diperlukan");

  req.session.username = username;
  res.redirect('/');
});

// Endpoint logout
app.get('/logout', ( req, res ) => {
  delete usersOnline[req.session.username];
  io.emit('user list', Object.keys(usersOnline));
  req.session.destroy();
  res.redirect('/');
});


// Hanya aktif kalau ada request dari sisi client setelah memuat file index.html (index.html harus ada dlu)
io.on('connection', (socket) => {
  let username = socket.handshake.auth.username;

  if (username) {
    usersOnline[username] = socket.id;
    io.emit('user list', Object.keys(usersOnline));

    socket.on('join group', ({ group, isJoin }) => {
      socket.join(group);
      if (!groups[group]) groups[group] = [];

      if (!groups[group].includes(username)) {
        groups[group].push(username);
        io.to(group).emit('server msg', { 
          username: username, 
          group: group,
          isJoin: isJoin,
        });

      };
      

      io.to(group).emit('group users', groups[group]);
    });

    socket.on('leave group', (group) => {
      socket.leave(group);
      
      if (groups[group]) {
        groups[group] = groups[group].filter(user => user !== username);
        io.to(group).emit('group users', groups[group]);
        
        // Kirim notifikasi bahwa user telah keluar grup
        io.to(group).emit('server msg', { 
          username: username
        });
      }
    });

  };
  console.log('🟢 User connected:', socket.id);

  // Terima 'pesan' dri client
  socket.on('client msg', (data) => {
    console.log(`${username}: ${data.message}`);
    
    // kirim 'pesan' ke semua client yg terhubung as object
    io.to(data.group).emit('server msg', { username: username, message: data.message, sentAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) });
  });

  socket.on('disconnect', () => {
    
    if (username) {
      delete usersOnline[username];
      io.emit('user list', Object.keys(usersOnline));

      for (let group in groups) {
        groups[group] = groups[group].filter(user => user !== username);
        io.to(group).emit('group users', groups[group]);
      };
    };

    console.log('🔴 User disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});