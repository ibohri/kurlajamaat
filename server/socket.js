let io;

module.exports.configure = (server) => {
  const { Server } = require("socket.io");
  io = new Server(server);
  io.on("connection", (socket) => {
    console.log("a user connected");
  });
};

module.exports.emitMessage = (message, data) => {
  io.emit(message, data);
};
