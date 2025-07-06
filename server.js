const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session');
const multer = require('multer');
const path = require('path');

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

// Konfigurasi penyimpanan file upload
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Endpoint unggah file
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send("Tidak ada file yang diunggah.");

  const fileUrl = `/uploads/${req.file.filename}`;

  res.json({ fileUrl });
});

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

  // client kirim file
  socket.on('send file', ({ fileUrl, group }) => {
    console.log(`${username}: Unggah file di ${group} (fileUrl: ${fileUrl})`);
    
    io.to(group).emit('notification', "File baru telah dikirim!");

    // Teruskan ke client di room sama
    io.to(group).emit('file received', { fileUrl: fileUrl, username: username, sentAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) });
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