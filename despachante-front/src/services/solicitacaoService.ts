const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://despachante-bortone-release-production.up.railway.app";

const ENV_USUARIO_ID = Number(import.meta.env.VITE_CLIENTE_USUARIO_ID ?? "");

type ApiSolicitacaoItem = {
  id?: number;
  protocolo?: string | null;
  cliente: {
    id: number;
    nome: string;
    email: string;
  };
  servico: {
    id?: number;
    tipo: string;
    valorBase: number | string;
  };
  solicitacao: {
    id?: number;
    status: string;
    observacaoCliente?: string | null;
    observacaoAdmin?: string | null;
    dataSolicitacao: string;
    dataConclusao: string | null;
  };
};

type ApiListSolicitacoesResponse = {
  total: number;
  solicitacoes: ApiSolicitacaoItem[];
};

export type SolicitacaoStatus =
  | "Recebida"
  | "Em andamento"
  | "Concluida"
  | "Cancelada"
  | "Aguardando pagamento"
  | "Aguardando documento";

export interface ClienteSolicitacao {
  routeId: string;
  id: number | null;
  protocolo: string | null;
  clienteId: number;
  clienteNome: string;
  clienteEmail: string;
  servicoId: number | null;
  servico: string;
  valor: number;
  status: SolicitacaoStatus;
  rawStatus: string;
  dataSolicitacao: string;
  dataConclusao: string | null;
  observacaoCliente: string;
  observacaoAdmin: string;
}

export interface SolicitacoesFilters {
  usuarioId?: number;
  status?: SolicitacaoStatus;
  search?: string;
  dataInicio?: string;
  dataFim?: string;
  page?: number;
  limit?: number;
}

export interface ServicoDisponivel {
  id: number;
  nome: string;
  valorBase: number;
}

export interface CriarSolicitacaoPayload {
  usuario_id: number;
  servico_id: number;
  veiculo_id?: number | null;
  observacao_cliente?: string;
}

export interface CriarSolicitacaoResponse {
  message: string;
  protocolo: {
    cliente: {
      nome: string;
    };
    servico: {
      nome: string;
      valor_base: number | null;
    };
    solicitacao: {
      data_solicitacao: string;
      prazo_estimado: string;
    };
  };
}

const STATUS_LABELS: Record<SolicitacaoStatus, string> = {
  Recebida: "Recebida",
  "Em andamento": "Em andamento",
  Concluida: "Concluida",
  Cancelada: "Cancelada",
  "Aguardando pagamento": "Aguardando pagamento",
  "Aguardando documento": "Aguardando documento",
};

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const normalizeStatus = (status: string): SolicitacaoStatus => {
  const normalizedStatus = normalizeText(status).replace(/\s+/g, "_");

  switch (normalizedStatus) {
    case "recebido":
    case "recebida":
      return "Recebida";
    case "em_andamento":
    case "andamento":
      return "Em andamento";
    case "concluido":
    case "concluida":
      return "Concluida";
    case "cancelado":
    case "cancelada":
      return "Cancelada";
    case "aguardando_pagamento":
      return "Aguardando pagamento";
    case "aguardando_documento":
      return "Aguardando documento";
    default:
      return "Recebida";
  }
};

const buildRouteId = (solicitacao: ApiSolicitacaoItem) => {
  const numericId = solicitacao.id ?? solicitacao.solicitacao.id;
  if (numericId) {
    return String(numericId);
  }

  const timestamp = new Date(solicitacao.solicitacao.dataSolicitacao).getTime();

  return [
    solicitacao.cliente.id,
    solicitacao.servico.id ?? "servico",
    Number.isNaN(timestamp) ? "sem-data" : timestamp,
  ].join("-");
};

const normalizeSolicitacao = (
  solicitacao: ApiSolicitacaoItem,
): ClienteSolicitacao => ({
  routeId: buildRouteId(solicitacao),
  id: solicitacao.id ?? solicitacao.solicitacao.id ?? null,
  protocolo: solicitacao.protocolo ?? null,
  clienteId: solicitacao.cliente.id,
  clienteNome: solicitacao.cliente.nome,
  clienteEmail: solicitacao.cliente.email,
  servicoId: solicitacao.servico.id ?? null,
  servico: solicitacao.servico.tipo,
  valor: Number(solicitacao.servico.valorBase ?? 0),
  status: normalizeStatus(solicitacao.solicitacao.status),
  rawStatus: solicitacao.solicitacao.status,
  dataSolicitacao: solicitacao.solicitacao.dataSolicitacao,
  dataConclusao: solicitacao.solicitacao.dataConclusao,
  observacaoCliente: solicitacao.solicitacao.observacaoCliente ?? "",
  observacaoAdmin: solicitacao.solicitacao.observacaoAdmin ?? "",
});

const applyDateFilter = (
  value: string,
  dataInicio?: string,
  dataFim?: string,
) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return true;
  }

  if (dataInicio) {
    const start = new Date(`${dataInicio}T00:00:00`);
    if (date < start) {
      return false;
    }
  }

  if (dataFim) {
    const end = new Date(`${dataFim}T23:59:59`);
    if (date > end) {
      return false;
    }
  }

  return true;
};

const applyFilters = (
  solicitacoes: ClienteSolicitacao[],
  filters: SolicitacoesFilters,
) => {
  const normalizedSearch = filters.search
    ? normalizeText(filters.search)
    : "";

  return solicitacoes.filter((solicitacao) => {
    if (
      filters.usuarioId !== undefined &&
      solicitacao.clienteId !== filters.usuarioId
    ) {
      return false;
    }

    if (filters.status && solicitacao.status !== filters.status) {
      return false;
    }

    if (
      !applyDateFilter(
        solicitacao.dataSolicitacao,
        filters.dataInicio,
        filters.dataFim,
      )
    ) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    const haystack = [
      solicitacao.protocolo ?? "",
      solicitacao.servico,
      solicitacao.clienteNome,
      solicitacao.clienteEmail,
      solicitacao.observacaoCliente,
      solicitacao.observacaoAdmin,
    ]
      .map(normalizeText)
      .join(" ");

    return haystack.includes(normalizedSearch);
  });
};

const paginate = (
  solicitacoes: ClienteSolicitacao[],
  page?: number,
  limit?: number,
) => {
  if (!page || !limit) {
    return solicitacoes;
  }

  const start = (page - 1) * limit;
  return solicitacoes.slice(start, start + limit);
};

const parseStoredUsuarioId = (value: string | null) => {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const getNetworkErrorMessage = (fallbackMessage: string) => {
  const baseUrl = API_URL.replace(/\/$/, "");

  return `${fallbackMessage} Verifique se a API está disponível em ${baseUrl}.`;
};

const toFriendlyError = (error: unknown, fallbackMessage: string) => {
  if (error instanceof Error) {
    const normalizedMessage = normalizeText(error.message);

    if (
      normalizedMessage.includes("failed to fetch") ||
      normalizedMessage.includes("load failed") ||
      normalizedMessage.includes("networkerror") ||
      normalizedMessage.includes("network request failed")
    ) {
      return new Error(getNetworkErrorMessage(fallbackMessage));
    }

    if (normalizedMessage.includes("fetch")) {
      return new Error(getNetworkErrorMessage(fallbackMessage));
    }

    return error;
  }

  return new Error(fallbackMessage);
};

export const formatSolicitacaoDate = (value: string | null) => {
  if (!value) return "--";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";

  return new Intl.DateTimeFormat("pt-BR").format(date);
};

export const formatSolicitacaoCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export const resolveClienteUsuarioId = () => {
  if (Number.isFinite(ENV_USUARIO_ID)) {
    return ENV_USUARIO_ID;
  }

  if (typeof window === "undefined") {
    return undefined;
  }

  const storageKeys = [
    "clienteId",
    "cliente_id",
    "usuarioId",
    "usuario_id",
    "userId",
    "user_id",
  ];

  for (const key of storageKeys) {
    const parsed = parseStoredUsuarioId(window.localStorage.getItem(key));
    if (parsed !== undefined) {
      return parsed;
    }
  }

  return undefined;
};

export const getSolicitacaoStatusLabel = (status: SolicitacaoStatus) =>
  STATUS_LABELS[status];

export const canGenerateReceipt = (solicitacao: ClienteSolicitacao) =>
  solicitacao.status !== "Cancelada";

export const solicitacaoService = {
  async listarSolicitacoes(
    filters: SolicitacoesFilters = {},
  ): Promise<ClienteSolicitacao[]> {
    try {
      const response = await fetch(`${API_URL}/solicitacoes`);

      if (!response.ok) {
        throw new Error("Nao foi possivel carregar as solicitacoes.");
      }

      const data = (await response.json()) as ApiListSolicitacoesResponse;

      const solicitacoes = data.solicitacoes
        .map(normalizeSolicitacao)
        .sort(
          (a, b) =>
            new Date(b.dataSolicitacao).getTime() -
            new Date(a.dataSolicitacao).getTime(),
        );

      return paginate(
        applyFilters(solicitacoes, filters),
        filters.page,
        filters.limit,
      );
    } catch (error) {
      throw toFriendlyError(error, "Nao foi possivel carregar as solicitacoes.");
    }
  },

  async buscarSolicitacao(routeId: string) {
    const solicitacoes = await this.listarSolicitacoes();

    return (
      solicitacoes.find(
        (solicitacao) =>
          solicitacao.routeId === routeId ||
          String(solicitacao.id ?? "") === routeId ||
          solicitacao.protocolo === routeId,
      ) ?? null
    );
  },

  async listarServicosDisponiveis(): Promise<ServicoDisponivel[]> {
    try {
      const solicitacoes = await this.listarSolicitacoes();
      const servicesMap = new Map<number, ServicoDisponivel>();

      for (const solicitacao of solicitacoes) {
        if (!solicitacao.servicoId) {
          continue;
        }

        if (!servicesMap.has(solicitacao.servicoId)) {
          servicesMap.set(solicitacao.servicoId, {
            id: solicitacao.servicoId,
            nome: solicitacao.servico,
            valorBase: solicitacao.valor,
          });
        }
      }

      return Array.from(servicesMap.values()).sort((a, b) =>
        a.nome.localeCompare(b.nome),
      );
    } catch (error) {
      throw toFriendlyError(error, "Nao foi possivel carregar os servicos.");
    }
  },

  async criarSolicitacao(
    payload: CriarSolicitacaoPayload,
  ): Promise<CriarSolicitacaoResponse> {
    try {
      const response = await fetch(`${API_URL}/solicitacoes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Nao foi possivel criar a solicitacao.");
      }

      return response.json() as Promise<CriarSolicitacaoResponse>;
    } catch (error) {
      throw toFriendlyError(error, "Nao foi possivel criar a solicitacao.");
    }
  },
};
