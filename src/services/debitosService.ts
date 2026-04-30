import mockData from "@/mocks/debitos.json";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getVeiculos() {
  await delay(800);
  return mockData.veiculos;
}

export async function getDebitosByVeiculoId(veiculoId: string) {
  await delay(1000);
  const data = mockData.debitos[veiculoId as keyof typeof mockData.debitos];
  if (!data) return null;
  return data;
}
