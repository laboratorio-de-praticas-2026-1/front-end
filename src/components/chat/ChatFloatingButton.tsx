import { MessageSquare } from "lucide-react";

type ChatFloatingButtonProps = {
  onClick: () => void;
  unreadCount?: number;
};

export default function ChatFloatingButton({
  onClick,
  unreadCount = 0,
}: ChatFloatingButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Abrir chat"
      className="
        fixed z-50 flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full 
        bg-primary text-white shadow-[0_10px_25px_rgba(0,0,0,0.22)] transition-all duration-200 
        hover:scale-105 hover:bg-secondary active:scale-95
        bottom-6 right-4 md:bottom-10 md:right-12
      "
    >
      <MessageSquare size={22} className="shrink-0" />

      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-7 min-w-7 px-1 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}
