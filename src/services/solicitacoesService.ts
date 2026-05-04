const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://backend-release-entrega-04-05-412027788376.southamerica-east1.run.app";

export type DocumentoStatus = "pendente" | "aprovado" | "rejeitado";

export interface Documento {
  id: number;
  arquivo: string;
  tipo: string;
  status: DocumentoStatus;
  url?: string;
  dataUpload?: string | null;
}

export interface Solicitacao {
  id: string | number;
  clienteId?: number;
  cliente: string;
  servicoId?: number | null;
  servico: string;
  valorBase?: number;
  data: string;
  dataConclusao?: string | null;
  status: string;
  veiculo?: string;
  observacao?: string;
  observacaoCliente?: string;
  documentos?: Documento[];
}

export interface FiltrosSolicitacoesAdmin {
  nome?: string;
  cpf_cnpj?: string;
  servico_id?: number;
  veiculo_id?: number;
  data_solicitacao_inicio?: string;
  data_solicitacao_fim?: string;
  data_conclusao_inicio?: string;
  data_conclusao_fim?: string;
  concluida?: boolean;
  orderBy?: string;
  order?: "asc" | "desc";
}

interface ApiCliente {
  id?: number;
  nome?: string;
  email?: string;
}

interface ApiServico {
  id?: number;
  tipo?: string;
  nome?: string;
  valorBase?: number | string | null;
}

interface ApiSolicitacaoInfo {
  id?: number;
  status?: string;
  observacaoCliente?: string | null;
  observacaoAdmin?: string | null;
  dataSolicitacao?: string;
  dataConclusao?: string | null;
}

interface ApiSolicitacaoItem {
  id?: number;
  protocolo?: string | null;
  cliente?: ApiCliente;
  servico?: ApiServico;
  solicitacao?: ApiSolicitacaoInfo;
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

interface ApiListResponse {
  total?: number;
  solicitacoes?: ApiSolicitacaoItem[];
}

interface ApiKanbanResponse {
  total?: number;
  solicitacoes?: Record<string, ApiSolicitacaoItem[]> | ApiSolicitacaoItem[];
}

type ApiErrorBody = {
  message?: string | string[];
  error?: string;
};

function buildQuery(
  params: Record<string, string | number | boolean | null | undefined>,
): string {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  }

  const qs = query.toString();
  return qs ? `?${qs}` : "";
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

    return (await response.text()) || fallback;
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

function normalizarTexto(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function normalizarStatus(status?: string): string {
  const valor = normalizarTexto(status ?? "").replace(/[\s-]+/g, "_");

  switch (valor) {
    case "recebido":
    case "em_andamento":
    case "aguardando_pagamento":
    case "aguardando_documento":
    case "concluido":
    case "cancelado":
      return valor;
    default:
      return "recebido";
  }
}

function formatarDataIso(data?: string): string {
  if (!data) return "";
  return data.split("T")[0] ?? data;
}

function mapDocumento(raw: ApiDocumento): Documento {
  return {
    id: raw.id,
    arquivo: raw.nome_arquivo || `Documento ${raw.id}`,
    tipo: raw.tipo_documento || "Documento",
    status: raw.status_validacao,
    url: raw.url,
    dataUpload: raw.data_upload,
  };
}

function mapListItem(raw: ApiSolicitacaoItem, index: number): Solicitacao {
  const solicitacao = raw.solicitacao ?? {};
  const servico = raw.servico ?? {};
  const cliente = raw.cliente ?? {};

  return {
    id: raw.id ?? solicitacao.id ?? index + 1,
    clienteId: cliente.id,
    cliente: cliente.nome ?? "",
    servicoId: servico.id ?? null,
    servico: servico.tipo ?? servico.nome ?? "",
    valorBase: Number(servico.valorBase ?? 0),
    data: formatarDataIso(solicitacao.dataSolicitacao),
    dataConclusao: solicitacao.dataConclusao ?? null,
    status: normalizarStatus(solicitacao.status),
    observacao: solicitacao.observacaoAdmin ?? "",
    observacaoCliente: solicitacao.observacaoCliente ?? "",
  };
}

function mapDetalhe(raw: ApiDetalheSolicitacao, documentos: Documento[]): Solicitacao {
  const veiculo = raw.veiculo
    ? [raw.veiculo.modelo, raw.veiculo.placa].filter(Boolean).join(" - ")
    : "";

  return {
    id: raw.id,
    clienteId: raw.usuario_id,
    cliente: raw.usuario?.nome ?? "",
    servicoId: raw.servico_id,
    servico: raw.servico?.nome ?? "",
    data: formatarDataIso(raw.data_solicitacao),
    dataConclusao: raw.data_conclusao,
    status: normalizarStatus(raw.status),
    veiculo,
    observacao: raw.observacao_admin ?? "",
    observacaoCliente: raw.observacao_cliente ?? "",
    documentos,
  };
}

function flattenKanban(data: ApiKanbanResponse): ApiSolicitacaoItem[] {
  if (Array.isArray(data.solicitacoes)) {
    return data.solicitacoes;
  }

  return Object.values(data.solicitacoes ?? {}).flat();
}

async function listarDocumentos(id: string | number): Promise<Documento[]> {
  const response = await fetch(`${API_URL}/solicitacoes/${id}/documentos`);
  if (response.status === 404) return [];

  const data = await handleJson<ApiDocumentosResponse>(
    response,
    "Erro ao listar documentos da solicitacao",
  );

  return (data.data ?? []).map(mapDocumento);
}

async function fallbackListarTodas(
  filtros: FiltrosSolicitacoesAdmin = {},
): Promise<Solicitacao[]> {
  const query = buildQuery({
    ...filtros,
    limit: 1000,
    orderBy: filtros.orderBy ?? "dataSolicitacao",
    order: filtros.order ?? "desc",
  });

  const response = await fetch(`${API_URL}/solicitacoes${query}`);
  const data = await handleJson<ApiListResponse>(
    response,
    "Erro ao listar solicitacoes",
  );

  return (data.solicitacoes ?? [])
    .map(mapListItem)
    .sort((a, b) => b.data.localeCompare(a.data));
}

export const solicitacoesService = {
  listarTodas: fallbackListarTodas,

  async listarKanban(
    filtros: FiltrosSolicitacoesAdmin = {},
  ): Promise<Solicitacao[]> {
    const query = buildQuery({
      ...filtros,
      orderBy: filtros.orderBy ?? "dataSolicitacao",
      order: filtros.order ?? "desc",
    });

    const response = await fetch(`${API_URL}/solicitacoes/kanban${query}`);
    if (response.status === 400 || response.status === 404) {
      return fallbackListarTodas(filtros);
    }

    const data = await handleJson<ApiKanbanResponse>(
      response,
      "Erro ao listar solicitacoes no kanban",
    );

    return flattenKanban(data)
      .map(mapListItem)
      .sort((a, b) => b.data.localeCompare(a.data));
  },

  async buscarPorId(id: string | number): Promise<Solicitacao | null> {
    try {
      const response = await fetch(`${API_URL}/solicitacoes/${id}`);
      if (response.status === 404) {
        const solicitacoes = await fallbackListarTodas();
        return solicitacoes.find((item) => String(item.id) === String(id)) ?? null;
      }

      const detalhe = await handleJson<ApiDetalheSolicitacao>(
        response,
        "Erro ao buscar solicitacao",
      );
      const documentos = await listarDocumentos(id).catch(() => []);

      return mapDetalhe(detalhe, documentos);
    } catch (erro) {
      console.error("Erro ao buscar solicitacao:", erro);
      return null;
    }
  },

  async atualizarStatus(
    id: string | number,
    novoStatus: string,
    observacaoAdmin?: string,
  ): Promise<boolean> {
    try {
      const payload: { status: string; observacaoAdmin?: string } = {
        status: novoStatus,
      };

      if (observacaoAdmin !== undefined) {
        payload.observacaoAdmin = observacaoAdmin;
      }

      const response = await fetch(`${API_URL}/solicitacoes/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      return response.ok;
    } catch (erro) {
      console.error("Erro ao atualizar status:", erro);
      return false;
    }
  },

  async cancelar(id: string | number): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/solicitacoes/${id}/cancelar`, {
        method: "POST",
      });

      if (response.status === 404) {
        return this.atualizarStatus(id, "cancelado");
      }

      return response.ok;
    } catch (erro) {
      console.error("Erro ao cancelar solicitacao:", erro);
      return false;
    }
  },

  async reabrir(id: string | number): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/solicitacoes/${id}/reabrir`, {
        method: "POST",
      });

      if (response.status === 404) {
        return this.atualizarStatus(id, "em_andamento");
      }

      return response.ok;
    } catch (erro) {
      console.error("Erro ao reabrir solicitacao:", erro);
      return false;
    }
  },

  async enviarDocumento(
    id: string | number,
    tipoDocumento: string,
    arquivo: File,
  ): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append("tipo_documento", tipoDocumento);
      formData.append("documento", arquivo);

      const response = await fetch(`${API_URL}/solicitacoes/${id}/documentos`, {
        method: "POST",
        body: formData,
      });

      return response.ok;
    } catch (erro) {
      console.error("Erro ao enviar documento:", erro);
      return false;
    }
  },

  async alterarStatusDocumento(
    id: string | number,
    documentoId: number,
    novoStatus: DocumentoStatus,
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${API_URL}/solicitacoes/${id}/documentos/${documentoId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: novoStatus }),
        },
      );

      return response.ok;
    } catch (erro) {
      console.error("Erro ao alterar status do documento:", erro);
      return false;
    }
  },

  async listarDocumentos(id: string | number): Promise<Documento[]> {
    return listarDocumentos(id);
  },

  async baixarRecibo(payload: { idSolicitacao: number }): Promise<Blob> {
    const response = await fetch(`${API_URL}/recibo/preview/download`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(await getApiErrorMessage(response, "Erro ao baixar recibo"));
    }

    return response.blob();
  },
};
