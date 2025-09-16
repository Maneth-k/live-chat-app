import { Socket } from "socket.io";
import { Server } from "socket.io";

const io = new Server(3000, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("send-message", (msg) => {
    console.log(msg);
    socket.broadcast.emit("receive-message", msg);
  });
});
