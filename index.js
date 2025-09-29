const express = require('express');
const http = require('http');
const socketIo = require('socket.io');


const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
      origin: "*", // Remplace par ton origine autorisée
      methods: ["GET", "POST"],
      credentials: true, // Parfois utile pour les cookies ou authentification
    }
  });

let players = {};

io.on("connection", (socket) => {
  players[socket.id] = { ready: false };

  socket.on("ready", () => {
    console.log("ready")
    if (players[socket.id]) {
      players[socket.id].ready = true;
      checkStartCondition();
      console.log(players[socket.id])
    }
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
  });
});

function checkStartCondition() {
  const connectedCount = Object.keys(players).length;
  console.log(connectedCount)
  
  if (connectedCount === 3) {
    const allReady = Object.values(players).every(p => p.ready);
    if (allReady) {
      console.log('all ready !')
      io.emit("start", { time: Date.now() });
    }
  }
}


server.listen(3000, () => {
  console.log("En écoute sur http://localhost:3000");
});
