import type { FAQPublico } from "@/types/faqPublico.types";

const API_URL = import.meta.env.VITE_API_URL || "https://despachante-bortone-release-production.up.railway.app";

const CATEGORIA_LABEL: Record<string, string> = {
  documentacao: "Documentação",
  regularizacao: "Regularização",
  manutencao: "Manutenção",
  outros: "Outros",
  frequentes: "Frequentes",
};

interface FaqApiResponse {
  id: number;
  pergunta: string;
  resposta: string;
  categoria: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

function mapApiToFaqPublico(api: FaqApiResponse): FAQPublico {
  return {
    id: `#${api.id}`,
    pergunta: api.pergunta,
    resposta: api.resposta,
    categoria: CATEGORIA_LABEL[api.categoria] ?? api.categoria,
    status: api.status ? "Ativo" : "Inativo",
    dataCriacao: api.createdAt
      ? new Date(api.createdAt).toLocaleDateString("pt-BR")
      : "—",
    dataAtualizacao: api.updatedAt
      ? new Date(api.updatedAt).toLocaleDateString("pt-BR")
      : "—",
  };
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`Erro: ${response.status}`);
  }
  return response.json();
};

export const faqPublicoService = {
  async listarTodos(): Promise<FAQPublico[]> {
    try {
      const response = await fetch(`${API_URL}/faq`);
      const data: FaqApiResponse[] = await handleResponse(response);
      return data.map(mapApiToFaqPublico);
    } catch (erro) {
      console.error("Erro ao listar FAQ público:", erro);
      return [];
    }
  },
};