const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://despachante-bortone-release-production.up.railway.app";

export interface UsuarioAdmin {
  id: number;
  nome: string;
  email: string;
  nivel: "Administrador" | "Cliente" | "Nível 3";
  dataCadastro: Date;
}

type ApiUsuario = {
  id: number;
  nome: string;
  email: string;
  nivel?: "cliente" | "administrador";
  dataCadastro?: string;
  data_cadastro?: string;
};

const normalizeUsuario = (usuario: ApiUsuario): UsuarioAdmin => {
  const dataCadastroRaw = usuario.dataCadastro ?? usuario.data_cadastro;

  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    nivel: usuario.nivel === "administrador" ? "Administrador" : "Cliente",
    dataCadastro: dataCadastroRaw ? new Date(dataCadastroRaw) : new Date(0),
  };
};

const buildFiltroQuery = (filtros: {
  nivel?: string;
  dataCadastro?: Date;
}) => {
  const params = new URLSearchParams();

  if (filtros.nivel && filtros.nivel !== "all") {
    params.set("nivel_usuario", filtros.nivel.toLowerCase());
  }

  if (filtros.dataCadastro) {
    const ano = filtros.dataCadastro.getFullYear();
    const mes = String(filtros.dataCadastro.getMonth() + 1).padStart(2, "0");
    const dia = String(filtros.dataCadastro.getDate()).padStart(2, "0");
    params.set("data_cadastro", `${ano}-${mes}-${dia}`);
  }

  return params.toString();
};

export const usuarioService = {
  listarTodos: async (): Promise<UsuarioAdmin[]> => {
    try {
      const resposta = await fetch(`${API_URL}/busca/usuario/filtros`);

      if (!resposta.ok) throw new Error("Erro ao buscar usuários");

      const dados: ApiUsuario[] = await resposta.json();
      return dados.map(normalizeUsuario);
    } catch (erro) {
      console.error("Erro no listarTodos de usuários:", erro);
      return [];
    }
  },

  buscarPorFiltros: async (filtros: {
    nivel?: string;
    dataCadastro?: Date;
  }): Promise<UsuarioAdmin[]> => {
    try {
      const query = buildFiltroQuery(filtros);
      const url = query
        ? `${API_URL}/busca/usuario/filtros?${query}`
        : `${API_URL}/busca/usuario/filtros`;

      const resposta = await fetch(url);

      if (!resposta.ok) throw new Error("Erro ao buscar usuários por filtros");

      const dados: ApiUsuario[] = await resposta.json();
      return dados.map(normalizeUsuario);
    } catch (erro) {
      console.error("Erro no buscarPorFiltros de usuários:", erro);
      return [];
    }
  },
};
