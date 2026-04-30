import { MOCK_EMPRESAS } from "@/mocks/empresas.mock";

export interface Empresa {
  id: string;
  nomeFantasia: string;
  cnpj: string;
  tipo: string;
  telefone: string;
  email: string;
  site?: string;
  endereco: string;
  cidade: string;
  estado: string;
  latitude: number;
  longitude: number;
}

export interface CreateEmpresaDTO {
  nome_fantasia: string;
  cnpj: string;
  tipo: string;
  telefone: string;
  email: string;
  site?: string;
  endereco: string;
  cidade: string;
  estado: string;
  latitude: number;
  longitude: number;
}

export interface EmpresaFilters {
  tipo?: string;
  estado?: string;
  cidade?: string;
  search?: string;
  page: number;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mapToDTO = (data: Omit<Empresa, "id">): CreateEmpresaDTO => ({
  nome_fantasia: data.nomeFantasia,
  cnpj: data.cnpj,
  tipo: data.tipo,
  telefone: data.telefone,
  email: data.email,
  site: data.site,
  endereco: data.endereco,
  cidade: data.cidade,
  estado: data.estado,
  latitude: data.latitude,
  longitude: data.longitude,
});

export const empresaService = {
  async getEmpresas(filters: EmpresaFilters): Promise<Empresa[]> {
    await delay(800);
    return (MOCK_EMPRESAS as any[]).filter((emp) => {
      const matchesSearch = emp.nomeFantasia?.toLowerCase().includes(filters.search?.toLowerCase() || "");
      const matchesTipo = filters.tipo ? emp.tipo === filters.tipo : true;
      const matchesCidade = filters.cidade ? emp.cidade === filters.cidade : true;
      const matchesEstado = filters.estado ? emp.estado === filters.estado : true;
      return matchesSearch && matchesTipo && matchesCidade && matchesEstado;
    }) as Empresa[];
  },

  async getEmpresaById(id: string): Promise<Empresa | undefined> {
    await delay(500);
    return (MOCK_EMPRESAS as any[]).find((emp) => emp.id === id) as Empresa | undefined;
  },

  async createEmpresa(data: Omit<Empresa, "id">): Promise<void> {
    const dto = mapToDTO(data);
    await delay(1000);
    console.log("POST /empresas", dto);
  },

  async updateEmpresa(id: string, data: Omit<Empresa, "id">): Promise<void> {
    const dto = mapToDTO(data);
    await delay(1000);
    console.log(`PUT /empresas/${id}`, dto);
  },

  async deleteEmpresa(id: string): Promise<void> {
    await delay(1000);
    console.log(`DELETE /empresas/${id}`);
  },
};