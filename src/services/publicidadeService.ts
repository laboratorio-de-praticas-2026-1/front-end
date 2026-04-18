const API_URL = import.meta.env.VITE_API_URL || "https://despachante-bortone-release-production.up.railway.app";

export interface PublicidadePost {
  id: number;
  titulo: string;
  conteudo: string;
  imagem?: string; // caso venha sem foto
}

type ApiPublicidadePost = {
  id: number;
  titulo: string;
  conteudo: string;
  imagem?: string;
  urlImagem?: string;
};

const normalizeImageUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

const normalizePost = (post: ApiPublicidadePost): PublicidadePost => {
  return {
    ...post,
    imagem: normalizeImageUrl(post.imagem || post.urlImagem),
  };
};

export const publicidadeService = {
  // 1. GET /publicidade - Lista todos
  listarTodos: async (): Promise<PublicidadePost[]> => {
    try {
      const resposta = await fetch(`${API_URL}/publicidade`);
      if (!resposta.ok) throw new Error("Erro ao buscar publicidades");
      
      const dados: ApiPublicidadePost[] = await resposta.json();
      return dados.map(normalizePost);
    } catch (erro) {
      console.error("Erro no listarTodos:", erro);
      return [];
    }
  },

  // 2. GET /publicidade/{id} - Busca um específico
  buscarPorId: async (id: number): Promise<PublicidadePost | null> => {
    try {
      const resposta = await fetch(`${API_URL}/publicidade/${id}`);
      if (!resposta.ok) throw new Error("Erro ao buscar a publicidade");
      
      const dados: ApiPublicidadePost = await resposta.json();
      return normalizePost(dados);
    } catch (erro) {
      console.error("Erro no buscarPorId:", erro);
      return null;
    }
  },

  // 3. GET /busca/publicidade/status?status={status} - Busca por status
  buscarPorStatus: async (status: string): Promise<PublicidadePost[]> => {
    try {
      const resposta = await fetch(
        `${API_URL}/busca/publicidade/status?status=${encodeURIComponent(status)}`
      );
      if (!resposta.ok) throw new Error("Erro ao buscar publicidades por status");

      const dados: ApiPublicidadePost[] = await resposta.json();
      return dados.map(normalizePost);
    } catch (erro) {
      console.error("Erro no buscarPorStatus:", erro);
      return [];
    }
  },


  // 4. POST /publicidade - Cria novo
  criar: async (dadosDoFormulario: FormData) => {
    try {
      const resposta = await fetch(`${API_URL}/publicidade`, {
        method: "POST",
        body: dadosDoFormulario, 
      });

      if (!resposta.ok) {
        const motivoDoErro = await resposta.text();
        console.error(`O Servidor recusou (Status ${resposta.status}). Motivo:`, motivoDoErro);
        throw new Error("Erro ao criar publicidade");
      }
      
      const dados: ApiPublicidadePost = await resposta.json();
      return normalizePost(dados);
    } catch (erro) {
      console.error("Erro no criar:", erro);
      throw erro;
    }
  },

  // 5. PUT /publicidade/{id} - Atualiza existente
  atualizar: async (id: number, dadosDoFormulario: FormData) => {
    try {
      let resposta = await fetch(`${API_URL}/publicidade/${id}`, {
        method: "GET",
      });

      if (resposta.status != 404) {
        resposta = await fetch(`${API_URL}/publicidade/${id}`, {
          method: "PUT",
          body: dadosDoFormulario,
        });
      }

      if (resposta.status == 400) {
        const motivoDoErro = await resposta.text();
        console.error(`O Servidor recusou update (Status ${resposta.status}). Motivo:`, motivoDoErro);
        throw new Error("Erro ao atualizar publicidade");
      }

      if (resposta.status === 204) {
        return null;
      }

      const dados: ApiPublicidadePost = await resposta.json();
      return normalizePost(dados);
    } catch (erro) {
      console.error("Erro no atualizar:", erro);
      throw erro;
    }
  },

  // 6. DELETE /publicidade/{id} - Exclui
  deletar: async (id: number) => {
    try {
      const resposta = await fetch(`${API_URL}/publicidade/${id}`, {
        method: "DELETE",
      });

      if (!resposta.ok) throw new Error("Erro ao excluir publicidade");
      return true; 
    } catch (erro) {
      console.error("Erro no deletar:", erro);
      throw erro;
    }
  }
};
