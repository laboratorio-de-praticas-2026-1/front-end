const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://despachante-bortone-release-production.up.railway.app";

//FRONT
export interface Servico {
  id: number;
  nome: string;
  descricao: string | null;
  valorBase: number | null;
  prazoEstimadoDias: number | null;
  ativo: boolean | null;
}

//API
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
  //GET
  listarTodos: async (): Promise<Servico[]> => {
    try {
      const res = await fetch(`${API_URL}/servicos`);
      if (!res.ok) throw new Error("Erro ao buscar serviços");

      const data: ApiServico[] = await res.json();
      return data.map(normalizeServico);
    } catch (err) {
      console.error("Erro no listarTodos:", err);
      return [];
    }
  },

  //GET BY ID
  buscarPorId: async (id: number): Promise<Servico | null> => {
    try {
      const res = await fetch(`${API_URL}/servicos/${id}`);
      if (!res.ok) throw new Error("Erro ao buscar serviço");

      const data: ApiServico = await res.json();
      return normalizeServico(data);
    } catch (err) {
      console.error("Erro no buscarPorId:", err);
      return null;
    }
  },

  //POST
  criar: async (dados: Omit<Servico, "id">) => {
    try {
      const res = await fetch(`${API_URL}/servicos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      if (!res.ok) {
        const erro = await res.text();
        console.error("Erro ao criar:", erro);
        throw new Error("Erro ao criar serviço");
      }

      const data: ApiServico = await res.json();
      return normalizeServico(data);
    } catch (err) {
      console.error("Erro no criar:", err);
      throw err;
    }
  },

  //PUT
  atualizar: async (id: number, dados: Partial<Servico>) => {
    try {
      const res = await fetch(`${API_URL}/servicos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      if (!res.ok) {
        const erro = await res.text();
        console.error("Erro ao atualizar:", erro);
        throw new Error("Erro ao atualizar serviço");
      }

      const data: ApiServico = await res.json();
      return normalizeServico(data);
    } catch (err) {
      console.error("Erro no atualizar:", err);
      throw err;
    }
  },

  //DELETE
  deletar: async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/servicos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erro ao deletar serviço");

      return true;
    } catch (err) {
      console.error("Erro no deletar:", err);
      throw err;
    }
  },
};