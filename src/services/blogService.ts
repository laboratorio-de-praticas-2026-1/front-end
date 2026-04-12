const API_URL = import.meta.env.VITE_API_URL || "https://despachante-bortone-release-production.up.railway.app";

export interface BlogPost {
  id: number;
  titulo: string;
  conteudo: string;
  dataPublicacao: string;
  imagem?: string; // caso o post venha sem foto
}

type ApiBlogPost = {
  id: number;
  titulo: string;
  conteudo: string;
  dataPublicacao: string;
  imagem?: string;
  urlImagem?: string;
};

const normalizeImageUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

const normalizePost = (post: ApiBlogPost): BlogPost => {
  return {
    ...post,
    imagem: normalizeImageUrl(post.imagem || post.urlImagem),
  };
};

export const blogService = {
  // 1. GET /blog - Lista todos os posts
  listarTodos: async (): Promise<BlogPost[]> => {
    try {
      const resposta = await fetch(`${API_URL}/blog`);
      if (!resposta.ok) throw new Error("Erro ao buscar posts");
      
      const dados: ApiBlogPost[] = await resposta.json();
      return dados.map(normalizePost);
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
      
      const dados: ApiBlogPost = await resposta.json();
      return normalizePost(dados);
    } catch (erro) {
      console.error("Erro no buscarPorId:", erro);
      return null;
    }
  },

// 3. POST /blog - Cria um novo post
  criar: async (dadosDoFormulario: FormData) => {
    try {
      const resposta = await fetch(`${API_URL}/blog`, {
        method: "POST",
        body: dadosDoFormulario, 
      });

      // Se o servidor recusar, vamos ler o que ele disse!
      if (!resposta.ok) {
        const motivoDoErro = await resposta.text();
        console.error(`O Servidor recusou (Status ${resposta.status}). Motivo:`, motivoDoErro);
        throw new Error("Erro ao criar post");
      }
      
      const dados: ApiBlogPost = await resposta.json();
      return normalizePost(dados);
    } catch (erro) {
      console.error("Erro no criar:", erro);
      throw erro;
    }
  },

  // 4. PATCH/PUT /blog/{id} - Atualiza um post existente
  atualizar: async (id: number, dadosDoFormulario: FormData) => {
    try {
      let resposta = await fetch(`${API_URL}/blog/${id}`, {
        method: "GET",
      });

      if (resposta.status != 404) {
        resposta = await fetch(`${API_URL}/blog/${id}`, {
          method: "PUT",
          body: dadosDoFormulario,
        });
      }

      if (resposta.status == 400) {
        const motivoDoErro = await resposta.text();
        console.error(`O Servidor recusou update (Status ${resposta.status}). Motivo:`, motivoDoErro);
        throw new Error("Erro ao atualizar post");
      }

      if (resposta.status === 204) {
        return null;
      }

      const dados: ApiBlogPost = await resposta.json();
      return normalizePost(dados);
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