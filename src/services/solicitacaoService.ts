const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://despachante-bortone-release-production.up.railway.app";

export type StatusSolicitacao =
  | "recebido"
  | "em_andamento"
  | "aguardando_pagamento"
  | "aguardando_documento"
  | "concluido"
  | "cancelado";

export interface SolicitacaoResumo {
  id: number | null;
  clienteId: number;
  protocolo: string | null;
  servico: string;
  valorBase: number;
  dataSolicitacao: Date;
  dataConclusao: Date | null;
  status: StatusSolicitacao;
  observacaoCliente: string;
  observacaoAdmin: string;
}

export interface ListaSolicitacoesResponse {
  total: number;
  solicitacoes: SolicitacaoResumo[];
}

export interface FiltrosSolicitacoes {
  usuario_id?: number;
  status?: string;
  search?: string;
  dataInicio?: string;
  dataFim?: string;
  page?: number;
  limit?: number;
}

export interface CriarSolicitacaoPayload {
  usuario_id: number;
  servico_id: number;
  veiculo_id?: number | null;
  observacao_cliente?: string;
}

export interface CreateSolicitacaoResponse {
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

export interface ServicoDisponivel {
  id: number;
  nome: string;
  valorBase: number;
}

interface ApiSolicitacaoItem {
  id?: number;
  protocolo?: string;
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
    observacaoCliente?: string;
    observacaoAdmin?: string;
    dataSolicitacao: string;
    dataConclusao: string | null;
  };
}

interface ApiListSolicitacoesResponse {
  total: number;
  solicitacoes: ApiSolicitacaoItem[];
}

function normalizarTexto(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function normalizarStatus(status: string): StatusSolicitacao {
  const valor = normalizarTexto(status).replace(/\s+/g, "_");

  switch (valor) {
    case "recebido":
      return "recebido";
    case "em_andamento":
      return "em_andamento";
    case "aguardando_pagamento":
      return "aguardando_pagamento";
    case "aguardando_documento":
      return "aguardando_documento";
    case "concluido":
      return "concluido";
    case "cancelado":
      return "cancelado";
    default:
      return "recebido";
  }
}

function mapApiSolicitacao(raw: ApiSolicitacaoItem): SolicitacaoResumo {
  return {
    id: raw.id ?? raw.solicitacao.id ?? null,
    clienteId: raw.cliente.id,
    protocolo: raw.protocolo ?? null,
    servico: raw.servico.tipo,
    valorBase: Number(raw.servico.valorBase ?? 0),
    dataSolicitacao: new Date(raw.solicitacao.dataSolicitacao),
    dataConclusao: raw.solicitacao.dataConclusao
      ? new Date(raw.solicitacao.dataConclusao)
      : null,
    status: normalizarStatus(raw.solicitacao.status),
    observacaoCliente: raw.solicitacao.observacaoCliente ?? "",
    observacaoAdmin: raw.solicitacao.observacaoAdmin ?? "",
  };
}

function estaDentroDoIntervalo(
  data: Date,
  dataInicio?: string,
  dataFim?: string,
): boolean {
  const diaSolicitacao = new Date(data);
  diaSolicitacao.setHours(0, 0, 0, 0);

  if (dataInicio) {
    const inicio = new Date(`${dataInicio}T00:00:00`);
    if (diaSolicitacao < inicio) {
      return false;
    }
  }

  if (dataFim) {
    const fim = new Date(`${dataFim}T23:59:59`);
    if (data > fim) {
      return false;
    }
  }

  return true;
}

function aplicarFiltros(
  solicitacoes: SolicitacaoResumo[],
  filtros: FiltrosSolicitacoes,
): SolicitacaoResumo[] {
  const termoBusca = filtros.search ? normalizarTexto(filtros.search) : "";
  const statusFiltro = filtros.status ? normalizarStatus(filtros.status) : null;

  return solicitacoes.filter((solicitacao) => {
    if (
      filtros.usuario_id !== undefined &&
      solicitacao.clienteId !== filtros.usuario_id
    ) {
      return false;
    }

    if (statusFiltro && solicitacao.status !== statusFiltro) {
      return false;
    }

    if (
      !estaDentroDoIntervalo(
        solicitacao.dataSolicitacao,
        filtros.dataInicio,
        filtros.dataFim,
      )
    ) {
      return false;
    }

    if (!termoBusca) {
      return true;
    }

    const camposBusca = [
      solicitacao.protocolo ?? "",
      solicitacao.servico,
      solicitacao.observacaoCliente,
      solicitacao.observacaoAdmin,
    ]
      .map(normalizarTexto)
      .join(" ");

    return camposBusca.includes(termoBusca);
  });
}

function paginar(
  solicitacoes: SolicitacaoResumo[],
  page?: number,
  limit?: number,
): SolicitacaoResumo[] {
  if (!page || !limit) {
    return solicitacoes;
  }

  const inicio = (page - 1) * limit;
  return solicitacoes.slice(inicio, inicio + limit);
}

export const solicitacaoService = {
  async listar(
    filtros: FiltrosSolicitacoes = {},
  ): Promise<ListaSolicitacoesResponse> {
    const res = await fetch(`${API_URL}/solicitacoes`);
    if (!res.ok) {
      throw new Error("Erro ao listar solicitacoes");
    }

    const data = (await res.json()) as ApiListSolicitacoesResponse;
    const solicitacoes = data.solicitacoes
      .map(mapApiSolicitacao)
      .sort(
        (a, b) =>
          b.dataSolicitacao.getTime() - a.dataSolicitacao.getTime(),
      );

    const filtradas = aplicarFiltros(solicitacoes, filtros);

    return {
      total: filtradas.length,
      solicitacoes: paginar(filtradas, filtros.page, filtros.limit),
    };
  },

  async criar(
    payload: CriarSolicitacaoPayload,
  ): Promise<CreateSolicitacaoResponse> {
    const res = await fetch(`${API_URL}/solicitacoes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || "Erro ao criar solicitacao");
    }

    return res.json() as Promise<CreateSolicitacaoResponse>;
  },

  async listarServicosDisponiveis(): Promise<ServicoDisponivel[]> {
    const res = await fetch(`${API_URL}/solicitacoes`);
    if (!res.ok) {
      throw new Error("Erro ao listar servicos");
    }

    const data = (await res.json()) as ApiListSolicitacoesResponse;
    const servicosPorId = new Map<number, ServicoDisponivel>();

    for (const item of data.solicitacoes) {
      if (!item.servico.id) {
        continue;
      }

      if (!servicosPorId.has(item.servico.id)) {
        servicosPorId.set(item.servico.id, {
          id: item.servico.id,
          nome: item.servico.tipo,
          valorBase: Number(item.servico.valorBase ?? 0),
        });
      }
    }

    return Array.from(servicosPorId.values()).sort((a, b) =>
      a.nome.localeCompare(b.nome),
    );
  },

  async enviarDocumento(
    solicitacaoId: number,
    tipoDocumento: string,
    arquivo: File,
  ): Promise<void> {
    const form = new FormData();
    form.append("tipo_documento", tipoDocumento);
    form.append("documento", arquivo);

    const res = await fetch(`${API_URL}/solicitacoes/${solicitacaoId}/documentos`, {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || "Erro ao enviar documento");
    }
  },
};
