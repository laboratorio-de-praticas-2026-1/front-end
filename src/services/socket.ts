import { io, Socket } from "socket.io-client";

// URL base do seu servidor
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://despachante-bortone-release-production.up.railway.app";

let socket: Socket | null = null;

export const connectChatSocket = (token: string) => {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    auth: {
      token: token, // Aqui vai o JWT válido exigido pelo backend
    },
    transports: ["websocket"], // Força usar websocket ao invés de polling
  });

  socket.on("connect_error", (err) => {
    console.error("Erro de conexão no Chat:", err.message);
  });


  socket.on("chat_error", (errorData) => {
    // Aqui o vai tratar os erros que o dev mencionou:
    // "Fora do horário comercial (8h as 18h)"
    // "Limite de mensagens atingido (Spam)"
    // "Mensagem maior que 200 caracteres"
    console.warn("Erro de validação do chat:", errorData.message);
    alert(errorData.message);
  });

  return socket;
};

export const disconnectChatSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};