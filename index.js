// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let players = {};

io.on("connection", (socket) => {
  console.log("✅ Nouvelle connexion :", socket.id);
  players[socket.id] = { ready: false };

  socket.on("ready", () => {
    players[socket.id].ready = true;
    console.log(`🟩 ${socket.id} prêt`);
    checkStartCondition();
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    console.log("❌ Déconnexion :", socket.id);
  });
});

function checkStartCondition() {
  const connectedCount = Object.keys(players).length;
  if (connectedCount === 3 && Object.values(players).every(p => p.ready)) {
    io.emit("start", { time: Date.now() });
    console.log("🚀 Tous prêts !");
  }
}

server.listen(3000, () => {
  console.log("🟢 Serveur en écoute sur http://localhost:3000");
});
