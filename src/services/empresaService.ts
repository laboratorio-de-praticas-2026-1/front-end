const API_URL = import.meta.env.VITE_API_URL;

export interface Empresa {
  id: number;
  nomeFantasia: string | null;
  cnpj: string | null;
  tipo: 'clinica' | 'vistoria' | 'detran' | null;
  telefone: string | null;
  email: string | null;
  site?: string | null;
  endereco: string | null;
  cidade: string | null;
  estado: string | null;
  latitude: string | null;
  longitude: string | null;
}

export interface EmpresaFilters {
  tipo?: string;
  cidade?: string;
}

const mapApiToFront = (emp: Empresa) => {
  const lat = Number(emp.latitude);
  const lng = Number(emp.longitude);

  // proteção contra dados inválidos
  if (isNaN(lat) || isNaN(lng)) return null;

  return {
    id: emp.id,
    nome: emp.nomeFantasia ?? "Sem nome",
    tipo: emp.tipo ?? "Não informado",
    endereco: emp.endereco ?? "Endereço não informado",
    lat,
    lng,
    categoria:
      emp.tipo === "clinica"
        ? "Clínicas"
        : emp.tipo === "vistoria"
        ? "Vistoria"
        : "Detran",
    nota: 4.5, // mock temporário
    imagem: "https://via.placeholder.com/400x300", // mock temporário
  };
};

export const empresaService = {
  async getEmpresas(filters?: EmpresaFilters) {
    let url = `${API_URL}/mapa`;

    if (filters?.tipo || filters?.cidade) {
      const params = new URLSearchParams();

      if (filters.tipo) params.append("tipo", filters.tipo);
      if (filters.cidade) params.append("cidade", filters.cidade);

      url = `${API_URL}/mapa/filtro?${params.toString()}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Erro ao buscar empresas");
    }

    const data: Empresa[] = await response.json();

    return data
      .map(mapApiToFront)
      .filter((item): item is NonNullable<typeof item> => item !== null);
  },

  async getEmpresasByTipo(tipo: string) {
    const response = await fetch(`${API_URL}/mapa/tipo?tipo=${tipo}`);

    if (!response.ok) {
      throw new Error("Erro ao buscar por tipo");
    }

    const data: Empresa[] = await response.json();

    return data
      .map(mapApiToFront)
      .filter((item): item is NonNullable<typeof item> => item !== null);
  },

  async getEmpresasByCidade(cidade: string) {
    const response = await fetch(
      `${API_URL}/mapa/cidade?cidade=${cidade}`
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar por cidade");
    }

    const data: Empresa[] = await response.json();

    return data
      .map(mapApiToFront)
      .filter((item): item is NonNullable<typeof item> => item !== null);
  },
};