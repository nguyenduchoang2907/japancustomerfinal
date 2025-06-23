// src/api/socketInit.ts
import { io, Socket } from "socket.io-client";

const socket: Socket = io("https://api.vnpt-hn.io.vn", {
  withCredentials: true,
  autoConnect: true,
});

export default socket;
