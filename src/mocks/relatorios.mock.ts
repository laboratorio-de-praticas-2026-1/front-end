export const RELATORIOS_MOCK = {
  report: [
    { 
      id: "#001", 
      nome: "Histórico de Pagamentos — ...", 
      descricao: "Relatório de histórico de pagamentos gerado automaticamente para o período de 07/04/2006 a 07/05/2026.", 
      categoria: "Histórico de pagamentos", 
      data: "07/04/2026",
      dataInicio: "07/04/2026",
      dataFim: "07/05/2026",
      status: "Gerado",
      pdfUrl: "https://private-user-images.githubusercontent.com/99690766/578901227-d6af4004-8234-4229-8ad0-3d257e28d9b6.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NzY3MzI5NTIsIm5iZiI6MTc3NjczMjY1MiwicGF0aCI6Ii85OTY5MDc2Ni81Nzg5MDEyMjctZDZhZjQwMDQtODIzNC00MjI5LThhZDAtM2QyNTdlMjhkOWI2LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjA0MjElMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwNDIxVDAwNTA1MlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTVlYmFhNDFmZWM3NmMzMjdjNTI2YTVmNTY5YzU0NWQ0MzZkMWQ2Y2ZmODIzMWNiYWI1Y2VlMDUyZmY2MTM1MjcmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnJlc3BvbnNlLWNvbnRlbnQtdHlwZT1pbWFnZSUyRnBuZyJ9.2GYPrvhMJFlcaPlOKvdyAvMhler61_G-0DkTatSGRwc"
    },
    { 
      id: "#002", 
      nome: "Relatório Resumido de Dívidas", 
      descricao: "Dívida abrangente", 
      categoria: "Resumo da dívida", 
      data: "07/04/2026",
      dataInicio: "01/04/2026",
      dataFim: "07/04/2026",
      status: "Erro",
      pdfUrl: ""
    },
    { 
      id: "#003", 
      nome: "Visão geral do processo de m...", 
      descricao: "Visão geral detalhada de tod...", 
      categoria: "Visão geral do processo", 
      data: "06/04/2026",
      dataInicio: "01/03/2026",
      dataFim: "30/03/2026",
      status: "Andamento",
      pdfUrl: ""
    },
    { 
      id: "#004", 
      nome: "Histórico de Pagamentos - G...", 
      descricao: "Relatório de rastreamento d...", 
      categoria: "Histórico de pagamentos", 
      data: "07/04/2026",
      dataInicio: "01/04/2026",
      dataFim: "07/04/2026",
      status: "Gerado",
      pdfUrl: ""
    },
    { 
      id: "#005", 
      nome: "Declaração do cliente de feve...", 
      descricao: "Extrato mensal do cliente, in...", 
      categoria: "Declaração do cliente", 
      data: "07/04/2026",
      dataInicio: "01/02/2026",
      dataFim: "28/02/2026",
      status: "Erro",
      pdfUrl: ""
    }
  ],

  categorias: [
    { value: "visao-geral", label: "Visão Geral" },
    { value: "performance-financeira", label: "Performance Financeira" },
    { value: "desempenho-operacional", label: "Desempenho Operacional" },
    { value: "gestao-solicitacoes", label: "Gestão de Solicitações" },
    { value: "gestao-documentos", label: "Gestão de Documentos" },
    { value: "gestao-veiculos", label: "Gestão de Veículos" },
    { value: "base-clientes", label: "Base de Clientes" },
    { value: "analise-eficiencia", label: "Análise de Eficiência" },
    { value: "funil-conversao", label: "Funil de Conversão" },
    { value: "gargalos-operacionais", label: "Gargalos Operacionais" }
  ]
}