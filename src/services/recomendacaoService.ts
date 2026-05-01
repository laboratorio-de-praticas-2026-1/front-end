const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error("VITE_API_URL não está definido no ambiente");
}

export const RecomendacaoCategoriaBlogEnum = {
  DOCUMENTACAO: "Documentacao",
  DEBITOS: "Debitos",
  MULTAS: "Multas",
  LEGISLACAO: "Legislacao",
  CONDUTOR: "Condutor",
} as const;

export const recomendacaoService = {
  async registrarInteracao(categoria: (typeof RecomendacaoCategoriaBlogEnum)[keyof typeof RecomendacaoCategoriaBlogEnum]) {
    console.log("Registrando interação para categoria:", categoria);
    const response = await fetch(`${API_URL}/recomendacoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
      },
      body: JSON.stringify({
        usuarioId: 1,
        categoriaBlog: categoria,
        dataInteracao: new Date().toISOString(),
      }),
    });
    if (!response.ok) {
      const reason = await response.text();
      console.error(
        `Erro ao adicionar interação (${response.status}):`,
        reason,
      );
      throw new Error("Erro ao adicionar interação");
    }
    return await response.json();
  },

  async obterRecomendacoes() {
    const response = await fetch(`${API_URL}/recomendacoes`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
      },
    });
    const data = await response.json();
    return data;
  },
};
