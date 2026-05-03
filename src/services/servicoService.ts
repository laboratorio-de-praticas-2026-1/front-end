const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://despachante-bortone-release-production.up.railway.app";

// FRONT
export interface Servico {
  id: number;
  nome: string;
  descricao: string | null;
  valorBase: number | null;
  prazoEstimadoDias: number | null;
  ativo: boolean | null;
}

// API
type ApiServico = {
  id: number;
  nome: string;
  descricao: string | null;
  valorBase?: number | null;
  valor_base?: number | null;
  prazoEstimadoDias?: number | null;
  prazo_estimado_dias?: number | null;
  ativo: boolean | null;
};

const normalizeServico = (servico: ApiServico): Servico => {
  return {
    id: servico.id,
    nome: servico.nome,
    descricao: servico.descricao,
    valorBase: servico.valorBase ?? servico.valor_base ?? null,
    prazoEstimadoDias:
      servico.prazoEstimadoDias ?? servico.prazo_estimado_dias ?? null,
    ativo: servico.ativo,
  };
};

export const servicosService = {
  listarTodos: async (): Promise<Servico[]> => {
    const res = await fetch(`${API_URL}/servicos`);
    if (!res.ok) throw new Error("Erro ao buscar serviços");

    const data: ApiServico[] = await res.json();
    return data.map(normalizeServico);
  },

  buscarPorId: async (id: number): Promise<Servico | null> => {
    const res = await fetch(`${API_URL}/servicos/${id}`);
    if (!res.ok) throw new Error("Erro ao buscar serviço");

    const data: ApiServico = await res.json();
    return normalizeServico(data);
  },

  criar: async (dados: Omit<Servico, "id">) => {
    const payload = {
      nome: dados.nome,
      descricao: dados.descricao,
      valor_base: dados.valorBase,
      prazo_estimado_dias: dados.prazoEstimadoDias,
      ativo: dados.ativo,
    };

    const res = await fetch(`${API_URL}/servicos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Erro ao criar serviço");

    const data: ApiServico = await res.json();
    return normalizeServico(data);
  },

  atualizar: async (id: number, dados: Partial<Servico>) => {
    const payload: any = {};

    if (dados.nome !== undefined) payload.nome = dados.nome;
    if (dados.descricao !== undefined) payload.descricao = dados.descricao;
    if (dados.valorBase !== undefined) payload.valor_base = dados.valorBase;
    if (dados.prazoEstimadoDias !== undefined)
      payload.prazo_estimado_dias = dados.prazoEstimadoDias;
    if (dados.ativo !== undefined) payload.ativo = dados.ativo;

    const res = await fetch(`${API_URL}/servicos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Erro ao atualizar serviço");

    const data: ApiServico = await res.json();
    return normalizeServico(data);
  },

  deletar: async (id: number) => {
    const res = await fetch(`${API_URL}/servicos/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Erro ao deletar serviço");

    return true;
  },
};