import { io } from "socket.io-client";
const HOST = window.location.origin.replace(/^http/, "ws");
const socket = io(HOST, {
  transports: ["websocket", "polling"],
});

socket.connect();

export default socket;
