import { io, type Socket } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL?.trim() ||
  import.meta.env.VITE_API_URL?.trim() ||
  "http://localhost:3000";

let socket: Socket | null = null;
let boundToken: string | null = null;

export function getChatSocket(token: string): Socket {
  if (!token) throw new Error("Token ausente para o chat");

  if (socket && boundToken !== token) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    boundToken = null;
  }

  if (socket?.connected && boundToken === token) return socket;

  boundToken = token;
  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket"],
  });

  return socket;
}

export function disconnectChatSocket(): void {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    boundToken = null;
  }
}

/** @deprecated use getChatSocket */
export const connectChatSocket = getChatSocket;
