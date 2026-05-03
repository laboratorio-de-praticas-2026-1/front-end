const API_URL =
  import.meta.env.VITE_API_URL?.trim() || "http://localhost:3000";

export type AuthUser = {
  id: number;
  nome: string;
  email: string;
  nivel: string;
};

export type LoginResponse = {
  message: string;
  tokenJWT: string;
  usuario: AuthUser;
};

async function readApiError(res: Response): Promise<string> {
  const body = (await res.json().catch(() => ({}))) as {
    message?: string | string[];
  };
  const m = body.message;
  if (Array.isArray(m)) return m.join(", ");
  if (typeof m === "string") return m;
  return `Erro ${res.status}`;
}

export async function loginRequest(
  email: string,
  senha: string,
): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/usuario/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  if (!res.ok) throw new Error(await readApiError(res));
  return res.json() as Promise<LoginResponse>;
}

export type RegisterBody = {
  nome: string;
  email: string;
  senha: string;
  cpfCnpj?: string;
  celular?: string;
};

export async function registerRequest(body: RegisterBody): Promise<unknown> {
  const res = await fetch(`${API_URL}/usuario/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await readApiError(res));
  return res.json();
}
