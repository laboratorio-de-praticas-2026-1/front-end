import { useEffect, useRef, useState } from "react";
import { CarFront, Send, X, Smile } from "lucide-react";
import { toast } from "sonner";
import { getChatSocket } from "@/services/socket";
import { getStoredUser, getToken } from "@/lib/authStorage";

type ChatMessage = {
  id: string;
  sender: "admin" | "client";
  text: string;
  time: string;
};

type ClientChatModalProps = {
  open: boolean;
  onClose: () => void;
};

function formatChatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

type HistoryRow = { nome: string; text: string; timestamp: string };

export default function ClientChatModal({
  open,
  onClose,
}: ClientChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [blocked, setBlocked] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const token = getToken();
    const user = getStoredUser();
    if (!token || user?.nivel !== "cliente") {
      setBlocked(true);
      return;
    }
    setBlocked(false);

    const s = getChatSocket(token);

    const onChat = (data: unknown) => {
      if (!data || typeof data !== "object") return;
      const d = data as Record<string, unknown>;

      if (d.type === "history" && Array.isArray(d.messages)) {
        const rows = d.messages as HistoryRow[];
        setMessages(
          rows.map((m, i) => ({
            id: `h-${i}-${m.timestamp}`,
            sender: m.nome === "Atendente" ? "admin" : "client",
            text: m.text,
            time: formatChatTime(m.timestamp),
          })),
        );
        return;
      }

      if (d.type === "message" && typeof d.text === "string") {
        const textIn = d.text;
        const tsIn = d.timestamp;
        setMessages((prev) => [
          ...prev,
          {
            id: `in-${Date.now()}`,
            sender: "admin",
            text: textIn,
            time: typeof tsIn === "string" ? formatChatTime(tsIn) : "",
          },
        ]);
        return;
      }

      if (d.type === "error" && typeof d.msg === "string") {
        toast.error(d.msg);
        return;
      }

      if (d.type === "status" && typeof d.msg === "string") {
        toast.message(d.msg);
      }
    };

    const onConnectErr = (err: Error) => {
      toast.error(err.message || "Falha ao conectar no chat");
    };

    s.on("chat", onChat);
    s.on("connect_error", onConnectErr);

    queueMicrotask(() => {
      s.emit("chat", { type: "resync" });
    });

    return () => {
      s.off("chat", onChat);
      s.off("connect_error", onConnectErr);
    };
  }, [open]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleSendMessage = () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue || blocked) return;

    const token = getToken();
    if (!token) return;

    const s = getChatSocket(token);
    if (!s.connected) {
      toast.error("Chat desconectado. Aguarde ou abra de novo.");
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `out-${Date.now()}`,
        sender: "client",
        text: trimmedValue,
        time: "Agora",
      },
    ]);
    s.emit("chat", { type: "message", text: trimmedValue });
    setInputValue("");
  };

  if (!open) return null;

  if (blocked) {
    return (
      <div
        className="
        fixed z-50 bg-white overflow-hidden rounded-[28px] shadow-[0_18px_40px_rgba(0,0,0,0.18)]
        bottom-20 right-4 w-[calc(100vw-32px)] sm:w-[380px] flex flex-col p-6
        md:bottom-28 md:right-12
      "
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-800">Chat</h2>
          <button type="button" onClick={onClose} aria-label="Fechar chat">
            <X size={22} />
          </button>
        </div>
        <p className="text-sm text-zinc-600">
          Faça login com uma conta de cliente para usar o chat ao vivo.
        </p>
      </div>
    );
  }

  const bubbleBase =
    "max-w-[75%] min-w-0 rounded-2xl px-4 py-3 text-sm shadow-sm break-words [overflow-wrap:anywhere]";

  return (
    <div
      className="
        fixed z-50 bg-white overflow-hidden rounded-[28px] shadow-[0_18px_40px_rgba(0,0,0,0.18)]
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

        <button type="button" onClick={onClose} aria-label="Fechar chat" className="cursor-pointer shrink-0">
          <X size={22} />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex h-[50vh] sm:h-[420px] flex-col gap-3 overflow-y-auto bg-slate-100 p-4"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex min-w-0 ${
              message.sender === "client" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`${bubbleBase} ${
                message.sender === "client"
                  ? "bg-white text-zinc-800 after:content-[''] after:absolute after:bottom-0 after:right-[-6px] after:w-3 after:h-3 after:bg-white after:rotate-45 after:rounded-sm"
                  : "bg-primary text-white after:content-[''] after:absolute after:bottom-0 after:left-[-6px] after:w-3 after:h-3 after:bg-primary after:rotate-45 after:rounded-sm"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.text}</p>
              <span className="mt-1 block text-[11px] opacity-70">
                {message.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 p-4 shrink-0">
        <button
          type="button"
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
          type="button"
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
