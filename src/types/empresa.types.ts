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

export type UpdateEmpresaDTO = Partial<CreateEmpresaDTO>;

export interface EmpresaFilters {
  tipo?: string;
  estado?: string;
  cidade?: string;
  search?: string;
  page: number;
}