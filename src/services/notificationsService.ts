const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface Notificacao {
  titulo: string;
  mensagem: string;
  valor: number;
  data: string;
}

export const notificationsService = {
  listarPorUsuario: async (userId: number): Promise<Notificacao[]> => {
    try {
      const resposta = await fetch(`${API_URL}/notificacao/${userId}`);

      if (!resposta.ok) {
        throw new Error(`Erro HTTP: ${resposta.status}`);
      }

      const dados = await resposta.json();

      // 🔥 AGORA CORRETO
      return dados.notificacoes || [];

    } catch (erro) {
      console.error("Erro ao buscar notificações:", erro);
      return [];
    }
  },
};