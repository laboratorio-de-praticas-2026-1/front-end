const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error("VITE_API_URL não está definido no ambiente");
}

const buildDashboardUrl = (
  endpoint: string,
  dataInicio?: Date,
  dataFim?: Date,
) => {
  const queryParams = new URLSearchParams();
  if (dataInicio) {
    queryParams.set("inicio", dataInicio.toISOString());
  }

  if (dataFim) {
    queryParams.set("fim", dataFim.toISOString());
  }

  const query = queryParams.toString();
  return `${API_URL}${endpoint}${query ? `?${query}` : ""}`;
};

const fetchDashboardData = async <T>(
  endpoint: string,
  erroBusca: string,
  erroProcessamento: string,
  dataInicio?: Date,
  dataFim?: Date,
) => {
  try {
    const response = await fetch(
      buildDashboardUrl(endpoint, dataInicio, dataFim),
    );

    if (!response.ok) {
      throw new Error(erroBusca);
    }

    const result = await response.json();
    return result as T;
  } catch (error) {
    console.error(erroBusca, error);
    throw new Error(erroProcessamento);
  }
};

export interface DashboardGeralResponse {
  solicitacoesEmAberto: number;
  solicitacoesConcluidas: number;
  documentosPendentesValidacao: number;
  clientesNovosMesAtual: number;
  taxaCancelamentoPct: number;
  debitosEmAberto: {
    quantidade: number;
    valorTotal: number;
    listaDetalhada: {
      id: number;
      nomeCliente: string;
      nomeServico: string;
      valor: number;
    }[];
  };
  parcelasVencidasNaoPagas: {
    quantidade: number;
    valorTotal: number;
  };
}

export interface DashboardVeiculosResponse {
  totalCadastrados: number;
  comSolicitacaoAtiva: number;
  comDebitoPendente: number;
  debitosPendentes: {
    valorTotal: number;
    porVeiculo: {
      veiculoId: number;
      placa: string;
      totalDebitos: number;
      valorTotal: number;
    }[];
  };
}

export interface DashboardServicosResponse {
  ativos: number;
  pausados: number;
  maisSolicitados: {
    servicoId: number;
    nome: string;
    totalSolicitacoes: number;
  }[];
  receitaPorServicoCompleto: {
    servicoId: number;
    nome: string;
    totalSolicitacoes: number;
    receitaTotal: number;
  }[];
}

export interface DashboardFinanceiroResponse {
  receitaRealizada: number;
  receitaPendente: number;
  receitaTaxa: number;
  ticketMedio: number;
  mediaMensalReceita: number;
  historicoMensal: {
    mes: string;
    receitaRealizada: number;
  }[];
  inadimplencia: {
    valorTotal: number;
    quantidadePagamentos: number;
    quantidadeParcelas: number;
  };
  previsaoCaixa30Dias: {
    valorTotal: number;
    quantidadeParcelas: number;
  };
  porMetodoPagamento: {
    metodo: string;
    quantidade: number;
    valorTotal: number;
  }[];
  porTipoPagamento: {
    tipo: string;
    quantidade: number;
    valorTotal: number;
  }[];
}

export interface DashboardDocumentosResponse {
  pendentes: number;
  aprovados: number;
  rejeitados: number;
  solicitacoesTravadas: number;
  rejeicoesPorTipo: {
    tipoDocumento: string;
    totalRejeitados: number;
  }[];
}

export interface DashboardClientesResponse {
  topPorVolume: {
    usuarioId: number;
    nome: string;
    totalSolicitacoes: number;
  }[];
  topPorValorPago: {
    usuarioId: number;
    nome: string;
    valorTotalPago: number;
  }[];
  comParcelasEmAtraso: {
    usuarioId: number;
    nome: string;
    quantidadeParcelasAtrasadas: number;
    valorTotalAtrasado: number;
  }[];
}

export interface DashboardSolicitacoesResponse {
  porStatus: {
    recebido: number;
    emAndamento: number;
    aguardandoPagamento: number;
    aguardandoDocumento: number;
    concluido: number;
    cancelado: number;
  };
  proximasDeVencer: {
    quantidade: number;
  };
  tempoConclusaoPorServico: {
    servicoId: number;
    servicoNome: string;
    prazoEstimadoDias: number;
    mediaRealDias: number;
    totalConcluidas: number;
  }[];
  foraDoPrazo: {
    quantidade: number;
    totalConcluidas: number;
    percentual: number;
  };
}

export const dashboardService = {
  async getGeral(dataInicio?: Date, dataFim?: Date) {
    return fetchDashboardData<DashboardGeralResponse>(
      "/dashboard",
      "Erro ao buscar dados gerais",
      "Erro ao processar dados gerais do dashboard. Tente recarregar a página.",
      dataInicio,
      dataFim,
    );
  },

  async getSolicitacoes(dataInicio?: Date, dataFim?: Date) {
    return fetchDashboardData<DashboardSolicitacoesResponse>(
      "/dashboard/solicitacoes",
      "Erro ao buscar dados de solicitações",
      "Erro ao processar dados de solicitações do dashboard. Tente recarregar a página.",
      dataInicio,
      dataFim,
    );
  },

  async getVeiculos() {
    try {
      const response = await fetch(`${API_URL}/dashboard/veiculos`);
      if (!response.ok) {
        throw new Error("Erro ao buscar dados de veículos");
      }
      const result = await response.json();
      return result as DashboardVeiculosResponse;
    } catch (error) {
      console.error("Erro ao buscar dados de veículos", error);
      throw new Error(
        "Erro ao processar dados de veículos do dashboard. Tente recarregar a página.",
      );
    }
  },

  async getServicos(dataInicio?: Date, dataFim?: Date) {
    return fetchDashboardData<DashboardServicosResponse>(
      "/dashboard/servicos",
      "Erro ao buscar dados de serviços",
      "Erro ao processar dados de serviços do dashboard. Tente recarregar a página.",
      dataInicio,
      dataFim,
    );
  },

  async getFinanceiro(dataInicio?: Date, dataFim?: Date) {    
    return fetchDashboardData<DashboardFinanceiroResponse>(
      "/dashboard/financeiro",
      "Erro ao buscar dados financeiros",
      "Erro ao processar dados financeiros do dashboard. Tente recarregar a página.",
      dataInicio,
      dataFim,
    );
  },

  async getDocumentos(dataInicio?: Date, dataFim?: Date) {
    return fetchDashboardData<DashboardDocumentosResponse>(
      "/dashboard/documentos",
      "Erro ao buscar dados de documentos",
      "Erro ao processar dados de documentos do dashboard. Tente recarregar a página.",
      dataInicio,
      dataFim,
    );
  },

  async getClientes(dataInicio?: Date, dataFim?: Date) {    
    return fetchDashboardData<DashboardClientesResponse>(
      "/dashboard/clientes",
      "Erro ao buscar dados de clientes",
      "Erro ao processar dados de clientes do dashboard. Tente recarregar a página.",
      dataInicio,
      dataFim,
    );
  },
};
