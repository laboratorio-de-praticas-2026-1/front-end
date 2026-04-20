import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SquarePen, Trash2, ChevronRight, Plus, Search } from "lucide-react";

export function CarouselAdmin() {
  type Banner = {
    id: string;
    image: string;
    description: string;
    status: "Ativo" | "Inativo";
    servico: string;
  };

  const [statusFilter, setStatusFilter] = useState("Todos");
  const [servicoFilter, setServicoFilter] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [banners] = useState<Banner[]>([
    {
      id: "#001",
      image: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=400&q=70",
      description: "O licenciamento SP 2026 já pode ser feito de maneira simples",
      status: "Ativo",
      servico: "Licenciamento",
    },
    {
      id: "#002",
      image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=70",
      description: "Carros 2026: 5 modelos que vão ganhar as ruas",
      status: "Inativo",
      servico: "Outros",
    },
    {
      id: "#003",
      image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=400&q=70",
      description: "Como parcelar o IPVA 2026 atrasado",
      status: "Ativo",
      servico: "Licenciamento",
    },
    {
      id: "#004",
      image: "https://images.unsplash.com/photo-1558980664-4bd4e7d17a0f?auto=format&fit=crop&w=400&q=70",
      description: "Como funcionará o pedágio free flow na anchieta",
      status: "Ativo",
      servico: "Outros",
    },
    {
      id: "#005",
      image: "https://images.unsplash.com/photo-1470312881728-2952259723d0?auto=format&fit=crop&w=400&q=70",
      description: "Licenciamento RJ 2026: Taxa do detran, prazo e consulta",
      status: "Inativo",
      servico: "Licenciamento",
    },
    {
      id: "#006",
      image: "https://images.unsplash.com/photo-1554136898-4eed26652beb?auto=format&fit=crop&w=400&q=70",
      description: "Estacionamento Allianz Parque: preço, reserva e…",
      status: "Ativo",
      servico: "Outros",
    },
  ]);

  const servicosDisponiveis = useMemo(() => {
    const servicos = new Set(banners.map(b => b.servico));
    return Array.from(servicos);
  }, [banners]);

  const filteredBanners = useMemo(() => {
    return banners.filter((banner) => {
      const term = searchTerm.toLowerCase();
      const matchesTerm =
        banner.id.toLowerCase().includes(term) ||
        banner.description.toLowerCase().includes(term);
      const matchesStatus =
        statusFilter === "Todos" ? true : banner.status === statusFilter;
      const matchesServico = 
        servicoFilter === "Todos" ? true : banner.servico === servicoFilter;
        
      return matchesTerm && matchesStatus && matchesServico;
    });
  }, [banners, searchTerm, statusFilter, servicoFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, servicoFilter]);

  const totalPages = Math.ceil(filteredBanners.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBanners = filteredBanners.slice(indexOfFirstItem, indexOfLastItem);

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

  const navigate = useNavigate();

  const handleAddNew = () => navigate("/admin/carrossel/novo");
  const handleEdit = (id: string) => navigate(`/admin/carrossel/${encodeURIComponent(id)}/editar`);
  const handleDelete = (id: string) => setBannerToDelete(id);

  const confirmDelete = () => {
    if (!bannerToDelete) return;
    setBannerToDelete(null);
  };

  const cancelDelete = () => setBannerToDelete(null);

  const handleClearFilters = () => {
    setStatusFilter("Todos");
    setServicoFilter("Todos");
    setSearchTerm("");
  };

  return (
    <div className="rounded-[28px] p-7">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-[34px] leading-none font-bold text-secondary">Carrossel</h1>
          <p className="text-sm text-zinc-500 mt-2">Visualize, crie, organize e gerencie todos os banners do seu carrossel de serviços.</p>
        </div>
        <Button 
          onClick={handleAddNew} 
          className="w-full lg:w-auto cursor-pointer bg-primary text-white font-medium shadow-sm transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] h-10 px-6 rounded-md flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo banner
        </Button>
      </div>

      <div className="mt-7 w-full border-2 border-secondary rounded-xl p-2 bg-white flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full lg:w-40 border border-zinc-300 rounded-md bg-transparent focus:ring-0 text-muted-foreground h-10 shadow-none">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            <SelectItem value="Todos" className="cursor-pointer">Todos</SelectItem>
            <SelectItem value="Ativo" className="cursor-pointer">Ativo</SelectItem>
            <SelectItem value="Inativo" className="cursor-pointer">Inativo</SelectItem>
          </SelectContent>
        </Select>

        <Select value={servicoFilter} onValueChange={setServicoFilter}>
          <SelectTrigger className="w-full lg:w-48 border border-zinc-300 rounded-md bg-transparent focus:ring-0 text-muted-foreground h-10 shadow-none">
            <SelectValue placeholder="Tipo de serviço" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            <SelectItem value="Todos" className="cursor-pointer">Todos</SelectItem>
            {servicosDisponiveis.map(servico => (
              <SelectItem key={servico} value={servico} className="cursor-pointer">{servico}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative flex-1 group flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-secondary" />
          <Input
            type="search"
            placeholder="Pesquisar banner..."
            className="pl-9 border border-zinc-300 rounded-md bg-transparent focus-visible:ring-0 h-10 w-full text-sm shadow-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button 
          variant="secondary"
          onClick={handleClearFilters}
          className="w-full lg:w-auto h-10 bg-zinc-200 text-zinc-700 hover:bg-zinc-300 rounded-md cursor-pointer"
        >
          Limpar filtros
        </Button>

        
      </div>

      <div className="mt-4 w-full bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-[#032a4e] hover:bg-[#032a4e]">
                <TableHead className="text-white font-medium">ID</TableHead>
                <TableHead className="text-white font-medium">Imagem</TableHead>
                <TableHead className="text-white font-medium">Descrição</TableHead>
                <TableHead className="text-white font-medium w-28">Status</TableHead>
                <TableHead className="text-white font-medium text-right px-6 w-32">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="border-b border-zinc-200">
              {currentBanners.map((banner) => (
                <TableRow key={banner.id} className="hover:bg-zinc-50 bg-white">
                  <TableCell className="text-muted-foreground font-medium">{banner.id}</TableCell>
                  <TableCell className="p-2">
                    <img src={banner.image} alt={banner.description} className="h-14 w-24 object-cover rounded-md shadow-sm border border-zinc-200" />
                  </TableCell>
                  <TableCell className="font-medium text-foreground truncate max-w-[420px]">{banner.description}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        banner.status === "Ativo" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {banner.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(banner.id)} 
                        className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors cursor-pointer" 
                        aria-label={`Editar ${banner.id}`}
                      >
                        <SquarePen size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(banner.id)} 
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer" 
                        aria-label={`Excluir ${banner.id}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption className="hidden">{filteredBanners.length} resultados</TableCaption>
          </Table>

          {filteredBanners.length === 0 && (
            <div className="text-center py-10 text-zinc-500">Nenhum banner encontrado.</div>
          )}
        </div>

        {filteredBanners.length > 0 && (
          <div className="py-4 grid grid-cols-1 sm:grid-cols-3 items-center px-6 bg-white gap-4 sm:gap-0">
            <div className="hidden sm:block"></div>
            <div className="flex items-center justify-center gap-2 text-sm text-secondary">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="hover:text-primary font-medium disabled:opacity-30 cursor-pointer transition-all px-2"
              >
                Anterior
              </button>
              
              <div className="flex items-center gap-1">
                {getPaginationItems().map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md transition-all font-medium ${
                      currentPage === page 
                        ? "bg-primary text-white shadow-sm" 
                        : "hover:bg-zinc-100 text-zinc-600 cursor-pointer"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                {totalPages > 3 && currentPage < totalPages - 1 && (
                  <span className="px-1 text-zinc-400">...</span>
                )}
              </div>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="disabled:opacity-30 cursor-pointer transition-all flex items-center font-medium hover:text-primary px-2"
              >
                Próxima <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
            
            <div className="text-sm text-zinc-500 text-center sm:text-right">
              {filteredBanners.length} {filteredBanners.length === 1 ? 'resultado' : 'resultados'}
            </div>
          </div>
        )}
      </div>

      {bannerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl border border-zinc-200 overflow-hidden">
            <div className="p-4 text-center border-b border-zinc-200">
              <h3 className="text-lg font-bold text-zinc-900">Excluir banner?</h3>
              <p className="mt-2 text-sm text-zinc-500">
                Tem certeza que deseja excluir o banner {bannerToDelete}?<br />
                O banner será removido do fluxo do carrossel imediatamente.
              </p>
            </div>
            <div className="flex justify-end gap-2 p-4">
              <Button variant="outline" onClick={cancelDelete} className="h-10 cursor-pointer">
                Voltar
              </Button>
              <Button variant="destructive" onClick={confirmDelete} className="h-10 cursor-pointer">
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}