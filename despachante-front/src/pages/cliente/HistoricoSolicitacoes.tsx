import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Calendar } from "lucide-react";
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

interface Solicitacao {
  id: string;
  protocolo: string;
  servico: string;
  valor: number;
  veiculo: string;
  dataSolicitacao: string;
  status:
    | "Recebido"
    | "Andamento"
    | "Cancelado"
    | "Concluído"
    | "Aguardando pagamento"
    | "Aguardando documento";
}

const mockSolicitacoes: Solicitacao[] = [
  {
    id: "1",
    protocolo: "SOL-260317-2122",
    servico: "Emissão de CRLV",
    valor: 120,
    veiculo: "DEF-5678 - Honda Civic",
    dataSolicitacao: "17/03/2026",
    status: "Recebido",
  },
  {
    id: "2",
    protocolo: "SOL-260317-2122",
    servico: "Emissão de CRLV",
    valor: 120,
    veiculo: "DEF-5678 - Honda Civic",
    dataSolicitacao: "17/03/2026",
    status: "Andamento",
  },
  {
    id: "3",
    protocolo: "SOL-260317-2122",
    servico: "Emissão de CRLV",
    valor: 120,
    veiculo: "DEF-5678 - Honda Civic",
    dataSolicitacao: "17/03/2026",
    status: "Cancelado",
  },
  {
    id: "4",
    protocolo: "SOL-260317-2122",
    servico: "Emissão de CRLV",
    valor: 120,
    veiculo: "DEF-5678 - Honda Civic",
    dataSolicitacao: "17/03/2026",
    status: "Concluído",
  },
  {
    id: "5",
    protocolo: "SOL-260317-2122",
    servico: "Emissão de CRLV",
    valor: 120,
    veiculo: "DEF-5678 - Honda Civic",
    dataSolicitacao: "17/03/2026",
    status: "Aguardando pagamento",
  },
  {
    id: "6",
    protocolo: "SOL-260317-2122",
    servico: "Emissão de CRLV",
    valor: 120,
    veiculo: "DEF-5678 - Honda Civic",
    dataSolicitacao: "17/03/2026",
    status: "Aguardando documento",
  },
];

function StatusTag({ status }: { status: Solicitacao["status"] }) {
  const statusConfig = {
    Recebido: {
      bg: "bg-[#E5E7EA]",
      text: "text-[#4D5461]",
      dot: "bg-[#4D5461]",
    },
    Andamento: {
      bg: "bg-[#B0DEFF]",
      text: "text-[#0088E8]",
      dot: "bg-[#0088E8]",
    },
    Cancelado: {
      bg: "bg-[#FAC5C3]",
      text: "text-[#D93E39]",
      dot: "bg-[#D93E39]",
    },
    Concluído: {
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

  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
}

export default function HistoricoSolicitacoes() {
  const navigate = useNavigate();
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredSolicitacoes = mockSolicitacoes.filter((s) => {
    if (statusFilter && s.status !== statusFilter) return false;
    if (
      searchText &&
      !s.servico.toLowerCase().includes(searchText.toLowerCase()) &&
      !s.protocolo.includes(searchText)
    )
      return false;
    return true;
  });

  const totalPages = Math.ceil(filteredSolicitacoes.length / itemsPerPage);
  const paginated = filteredSolicitacoes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCardClick = (id: string) => {
    navigate(`/cliente/solicitacoes/${id}`);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/cliente/solicitacoes")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Histórico de solicitações</h1>
          <p className="text-sm text-gray-500">
            Veja todas as suas solicitações já realizadas
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-3">Solicitações</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="De"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Até"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Recebido">Recebido</SelectItem>
            <SelectItem value="Andamento">Andamento</SelectItem>
            <SelectItem value="Cancelado">Cancelado</SelectItem>
            <SelectItem value="Concluído">Concluído</SelectItem>
            <SelectItem value="Aguardando pagamento">
              Aguardando pagamento
            </SelectItem>
            <SelectItem value="Aguardando documento">
              Aguardando documento
            </SelectItem>
          </SelectContent>
        </Select>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Pesquisar solicitação"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
      </div>

      <div className="space-y-3">
        {paginated.map((solicitacao) => (
          <Card
            key={solicitacao.id}
            className="cursor-pointer hover:shadow-md transition-shadow border-gray-200"
            onClick={() => handleCardClick(solicitacao.id)}
          >
            <CardContent className="p-4 flex justify-between items-center">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{solicitacao.servico}</h3>
                  <StatusTag status={solicitacao.status} />
                </div>
                <p className="text-sm text-gray-500">
                  {solicitacao.protocolo} - {solicitacao.veiculo} -{" "}
                  {solicitacao.dataSolicitacao}
                </p>
              </div>
              <div className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                R$ {solicitacao.valor.toFixed(2).replace(".", ",")}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className="w-9"
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Próximo
          </Button>
        </div>
      )}
    </div>
  );
}