import { useState } from "react";
import { CarFront, Send, X, Smile } from "lucide-react";
import chatMock from "../../mocks/chat.mock.json"

type ChatMessage = {
  id: number;
  sender: "admin" | "client";
  text: string;
  time: string;
};

type ClientChatModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function ClientChatModal({
  open,
  onClose,
}: ClientChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(
    chatMock.messages["1"] as ChatMessage[]
  );
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      sender: "client",
      text: trimmedValue,
      time: "Agora",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
  };

  if (!open) return null;

  return (
    <div
      className="
        fixed z- bg-white overflow-hidden rounded-[28px] shadow-[0_18px_40px_rgba(0,0,0,0.18)]
        bottom-20 right-4 w-[calc(100vw-32px)] sm:w-[380px] flex flex-col
        md:bottom-28 md:right-12
      "
    >
      <div className="flex items-center justify-between bg-secondary px-5 py-4 text-white shrink-0">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-white">
            <CarFront size={32} />
          </div>

          <h2 className="text-lg font-semibold truncate">Administrador Bortone</h2>
        </div>

        <button onClick={onClose} aria-label="Fechar chat" className="cursor-pointer shrink-0">
          <X size={22} />
        </button>
      </div>

      <div className="flex h-[50vh] sm:h-[420px] flex-col gap-3 overflow-y-auto bg-slate-100 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "client" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                message.sender === "client"
                  ? "bg-white text-zinc-800 after:content-[''] after:absolute after:bottom-0 after:right-[-6px] after:w-3 after:h-3 after:bg-white after:rotate-45 after:rounded-sm"
                  : "bg-primary text-white after:content-[''] after:absolute after:bottom-0 after:left-[-6px] after:w-3 after:h-3 after:bg-primary after:rotate-45 after:rounded-sm"
              }`}
            >
              <p>{message.text}</p>
              <span className="mt-1 block text-[11px] opacity-70">
                {message.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CORREÇÃO DO BOTÃO CORTADO AQUI (min-w-0 no input, shrink-0 nos botões) */}
      <div className="flex items-center gap-2 p-4 shrink-0">
        <button 
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-secondary cursor-pointer transition hover:brightness-95"
            aria-label="Enviar emoji"
          >
            <Smile size={24} />
          </button>
          
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Digite sua mensagem"
          className="flex-1 min-w-0 rounded-full border border-zinc-300 px-4 py-3 text-sm outline-none"
        />

        <button
          onClick={handleSendMessage}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary cursor-pointer text-white transition hover:brightness-95"
          aria-label="Enviar mensagem"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}