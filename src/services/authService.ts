const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://despachante-bortone-release-production.up.railway.app";

export interface CadastroPayload {
  nome: string;
  email: string;
  senha: string;
  cpfCnpj?: string;
  celular?: string;
}

export interface LoginPayload {
  email: string;
  senha: string;
}

async function throwIfError(response: Response, fallback: string) {
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const message = Array.isArray(data?.message)
      ? data.message.join(", ")
      : (data?.message ?? fallback);
    throw new Error(message);
  }
}

export async function cadastrarUsuario(payload: CadastroPayload): Promise<void> {
  const response = await fetch(`${API_URL}/usuario/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  await throwIfError(response, "Erro ao realizar cadastro.");
}

export interface LoginResponse {
  nivel: string;
}

export async function loginUsuario(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/usuario/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  await throwIfError(response, "E-mail ou senha inválidos.");

  const data = await response.json();
  localStorage.setItem("token", data.tokenJWT);
  localStorage.setItem("nivel", data.usuario.nivel);

  return { nivel: data.usuario.nivel };
}
