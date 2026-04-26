import { SquarePen, Trash, Plus, ChevronRight, Loader2, ArrowUpDown } from "lucide-react";
import { useState, useMemo, useEffect } from "react"; // Adicionado useEffect
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { FAQItem, FAQStatus, FAQFilters, FAQCategoryOption, FAQStatusOption } from "@/types/faq.types";
import { FAQ_MOCK_DATA, FAQ_CATEGORIES_MOCK, FAQ_STATUS_MOCK } from "@/mocks/faq.mocks";
import { ConfirmDeleteModalFaq } from "./ConfirmDeleteModal";
import { id } from "date-fns/locale";

export default function FAQ() {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [catOptions, setCatOptions] = useState<FAQCategoryOption[]>([]);
  const [statusOptions, setStatusOptions] = useState<FAQStatusOption[]>([]);
  const [sortType, setSortType] = useState<"id">("id") 
  const [loading, setLoading] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FAQItem | null>(null)
  const [openModal, setOpenModal] = useState(false)

  const [filterState, setFilterState] = useState<FAQFilters>({
    busca: "",
    categoria: "",
    status: "todas",
    page: 1,
    sortOrder: "desc"
   });

  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const postsPerPage = 7;

  const statusColor: Record<FAQStatus, string> = {
    Ativo: "bg-green-500",
    Inativo: "bg-red-400",
  }; 

  useEffect(() => {
  const loadData = async () => {
    setLoading(true);
    try {
      setFaqs(FAQ_MOCK_DATA);
      setCatOptions(FAQ_CATEGORIES_MOCK);
      setStatusOptions(FAQ_STATUS_MOCK);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  loadData();
}, []);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((f) => {
      const matchesSearch =
        (f.pergunta ?? "").toLowerCase().includes(filterState.busca.toLowerCase()) ||
        (f.resposta ?? "").toLowerCase().includes(filterState.busca.toLowerCase()) ||
        (f.status ?? "").toLowerCase().includes(filterState.busca.toLowerCase()) ||
        String(f.id ?? "").includes(filterState.busca);

      const matchesCategoria = !filterState.categoria || filterState.categoria === "todas" || f.categoria === filterState.categoria;
      const matchesStatus = filterState.status === "todas" || f.status === filterState.status;

      return (
        matchesSearch &&
        matchesCategoria &&
        matchesStatus
      );
    });
  }, [faqs, filterState]);

  const sortedFaqs = [...filteredFaqs].sort((a, b) => {
    const idA = Number(a.id.toString().replace("#", ""));
    const idB = Number(b.id.toString().replace("#", ""));

    // Aplica a lógica de asc/desc baseada no estado sortOrder
    if (sortOrder === 'asc') {
      return idA - idB;
    } else {
      return idB - idA;
    }
  })

  const totalPages = Math.ceil(sortedFaqs.length / postsPerPage) || 1;
  const indexOfLastReport = currentPage * postsPerPage;
  const indexOfFirstReport = indexOfLastReport - postsPerPage;
  const currentFaqs = sortedFaqs.slice(indexOfFirstReport, indexOfLastReport);

  const toggleSort = () => {
    setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
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
    for (let i = startPage; i <= endPage; i++) { items.push(i); }
    return items;
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFilterState({ ...filterState, [e.target.name]: e.target.value });
  }

  function clearFilters() {
  setFilterState({
    busca: "",
    categoria: "",
    status: "todas",
    page: 1,
    sortOrder: "desc",
  });
}

  const handleDelete = async () => {
    if (!selectedFaq) return
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setFaqs((prev) => prev.filter((f) => f.id !== selectedFaq.id))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary mb-2">FAQ</h1>
          <p className="text-muted-foreground text-sm">Visualize, crie, organize e gerencie todas as perguntas do seu FAQ.</p>
        </div>
        <Button
          className="bg-primary font-semibold h-10 text-white hover:scale-[1.02] transition-transform cursor-pointer"
          onClick={() => navigate("/admin/faq/novo")}
        >
          <Plus className="h-4 w-4" />
          Nova Pergunta
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-2 border-secondary rounded-xl p-3 bg-white w-full">
        
        <div className="relative flex-1 min-w-[180px]">
          <Input
            name="busca"
            value={filterState.busca}
            onChange={handleChange}
            placeholder="Pesquisar relatório..."
            className="pl-4"
          />
        </div>

            <Select 
                value={filterState.status} 
                onValueChange={(val) => 
                    setFilterState({ ...filterState, status: val as FAQStatus | "todas" })
                }
            >
            <SelectTrigger className="w-full sm:w-[180px] text-slate-600 cursor-pointer">
                <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white">
                {statusOptions.map((status) => (
                    <SelectItem 
                    key={status.value}
                    value={status.value} 
                    className="hover:bg-muted cursor-pointer">
                        {status.label}
                    </SelectItem>
                ))}
            </SelectContent>
            </Select>

            <Select 
            value={filterState.categoria} 
            onValueChange={(val) => setFilterState({ ...filterState, categoria: val })}
            >
            <SelectTrigger className="w-full sm:w-[180px] text-slate-600 cursor-pointer">
                <SelectValue placeholder="Categorias" />
            </SelectTrigger>
            <SelectContent className="bg-white">
                {catOptions.map((opcao) => (
                    <SelectItem 
                    key={opcao.value}
                    value={opcao.value} 
                    className="hover:bg-muted cursor-pointer">
                        {opcao.label}
                    </SelectItem>
                ))}
            </SelectContent>
            </Select>

        

        <Button variant="ghost" onClick={clearFilters} className="w-full xl:w-auto font-medium bg-gray-200 cursor-pointer">
          Limpar Filtros
        </Button>
      </div>

      <div className="w-full bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden mt-6">
        <div className="w-full overflow-x-auto">
          <Table className="w-full">
            <TableHeader className="bg-[#002845]">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-white font-medium h-12 px-4 text-sm">ID</TableHead>
                <TableHead className="text-white font-medium h-12 px-4 text-sm">Pergunta</TableHead>
                <TableHead className="text-white font-medium h-12 px-4 text-sm">Resposta</TableHead>
                <TableHead className="text-white font-medium text-right px-6 w-32">Status</TableHead>
                <TableHead className="text-white font-medium text-right px-6 w-32">Ações</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody className="border-b border-zinc-200">
              {loading ? (
                <TableRow><TableCell colSpan={6} className="h-24 text-center"><Loader2 className="animate-spin inline mr-2" /> Carregando...</TableCell></TableRow>
              ) : currentFaqs.map((faqs) => (
                <TableRow key={faqs.id} className="hover:bg-zinc-50 bg-white last:border-0 border-b border-zinc-100">
                  <TableCell className="text-muted-foreground py-4 text-sm">{faqs.id}</TableCell>
                  <TableCell><span className=" text-zinc-800 truncate block py-4 text-sm max-w-[200px]">{faqs.pergunta}</span></TableCell>
                  <TableCell><span className=" text-zinc-800 truncate block py-4 text-sm max-w-[200px]">{faqs.resposta}</span></TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-end">
                        <span className={`
                            p-2 py-1 rounded-full text-white text-xs font-semibold
                            ${statusColor[faqs.status]} 
                        `}>
                        {faqs.status}
                    </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-end gap-1">
                      <button 
                      className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors cursor-pointer"
                      onClick={() => navigate(`/admin/faq/editar/${faqs.id.replace('#', '')}`)}
                      >
                        <SquarePen size={18}/>
                        </button>
                      <button 
                      className="p-2 text-red-600 hover:bg-zinc-100 rounded-md transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedFaq(faqs)
                        setOpenModal(true)
                      }}
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="py-4 grid grid-cols-1 sm:grid-cols-3 items-center border-t border-zinc-100 px-6 bg-white gap-4 sm:gap-0">
          <div className="hidden sm:block"></div>
          <div className="flex items-center justify-center gap-2 text-sm text-secondary">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                  className={`w-8 h-8 flex items-center justify-center rounded-md transition-all border-gray-300 font-medium ${
                    currentPage === page ? "border border-gray-300 bg-white text-secondary shadow-sm cursor-pointer" : "hover:bg-zinc-100 text-zinc-600 cursor-pointer"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className=" cursor-pointer transition-all flex items-center font-medium text-secondary px-2"
            >
              Next <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
      <div className="text-sm text-zinc-500 text-center sm:text-right">
        {filteredFaqs.length} resultados
      </div>
      <ConfirmDeleteModalFaq
        open={openModal}
        onOpenChange={setOpenModal}
        onConfirm={handleDelete}
        title="Excluir Pergunta?"
        description={
          <>
            Tem certeza que deseja excluir a pergunta{" "}
            <span className="font-bold text-muted-fore">
              {selectedFaq?.id}
            </span>
            ?<br />
            A pergunta será removida do blog imediatamente.
          </>
        }
      />
    </div>
  );
}
