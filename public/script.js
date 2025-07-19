// Kunci AES (harus disimpan aman)
const secretKey = "SECRET_KEY_123"; 
const forge = window.forge;

// get id html tag
const loginForm = document.getElementById("loginForm");
const username = document.getElementById("username");
const usersOnline = document.getElementById("usersOnline");

const join = document.getElementById("join");
const leave = document.getElementById("leave");

const groupSelect = document.getElementById("groupSelect");
const groupUsers = document.getElementById("groupUsers");

const main = document.getElementById("main");
const logout = document.getElementById("logout");

const chatBox = document.getElementById("chatBox");
const message = document.getElementById("message");
const uploadForm = document.getElementById("uploadForm");
const fileInput = document.getElementById("fileInput");
const form = document.getElementById("form");
const messages = document.getElementById("messages");


fetch('/public-key')
  .then(response => response.json())
  .then(data => {
    let publicKeyPem = data.publicKey;
    let publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    let encryptedAESKey = forge.util.encode64(publicKey.encrypt(secretKey, "RSA-OAEP"));
    // Kirim AES key terenkripsi ke server
    socket.emit("send-aes-key", encryptedAESKey);
  });


// ============================= HANDLE LOGIN ==========================
// Simpan username ke localstorage
loginForm.addEventListener('submit', () => {
    const uname = username.value;
    localStorage.setItem("username", uname);
});

// Kirim auth ke server saat koneksi terjadi
const socket = io({
    auth: { username: localStorage.getItem("username") }
});

// Kondisi login & logout
if (!localStorage.getItem("username")) {
  logout.style.display = "none";
  main.style.display = "none";
} 
else { loginForm.style.display = "none"; };

// ============================= HANDLE GROUP CHAT ================================
// Modifikasi fungsi joinGroup
const joinGroup = () => {
  const group = groupSelect.value;
  socket.emit('join group', { group: group, isJoin: "no" });
  // console.log(group)
  
  // Tunggu sebentar agar emit sempat terkirim (sekitar 100ms)
  setTimeout(() => {
    localStorage.setItem("group", group);
  }, 100);
  
  // Sembunyikan tombol gabung, tampilkan tombol keluar
  join.style.display = "none";
  leave.style.display = "block";
  chatBox.style.display = "flex";
};

// Tambahkan fungsi baru
const leaveGroup = () => {
  const group = localStorage.getItem("group");
  if (group) {
    socket.emit('leave group', group); // Kirim ke server

    // Tunggu sebentar agar emit sempat terkirim (sekitar 100ms)
    setTimeout(() => {
      localStorage.removeItem("group");
      location.reload(); // Reload untuk hapus chat dari DOM
    }, 100);
  };
  
  // Sembunyikan tombol keluar, tampilkan tombol gabung
  leave.style.display = "none";
  join.style.display = "block";
  
  // Kosongkan daftar anggota grup
  groupUsers.innerHTML = "";
};

// Aksi refresh halaman
window.addEventListener('DOMContentLoaded', function (e) {
  const savedGroup = localStorage.getItem("group");
  if (savedGroup) {
    socket.emit('join group', { group: savedGroup, isJoin: "yes" });

    join.style.display = "none";
    leave.style.display = "block";
    chatBox.style.display = "flex";
  }

// document.body.addEventListener("mousemove", () => {
  // socket.emit('leave group', group);
  // localStorage.removeItem("group");

  // Sembunyikan tombol keluar, tampilkan tombol gabung
  // leave.style.display = "none";
  // join.style.display = "block";
  
  // // Kosongkan daftar anggota grup
  // groupUsers.innerHTML = "";
// });


});

socket.on('group users', (users) => {
  groupUsers.innerHTML = users.map(u => `<li>${u}</li>`).join("");
});

socket.on('user list', (users) => {
  usersOnline.innerHTML = users.map(u => `<li>${u}</li>`).join("");
});


// ============================= HANDLE CHAT MESSAGE =====================================
// Fungsi toast
const showToast = (msg) => {
    const toast = document.createElement("div");
    toast.style.position = "fixed";
    toast.style.top = "5px";
    toast.style.right = "5px";
    toast.style.background = "#323232";
    toast.style.color = "#fff";
    toast.style.padding = "8px 14px";
    toast.style.borderRadius = "8px";
    toast.style.zIndex = "9999";
    toast.textContent = msg;
    document.body.appendChild(toast);

    setTimeout(() => { toast.remove(); }, 3000);
};

// Fungsi untuk mengenkripsi pesan sebelum dikirim
const encryptMessage = (message) => {
    return CryptoJS.AES.encrypt(message, secretKey).toString();
};

// Fungsi untuk mendekripsi pesan yang diterima
const decryptMessage = (encryptMessage) => {
    let bytes = CryptoJS.AES.decrypt(encryptMessage, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

// Kirim 'pesan' ke server
form.addEventListener('submit', (event) => {
  event.preventDefault(); 
  const msg = message.value;

  const encryptedMessage = encryptMessage(msg);

  const group = localStorage.getItem("group");
  
  socket.emit('client msg', { group: group, message: encryptedMessage }); // Kirim sebagai objek

  message.value = "";
});

// Terima 'pesan' dari server
socket.on('server msg', (msg) => {
  const item = document.createElement("p");

  if (msg.message) {

    let decryptedMessage = decryptMessage(msg.message);

    // elemen uname
    const uname = document.createElement("span");
    uname.className = "uname";
    uname.textContent = `${msg.username}`;

    // Elemen isi pesan
    const messageText = document.createElement("span");
    messageText.className = "messageText";
    messageText.textContent = decryptedMessage;

    // elemen time
    const time = document.createElement("span");
    time.className = "time";
    time.textContent = `${msg.sentAt}`;

    item.appendChild(uname);
    item.appendChild(messageText);
    item.appendChild(time);

    // item.textContent = `${msg.username}: ${msg.message}`;

    if (msg.username === localStorage.getItem("username")) {
      item.classList.add("me");
    } else {
      item.classList.add("other");
    };

  } else {
    // Notif bergabung grup
    if (msg.group) {
      if (msg.isJoin === "no") {
        if (msg.username === localStorage.getItem("username")) {
          item.textContent = `Anda bergabung ke grup ${msg.group}`;
        } else {
          item.textContent = `${msg.username} bergabung ke grup ${msg.group}`;
        };
      } 
    } 
    else {
      item.textContent = `${msg.username} meninggalkan group`;
    }
  
  };

  if (item.textContent) {
    messages.appendChild(item); // Tambah item sebagai tag baru ke dalam tag messages
    messages.scrollTop = messages.scrollHeight;
  }

});

// Kirim file
uploadForm.addEventListener('submit', (event) => {
  event.preventDefault();

  let file = fileInput.files[0];
  if (!file) return;

  let formData = new FormData();
  formData.append('file', file);

  const group = localStorage.getItem("group");

  if (!group) return;

  fetch('/upload', { method: "POST", body: formData })
    .then(response => response.json())
    .then(data => {
      socket.emit('send file', { fileUrl: data.fileUrl, group: group });
    });
});

// Terima file
socket.on('file received', ({ fileUrl, username, sentAt }) => {

  // elemen uname
  const uname = document.createElement("span");
  uname.className = "uname";
  uname.textContent = username;

  // elemen isi
  const fileName = fileUrl.split('/uploads/')[1];

  const fileLink = document.createElement("a");
  fileLink.href = fileUrl;
  fileLink.target = "_blank";
  fileLink.className = "fileLink";
  // fileLink.innerText = "📂 File yang diunggah";
  fileLink.innerText = fileName;

  // elemen time
  const time = document.createElement("span");
  time.className = "time";
  time.textContent = sentAt;

  const fileText = document.createElement("p");

  fileText.appendChild(uname);
  fileText.appendChild(fileLink);
  fileText.appendChild(time);

  if (username === localStorage.getItem("username")) {
    fileText.classList.add("me");
  } else {
    fileText.classList.add("other");
  };

  messages.appendChild(fileText);
  messages.appendChild(document.createElement("br"));
})

// Notifikasi terima file 
socket.on('notification', (message) => {
  showToast(message);
});