import mockData from "@/mocks/dashboardCliente.json";

// Simulates network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getDashboardData(){
  await delay(1200);
  return mockData;
}

export async function getDebitosByVeiculo(_veiculoId: string) {
  await delay(1200);
  return mockData.debitos;
}

export async function getVeiculoAtivo(){
  await delay(800);
  return mockData.veiculo;
}
