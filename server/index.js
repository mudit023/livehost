const { Server } = require("socket.io");

const io = new Server(8000, { cors: true });
const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log("Socket successfully connected!", socket.id);

  // when join room request is received
  socket.on("room:join", (data) => {
    const { email, room } = data;
    // Mapping email with socketID and vice versa
    emailToSocketIdMap.set(email, socket.id);
    socketIdToEmailMap.set(socket.id, email);

    // sending a message that a user joined
    io.to(room).emit("user:joined", { email, id: socket.id });

    // user joins the room
    socket.join(room);

    // emitting the request back to join the room
    io.to(socket.id).emit("room:join", data);
  });
});
