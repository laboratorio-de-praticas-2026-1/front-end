import { useMemo, useState } from "react";
import { CircleUserRound, Search, Send, Smile, X } from "lucide-react";
import chatMock from "../../mocks/chat.mock.json"

type ChatMessage = {
    id: number,
    sender: "admin" | "client";
    text: string;
    time: string;
}

type ChatContact = {
    id: number
    name: string
    online: boolean
    unreadCount: number
    lastMessage: string
    lastMessageTime: string
}

type ChatMessagesByContact = Record<string, ChatMessage[]>

type AdminChatModalProps = {
    open: boolean
    onClose: () => void
}

export default function AdminChatModal({
  open,
  onClose,
}: AdminChatModalProps) {
  const contacts = chatMock.contacts as ChatContact[];

    const [search, setSearch] = useState("")
    const [selectedContactId, setSelectedContactId] = useState<number>(
        contacts[0]?.id ?? 1
    )

    const [inputValue, setInputValue] = useState("")
    const [messagesByContact, setMessagesByContact] = useState<ChatMessagesByContact>(chatMock.messages as ChatMessagesByContact)

    const filteredContacts = useMemo(() => {
        return contacts.filter((contact) =>
        contact.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [contacts, search]);

    const selectedContact =
    contacts.find((contact) => contact.id === selectedContactId) ?? contacts[0];

    const selectedMessages = messagesByContact[String(selectedContactId)] ?? [];

    const handleSendMessage = () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      sender: "admin",
      text: trimmedValue,
      time: "Agora",
    };

    setMessagesByContact((prev) => ({
      ...prev,
      [String(selectedContactId)]: [
        ...(prev[String(selectedContactId)] ?? []),
        newMessage,
      ],
    }));

    setInputValue("");
  };

  if (!open) return null;

  return (
    <div
      className="
        fixed bottom-28 right-12 z-[999]
        flex h-[520px] w-[620px] max-w-[calc(100vw-24px)]
        overflow-hidden rounded-[28px] bg-white
        shadow-[0_18px_40px_rgba(0,0,0,0.18)]
      "
    >
      <aside className="flex w-[310px] flex-col border-r border-zinc-200 bg-zinc-50">
        <div className="p-4">
          <div className="flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Procurar por usuários"
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
            />
            <Search size={18} className="text-primary" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-3">
          {filteredContacts.map((contact) => {
            const isActive = selectedContactId === contact.id;

            return (
              <button
                key={contact.id}
                onClick={() => setSelectedContactId(contact.id)}
                className={`relative flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                  isActive ? "bg-zinc-200" : "hover:bg-zinc-100"
                } ${isActive ? "text-secondary" : "text-zinc-800"}`}
              >
                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-secondary" />
                )}

                <div className="relative">
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
                  <p className="truncate text-sm font-semibold text-zinc-800 $">
                    {contact.name}
                  </p>
                  <p className="truncate text-xs text-zinc-500">
                    {contact.lastMessage}
                  </p>
                </div>

                {contact.unreadCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {contact.unreadCount > 9 ? "9+" : contact.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      <section className="flex flex-1 flex-col bg-slate-100">
        <div className="flex items-center justify-between bg-secondary px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-secondary">
              <CircleUserRound size={24} />
            </div>
            <h2 className="text-base font-medium">
              {selectedContact?.name ?? "Cliente"}
            </h2>
          </div>

          <button onClick={onClose} aria-label="Fechar chat" className="cursor-pointer">
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
          {selectedMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "admin" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  message.sender === "admin"
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
            <Smile size={24} />
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
            className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-white cursor-pointer transition hover:brightness-95"
            aria-label="Enviar mensagem"
          >
            <Send size={18} />
          </button>
        </div>
      </section>
    </div>
  );


}