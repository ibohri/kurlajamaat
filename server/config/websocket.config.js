const WebSocketServer = require("websocket").server;
let ws;
module.exports.configure = (server) => {
  const wss = new WebSocketServer({
    httpServer: server,
  });

  wss.on("connection", (_ws) => {
    ws = _ws;
  });
};

module.exports.sendMessage = (data) => ws && ws.send(data);
