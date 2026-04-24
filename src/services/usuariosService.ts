const API_URL = import.meta.env.VITE_API_URL?.trim();
if (!API_URL) {
  throw new Error(
    'A variável de ambiente VITE_API_URL não está definida. Configure-a antes de usar usuariosService.'
  );
}

const authHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
});

export interface UsuarioApi {
  id: number;
  nome: string;
  email: string;
  nivel: string;
  cpf_cnpj: string | null;
  celular: string | null;
  data_cadastro: string;
}

export interface CreateUsuarioPayload {
  nome: string;
  email: string;
  senha: string;
  nivel: 'cliente' | 'administrador';
  cpfCnpj?: string;
  celular?: string;
}

export interface UpdateUsuarioPayload {
  nome?: string;
  email?: string;
  senha?: string;
  cpfCnpj?: string;
  celular?: string;
}

export const usuariosService = {
  criar: async (payload: CreateUsuarioPayload): Promise<UsuarioApi> => {
    const response = await fetch(`${API_URL}/usuario/admin/usuarios`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const reason = await response.text();
      console.error(`Erro ao criar usuário (${response.status}):`, reason);
      throw new Error('Erro ao criar usuário');
    }

    return await response.json();
  },

  buscarPorId: async (id: number): Promise<UsuarioApi | null> => {
    try {
      const response = await fetch(`${API_URL}/usuario/${id}`, { headers: authHeaders() });
      if (!response.ok) throw new Error('Erro ao buscar usuário');
      return await response.json();
    } catch (error) {
      console.error('Erro no buscarPorId:', error);
      return null;
    }
  },

  atualizar: async (id: number, payload: UpdateUsuarioPayload): Promise<UsuarioApi | null> => {
    try {
      const response = await fetch(`${API_URL}/usuario/${id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const reason = await response.text();
        console.error(`Erro ao atualizar usuário (${response.status}):`, reason);
        throw new Error('Erro ao atualizar usuário');
      }

      if (response.status === 204) return null;
      return await response.json();
    } catch (error) {
      console.error('Erro no atualizar:', error);
      throw error;
    }
  },

  listarTodos: async (): Promise<UsuarioApi[]> => {
    try {
      const response = await fetch(`${API_URL}/usuario`, { headers: authHeaders() });
      if (!response.ok) throw new Error('Erro ao listar usuários');
      return await response.json();
    } catch (error) {
      console.error('Erro no listarTodos:', error);
      return [];
    }
  },

  deletar: async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/usuario/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (!response.ok) throw new Error('Erro ao excluir usuário');
      return true;
    } catch (error) {
      console.error('Erro no deletar:', error);
      throw error;
    }
  },
};
