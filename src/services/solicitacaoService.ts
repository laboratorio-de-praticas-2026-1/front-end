const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://backend-release-entrega-04-05-412027788376.southamerica-east1.run.app";

export type StatusSolicitacao =
  | "recebido"
  | "em_andamento"
  | "aguardando_pagamento"
  | "aguardando_documento"
  | "concluido"
  | "cancelado";

export type DocumentoStatus = "pendente" | "aprovado" | "rejeitado";

export interface DocumentoSolicitacao {
  id: number;
  arquivo: string;
  tipo: string;
  status: DocumentoStatus;
  url?: string;
  dataUpload?: string | null;
}

export interface SolicitacaoResumo {
  id: number;
  clienteId: number;
  clienteNome?: string;
  servicoId: number | null;
  protocolo: string | null;
  servico: string;
  valorBase: number;
  dataSolicitacao: Date;
  dataConclusao: Date | null;
  status: StatusSolicitacao;
  observacaoCliente: string;
  observacaoAdmin: string;
  veiculo?: string;
  documentos?: DocumentoSolicitacao[];
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

export interface CriarReciboPayload {
  idSolicitacao: number;
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
  prazoEstimadoDias?: number;
  ativo?: boolean;
  exigeVeiculo?: boolean;
}

interface ApiServicoItem {
  id: number;
  nome?: string;
  tipo?: string;
  valorBase?: number | string | null;
  prazoEstimadoDias?: number;
  ativo?: boolean;
  exigeVeiculo?: boolean;
}

interface ApiSolicitacaoItem {
  id?: number;
  protocolo?: string | null;
  cliente?: {
    id?: number;
    nome?: string;
    email?: string;
  };
  servico?: {
    id?: number;
    tipo?: string;
    nome?: string;
    valorBase?: number | string | null;
  };
  solicitacao?: {
    id?: number;
    status?: string;
    observacaoCliente?: string | null;
    observacaoAdmin?: string | null;
    dataSolicitacao?: string;
    dataConclusao?: string | null;
  };
}

interface ApiListSolicitacoesResponse {
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  solicitacoes?: ApiSolicitacaoItem[];
}

interface ApiDetalheSolicitacao {
  id: number;
  usuario_id: number;
  veiculo_id: number | null;
  servico_id: number;
  status: string;
  observacao_cliente: string | null;
  observacao_admin: string | null;
  data_solicitacao: string;
  data_conclusao: string | null;
  usuario?: {
    id: number;
    nome: string;
    cpf_cnpj?: string | null;
  };
  veiculo?: {
    id: number;
    modelo?: string | null;
    placa?: string | null;
  } | null;
  servico?: {
    id: number;
    nome: string;
  };
}

interface ApiDocumento {
  id: number;
  tipo_documento: string | null;
  nome_arquivo: string;
  status_validacao: DocumentoStatus;
  url: string;
  data_upload: string | null;
}

interface ApiDocumentosResponse {
  data?: ApiDocumento[];
  total?: number;
  message?: string;
}

type ApiErrorBody = {
  message?: string | string[];
  error?: string;
};

function normalizarTexto(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function normalizarStatus(status?: string): StatusSolicitacao {
  const valor = normalizarTexto(status ?? "").replace(/[\s-]+/g, "_");

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

function buildQuery(
  params: Record<string, string | number | boolean | null | undefined>,
): string {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  }

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

async function getApiErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const body = (await response.json()) as ApiErrorBody;
      if (Array.isArray(body.message)) return body.message.join(", ");
      return body.message || body.error || fallback;
    }

    const text = await response.text();
    return text || fallback;
  } catch {
    return fallback;
  }
}

async function handleJson<T>(response: Response, fallback: string): Promise<T> {
  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, fallback));
  }

  return response.json() as Promise<T>;
}

function toDate(data?: string): Date {
  const parsed = data ? new Date(data) : new Date("");
  return parsed;
}

function mapDocumento(raw: ApiDocumento): DocumentoSolicitacao {
  return {
    id: raw.id,
    arquivo: raw.nome_arquivo || `Documento ${raw.id}`,
    tipo: raw.tipo_documento || "Documento",
    status: raw.status_validacao,
    url: raw.url,
    dataUpload: raw.data_upload,
  };
}

function mapApiSolicitacao(
  raw: ApiSolicitacaoItem,
  index: number,
): SolicitacaoResumo {
  const cliente = raw.cliente ?? {};
  const servico = raw.servico ?? {};
  const solicitacao = raw.solicitacao ?? {};

  return {
    id: raw.id ?? solicitacao.id ?? index + 1,
    clienteId: cliente.id ?? 0,
    clienteNome: cliente.nome ?? "",
    servicoId: servico.id ?? null,
    protocolo: raw.protocolo ?? null,
    servico: servico.tipo ?? servico.nome ?? "",
    valorBase: Number(servico.valorBase ?? 0),
    dataSolicitacao: toDate(solicitacao.dataSolicitacao),
    dataConclusao: solicitacao.dataConclusao
      ? toDate(solicitacao.dataConclusao)
      : null,
    status: normalizarStatus(solicitacao.status),
    observacaoCliente: solicitacao.observacaoCliente ?? "",
    observacaoAdmin: solicitacao.observacaoAdmin ?? "",
  };
}

function mapDetalheSolicitacao(
  raw: ApiDetalheSolicitacao,
  documentos: DocumentoSolicitacao[],
): SolicitacaoResumo {
  const veiculo = raw.veiculo
    ? [raw.veiculo.modelo, raw.veiculo.placa].filter(Boolean).join(" - ")
    : "";

  return {
    id: raw.id,
    clienteId: raw.usuario_id,
    clienteNome: raw.usuario?.nome ?? "",
    servicoId: raw.servico_id,
    protocolo: null,
    servico: raw.servico?.nome ?? "",
    valorBase: 0,
    dataSolicitacao: toDate(raw.data_solicitacao),
    dataConclusao: raw.data_conclusao ? toDate(raw.data_conclusao) : null,
    status: normalizarStatus(raw.status),
    observacaoCliente: raw.observacao_cliente ?? "",
    observacaoAdmin: raw.observacao_admin ?? "",
    veiculo,
    documentos,
  };
}

function estaDentroDoIntervalo(
  data: Date,
  dataInicio?: string,
  dataFim?: string,
): boolean {
  if (Number.isNaN(data.getTime())) {
    return false;
  }

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
      solicitacao.clienteNome ?? "",
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

async function listarDocumentos(
  solicitacaoId: number | string,
): Promise<DocumentoSolicitacao[]> {
  const res = await fetch(`${API_URL}/solicitacoes/${solicitacaoId}/documentos`);
  if (res.status === 404) return [];

  const data = await handleJson<ApiDocumentosResponse>(
    res,
    "Erro ao listar documentos",
  );

  return (data.data ?? []).map(mapDocumento);
}

export const solicitacaoService = {
  async listar(
    filtros: FiltrosSolicitacoes = {},
  ): Promise<ListaSolicitacoesResponse> {
    const query = buildQuery({
      usuario_id: filtros.usuario_id,
      status_in: filtros.status,
      data_solicitacao_inicio: filtros.dataInicio,
      data_solicitacao_fim: filtros.dataFim,
      limit: 1000,
      orderBy: "dataSolicitacao",
      order: "desc",
    });

    const res = await fetch(`${API_URL}/solicitacoes${query}`);
    if (!res.ok) {
      throw new Error(await getApiErrorMessage(res, "Erro ao listar solicitacoes"));
    }

    const data = (await res.json()) as ApiListSolicitacoesResponse;
    const solicitacoes = (data.solicitacoes ?? [])
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

  async buscarPorId(
    id: number | string,
    filtros: FiltrosSolicitacoes = {},
  ): Promise<SolicitacaoResumo | null> {
    const res = await fetch(`${API_URL}/solicitacoes/${id}`);

    if (res.status !== 404) {
      const detalhe = await handleJson<ApiDetalheSolicitacao>(
        res,
        "Erro ao buscar solicitacao",
      );
      const documentos = await listarDocumentos(id).catch(() => []);
      return mapDetalheSolicitacao(detalhe, documentos);
    }

    const data = await this.listar(filtros);
    return (
      data.solicitacoes.find((solicitacao) => solicitacao.id === Number(id)) ??
      null
    );
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
      throw new Error(await getApiErrorMessage(res, "Erro ao criar solicitacao"));
    }

    return res.json() as Promise<CreateSolicitacaoResponse>;
  },

  async baixarRecibo(payload: CriarReciboPayload): Promise<Blob> {
    const res = await fetch(`${API_URL}/recibo/preview/download`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(await getApiErrorMessage(res, "Erro ao baixar recibo"));
    }

    return res.blob();
  },

  async listarServicosDisponiveis(): Promise<ServicoDisponivel[]> {
    const res = await fetch(`${API_URL}/servicos`);
    if (!res.ok) {
      throw new Error(await getApiErrorMessage(res, "Erro ao listar servicos"));
    }

    const data = (await res.json()) as ApiServicoItem[];

    return data
      .filter((servico) => servico.ativo !== false)
      .map((servico) => ({
        id: servico.id,
        nome: servico.nome ?? servico.tipo ?? `Servico ${servico.id}`,
        valorBase: Number(servico.valorBase ?? 0),
        prazoEstimadoDias: servico.prazoEstimadoDias,
        ativo: servico.ativo,
        exigeVeiculo: servico.exigeVeiculo,
      }))
      .sort((a, b) => a.nome.localeCompare(b.nome));
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
      throw new Error(await getApiErrorMessage(res, "Erro ao enviar documento"));
    }
  },

  listarDocumentos,
};
