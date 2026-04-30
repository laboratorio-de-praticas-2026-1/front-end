import type { FAQItem, FAQStatus } from "@/types/faq.types";
import { FAQ_MOCK_DATA } from "@/mocks/faq.mocks"; // Ajuste o caminho conforme sua estrutura

const API_URL = import.meta.env.VITE_API_URL || "https://despachante-bortone-release-production.up.railway.app";

let faqs = [...FAQ_MOCK_DATA];

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`Erro: ${response.status}`);
  }
  return response.json();
};

export const faqService = {
  // GET: Listar todas as perguntas
  listarTodos: async (): Promise<FAQItem[]> => {
    try {
      // Quando a API estiver pronta, basta descomentar as linhas abaixo:
      // const response = await fetch(`${API_URL}/faq`);
      // return await handleResponse(response);
      return new Promise((resolve) => {
        setTimeout(() => resolve(faqs), 500);
      });
    } catch (erro) {
      console.error('Erro ao listar FAQ:', erro);
      return [];
    }
  },

  // GET: Buscar por ID
  buscarPorId: async (id: string): Promise<FAQItem | null> => {
  try {

    await new Promise((resolve) => setTimeout(resolve, 500));
    const idLimpoParaBusca = id.replace("#", "");

    const item = faqs.find((f) => {
      const idMockLimpo = f.id.toString().replace("#", "");
      return idMockLimpo === idLimpoParaBusca;
    });

    return item || null;
  } catch (erro) {
    console.error('Erro ao buscar FAQ:', erro);
    return null;
  }
},

  // POST: Criar nova pergunta
  criar: async (
    data: Omit<FAQItem, 'id' | 'dataCriacao' | 'dataAtualizacao'>
  ): Promise<boolean> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const novoItem: FAQItem = {
        ...data,
        id: `#${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        dataCriacao: new Date().toLocaleDateString('pt-BR'),
        dataAtualizacao: new Date().toLocaleDateString('pt-BR'),
      };
      
      faqs.unshift(novoItem); // Adiciona no início da lista
      return true;
    } catch (erro) {
      console.error('Erro ao criar FAQ:', erro);
      return false;
    }
  },

  // PUT/PATCH: Atualizar pergunta existente
  atualizar: async (id: string, dados: Partial<FAQItem>): Promise<boolean> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

        const idParamLimpo = id.replace("#", "");

        const index = faqs.findIndex((f) => {
        const idMockLimpo = f.id.toString().replace("#", "");
        return idMockLimpo === idParamLimpo;
        });

        if (index === -1) {
        console.warn(`FAQ com id ${id} não encontrado para atualização.`);
        return false;
        }

        faqs[index] = {
        ...faqs[index],
        ...dados,
        dataAtualizacao: new Date().toLocaleDateString('pt-BR'),
        };
    
        return true; 
    } catch (erro) {
        console.error('Erro ao atualizar FAQ:', erro);
        return false;
        }
  },

  // DELETE: Remover pergunta
  excluir: async (id: string): Promise<boolean> => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const idParaRemover = id.replace("#", "");
    
    faqs = faqs.filter((f) => {
      const idMockLimpo = f.id.toString().replace("#", "");
      return idMockLimpo !== idParaRemover;
    });
    
    return true;
  } catch (erro) {
    console.error('Erro ao excluir FAQ:', erro);
    return false;
  }
  }
}