import { disconnectChatSocket } from "@/services/socket";

const TOKEN_KEY = "bortone_auth_token";
const USER_KEY = "bortone_auth_user";

export type StoredUser = {
  id: number;
  nome: string;
  email: string;
  nivel: string;
};

export function setSession(token: string, usuario: StoredUser): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(usuario));
}

export function clearSession(): void {
  disconnectChatSocket();
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("token");
  localStorage.removeItem("admin_token");
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): StoredUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}
