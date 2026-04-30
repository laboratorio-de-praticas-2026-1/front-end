import type { FAQPublico } from "@/types/faqPublico.types";
import { FAQ_PUBLICO_MOCK } from "@/mocks/faqPublico.mocks";

const API_URL = import.meta.env.VITE_API_URL || "https://despachante-bortone-release-production.up.railway.app";

let faqs = [...FAQ_PUBLICO_MOCK];

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`Erro: ${response.status}`);
  }
  return response.json();
};

export const faqPublicoService = {
  async listarTodos(): Promise<FAQPublico[]> {
    try {
      // 🔥 quando tiver API:
      // const response = await fetch(`${API_URL}/faq`);
      // const data = await handleResponse(response);

      // mock
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 🔥 REGRA DA ISSUE
      return faqs.filter((faq) => faq.status === "Ativo");

    } catch (erro) {
      console.error("Erro ao listar FAQ público:", erro);
      return [];
    }
  }
};