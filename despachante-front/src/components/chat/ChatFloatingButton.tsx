import { MessageSquare } from "lucide-react";
import { Button } from "../ui/button";

type ChatFloatingButtonProps = {
    onClick: () => void;
    unreadCount?: number;
}

export default function ChatFloatingButton({
    onClick,
    unreadCount = 0,
}: ChatFloatingButtonProps) {
    return(
        <button
        onClick={onClick}
        aria-label="Abrir chat"
        className="fixed bottom-10 right-12 z-[1000] flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-[0_10px_25px_rgba(0,0,0,0.22)] transition-all duration-200 hover:scale-105 hover:bg-secondary active:scale-95" 
    >
        <MessageSquare size={22} />

        {unreadCount > 0 && (
            <span
                className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold"
            >

                {unreadCount > 9 ? "9+" : unreadCount}

            </span>
        )}
    </button>
    )
}