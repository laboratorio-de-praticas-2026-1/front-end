import type { FAQItem, FAQCategoryOption, FAQStatusOption } from "@/types/faq.types";


export const FAQ_MOCK_DATA: FAQItem[] = [
  {
    id: "#001",
    pergunta: "O licenciamento SP 2026 já pode ser feito de m...",
    resposta: "O licenciamento é uma obrigação anual para os...",
    categoria: "Documentação", 
    status: "Ativo",
    dataCriacao: "01/01/2026",
    dataAtualizacao: "02/01/2026"
  },
  {
    id: "#002",
    pergunta: "Carros 2026: 5 modelos que vão ganhar as ruas ...",
    resposta: "O mercado automotivo brasileiro entra em 2026...",
    categoria: "Novidades",
    status: "Inativo",
    dataCriacao: "05/01/2026",
    dataAtualizacao: "09/01/2026"
  },
  {
    id: "#003",
    pergunta: "Como parcelar o IPVA 2026 atrasado",
    resposta: "O IPVA atrasado pode complicar e muito a vida ...",
    categoria: "Financeiro",
    status: "Ativo",
    dataCriacao: "10/01/2026",
    dataAtualizacao: "11/01/2026"
  },
  {
    id: "#004",
    pergunta: "Como funcionará o pedágio free flow na anchiet...",
    resposta: "As rodovias Anchieta e Imigrantes estão prestes...",
    categoria: "Trânsito",
    status: "Ativo",
    dataCriacao: "15/01/2026",
    dataAtualizacao: "18/01/2026"
  },
  {
    id: "#005",
    pergunta: "Licenciamento RJ 2026: Taxa do detran, prazo e c...",
    resposta: "Se você tem um carro ou moto no Rio de Janeir...",
    categoria: "Documentação",
    status: "Inativo",
    dataCriacao: "20/01/2026",
    dataAtualizacao: "21/01/2026"
  },
  {
    id: "#006",
    pergunta: "Estacionamento Allianz Parque: preço, reserva e...",
    resposta: "O Allianz Parque é palco de grandes espetáculos, ...",
    categoria: "Serviços",
    status: "Ativo",
    dataCriacao: "25/01/2026",
    dataAtualizacao: "26/01/2026"
  },
  {
    id: "#007",
    pergunta: "É proibido dirigir descalço? e sem camisa?",
    resposta: "Muitas pessoas têm dúvidas se é proibido dirigir...",
    categoria: "Leis",
    status: "Ativo",
    dataCriacao: "30/01/2026",
    dataAtualizacao: "01/02/2026"
  }
];

export const FAQ_CATEGORIES_MOCK: FAQCategoryOption[] = [
  { value: "todas", label: "Todas as Categorias" },
  { value: "Documentação", label: "Documentação" },
  { value: "Financeiro", label: "Financeiro" },
  { value: "Trânsito", label: "Trânsito" },
  { value: "Novidades", label: "Novidades" },
  { value: "Serviços", label: "Serviços" },
  { value: "Leis", label: "Leis" },
];

export const FAQ_STATUS_MOCK: FAQStatusOption[] = [
  { value: "todas", label: "Status" },
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];