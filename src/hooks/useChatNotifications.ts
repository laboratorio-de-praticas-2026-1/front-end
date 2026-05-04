import { useCallback, useEffect, useRef, useState } from "react";
import { getStoredUser, getToken } from "@/lib/authStorage";
import { getChatSocket } from "@/services/socket";

function isClientBroadcastPayload(
  d: unknown,
): d is { userId: string; text: string; timestamp: string } {
  if (typeof d !== "object" || d === null) return false;
  const o = d as Record<string, unknown>;
  if ("type" in o) return false;
  return (
    typeof o.userId === "string" &&
    typeof o.text === "string" &&
    typeof o.timestamp === "string"
  );
}

type Role = "cliente" | "administrador";

/**
 * Mantém contagem de não lidas enquanto o chat está fechado (socket permanece ativo no layout).
 */
export function useChatNotifications(role: Role, chatOpen: boolean) {
  const openRef = useRef(chatOpen);
  openRef.current = chatOpen;

  const [floatingCount, setFloatingCount] = useState(0);
  const [sessionUnread, setSessionUnread] = useState<Record<string, number>>(
    {},
  );

  useEffect(() => {
    if (chatOpen) {
      setFloatingCount(0);
      setSessionUnread({});
    }
  }, [chatOpen]);

  useEffect(() => {
    const user = getStoredUser();
    const token = getToken();
    if (!token || user?.nivel !== role) return;

    const s = getChatSocket(token);

    const onChat = (data: unknown) => {
      if (openRef.current) return;

      if (role === "cliente") {
        const d = data as Record<string, unknown>;
        if (d?.type === "message" && typeof d.text === "string") {
          setFloatingCount((n) => n + 1);
        }
        return;
      }

      if (isClientBroadcastPayload(data)) {
        const uid = data.userId;
        setFloatingCount((n) => n + 1);
        setSessionUnread((prev) => ({
          ...prev,
          [uid]: (prev[uid] ?? 0) + 1,
        }));
      }
    };

    s.on("chat", onChat);
    return () => {
      s.off("chat", onChat);
    };
  }, [role]);

  const consumeSessionUnread = useCallback((sessionId: string) => {
    setSessionUnread((prev) => {
      const n = prev[sessionId] ?? 0;
      if (n <= 0) return prev;
      setFloatingCount((t) => Math.max(0, t - n));
      const next = { ...prev };
      delete next[sessionId];
      return next;
    });
  }, []);

  return { floatingCount, sessionUnread, consumeSessionUnread };
}
