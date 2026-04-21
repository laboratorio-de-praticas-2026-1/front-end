import type { Report } from "@/components/admin/relatorios/RelatoriosAdmin";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error("VITE_API_URL não está definido no ambiente");
}

export const reportsService = {
  //GET /relatorios - Lista todos os relatórios
  listarTodos: async (): Promise<Report[]> => {
    try {
      const resposta = await fetch(`${API_URL}/reports`);

      if (!resposta.ok) {
        const motivoDoErro = await resposta.text();
        console.error(
          `O Servidor recusou (Status ${resposta.status}). Motivo:`,
          motivoDoErro,
        );
        throw new Error("Erro ao buscar relatórios");
      }
      const data = await resposta.json();
      console.log("Relatórios recebidos do servidor:", data);
      return data;
    } catch (error) {
      console.error("Erro no listarTodos:", error);
      return []; // Retorna um array vazio para não quebrar a tela do usuário
    }
  },

  listarCategorias: async (): Promise<{ nome: string; valor: string }[]> => {
    try {
      const resposta = await fetch(`${API_URL}/reports/categorias`);

      if (!resposta.ok) {
        const motivoDoErro = await resposta.text();
        console.error(
          `O Servidor recusou (Status ${resposta.status}). Motivo:`,
          motivoDoErro,
        );
        throw new Error("Erro ao buscar categorias de relatórios");
      }

      const data = await resposta.json();
      console.log("Categorias recebidas do servidor:", data);

      return data;
    } catch (error) {
      console.error("Erro no listarCategorias:", error);
      return []; // Retorna um array vazio para não quebrar a tela do usuário
    }
  },

  gerarRelatorio: async (payload: {
    categoria: string;
    nome: string;
    descricao: string;
    dataPeriodoInicio: string;
    dataPeriodoFim: string;
  }) => {
    try {
      const resposta = await fetch(`${API_URL}/reports/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!resposta.ok) {
        const motivoDoErro = await resposta.text();
        console.error(
          `O Servidor recusou (Status ${resposta.status}). Motivo:`,
          motivoDoErro,
        );
        throw new Error("Erro ao gerar relatório");
      }
      const data = await resposta.json();
      console.log("Relatório gerado com sucesso:", data);
      return data;
    } catch (error) {
      console.error("Erro no gerarRelatorio:", error);
      throw error; // Propaga o erro para o componente lidar
    }
  },

  deleteRelatorio: async (id: string) => {
    try {
      const resposta = await fetch(`${API_URL}/reports/${id}`, {
        method: "DELETE",
      });

      if (!resposta.ok) {
        const motivoDoErro = await resposta.text();
        console.error(
          `O Servidor recusou (Status ${resposta.status}). Motivo:`,
          motivoDoErro,
        );
        throw new Error("Erro ao deletar relatório");
      }

      console.log(`Relatório com ID ${id} deletado com sucesso.`);
    } catch (error) {
      console.error("Erro no deleteRelatorio:", error);
      throw error; // Propaga o erro para o componente lidar
    }
  },
};
