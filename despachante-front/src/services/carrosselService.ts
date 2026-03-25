const API_URL = import.meta.env.VITE_API_URL || "https://despachante-bortone-release-production.up.railway.app";

export interface CarouselBanner {
  id: number;
  urlImagem: string;
  descricao: string;
  ativo: boolean;
}

export const carouselService = {
  // 1. GET /carrossel - Lista todos os banners
  listarTodos: async (): Promise<CarouselBanner[]> => {
    try {
      const resposta = await fetch(`${API_URL}/header`);
      if (!resposta.ok) throw new Error("Erro ao buscar banners");
      
      return await resposta.json();
    } catch (erro) {
      console.error("Erro no listarTodos:", erro);
      return []; // Retorna um array vazio para não quebrar a tela do usuário
    }
  },

  // 2. GET /carrossel/{id} - Busca apenas um banner específico
  buscarPorId: async (id: number): Promise<CarouselBanner | null> => {
    try {
      const resposta = await fetch(`${API_URL}/header/${id}`);
      if (!resposta.ok) throw new Error("Erro ao buscar o banner");
      
      return await resposta.json();
    } catch (erro) {
      console.error("Erro no buscarPorId:", erro);
      return null;
    }
  },

// 3. POST /carrossel - Cria um novo banner
  criar: async (dadosDoFormulario: FormData) => {
    try {
      const resposta = await fetch(`${API_URL}/header`, {
        method: "POST",
        body: dadosDoFormulario, 
      });

      // Se o servidor recusar, vamos ler o que ele disse!
      if (!resposta.ok) {
        const motivoDoErro = await resposta.text();
        console.error(`O Servidor recusou (Status ${resposta.status}). Motivo:`, motivoDoErro);
        throw new Error("Erro ao criar banner");
      }
      
      return await resposta.json();
    } catch (erro) {
      console.error("Erro no criar:", erro);
      throw erro;
    }
  },
  
  // 4. PUT /carrossel/{id} - Atualiza um banner existente
  atualizar: async (id: number, dadosDoFormulario: FormData) => {
    try {
      const resposta = await fetch(`${API_URL}/header/${id}`, {
        method: "PATCH",
        body: dadosDoFormulario,
      });

      if (!resposta.ok) throw new Error("Erro ao atualizar banner");
      return await resposta.json();
    } catch (erro) {
      console.error("Erro no atualizar:", erro);
      throw erro;
    }
  },

  // 5. DELETE /carrossel/{id} - Exclui um banner
  deletar: async (id: number) => {
    try {
      const resposta = await fetch(`${API_URL}/header/${id}`, {
        method: "DELETE",
      });

      if (!resposta.ok) throw new Error("Erro ao excluir banner");
      return true; 
    } catch (erro) {
      console.error("Erro no deletar:", erro);
      throw erro;
    }
  }
};