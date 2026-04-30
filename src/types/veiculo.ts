export interface Veiculo {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  anoFabricacao: number;
  anoModelo: number;
  renavam: string;
  alertaMultas?: boolean;
}