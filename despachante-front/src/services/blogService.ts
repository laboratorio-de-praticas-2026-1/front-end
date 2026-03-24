const API_URL = import.meta.env.VITE_API_URL || "https://despachante-bortone-release-production.up.railway.app";

export interface BlogPost {
  id: number;
  titulo: string;
  conteudo: string;
  dataPublicacao: string;
  imagem?: string; // Opcional, caso o post venha sem foto
}

export const blogService = {
  // 1. GET /blog - Lista todos os posts
  listarTodos: async (): Promise<BlogPost[]> => {
    try {
      const resposta = await fetch(`${API_URL}/blog`);
      if (!resposta.ok) throw new Error("Erro ao buscar posts");
      
      return await resposta.json();
    } catch (erro) {
      console.error("Erro no listarTodos:", erro);
      return []; // Retorna um array vazio para não quebrar a tela do usuário
    }
  },

  // 2. GET /blog/{id} - Busca apenas um post específico
  buscarPorId: async (id: number): Promise<BlogPost | null> => {
    try {
      const resposta = await fetch(`${API_URL}/blog/${id}`);
      if (!resposta.ok) throw new Error("Erro ao buscar o post");
      
      return await resposta.json();
    } catch (erro) {
      console.error("Erro no buscarPorId:", erro);
      return null;
    }
  },

  // 3. POST /blog - Cria um novo post
  // Recebe FormData porque tem envio de imagem ($binary)
  criar: async (dadosDoFormulario: FormData) => {
    try {
      const resposta = await fetch(`${API_URL}/blog`, {
        method: "POST",
        body: dadosDoFormulario, 
        // Não usamos "Content-Type" manual aqui, o navegador gerencia isso para arquivos
      });

      if (!resposta.ok) throw new Error("Erro ao criar post");
      return await resposta.json();
    } catch (erro) {
      console.error("Erro no criar:", erro);
      throw erro;
    }
  },

  // 4. PUT /blog/{id} - Atualiza um post existente
  atualizar: async (id: number, dadosDoFormulario: FormData) => {
    try {
      const resposta = await fetch(`${API_URL}/blog/${id}`, {
        method: "PUT",
        body: dadosDoFormulario,
      });

      if (!resposta.ok) throw new Error("Erro ao atualizar post");
      return await resposta.json();
    } catch (erro) {
      console.error("Erro no atualizar:", erro);
      throw erro;
    }
  },

  // 5. DELETE /blog/{id} - Exclui um post
  deletar: async (id: number) => {
    try {
      const resposta = await fetch(`${API_URL}/blog/${id}`, {
        method: "DELETE",
      });

      if (!resposta.ok) throw new Error("Erro ao excluir post");
      return true; 
    } catch (erro) {
      console.error("Erro no deletar:", erro);
      throw erro;
    }
  }
};