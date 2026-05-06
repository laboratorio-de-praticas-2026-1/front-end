const API_URL = import.meta.env.VITE_API_URL

export interface ContatoEmpresa {
  id: number;
  nomeFantasia: string;
  cnpj: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  estado: string;
  site: string;
  tipo: string;
  latitude: string;
  longitude: string;
  enderecoCompleto: string;
}

export interface EnviarContatoPayload {
  nome: string;
  email: string;
  telefone?: string;
  mensagem: string;
}

export const contatoService = {
  /**
   * GET /contato/1 — Busca dados da empresa (telefone, email, endereço, etc.)
   */
  async buscarDadosEmpresa(): Promise<ContatoEmpresa> {
    const resposta = await fetch(`${API_URL}/contato/1`);

    if (!resposta.ok) {
      throw new Error("Erro ao buscar dados de contato da empresa");
    }

    return resposta.json();
  },

  /**
   * GET /busca/empresa/filtros — Retorna todas as empresas cadastradas no banco
   */
  async buscarTodasEmpresas(): Promise<ContatoEmpresa[]> {
    const resposta = await fetch(`${API_URL}/busca/empresa/filtros`);

    if (!resposta.ok) {
      throw new Error("Erro ao listar as empresas");
    }

    const data = await resposta.json();
    return Array.isArray(data) ? data : data.value || [];
  },

  /**
   * PUT /contato/1 — Atualiza dados da empresa
   */
  async atualizarDadosEmpresa(
    id: number,
    data: Partial<ContatoEmpresa>
  ): Promise<{ message: string }> {
    const resposta = await fetch(`${API_URL}/contato/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!resposta.ok) {
      const erro = await resposta.json().catch(() => null);
      throw new Error(
        erro?.message || "Erro ao atualizar dados de contato da empresa"
      );
    }

    return resposta.json();
  },

  /**
   * POST /contato/enviar — Envia e-mail de contato
   */
  async enviarContato(
    data: EnviarContatoPayload
  ): Promise<{ message: string }> {
    const resposta = await fetch(`${API_URL}/contato/enviar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!resposta.ok) {
      const erro = await resposta.json().catch(() => null);
      throw new Error(
        erro?.message || "Erro ao enviar mensagem de contato"
      );
    }

    return resposta.json();
  },
};
