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
        fixed bottom-28 right-12 z-[999]
        w-[380px] max-w-[calc(100vw-24px)]
        overflow-hidden rounded-[28px]
        bg-white shadow-[0_18px_40px_rgba(0,0,0,0.18)]
      "
    >
      <div className="flex items-center justify-between bg-secondary px-5 py-4 text-white">
        <div className="flex items-center gap-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-white">
            <CarFront size={52} />
          </div>

          <h2 className="text-lg font-semibold">Administrador Bortone</h2>
        </div>

        <button onClick={onClose} aria-label="Fechar chat" className="cursor-pointer">
          <X size={22} />
        </button>
      </div>

      <div className="flex h-[420px] flex-col gap-3 overflow-y-auto bg-slate-100 p-4">
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

      <div className="flex items-center gap-2 p-4">
        <button 
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-secondary cursor-pointer transition hover:brightness-95"
            aria-label="Enviar mensagem"
          >
            <Smile size={26} />
          </button>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Digite sua mensagem"
          className="flex-1 rounded-full border border-zinc-300 px-4 py-3 text-sm outline-none"
        />

        <button
          onClick={handleSendMessage}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary cursor-pointer text-white transition hover:brightness-95"
          aria-label="Enviar mensagem"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}