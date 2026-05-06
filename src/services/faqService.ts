import type { FAQItem, FAQCategoryOption } from "@/types/faq.types";

const API_URL = import.meta.env.VITE_API_URL || "https://despachante-bortone-release-production.up.railway.app";

const CATEGORIA_LABEL: Record<string, string> = {
  documentacao: "Documentação",
  regularizacao: "Regularização",
  manutencao: "Manutenção",
  outros: "Outros",
  frequentes: "Frequentes",
};

const CATEGORIA_ENUM: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORIA_LABEL).map(([key, val]) => [val, key])
);

interface FaqApiResponse {
  id: number;
  pergunta: string;
  resposta: string;
  categoria: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

function mapApiToFaqItem(api: FaqApiResponse): FAQItem {
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

function cleanId(id: string): string {
  return id.replace("#", "");
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Erro ${response.status}: ${body}`);
  }
  return response.json();
};

export const faqService = {
  // GET: Listar todas as perguntas
  listarTodos: async (): Promise<FAQItem[]> => {
    try {
      const response = await fetch(`${API_URL}/faq/admin`);
      const data: FaqApiResponse[] = await handleResponse(response);
      return data.map(mapApiToFaqItem);
    } catch (erro) {
      console.error("Erro ao listar FAQ:", erro);
      return [];
    }
  },

  // GET: Buscar por ID
  buscarPorId: async (id: string): Promise<FAQItem | null> => {
    try {
      const numericId = cleanId(id);
      const response = await fetch(`${API_URL}/faq/${numericId}`);
      const data: FaqApiResponse = await handleResponse(response);
      return mapApiToFaqItem(data);
    } catch (erro) {
      console.error("Erro ao buscar FAQ:", erro);
      return null;
    }
  },

  // POST: Criar nova pergunta
  criar: async (
    data: Omit<FAQItem, "id" | "dataCriacao" | "dataAtualizacao">
  ): Promise<boolean> => {
    try {
      const payload = {
        pergunta: data.pergunta,
        resposta: data.resposta,
        categoria: CATEGORIA_ENUM[data.categoria] ?? data.categoria.toLowerCase(),
        status: data.status === "Ativo",
      };

      const response = await fetch(`${API_URL}/faq/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      await handleResponse(response);
      return true;
    } catch (erro) {
      console.error("Erro ao criar FAQ:", erro);
      return false;
    }
  },

  // PUT/PATCH: Atualizar pergunta existente
  atualizar: async (id: string, dados: Partial<FAQItem>): Promise<boolean> => {
    try {
      const numericId = cleanId(id);

      const payload: Record<string, unknown> = {};
      if (dados.pergunta !== undefined) payload.pergunta = dados.pergunta;
      if (dados.resposta !== undefined) payload.resposta = dados.resposta;
      if (dados.categoria !== undefined)
        payload.categoria = CATEGORIA_ENUM[dados.categoria] ?? dados.categoria.toLowerCase();
      if (dados.status !== undefined)
        payload.status = dados.status === "Ativo";

      const response = await fetch(`${API_URL}/faq/admin/${numericId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      await handleResponse(response);
      return true;
    } catch (erro) {
      console.error("Erro ao atualizar FAQ:", erro);
      return false;
    }
  },

  // DELETE: Remover pergunta
  excluir: async (id: string): Promise<boolean> => {
    try {
      const numericId = cleanId(id);

      const response = await fetch(`${API_URL}/faq/admin/${numericId}`, {
        method: "DELETE",
      });

      await handleResponse(response);
      return true;
    } catch (erro) {
      console.error("Erro ao excluir FAQ:", erro);
      return false;
    }
  },

  // GET: Listar categorias da API
  listarCategorias: async (): Promise<FAQCategoryOption[]> => {
    try {
      const response = await fetch(`${API_URL}/faq/categorias`);
      const categorias: string[] = await handleResponse(response);
      return categorias.map((cat) => ({
        value: CATEGORIA_LABEL[cat] ?? cat,
        label: CATEGORIA_LABEL[cat] ?? cat,
      }));
    } catch (erro) {
      console.error("Erro ao listar categorias:", erro);
      return [];
    }
  },
};