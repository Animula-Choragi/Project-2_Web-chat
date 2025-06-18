# 💬 Web chat Sederhana - Node.js, Express.js, dan Socket.io
Proyek aplikasi web chat sederhana ini dibangun dengan Node.js (Runtime JavaScript Server-side) , Express.js (Framework Web Server), dan Socket.io (Komunikasi real-time WebSocket).

## 🛠️ How To Setup Project (WIP)

### **A. Persiapan awal**

1. **Clone repository berikut dengan mengetik di terminal/cmd :**
   ```bash
   git clone https://github.com/Animula-Choragi/Project-2_Web-chat.git
   cd Project-2_Web-chat
   ```

### **Setup Library & Database**
1. Pastikan menginstall Node.js dan npm terlebih dahulu

2. Buka terminal/cmd di direktori proyek dan install dependency proyek  :
   ```bash
   npm install
   ```

<hr />

## 📝 Notes :

### Sesi 1 : Pengenalan dan Setup Lingkungan Pengembangan
- [x] Install Node.js dan npm
- [x] Install Express.js dan Socket.io
- [x] Membuat server web chat sederhana (Express.js) dengan komunikasi WebSocket (Socket.io).

<br />

- Materi sesi 1 : HTTP & WebSocket 
   - HTTP pakai protokol request-response yang bersifat stateless (server tidak mengingat sesi sebelumnya).
   - WebSocket pakai protokol full-duplex yang memungkinkan komunikasi dua arah secara real-time antara klien dan server.

### Sesi 2 : Implementasi WebSocket untuk Pesan Teks

- [x] Buat halaman HTML sederhana untuk chat.
- [x] Kirim & terima pesan + username secara real-time.

<br />

- Materi sesi 2 : Method komunikasi real-time (client-server)
   - on = Menerima event
      - socket.on = terima event dri **CLIENT** tertentu.
      - io.on = terima **KONEKSI** client (dipakai di server saja).

   - emit = Mengirim event
      - socket.emit = kirim event ke **CLIENT** yang sedang terhubung (hanya satu).
      - io.emit = kirim event ke **SEMUA** client yang terhubung.


### Sesi 3 : Membuat Sistem Pengguna (Login & Status Online)

- [x] Login dengan username & Logout.
- [x] Tambah method simpan dan hapus item ("username") dari localStorage.

<br />

- Materi sesi 3 : Komponen komunikasi real-time (client-server)  
   - event dalam Socket.IO selalu ditulis dalam bentuk strin, sehingga harus menggunakan petik
   - on = Menerima event
      - socket.on('event', callback);
      - io.on('connection', callback);

   - emit = Mengirim event
      - socket.emit('event', data);
      - io.emit('event', data);
   
   -  Contoh alur komunikasi :
      - CLIENT : socket.emit('pesan', data)   --->     SERVER : socket.on('pesan', callback)
      - CLIENT : socket.on('balasan', callback)     <---     SERVER : socket.emit('balasan', data)

