import type { Servico, StatusServico } from "@/mocks/mockServicos";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type ApiServico = {
  id: number;
  nome: string;
  descricao?: string | null;
  valorBase?: number | string | null;
  valor_base?: number | string | null;
  prazoEstimado?: number | null;
  prazoEstimadoDias?: number | null;
  prazo_estimado_dias?: number | null;
  ativo?: boolean | null;
};

type BuscarServicosFiltros = {
  status?: "Todos" | "Ativo" | "Inativo";
  valorDe?: number;
  valorAte?: number;
  prazoDe?: number;
  prazoAte?: number;
};

const toNumber = (value?: number | string | null): number => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const normalizarStatus = (ativo?: boolean | null): StatusServico => {
  return ativo ? "Ativo" : "Inativo";
};

const normalizarServico = (servico: ApiServico): Servico => {
  const prazo =
    servico.prazoEstimado ??
    servico.prazoEstimadoDias ??
    servico.prazo_estimado_dias;

  return {
    id: servico.id,
    nome: servico.nome,
    descricao: servico.descricao ?? "",
    valorBase: toNumber(servico.valorBase ?? servico.valor_base),
    prazoEstimado: typeof prazo === "number" ? prazo : 0,
    status: normalizarStatus(servico.ativo),
  };
};

const mapearStatusParaApi = (
  status?: "Todos" | "Ativo" | "Inativo",
): "ativo" | "inativo" | undefined => {
  if (status === "Ativo") return "ativo";
  if (status === "Inativo") return "inativo";
  return undefined;
};

const criarQueryString = (filtros: BuscarServicosFiltros): string => {
  const params = new URLSearchParams();

  const statusApi = mapearStatusParaApi(filtros.status);
  if (statusApi) params.set("status", statusApi);

  if (typeof filtros.valorDe === "number") {
    params.set("valor_base_de", String(filtros.valorDe));
  }

  if (typeof filtros.valorAte === "number") {
    params.set("valor_base_ate", String(filtros.valorAte));
  }

  if (typeof filtros.prazoDe === "number") {
    params.set("prazo_estimado_de", String(filtros.prazoDe));
  }

  if (typeof filtros.prazoAte === "number") {
    params.set("prazo_estimado_ate", String(filtros.prazoAte));
  }

  return params.toString();
};

export const servicoService = {
  buscarPorFiltros: async (filtros: BuscarServicosFiltros): Promise<Servico[]> => {
    try {
      const query = criarQueryString(filtros);
      const url = query
        ? `${API_URL}/busca/servico/filtros?${query}`
        : `${API_URL}/busca/servico/filtros`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Erro ao buscar serviços por filtros");

      const dados: ApiServico[] = await response.json();
      return dados.map(normalizarServico);
    } catch (error) {
      console.error("Erro no buscarPorFiltros de serviços:", error);
      return [];
    }
  },
};