import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, ChevronRight, Search } from "lucide-react";

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
  formatSolicitacaoCurrency,
  formatSolicitacaoDate,
  getSolicitacaoStatusLabel,
  resolveClienteUsuarioId,
  solicitacaoService,
  type ClienteSolicitacao,
  type SolicitacaoStatus,
} from "@/services/solicitacaoService";

const ITEMS_PER_PAGE = 6;

const STATUS_OPTIONS: SolicitacaoStatus[] = [
  "Recebida",
  "Em andamento",
  "Cancelada",
  "Concluida",
  "Aguardando pagamento",
  "Aguardando documento",
];

const STATUS_STYLES: Record<
  SolicitacaoStatus,
  { bg: string; text: string; dot: string }
> = {
  Recebida: {
    bg: "bg-[#E5E7EA]",
    text: "text-[#4D5461]",
    dot: "bg-[#4D5461]",
  },
  "Em andamento": {
    bg: "bg-[#B0DEFF]",
    text: "text-[#0088E8]",
    dot: "bg-[#0088E8]",
  },
  Cancelada: {
    bg: "bg-[#FAC5C3]",
    text: "text-[#D93E39]",
    dot: "bg-[#D93E39]",
  },
  Concluida: {
    bg: "bg-[#C5E9CD]",
    text: "text-[#3DA755]",
    dot: "bg-[#3DA755]",
  },
  "Aguardando pagamento": {
    bg: "bg-[#FFE5B0]",
    text: "text-[#FFAA00]",
    dot: "bg-[#FFAA00]",
  },
  "Aguardando documento": {
    bg: "bg-[#FFC654]",
    text: "text-[#8C5E00]",
    dot: "bg-[#8C5E00]",
  },
};

function StatusTag({ status }: { status: SolicitacaoStatus }) {
  const styles = STATUS_STYLES[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs ${styles.bg} ${styles.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
      {getSolicitacaoStatusLabel(status)}
    </span>
  );
}

export default function HistoricoSolicitacoes() {
  const navigate = useNavigate();
  const usuarioId = resolveClienteUsuarioId();

  const [solicitacoes, setSolicitacoes] = useState<ClienteSolicitacao[]>([]);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarSolicitacoes = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await solicitacaoService.listarSolicitacoes({ usuarioId });
        setSolicitacoes(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Nao foi possivel carregar o historico.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void carregarSolicitacoes();
  }, [usuarioId]);

  const filteredSolicitacoes = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return solicitacoes.filter((solicitacao) => {
      if (statusFilter !== "todos" && solicitacao.status !== statusFilter) {
        return false;
      }

      if (dataInicio) {
        const start = new Date(`${dataInicio}T00:00:00`);
        if (new Date(solicitacao.dataSolicitacao) < start) {
          return false;
        }
      }

      if (dataFim) {
        const end = new Date(`${dataFim}T23:59:59`);
        if (new Date(solicitacao.dataSolicitacao) > end) {
          return false;
        }
      }

      if (!normalizedSearch) {
        return true;
      }

      return [
        solicitacao.protocolo ?? "",
        solicitacao.servico,
        solicitacao.clienteNome,
        solicitacao.observacaoCliente,
        solicitacao.observacaoAdmin,
      ].some((field) => field.toLowerCase().includes(normalizedSearch));
    });
  }, [dataFim, dataInicio, searchText, solicitacoes, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [dataFim, dataInicio, searchText, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSolicitacoes.length / ITEMS_PER_PAGE),
  );

  const paginatedSolicitacoes = filteredSolicitacoes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleCardClick = (solicitacao: ClienteSolicitacao) => {
    navigate(`/cliente/solicitacoes/${encodeURIComponent(solicitacao.routeId)}`, {
      state: { solicitacao },
    });
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

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
            Veja todas as solicitacoes carregadas para o portal do cliente.
          </p>
        </div>
      </div>

      <h2 className="mb-3 text-xl font-semibold">Solicitacoes</h2>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Calendar className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="date"
            value={dataInicio}
            onChange={(event) => setDataInicio(event.target.value)}
            className="pl-8"
          />
        </div>

        <div className="relative">
          <Calendar className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="date"
            value={dataFim}
            onChange={(event) => setDataFim(event.target.value)}
            className="pl-8"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {getSolicitacaoStatusLabel(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Pesquisar solicitacao"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {isLoading ? (
        <Card className="border-gray-200">
          <CardContent className="p-6 text-sm text-gray-500">
            Carregando historico...
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border-red-200">
          <CardContent className="p-6 text-sm text-red-600">{error}</CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {paginatedSolicitacoes.map((solicitacao) => (
              <Card
                key={solicitacao.routeId}
                className="cursor-pointer border-gray-200 transition-shadow hover:shadow-md"
                onClick={() => handleCardClick(solicitacao)}
              >
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap gap-2">
                      <h3 className="font-semibold">{solicitacao.servico}</h3>
                      <StatusTag status={solicitacao.status} />
                    </div>

                    <p className="text-sm text-gray-500">
                      {solicitacao.protocolo
                        ? `${solicitacao.protocolo} - `
                        : "Solicitada em "}
                      {formatSolicitacaoDate(solicitacao.dataSolicitacao)}
                    </p>

                    {solicitacao.observacaoCliente && (
                      <p className="line-clamp-2 text-sm text-gray-500">
                        {solicitacao.observacaoCliente}
                      </p>
                    )}
                  </div>

                  <div className="text-right text-sm font-semibold text-gray-700">
                    {formatSolicitacaoCurrency(solicitacao.valor)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {!paginatedSolicitacoes.length && (
            <Card className="mt-6 border-gray-200">
              <CardContent className="p-6 text-sm text-gray-500">
                Nenhuma solicitacao encontrada com os filtros informados.
              </CardContent>
            </Card>
          )}

          {filteredSolicitacoes.length > 0 && (
            <div className="mt-8 flex items-center justify-center gap-4 text-sm">
              <button
                className="text-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
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
              </div>

              <button
                className="flex items-center gap-1 text-black disabled:cursor-not-allowed disabled:opacity-60"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
              >
                Proximo <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
