const API_URL = import.meta.env.VITE_API_URL?.trim();
if (!API_URL) {
  throw new Error(
    'A variável de ambiente VITE_API_URL não está definida. Configure-a antes de usar veiculoService.'
  );
}

const authHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
});

export interface VeiculoApi {
  id: number;
  usuarioId: number;
  placa: string;
  renavam: string | null;
  marca: string | null;
  modelo: string | null;
  anoFabricacao: number | null;
  anoModelo: number | null;
}

export interface CreateVeiculoPayload {
  usuarioId: number;
  placa: string;
  renavam?: string;
  marca?: string;
  modelo?: string;
  anoFabricacao?: number;
  anoModelo?: number;
}

export interface UpdateVeiculoPayload extends Partial<CreateVeiculoPayload> {}

export const veiculoService = {
  listarTodos: async (): Promise<VeiculoApi[]> => {
    try {
      const response = await fetch(`${API_URL}/veiculo`, { headers: authHeaders() });
      if (!response.ok) throw new Error('Erro ao listar veículos');
      return await response.json();
    } catch (error) {
      console.error('Erro no listarTodos:', error);
      return [];
    }
  },

  buscarPorId: async (id: number): Promise<VeiculoApi | null> => {
    try {
      const response = await fetch(`${API_URL}/veiculo/${id}`, { headers: authHeaders() });
      if (!response.ok) throw new Error('Erro ao buscar veículo');
      return await response.json();
    } catch (error) {
      console.error('Erro no buscarPorId:', error);
      return null;
    }
  },

  criar: async (payload: CreateVeiculoPayload): Promise<VeiculoApi> => {
    const response = await fetch(`${API_URL}/veiculo`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const reason = await response.text();
      console.error(`Erro ao criar veículo (${response.status}):`, reason);
      throw new Error('Erro ao criar veículo');
    }

    return await response.json();
  },

  atualizar: async (id: number, payload: UpdateVeiculoPayload): Promise<VeiculoApi> => {
    const response = await fetch(`${API_URL}/veiculo/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const reason = await response.text();
      console.error(`Erro ao atualizar veículo (${response.status}):`, reason);
      throw new Error('Erro ao atualizar veículo');
    }

    return await response.json();
  },

  deletar: async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/veiculo/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (!response.ok) throw new Error('Erro ao excluir veículo');
      return true;
    } catch (error) {
      console.error('Erro no deletar:', error);
      throw error;
    }
  },
};
