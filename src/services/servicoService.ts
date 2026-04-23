const API_URL = import.meta.env.VITE_API_URL || "https://despachante-bortone-release-production.up.railway.app";

export interface ServicoCms {
    id: number;
    nome: string;
    descricao?: string | null;
    valorBase?: number | string | null;
    prazoEstimadoDias?: number | null;
    ativo?: boolean | null;
}

type BuscaTermoResponse<T> = {
    itens: T[];
    mensagem?: string;
};

type ServicoApiLegado = {
    id: number;
    nome?: string;
    descricao?: string | null;
    valorBase?: number | string | null;
    valor_base?: number | string | null;
    prazoEstimadoDias?: number | null;
    prazo_estimado_dias?: number | null;
    ativo?: boolean | null;
};

const normalizarServico = (servico: ServicoApiLegado): ServicoCms => ({
    id: servico.id,
    nome: servico.nome || "",
    descricao: servico.descricao ?? "",
    valorBase: servico.valorBase ?? servico.valor_base ?? 0,
    prazoEstimadoDias:
        servico.prazoEstimadoDias ?? servico.prazo_estimado_dias ?? 0,
    ativo: servico.ativo ?? false,
});

const filtrarPorTermo = (lista: ServicoCms[], termo?: string): ServicoCms[] => {
    const termoNormalizado = termo?.trim().toLowerCase();
    if (!termoNormalizado) return lista;

    return lista.filter((servico) => {
        const nome = (servico.nome || "").toLowerCase();
        const descricao = (servico.descricao || "").toLowerCase();
        const valor = String(servico.valorBase ?? "").toLowerCase();
        const prazo = String(servico.prazoEstimadoDias ?? "").toLowerCase();

        return (
            nome.includes(termoNormalizado) ||
            descricao.includes(termoNormalizado) ||
            valor.includes(termoNormalizado) ||
            prazo.includes(termoNormalizado)
        );
    });
};

export const servicoService = {
    buscarPorTermo: async (termo?: string): Promise<ServicoCms[]> => {
        try {
            const url = new URL(`${API_URL}/busca/servico/termo`);

            const termoNormalizado = termo?.trim();
            if (termoNormalizado) {
                url.searchParams.set("termo", termoNormalizado);
            }

            const resposta = await fetch(url.toString());
            if (resposta.ok) {
                const dados: BuscaTermoResponse<ServicoCms> = await resposta.json();
                return Array.isArray(dados.itens) ? dados.itens : [];
            }

            if (resposta.status !== 404) {
                throw new Error("Erro ao buscar serviços");
            }

            const respostaLegada = await fetch(`${API_URL}/servicos`);
            if (!respostaLegada.ok) {
                throw new Error("Erro ao buscar serviços");
            }

            const dadosLegados: ServicoApiLegado[] = await respostaLegada.json();
            const servicos = Array.isArray(dadosLegados)
                ? dadosLegados.map(normalizarServico)
                : [];

            return filtrarPorTermo(servicos, termo);
        } catch (erro) {
            console.error("Erro no buscarPorTermo de serviço:", erro);
            return [];
        }
    },
};
