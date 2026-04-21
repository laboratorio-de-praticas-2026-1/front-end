const API_URL = import.meta.env.VITE_API_URL || "https://despachante-bortone-release-production.up.railway.app";

export interface UsuarioCms {
    id: number;
    nome: string;
    email: string;
    nivel?: string | null;
    cpfCnpj?: string | null;
    celular?: string | null;
    dataCadastro?: string | Date | null;
}

type BuscaTermoResponse<T> = {
    itens: T[];
    mensagem?: string;
};

export const usuarioService = {
    buscarPorTermo: async (termo?: string): Promise<UsuarioCms[]> => {
        try {
            const url = new URL(`${API_URL}/busca/usuario/termo`);

            const termoNormalizado = termo?.trim();
            if (termoNormalizado) {
                url.searchParams.set("termo", termoNormalizado);
            }

            const resposta = await fetch(url.toString());
            if (resposta.ok) {
                const dados: BuscaTermoResponse<UsuarioCms> = await resposta.json();
                return Array.isArray(dados.itens) ? dados.itens : [];
            }

            if (resposta.status !== 404) {
                throw new Error("Erro ao buscar usuários");
            }

            // Fallback para ambientes sem rota de termo.
            const fallback = await fetch(`${API_URL}/busca/usuario/filtros`);
            if (!fallback.ok) {
                return [];
            }

            const dadosFallback: UsuarioCms[] = await fallback.json();
            const termoFallback = termo?.trim().toLowerCase();
            if (!termoFallback) {
                return Array.isArray(dadosFallback) ? dadosFallback : [];
            }

            const usuarios = Array.isArray(dadosFallback) ? dadosFallback : [];
            return usuarios.filter((usuario) => {
                const nome = (usuario.nome || "").toLowerCase();
                const email = (usuario.email || "").toLowerCase();
                const cpfCnpj = (usuario.cpfCnpj || "").toLowerCase();
                const celular = (usuario.celular || "").toLowerCase();

                return (
                    nome.includes(termoFallback) ||
                    email.includes(termoFallback) ||
                    cpfCnpj.includes(termoFallback) ||
                    celular.includes(termoFallback)
                );
            });
        } catch (erro) {
            console.error("Erro no buscarPorTermo de usuário:", erro);
            return [];
        }
    },
};
