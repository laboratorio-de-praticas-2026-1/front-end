export type StatusServico = "Ativo" | "Inativo";

export interface Servico {
  id: number;
  nome: string;
  descricao: string;
  valorBase: number;
  prazoEstimado: number;
  status: StatusServico;
}

export const mockServicos: Servico[] = [
  {
    id: 1,
    nome: "Transferência",
    descricao: "A transferência de veículo é o processo de mudança de titularidade de um veículo de um proprietário para outro.",
    valorBase: 150.00,
    prazoEstimado: 3,
    status: "Ativo",
  },
  {
    id: 2,
    nome: "Licenciamento",
    descricao: "O licenciamento do veículo é a renovação anual obrigatória para manter o veículo regularizado junto ao DETRAN.",
    valorBase: 240.00,
    prazoEstimado: 6,
    status: "Inativo",
  },
  {
    id: 3,
    nome: "Renovação de CNH",
    descricao: "Para fazer a renovação da sua Carteira Nacional de Habilitação, é necessário passar por exames médicos e psicológicos.",
    valorBase: 100.00,
    prazoEstimado: 1,
    status: "Ativo",
  },
  {
    id: 4,
    nome: "Emplacamento",
    descricao: "Serviço de emplacamento de veículos novos ou transferência de placa, incluindo toda a documentação necessária junto ao DETRAN.",
    valorBase: 320.00,
    prazoEstimado: 5,
    status: "Ativo",
  },
  {
    id: 5,
    nome: "Regularização de Débitos",
    descricao: "Regularização de multas, IPVA e outros débitos pendentes junto aos órgãos de trânsito para emissão do CRVL.",
    valorBase: 80.00,
    prazoEstimado: 2,
    status: "Ativo",
  },
  {
    id: 6,
    nome: "Segunda Via de CNH",
    descricao: "Emissão da segunda via da Carteira Nacional de Habilitação em caso de perda, furto ou roubo do documento original.",
    valorBase: 90.00,
    prazoEstimado: 4,
    status: "Inativo",
  },
  {
    id: 7,
    nome: "Vistoria Veicular",
    descricao: "Vistoria cautelar do veículo para verificação de número de chassi, motor e demais dados técnicos do automóvel.",
    valorBase: 200.00,
    prazoEstimado: 1,
    status: "Ativo",
  },
  {
    id: 8,
    nome: "Adição de Categoria CNH",
    descricao: "Processo para adição de nova categoria à Carteira Nacional de Habilitação, permitindo conduzir diferentes tipos de veículos.",
    valorBase: 130.00,
    prazoEstimado: 7,
    status: "Ativo",
  },
  {
    id: 9,
    nome: "Registro de Veículo Novo",
    descricao: "Registro inicial de veículo zero km junto ao DETRAN, incluindo emissão do CRV e placa do veículo.",
    valorBase: 280.00,
    prazoEstimado: 5,
    status: "Inativo",
  },
  {
    id: 10,
    nome: "Alteração de Dados Cadastrais",
    descricao: "Atualização de dados cadastrais do proprietário no documento do veículo, como endereço e nome após casamento.",
    valorBase: 70.00,
    prazoEstimado: 2,
    status: "Ativo",
  },
  {
    id: 11,
    nome: "Bloqueio/Desbloqueio de Veículo",
    descricao: "Registro de bloqueio judicial ou administrativo de veículo, bem como o processo de desbloqueio junto aos órgãos competentes.",
    valorBase: 110.00,
    prazoEstimado: 3,
    status: "Ativo",
  },
  {
    id: 12,
    nome: "Baixa de Veículo",
    descricao: "Processo de baixa definitiva ou temporária de veículo junto ao DETRAN para fins de sucateamento, exportação ou outros motivos.",
    valorBase: 160.00,
    prazoEstimado: 4,
    status: "Inativo",
  },
];
