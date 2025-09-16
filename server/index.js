import { Socket } from "socket.io";
import { Server } from "socket.io";

const io = new Server(3000, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("send-message", (msg, room) => {
    if (room === "") {
      socket.broadcast.emit("receive-message", msg);
    } else {
      socket.to(room).emit("receive-message", msg);
    }
  });
  socket.on("join-room", (room, cb) => {
    socket.join(room);
    cb(`user joined to ${room}`);
  });
});
