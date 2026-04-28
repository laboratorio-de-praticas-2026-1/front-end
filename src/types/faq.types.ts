  export type FAQStatus = "Ativo" | "Inativo";

  export interface FAQItem {
    id: string;
    pergunta: string;
    resposta: string;
    categoria: string;
    status: FAQStatus;
    dataCriacao: string;
    dataAtualizacao: string;
  }

  export interface FAQFilters {
    busca: string;
    categoria: string;
    status: FAQStatus | "todas";
    page: number;
    sortOrder: "asc" | "desc";
  }

  export interface FAQCategoryOption {
    value: string;
    label: string;
  }

  export interface FAQStatusOption {
    value: string;
    label: string;
    }