import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Calendar, ChevronRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  solicitacaoService,
  type SolicitacaoResumo,
  type StatusSolicitacao,
} from "@/services/solicitacaoService";

const USUARIO_ID = 1;
const ITEMS_POR_PAGINA = 6;

const STATUS_CONFIG: Record<
  StatusSolicitacao,
  { bg: string; text: string; dot: string; label: string }
> = {
  recebido: {
    bg: "bg-[#E5E7EA]",
    text: "text-[#4D5461]",
    dot: "bg-[#4D5461]",
    label: "Recebido",
  },
  em_andamento: {
    bg: "bg-[#B0DEFF]",
    text: "text-[#0088E8]",
    dot: "bg-[#0088E8]",
    label: "Em andamento",
  },
  cancelado: {
    bg: "bg-[#FAC5C3]",
    text: "text-[#D93E39]",
    dot: "bg-[#D93E39]",
    label: "Cancelado",
  },
  concluido: {
    bg: "bg-[#C5E9CD]",
    text: "text-[#3DA755]",
    dot: "bg-[#3DA755]",
    label: "Concluido",
  },
  aguardando_pagamento: {
    bg: "bg-[#FFE5B0]",
    text: "text-[#FFAA00]",
    dot: "bg-[#FFAA00]",
    label: "Aguardando pagamento",
  },
  aguardando_documento: {
    bg: "bg-[#FFC654]",
    text: "text-[#8C5E00]",
    dot: "bg-[#8C5E00]",
    label: "Aguardando documento",
  },
};

function StatusTag({ status }: { status: StatusSolicitacao }) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs ${config.bg} ${config.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

function getLinhaSecundaria(solicitacao: SolicitacaoResumo) {
  const data = new Date(solicitacao.dataSolicitacao).toLocaleDateString("pt-BR");
  return solicitacao.protocolo
    ? `${solicitacao.protocolo} - ${data}`
    : `Solicitada em ${data}`;
}

export default function HistoricoSolicitacoes() {
  const navigate = useNavigate();

  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoResumo[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_POR_PAGINA));

  const carregarHistorico = useCallback(async () => {
    setLoading(true);
    setErro(null);

    try {
      const data = await solicitacaoService.listar({
        usuario_id: USUARIO_ID,
        status: statusFilter || undefined,
        search: searchText || undefined,
        dataInicio: dataInicio || undefined,
        dataFim: dataFim || undefined,
        page: currentPage,
        limit: ITEMS_POR_PAGINA,
      });

      setSolicitacoes(data.solicitacoes);
      setTotal(data.total);
    } catch {
      setErro("Nao foi possivel carregar o historico.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, dataFim, dataInicio, searchText, statusFilter]);

  useEffect(() => {
    carregarHistorico();
  }, [carregarHistorico]);

  const handleFiltroChange = (callback: () => void) => {
    callback();
    setCurrentPage(1);
  };

  const pageNumbers = Array.from(
    { length: Math.min(totalPages, 5) },
    (_, index) => index + 1,
  );

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6">
      <div className="mb-6 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/cliente/solicitacoes")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div>
          <h1 className="text-2xl font-bold">Historico de solicitacoes</h1>
          <p className="text-sm text-gray-500">
            Veja as solicitacoes do cliente filtradas no front com base na
            listagem disponivel nesta branch.
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
        O endpoint atual ainda nao expoe detalhe por ID, entao os cards abaixo
        ficam somente para consulta rapida.
      </div>

      <h2 className="mb-3 text-xl font-semibold">Solicitacoes</h2>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Calendar className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="date"
            placeholder="De"
            value={dataInicio}
            onChange={(e) => handleFiltroChange(() => setDataInicio(e.target.value))}
            className="pl-8"
          />
        </div>

        <div className="relative">
          <Calendar className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="date"
            placeholder="Ate"
            value={dataFim}
            onChange={(e) => handleFiltroChange(() => setDataFim(e.target.value))}
            className="pl-8"
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(value) =>
            handleFiltroChange(() => setStatusFilter(value === "todos" ? "" : value))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="recebido">Recebido</SelectItem>
            <SelectItem value="em_andamento">Em andamento</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
            <SelectItem value="concluido">Concluido</SelectItem>
            <SelectItem value="aguardando_pagamento">
              Aguardando pagamento
            </SelectItem>
            <SelectItem value="aguardando_documento">
              Aguardando documento
            </SelectItem>
          </SelectContent>
        </Select>

        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Pesquisar solicitacao"
            value={searchText}
            onChange={(e) => handleFiltroChange(() => setSearchText(e.target.value))}
            className="pl-8"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : erro ? (
        <p className="py-10 text-center text-sm text-red-500">{erro}</p>
      ) : solicitacoes.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-500">
          Nenhuma solicitacao encontrada.
        </p>
      ) : (
        <div className="space-y-3">
          {solicitacoes.map((solicitacao) => (
            <Card
              key={`${solicitacao.clienteId}-${solicitacao.servico}-${solicitacao.dataSolicitacao.toISOString()}`}
              className="border-gray-200"
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap gap-2">
                    <h3 className="font-semibold">{solicitacao.servico}</h3>
                    <StatusTag status={solicitacao.status} />
                  </div>

                  <p className="text-sm text-gray-500">
                    {getLinhaSecundaria(solicitacao)}
                  </p>
                </div>

                <div className="text-sm font-semibold text-gray-700">
                  R$ {Number(solicitacao.valorBase).toFixed(2).replace(".", ",")}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4 text-sm">
          <button
            className="text-gray-400 disabled:opacity-40"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => page - 1)}
          >
            Anterior
          </button>

          <div className="flex items-center gap-2">
            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                  currentPage === page
                    ? "bg-gray-200 font-medium text-black"
                    : "text-black hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            {totalPages > 5 && <span className="px-2 text-black">...</span>}
          </div>

          <button
            className="flex items-center gap-1 text-black disabled:opacity-40"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((page) => page + 1)}
          >
            Proximo <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
