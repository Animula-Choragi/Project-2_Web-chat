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