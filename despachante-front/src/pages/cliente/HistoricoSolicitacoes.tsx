import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Calendar, ChevronRight } from "lucide-react";
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
  { id: "1", protocolo: "SOL-260317-2122", servico: "Emissão de CRLV", valor: 120, veiculo: "DEF-5678 - Honda Civic", dataSolicitacao: "17/03/2026", status: "Recebido" },
  { id: "2", protocolo: "SOL-260317-2122", servico: "Emissão de CRLV", valor: 120, veiculo: "DEF-5678 - Honda Civic", dataSolicitacao: "17/03/2026", status: "Andamento" },
  { id: "3", protocolo: "SOL-260317-2122", servico: "Emissão de CRLV", valor: 120, veiculo: "DEF-5678 - Honda Civic", dataSolicitacao: "17/03/2026", status: "Cancelado" },
  { id: "4", protocolo: "SOL-260317-2122", servico: "Emissão de CRLV", valor: 120, veiculo: "DEF-5678 - Honda Civic", dataSolicitacao: "17/03/2026", status: "Concluído" },
  { id: "5", protocolo: "SOL-260317-2122", servico: "Emissão de CRLV", valor: 120, veiculo: "DEF-5678 - Honda Civic", dataSolicitacao: "17/03/2026", status: "Aguardando pagamento" },
  { id: "6", protocolo: "SOL-260317-2122", servico: "Emissão de CRLV", valor: 120, veiculo: "DEF-5678 - Honda Civic", dataSolicitacao: "17/03/2026", status: "Aguardando documento" },
];

function StatusTag({ status }: { status: Solicitacao["status"] }) {
  const statusConfig = {
    Recebido: { bg: "bg-[#E5E7EA]", text: "text-[#4D5461]", dot: "bg-[#4D5461]" },
    Andamento: { bg: "bg-[#B0DEFF]", text: "text-[#0088E8]", dot: "bg-[#0088E8]" },
    Cancelado: { bg: "bg-[#FAC5C3]", text: "text-[#D93E39]", dot: "bg-[#D93E39]" },
    Concluído: { bg: "bg-[#C5E9CD]", text: "text-[#3DA755]", dot: "bg-[#3DA755]" },
    "Aguardando pagamento": { bg: "bg-[#FFE5B0]", text: "text-[#FFAA00]", dot: "bg-[#FFAA00]" },
    "Aguardando documento": { bg: "bg-[#FFC654]", text: "text-[#8C5E00]", dot: "bg-[#8C5E00]" },
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.text}`}>
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
    ) return false;
    return true;
  });

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
        <Button variant="ghost" size="icon" onClick={() => navigate("/cliente/solicitacoes")}>
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
          <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="De" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="pl-8" />
        </div>

        <div className="relative">
          <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Até" value={dataFim} onChange={(e) => setDataFim(e.target.value)} className="pl-8" />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Recebido">Recebido</SelectItem>
            <SelectItem value="Andamento">Andamento</SelectItem>
            <SelectItem value="Cancelado">Cancelado</SelectItem>
            <SelectItem value="Concluído">Concluído</SelectItem>
            <SelectItem value="Aguardando pagamento">Aguardando pagamento</SelectItem>
            <SelectItem value="Aguardando documento">Aguardando documento</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Pesquisar solicitação" value={searchText} onChange={(e) => setSearchText(e.target.value)} className="pl-8" />
        </div>
      </div>

      <div className="space-y-3">
        {paginated.map((s) => (
          <Card key={s.id} className="cursor-pointer hover:shadow-md transition-shadow border-gray-200" onClick={() => handleCardClick(s.id)}>
            <CardContent className="p-4 flex justify-between items-center">
              <div className="space-y-1">
                <div className="flex gap-2 flex-wrap">
                  <h3 className="font-semibold">{s.servico}</h3>
                  <StatusTag status={s.status} />
                </div>
                <p className="text-sm text-gray-500">
                  {s.protocolo} - {s.veiculo} - {s.dataSolicitacao}
                </p>
              </div>
              <div className="text-sm font-semibold text-gray-700">
                R$ {s.valor.toFixed(2).replace(".", ",")}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* PAGINAÇÃO */}
      <div className="flex justify-center items-center gap-4 mt-8 text-sm">
        <button className="text-gray-400">Anterior</button>

        <div className="flex items-center gap-2">
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition
                ${
                  currentPage === page
                    ? "bg-gray-200 text-black font-medium"
                    : "text-black hover:bg-gray-100"
                }`}
            >
              {page}
            </button>
          ))}

          <span className="px-2 text-black">...</span>
        </div>

        <button className="flex items-center gap-1 text-black">
          Próximo <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}