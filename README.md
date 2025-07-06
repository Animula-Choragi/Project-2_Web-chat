# 💬 Web chat Sederhana - Node.js, Express.js, dan Socket.io
Proyek aplikasi web chat sederhana ini dibangun dengan [Node.js](https://nodejs.org/) (Runtime JavaScript Server-side) , [Express.js](https://expressjs.com/) (Framework Web Server), dan [Socket.io](https://socket.io/) (Komunikasi real-time WebSocket).

## 🛠️ How To Setup Project (WIP)

### **A. Persiapan awal**

1. **Clone repository berikut dengan mengetik di terminal/cmd :**
   ```bash
   git clone https://github.com/Itsnope/web-chat.git
   cd web-chat
   ```

### **B. Setup Library**
1. Pastikan menginstall Node.js dan npm terlebih dahulu

2. Buka terminal/cmd di direktori proyek dan install dependency proyek  :
   ```bash
   npm install
   ```

<hr />

## 📝 Notes :

### Sesi 1 : Pengenalan dan Setup Lingkungan Pengembangan
- [x] Instalasi Node.js dan npm
- [x] Instalasi modul Express.js dan Socket.io
- [x] Membuat server aplikasi express (web chat).

<br />

- Materi sesi 1 : HTTP & WebSocket 
   - HTTP pakai protokol komunikasi request->response dan stateless (server tidak mengingat sesi sebelumnya).
   - WebSocket pakai protokol komunikasi full-duplex yang memungkinkan komunikasi dua arah secara real-time antara klien dan server.
- Pada aplikasi web chat 2 komunikasi ini digunakan :
   - HTTP untuk menangani permintaan HTTP biasa (misal : GET /).
   - WebSocket menangani permintaan real-time (upgrade ke websocket).

### Sesi 2 : Implementasi WebSocket untuk Pesan Teks

- [x] Buat halaman HTML sederhana untuk chat.
- [x] Kirim & terima pesan (username & isi pesan) secara real-time.

<br />

- Materi sesi 2 : Metode komunikasi real-time (client-server dengan Socket.IO)
   - socket = digunakan di **CLIENT & SERVER**
   - io = Hanya digunakan di **SERVER**

   - on = Menerima
      - socket.on = terima event dri **CLIENT/SERVER**.
      - io.on = terima **KONEKSI** client (dipakai di server saja).

   - emit = Mengirim
      - socket.emit = kirim event ke **CLIENT/SERVER**.
      - io.emit = kirim event ke **SEMUA** client yang terhubung (dipakai di server saja).

### Sesi 3 : Membuat Sistem Pengguna (Login & Status Online)

- [x] Login & Logout (username only).
- [x] Simpan dan hapus username (pakai localStorage).
- [x] Bubble chat pribadi (kanan) & lain (kiri)

<br />

- Materi sesi 3 : Komponen komunikasi real-time (client-server)  
   - event ditulis dalam bentuk string (event-driven programming).
   - on = Menerima event
      - socket.on('event', callback);
      - io.on('connection', callback);

   - emit = Mengirim event
      - socket.emit('event', data);
      - io.emit('event', data);
   
   -  Contoh alur komunikasi :
      - CLIENT : socket.emit('pesan', data)   --->     SERVER : socket.on('pesan', callback)
      - CLIENT : socket.on('balasan', callback)     <---     SERVER : socket.emit('balasan', data)

### Sesi 4 : Membuat Fitur Chat Grup

- [x] Menampilkan pilihan grup.
- [x] Kirim pesan hanya ke user dalam grup yang sama.

<br />

- Materi sesi 4 : Komponen komunikasi real-time (client-server)  
   - io.to() = mengirim pesan ke client tertentu/semua client yg ada di dalam sebuah "room" yg sama.

### Sesi 5 : Menambahkan Fitur Berbagi File dan Notifikasi

- [x] Fitur berbagi file.
- [x] Notifikasi saat berhasil berbagi file.