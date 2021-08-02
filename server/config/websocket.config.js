const WebSocketServer = require("websocket").server;
let wss;
module.exports.configure = (server) => {
  wss = new WebSocketServer({
    httpServer: server,
  });

  wss.on("connection", (ws) => {});
};

module.exports.getServer = () => wss;
