import type { FAQPublico } from "@/types/faqPublico.types";

export const FAQ_PUBLICO_MOCK: FAQPublico[] = [
  {
    id: "#001",
    pergunta: "1. Quais serviços um despachante oferece?",
    resposta: "Um despachante atua como intermediário entre cidadãos/empresas e órgãos públicos, agilizando processos burocráticos.",
    categoria: "Regularização",
    status: "Ativo",
    destaque: true,
    dataCriacao: "01/01/2024",
    dataAtualizacao: "01/01/2024",
  },
  {
    id: "#002",
    pergunta: "Preciso ir ao Detran para resolver a documentação do meu veículo?",
    resposta: "Os documentos exigidos são...",
    categoria: "Documentação",
    status: "Ativo",
    destaque: false,
    dataCriacao: "01/01/2024",
    dataAtualizacao: "01/01/2024",
  },
  {
    id: "#003",
    pergunta: "Quanto tempo demora para concluir um serviço?",
    resposta: "Os documentos exigidos são...",
    categoria: "Documentação",
    status: "Ativo",
    destaque: true,
    dataCriacao: "01/01/2024",
    dataAtualizacao: "01/01/2024",
  },

  {
    id: "#004",
    pergunta: "Como funcionará o pedágio free flow na anchiet...",
    resposta: "As rodovias Anchieta e Imigrantes estão prestes...",
    categoria: "Manutenção",
    status: "Ativo",
    destaque: true,
    dataCriacao: "15/01/2026",
    dataAtualizacao: "18/01/2026"
  },
  {
    id: "#005",
    pergunta: "Licenciamento RJ 2026: Taxa do detran, prazo e c...",
    resposta: "Se você tem um carro ou moto no Rio de Janeir...",
    categoria: "Documentação",
    status: "Inativo",
    destaque: false,
    dataCriacao: "20/01/2026",
    dataAtualizacao: "21/01/2026"
  },
  
];

