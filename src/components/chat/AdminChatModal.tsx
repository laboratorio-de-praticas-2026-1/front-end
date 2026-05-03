import { useEffect, useMemo, useRef, useState } from "react";
import { CircleUserRound, Search, Send, Smile, X } from "lucide-react";
import { toast } from "sonner";
import { getChatSocket } from "@/services/socket";
import { getStoredUser, getToken } from "@/lib/authStorage";

type UiMessage = {
  id: string;
  sender: "admin" | "client";
  text: string;
  time: string;
};

type ChatContact = {
  userId: string;
  name: string;
  online: boolean;
};

type ChatMessagesByContact = Record<string, UiMessage[]>;

type AdminChatModalProps = {
  open: boolean;
  onClose: () => void;
  sessionUnreadCounts?: Record<string, number>;
  onConsumeSessionUnread?: (sessionId: string) => void;
};

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

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

function isClientBroadcastPayload(
  d: unknown,
): d is { userId: string; text: string; timestamp: string; nome: string } {
  if (typeof d !== "object" || d === null) return false;
  const o = d as Record<string, unknown>;
  if ("type" in o) return false;
  return (
    typeof o.userId === "string" &&
    typeof o.text === "string" &&
    typeof o.timestamp === "string"
  );
}

type ServerMsg = { nome: string; text: string; timestamp: string; userId?: string };

function serverRowToUi(m: ServerMsg, idx: number): UiMessage {
  return {
    id: `srv-${idx}-${m.timestamp}-${m.text.slice(0, 6)}`,
    sender: m.nome === "Atendente" ? "admin" : "client",
    text: m.text,
    time: formatChatTime(m.timestamp),
  };
}

export default function AdminChatModal({
  open,
  onClose,
  sessionUnreadCounts = {},
  onConsumeSessionUnread,
}: AdminChatModalProps) {
  const [blocked, setBlocked] = useState(false);
  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [selectedContactId, setSelectedContactId] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [messagesByContact, setMessagesByContact] = useState<ChatMessagesByContact>(
    {},
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const token = getToken();
    const user = getStoredUser();
    if (!token || user?.nivel !== "administrador") {
      setBlocked(true);
      return;
    }

    setBlocked(false);

    const s = getChatSocket(token);

    const onChat = (data: unknown) => {
      if (!data || typeof data !== "object") return;
      const d = data as Record<string, unknown>;

      if (d.type === "users" && Array.isArray(d.users)) {
        const rows = d.users as { userId: string; nome: string }[];
        setContacts(
          rows.map((u) => ({
            userId: u.userId,
            name: u.nome,
            online: true,
          })),
        );
        return;
      }

      if (d.type === "history_for_user" && typeof d.userId === "string" && Array.isArray(d.messages)) {
        const uid = d.userId;
        const rows = d.messages as ServerMsg[];
        const mapped = rows.map((m, i) => serverRowToUi(m, i));
        setMessagesByContact((prev) => ({
          ...prev,
          [uid]: mapped,
        }));
        return;
      }

      if (d.type === "userDisconnected" && typeof d.userId === "string") {
        const uid = d.userId;
        setContacts((prev) => prev.filter((c) => c.userId !== uid));
        setMessagesByContact((prev) => {
          const next = { ...prev };
          delete next[uid];
          return next;
        });
        return;
      }

      if (d.type === "error" && typeof d.msg === "string") {
        toast.error(d.msg);
        return;
      }

      if (d.type === "status" && typeof d.msg === "string") {
        toast.message(d.msg);
        return;
      }

      if (isClientBroadcastPayload(data)) {
        const msg: UiMessage = {
          id: `c-${data.timestamp}-${data.text.slice(0, 8)}`,
          sender: "client",
          text: data.text,
          time: formatChatTime(data.timestamp),
        };
        setMessagesByContact((prev) => ({
          ...prev,
          [data.userId]: [...(prev[data.userId] ?? []), msg],
        }));
      }
    };

    const onConnectErr = (err: Error) => {
      toast.error(err.message || "Falha ao conectar no chat");
    };

    s.on("chat", onChat);
    s.on("connect_error", onConnectErr);

    queueMicrotask(() => {
      s.emit("chat", { type: "admin_resync" });
    });

    return () => {
      s.off("chat", onChat);
      s.off("connect_error", onConnectErr);
    };
  }, [open]);

  useEffect(() => {
    if (contacts.length === 0) {
      setSelectedContactId("");
      return;
    }
    setSelectedContactId((prev) => {
      if (prev && contacts.some((c) => c.userId === prev)) return prev;
      return contacts[0].userId;
    });
  }, [contacts]);

  useEffect(() => {
    const activeIds = new Set(contacts.map((c) => c.userId));
    setMessagesByContact((prev) => {
      const next: ChatMessagesByContact = {};
      for (const [userId, msgs] of Object.entries(prev)) {
        if (activeIds.has(userId)) next[userId] = msgs;
      }
      return next;
    });
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    const q = normalizeText(search);
    if (!q) return contacts;
    return contacts.filter((contact) =>
      normalizeText(contact.name).includes(q),
    );
  }, [contacts, search]);

  const selectedContact = contacts.find((c) => c.userId === selectedContactId);
  const selectedMessages = messagesByContact[selectedContactId] ?? [];

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [selectedMessages, selectedContactId]);

  const handleSelectContact = (userId: string) => {
    setSelectedContactId(userId);
    onConsumeSessionUnread?.(userId);
  };

  const handleSendMessage = () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue || blocked || !selectedContactId) return;

    const token = getToken();
    if (!token) return;

    const s = getChatSocket(token);
    if (!s.connected) {
      toast.error("Chat desconectado.");
      return;
    }

    const newMessage: UiMessage = {
      id: `a-${Date.now()}`,
      sender: "admin",
      text: trimmedValue,
      time: "Agora",
    };

    setMessagesByContact((prev) => ({
      ...prev,
      [selectedContactId]: [...(prev[selectedContactId] ?? []), newMessage],
    }));

    s.emit("chat", {
      type: "message",
      text: trimmedValue,
      to: selectedContactId,
    });
    setInputValue("");
  };

  if (!open) return null;

  if (blocked) {
    return (
      <div
        className="
        fixed z-50 bg-white overflow-hidden rounded-[28px] shadow-[0_18px_40px_rgba(0,0,0,0.18)]
        bottom-20 right-4 w-[calc(100vw-32px)] h-[80vh] flex flex-col p-6
        md:bottom-28 md:right-12 md:w-[620px] md:h-[520px]
      "
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-800">Chat</h2>
          <button type="button" onClick={onClose} aria-label="Fechar chat">
            <X size={22} />
          </button>
        </div>
        <p className="text-sm text-zinc-600">
          Faça login com uma conta de administrador para atender pelo chat.
        </p>
      </div>
    );
  }

  const bubbleBase =
    "max-w-[90%] min-w-0 rounded-2xl px-4 py-3 text-sm shadow-sm break-words [overflow-wrap:anywhere]";

  return (
    <div
      className="
        fixed z-50 bg-white overflow-hidden rounded-[28px] shadow-[0_18px_40px_rgba(0,0,0,0.18)]
        bottom-20 right-4 w-[calc(100vw-32px)] h-[80vh] flex-col flex
        md:bottom-28 md:right-12 md:w-[620px] md:h-[520px] md:flex-row md:max-w-[calc(100vw-48px)]
      "
    >
      <aside className="flex flex-col bg-zinc-50 border-b border-zinc-200 md:border-b-0 md:border-r md:w-[310px] h-[35%] md:h-full">
        <div className="p-4">
          <div className="flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Procurar por usuários"
              className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-zinc-400"
            />
            <Search size={18} className="text-primary shrink-0" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-3">
          {filteredContacts.length === 0 ? (
            <p className="px-4 text-sm text-zinc-500">
              Nenhum cliente no chat. Peça para um cliente entrar no portal (logado) para aparecer aqui.
            </p>
          ) : (
            filteredContacts.map((contact) => {
              const isActive = selectedContactId === contact.userId;
              const nUnread = sessionUnreadCounts[contact.userId] ?? 0;
              return (
                <button
                  key={contact.userId}
                  type="button"
                  onClick={() => handleSelectContact(contact.userId)}
                  className={`relative flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                    isActive ? "bg-zinc-200" : "hover:bg-zinc-100"
                  } ${isActive ? "text-secondary" : "text-zinc-800"}`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-0 h-full w-1 bg-secondary" />
                  )}

                  <div className="relative shrink-0">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-200 text-secondary">
                      <CircleUserRound size={24} />
                    </div>

                    <span
                      className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${
                        contact.online ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-zinc-800">
                      {contact.name}
                    </p>
                    <p className="truncate text-xs text-zinc-500">
                      {contact.userId}
                    </p>
                  </div>

                  {nUnread > 0 && (
                    <span className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white">
                      {nUnread > 99 ? "99+" : nUnread}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </aside>

      <section className="flex flex-1 flex-col bg-slate-100 h-[65%] md:h-full min-w-0">
        <div className="flex items-center justify-between bg-secondary px-5 py-4 text-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-secondary">
              <CircleUserRound size={24} />
            </div>
            <h2 className="text-base font-medium truncate">
              {selectedContact?.name ?? "Cliente"}
            </h2>
          </div>

          <button type="button" onClick={onClose} aria-label="Fechar chat" className="cursor-pointer shrink-0">
            <X size={22} />
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex flex-1 flex-col gap-3 overflow-y-auto overflow-x-hidden p-4 min-w-0"
        >
          {selectedMessages.map((message) => (
            <div
              key={message.id}
              className={`flex min-w-0 ${
                message.sender === "admin" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`${bubbleBase} ${
                  message.sender === "admin"
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
            disabled={!selectedContactId}
            className="flex-1 min-w-0 rounded-full border border-zinc-300 px-4 py-3 text-sm outline-none"
          />

          <button
            type="button"
            onClick={handleSendMessage}
            disabled={!selectedContactId}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-white cursor-pointer transition hover:brightness-95 disabled:opacity-50"
            aria-label="Enviar mensagem"
          >
            <Send size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
