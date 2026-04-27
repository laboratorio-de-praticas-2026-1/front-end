export interface Empresa {
  id: string;
  nomeFantasia: string;
  tipo: string;
  cnpj: string;
  telefone: string;
  cidade: string;
  estado: string;
  site: string;
  endereco: string;
  lat: number;
  lng: number;
}

export interface EmpresaFilters {
  tipo?: string;
  estado?: string;
  cidade?: string;
  search?: string;
  page: number;
}