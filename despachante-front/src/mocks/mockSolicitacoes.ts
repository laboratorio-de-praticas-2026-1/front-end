// src/mocks/mockSolicitacoes.ts
export interface Solicitacao {
  id: string;
  protocolo: string;
  servico: string;
  valor: number;
  veiculo: string;
  dataSolicitacao: string;
  status: "Recebida" | "Em andamento" | "Concluída" | "Cancelada";
}

export const mockSolicitacoes: Solicitacao[] = [
  {
    id: "1",
    protocolo: "SOL-260317-2122",
    servico: "Emissão de CRLV",
    valor: 120.0,
    veiculo: "DEF-5678 - Honda Civic",
    dataSolicitacao: "17/03/2026",
    status: "Recebida",
  },
  {
    id: "2",
    protocolo: "SOL-250315-1890",
    servico: "Transferência de veículo",
    valor: 350.0,
    veiculo: "ABC-1234 - Fiat Uno",
    dataSolicitacao: "15/03/2026",
    status: "Em andamento",
  },
  {
    id: "3",
    protocolo: "SOL-240310-1456",
    servico: "Licenciamento anual",
    valor: 85.0,
    veiculo: "GHI-9012 - Chevrolet Onix",
    dataSolicitacao: "10/03/2026",
    status: "Concluída",
  },
  {
    id: "4",
    protocolo: "SOL-230305-1234",
    servico: "Segunda via do CRV",
    valor: 95.0,
    veiculo: "DEF-5678 - Honda Civic",
    dataSolicitacao: "05/03/2026",
    status: "Concluída",
  },
  {
    id: "5",
    protocolo: "SOL-220228-0987",
    servico: "Vistoria veicular",
    valor: 70.0,
    veiculo: "ABC-1234 - Fiat Uno",
    dataSolicitacao: "28/02/2026",
    status: "Concluída",
  },
  {
    id: "6",
    protocolo: "SOL-210220-0654",
    servico: "Emissão de CRLV",
    valor: 120.0,
    veiculo: "XYZ-5678 - VW Gol",
    dataSolicitacao: "20/02/2026",
    status: "Cancelada",
  },
];