const API_URL = import.meta.env.VITE_API_URL || "https://despachante-bortone-release-production.up.railway.app";

export interface PublicidadePost {
  id: number;
  titulo: string;
  conteudo: string;
  imagem?: string; // caso venha sem foto
  ativo?: boolean;
}

type ApiPublicidadePost = {
  id: number;
  titulo: string;
  conteudo: string;
  title?: string;
  content?: string;
  imagem?: string;
  urlImagem?: string;
  ativo?: boolean;
};

type BuscaTermoResponse = {
  itens: ApiPublicidadePost[];
  mensagem?: string;
};

type ListaPublicidadeResponse = ApiPublicidadePost[] | BuscaTermoResponse;

const normalizarTextoBusca = (valor: string): string =>
  valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const filtrarPublicidadePorTermo = (
  publicidades: PublicidadePost[],
  termo?: string,
): PublicidadePost[] => {
  const termoNormalizado = termo ? normalizarTextoBusca(termo.trim()) : "";
  if (!termoNormalizado) return publicidades;

  return publicidades.filter((item) => {
    const titulo = normalizarTextoBusca(item.titulo || "");
    const conteudo = normalizarTextoBusca(item.conteudo || "");
    const imagem = normalizarTextoBusca(item.imagem || "");
    const id = String(item.id);

    return (
      titulo.includes(termoNormalizado) ||
      conteudo.includes(termoNormalizado) ||
      imagem.includes(termoNormalizado) ||
      id.includes(termoNormalizado)
    );
  });
};

const normalizeImageUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

const normalizePost = (post: ApiPublicidadePost): PublicidadePost => {
  const tituloNormalizado = (post.titulo || post.title || "").trim();
  const conteudoNormalizado = (post.conteudo || post.content || "").trim();

  return {
    id: post.id,
    titulo: tituloNormalizado || "Sem titulo",
    conteudo: conteudoNormalizado,
    ativo: post.ativo,
    imagem: normalizeImageUrl(post.imagem || post.urlImagem),
  };
};

const extractItens = (dados: ListaPublicidadeResponse): ApiPublicidadePost[] => {
  if (Array.isArray(dados)) {
    return dados;
  }

  if (dados && Array.isArray(dados.itens)) {
    return dados.itens;
  }

  return [];
};

export const publicidadeService = {
  buscarPorTermo: async (termo?: string): Promise<PublicidadePost[]> => {
    try {
      const termoNormalizado = termo?.trim();
      // A busca de publicidade do backend nem sempre considera titulo,
      // então usamos a lista completa e filtramos localmente para garantir consistencia.
      const todasPublicidades = await publicidadeService.listarTodos();
      if (!termoNormalizado) {
        return todasPublicidades;
      }

      return filtrarPublicidadePorTermo(todasPublicidades, termoNormalizado);
    } catch (erro) {
      console.error("Erro no buscarPorTermo:", erro);
      return [];
    }
  },

  // 1. GET /publicidade - Lista todos
  listarTodos: async (): Promise<PublicidadePost[]> => {
    try {
      const resposta = await fetch(`${API_URL}/publicidade`);
      if (!resposta.ok) throw new Error("Erro ao buscar publicidades");

      const dados: ListaPublicidadeResponse = await resposta.json();
      const itens = extractItens(dados);
      return itens.map(normalizePost);
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

  // 3. POST /publicidade - Cria novo
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

  // 4. PUT /publicidade/{id} - Atualiza existente
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

  // 5. DELETE /publicidade/{id} - Exclui
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
