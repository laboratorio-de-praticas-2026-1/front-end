const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export type DocumentoStatus = 'validado' | 'aguardando_revisao' | 'negado';

export interface Documento {
  arquivo: string;
  tipo: string;
  status: DocumentoStatus;
}

export interface Solicitacao {
  id: string | number;
  cliente: string;
  servico: string;
  data: string;
  status: string;
  veiculo?: string;
  observacao?: string;
  documentos?: Documento[];
}

export interface ListaSolicitacoes {
  solicitacoes: Solicitacao[];
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`Erro: ${response.status}`);
  }
  return response.json();
};

export const solicitacoesService = {
  listarTodas: async (): Promise<Solicitacao[]> => {
    try {
      const response = await fetch(`${API_URL}/solicitacoes`);
      const data = await handleResponse(response);
      return data.solicitacoes || [];
    } catch (erro) {
      console.error('Erro ao listar solicitações:', erro);
      return [];
    }
  },

  buscarPorId: async (id: string | number): Promise<Solicitacao | null> => {
    try {
      const response = await fetch(`${API_URL}/solicitacoes/${id}`);
      if (response.status === 404) return null;
      return await handleResponse(response);
    } catch (erro) {
      console.error('Erro ao buscar solicitação:', erro);
      return null;
    }
  },

  atualizarStatus: async (
    id: string | number,
    novoStatus: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/solicitacoes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: novoStatus }),
      });
      if (!response.ok) return false;
      return true;
    } catch (erro) {
      console.error('Erro ao atualizar status:', erro);
      return false;
    }
  },

  enviarDocumento: async (
    id: string | number,
    tipoDocumento: string,
    arquivo: File
  ): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append('tipo_documento', tipoDocumento);
      formData.append('documento', arquivo);

      const response = await fetch(`${API_URL}/solicitacoes/${id}/documentos`, {
        method: 'POST',
        body: formData,
      });
      return response.ok;
    } catch (erro) {
      console.error('Erro ao enviar documento:', erro);
      return false;
    }
  },

  alterarStatusDocumento: async (
    id: string | number,
    arquivo: string,
    novoStatus: DocumentoStatus
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `${API_URL}/solicitacoes/${id}/documentos/${encodeURIComponent(arquivo)}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ statusValidacao: novoStatus }),
        }
      );
      return response.ok;
    } catch (erro) {
      console.error('Erro ao alterar status do documento:', erro);
      return false;
    }
  },

  downloadDocumento: async (
    id: string | number,
    arquivo: string
  ): Promise<string | null> => {
    try {
      const response = await fetch(
        `${API_URL}/solicitacoes/${id}/documentos/${encodeURIComponent(arquivo)}`
      );
      if (!response.ok) return null;
      return response.url;
    } catch (erro) {
      console.error('Erro ao baixar documento:', erro);
      return null;
    }
  },
};
