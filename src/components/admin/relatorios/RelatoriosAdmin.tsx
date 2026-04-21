import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/DatePicker";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { reportsService } from "@/services/reportsService";
import {
  ArrowUpDown,
  ChevronRight,
  Download,
  Eye,
  Loader2,
  Plus,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReportModal } from "./ModalRelatorio";
type Status = "Gerado" | "Erro" | "Andamento";

// Interface para integração
export interface Report {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  dataGeracao: string; // usado na tabela
  periodoInicio: string;
  periodoFim: string;
  status: Status;
  urlDocumento: string;
}

function toIsoDate(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isoToDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
}

function normalizeReportDate(value: string): string {
  if (!value) return "";

  if (value.includes("/")) {
    const [day, month, year] = value.split("/");
    const normalizedDay = (day ?? "").padStart(2, "0");
    const normalizedMonth = (month ?? "").padStart(2, "0");
    return `${year}-${normalizedMonth}-${normalizedDay}`;
  }

  return value.slice(0, 10);
}

function formatReportDate(value: string): string {
  if (!value) return "-";

  if (value.includes("-")) {
    const [year, month, day] = value.split("-");
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
  }

  return value;
}


export default function Relatorios() {
  const navigate = useNavigate();

  // Estados para integração
  const [reports, setReports] = useState<Report[]>([]);
  const [catOptions, setCatOptions] = useState<
    { nome: string; valor: string }[]
  >([]);
  const [sortType, setSortType] = useState<"data" | "id">("data");
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const [filterState, setFilterState] = useState({
    categoria: "",
    dataInicial: "",
    dataFinal: "",
    busca: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const postsPerPage = 7;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        setReports(await reportsService.listarTodos());
        setCatOptions((await reportsService.listarCategorias()));
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredReports = useMemo(() => {
    return reports.filter((s) => {
      const matchesSearch =
        (s.nome ?? "")
          .toLowerCase()
          .includes(filterState.busca.toLowerCase()) ||
        (s.descricao ?? "")
          .toLowerCase()
          .includes(filterState.busca.toLowerCase()) ||
        (s.categoria ?? "")
          .toLowerCase()
          .includes(filterState.busca.toLowerCase()) ||
        String(s.id ?? "").includes(filterState.busca);

      const dataRelatorioIso = normalizeReportDate(s.dataGeracao);
      const inicioIso = filterState.dataInicial;
      const fimIso = filterState.dataFinal;

      const matchesCategoria =
        !filterState.categoria ||
        filterState.categoria === "todas" ||
        s.categoria === filterState.categoria;

      return (
        matchesSearch &&
        matchesCategoria &&
        (inicioIso ? dataRelatorioIso >= inicioIso : true) &&
        (fimIso ? dataRelatorioIso <= fimIso : true)
      );
    });
  }, [reports, filterState]);

  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortType === "id") {
      console.log(typeof a.id, typeof b.id); // Debug: Verificar tipos dos IDs = number
      const idA = Number(a.id);
      const idB = Number(b.id);
      return idA - idB;
    }

    const dateA = new Date(normalizeReportDate(a.dataGeracao)).getTime();
    const dateB = new Date(normalizeReportDate(b.dataGeracao)).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const totalPages = Math.ceil(sortedReports.length / postsPerPage) || 1;
  const indexOfLastReport = currentPage * postsPerPage;
  const indexOfFirstReport = indexOfLastReport - postsPerPage;
  const currentReports = sortedReports.slice(
    indexOfFirstReport,
    indexOfLastReport,
  );

  const toggleSort = (type: "data" | "id") => {
    if (sortType === type) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortType(type);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const getPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 3;
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      items.push(i);
    }
    return items;
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFilterState({ ...filterState, [e.target.name]: e.target.value });
  }

  function clearFilters() {
    setFilterState({
      categoria: "",
      dataInicial: "",
      dataFinal: "",
      busca: "",
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary mb-2">Relatórios</h1>
          <p className="text-muted-foreground text-sm">
            Gere e baixe relatórios e recibos em PDF.
          </p>
        </div>
        <Button
          className="bg-primary font-semibold h-10 text-white hover:scale-[1.02] transition-transform cursor-pointer"
          onClick={() => navigate("/admin/relatorios/novo")}
        >
          <Plus className="h-4 w-4" />
          Gerar relatório
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-2 border-secondary rounded-xl p-3 bg-white w-full">
        <Select
          value={filterState.categoria}
          onValueChange={(val) =>
            setFilterState({
              ...filterState,
              categoria: val === "todas" ? "" : val,
            })
          }
        >
          <SelectTrigger className="w-full sm:w-[180px] text-slate-600 cursor-pointer">
            <SelectValue placeholder="Categorias" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="todas" className="hover:bg-muted cursor-pointer">
              Todas as categorias
            </SelectItem>
            {catOptions.map((opcao) => (
              <SelectItem
                key={opcao.valor}
                value={opcao.valor}
                className="hover:bg-muted cursor-pointer"
              >
                {opcao.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DatePicker 
          date={isoToDate(filterState.dataInicial)} 
          setDate={(date) =>
            setFilterState({
              ...filterState,
              dataInicial: date ? toIsoDate(date) : "",
            })
          } 
          placeholder="Data Inicial" 
          className="text-muted-foreground w-full xl:w-auto min-w-45"
        />
        <DatePicker 
          date={isoToDate(filterState.dataFinal)} 
          setDate={(date) =>
            setFilterState({
              ...filterState,
              dataFinal: date ? toIsoDate(date) : "",
            })
          } 
          placeholder="Data Final" 
          className="text-muted-foreground w-full xl:w-auto min-w-45"
        />

        <div className="relative flex-1 min-w-[200px]">
          <Input
            name="busca"
            value={filterState.busca}
            onChange={handleChange}
            placeholder="Pesquisar relatório..."
            className="pl-4"
          />
        </div>

        <Button
          variant="ghost"
          onClick={clearFilters}
          className="w-full xl:w-auto font-medium bg-gray-200 cursor-pointer"
        >
          Limpar Filtros
        </Button>
      </div>

      <div className="w-full bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden mt-6">
        <div className="w-full overflow-x-auto">
          <Table className="w-full">
            <TableHeader className="bg-[#002845]">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-white font-medium h-12 px-4 text-sm">
                  ID
                </TableHead>
                <TableHead className="text-white font-medium h-12 px-4 text-sm">
                  Nome
                </TableHead>
                <TableHead className="text-white font-medium h-12 px-4 text-sm">
                  Descrição
                </TableHead>
                <TableHead className="text-white font-medium h-12 text-sm">
                  Categoria
                </TableHead>
                <TableHead
                  className="text-white font-medium h-12 px-4 text-sm text-center cursor-pointer hover:bg-secondary/90 transition-colors w-48"
                  onClick={() => {
                    toggleSort("data");
                  }}
                >
                  <div className="flex items-center justify-center gap-1">
                    Data de geração
                    <ArrowUpDown
                      size={14}
                      className={
                        sortOrder === "asc" ? "opacity-100" : "opacity-50"
                      }
                    />
                  </div>
                </TableHead>
                <TableHead className="text-white font-medium text-right px-6 w-32">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="border-b border-zinc-200">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Loader2 className="animate-spin inline mr-2" />{" "}
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : (
                currentReports.map((report) => (
                  <TableRow
                    key={report.id}
                    className="hover:bg-zinc-50 bg-white last:border-0 border-b border-zinc-100"
                  >
                    <TableCell className="text-muted-foreground py-4 text-sm">
                      {report.id}
                    </TableCell>
                    <TableCell>
                      <span className=" text-zinc-800 truncate block py-4 text-sm max-w-[200px]">
                        {report.nome}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className=" text-zinc-800 truncate block py-4 text-sm max-w-[200px]">
                        {report.descricao}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className=" text-zinc-600 py-4 text-sm">
                        {report.categoria}
                      </span>
                    </TableCell>
                    <TableCell className="text-zinc-600 text-sm text-center">
                      {formatReportDate(report.dataGeracao)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-end gap-1">
                        <button
                          className="p-2 text-muted-foreground hover:bg-primary/10 rounded-md transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedReport(report);
                            setOpenModal(true);
                          }}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="p-2 text-primary hover:bg-zinc-100 rounded-md transition-colors cursor-pointer"
                          onClick={async () => {
                            try {
                              const res = await fetch(report.urlDocumento);

                              if (!res.ok) {
                                throw new Error("Erro ao baixar arquivo");
                              }

                              const blob = await res.blob();
                              const url = window.URL.createObjectURL(blob);

                              const a = document.createElement("a");

                              const nomeSeguro = (report.nome || "relatorio")
                                .normalize("NFD")
                                .replace(/[\u0300-\u036f]/g, "")
                                .replace(/[^a-zA-Z0-9-_ ]/g, "");

                              a.href = url;
                              a.download = `${nomeSeguro}.pdf`;

                              document.body.appendChild(a);
                              a.click();
                              a.remove();

                              window.URL.revokeObjectURL(url);
                            } catch (error) {
                              console.error("Erro ao baixar arquivo:", error);
                            }
                          }}
                        >
                          <Download size={18} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="py-4 grid grid-cols-1 sm:grid-cols-3 items-center border-t border-zinc-100 px-6 bg-white gap-4 sm:gap-0">
          <div className="hidden sm:block"></div>
          <div className="flex items-center justify-center gap-2 text-sm text-secondary">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="hover:text-primary font-medium disabled:opacity-30 cursor-pointer transition-all px-2"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {getPaginationItems().map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md transition-all border-secondary font-medium ${
                    currentPage === page
                      ? "border border-secondary bg-white text-secondary shadow-sm cursor-pointer"
                      : "hover:bg-zinc-100 text-zinc-600 cursor-pointer"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className=" cursor-pointer transition-all flex items-center font-medium text-secondary px-2"
            >
              Next <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
      <div className="text-sm text-zinc-500 text-center sm:text-right">
        {filteredReports.length} resultados
      </div>
      <ReportModal
        report={selectedReport}
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
}
