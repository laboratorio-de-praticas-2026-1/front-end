//import mockData from "@/mocks/debitos.json";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const API_URL =
  "https://backend-main-412027788376.southamerica-east1.run.app";

export interface Veiculo {
  id: string;
  placa: string;
  modelo: string;
  ano: number;
}

export async function getVeiculos(): Promise<Veiculo[]> {
  await delay(800); 
  const response = await fetch(
    `${API_URL}/dashboard/veiculos`
  );

  const data = await response.json();

  //Normalização 
  return data.debitosPendentes.porVeiculo.map((item: any) => ({
    id: String(item.veiculoId),
    placa: item.placa,
    modelo: null, // API não retorna modelo
    ano: 0, // API não retorna ano tbm
  }));
}

export async function getDebitosByVeiculoId(placa: string) {
  await delay(1000);
  const response = await fetch(
    `${API_URL}/debitos/veiculos/${placa}`
  );
  return response.json();
}

/*
export async function getDebitosByVeiculoId(veiculoId: string) {
  await delay(1000);
  const data = mockData.debitos[veiculoId as keyof typeof mockData.debitos];
  if (!data) return null;
  return data;
}  getDebito com dados mockup*/
