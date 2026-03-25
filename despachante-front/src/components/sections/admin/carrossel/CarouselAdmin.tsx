import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table";
import { SquarePen, Trash2, ChevronRight, Loader2 } from "lucide-react";
import { carouselService } from "@/services/carrosselService";
import type { CarouselBanner } from "@/services/carrosselService";

export function CarouselAdmin() {
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [bannerToDelete, setBannerToDelete] = useState<CarouselBanner | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [excluindoId, setExcluindoId] = useState<number | null>(null);

  // Estados para controlar a paginação (Igual ao Blog)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [banners, setBanners] = useState<CarouselBanner[]>([]);

  const carregarBanners = async () => {
    setCarregando(true);
    try {
      const dados = await carouselService.listarTodos();
      setBanners(dados);
    } catch (error) {
      console.error("Erro ao buscar banners:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    let cancelado = false;

    const carregar = async () => {
      setCarregando(true);
      try {
        const dados = await carouselService.listarTodos();
        if (!cancelado) setBanners(dados);
      } catch (error) {
        console.error("Erro ao buscar banners:", error);
      } finally {
        if (!cancelado) setCarregando(false);
      }
    };

    carregar();
    return () => { cancelado = true; };
  }, []);

  // Filtra os resultados
  const filteredBanners = useMemo(() => {
    return banners.filter((banner) => {
      const term = searchTerm.toLowerCase();
      const matchesTerm =
        String(banner.id).toLowerCase().includes(term) ||
        banner.descricao.toLowerCase().includes(term);
      const matchesStatus =
        statusFilter === "Todos" ? true : banner.ativo === (statusFilter === "Ativo");
      return matchesTerm && matchesStatus;
    });
  }, [banners, searchTerm, statusFilter]);

  // Se o usuário pesquisar algo, volta para a página 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Lógica matemática da paginação (Igual ao Blog)
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
  const handleEdit = (id: number) => navigate(`/admin/carrossel/${id}/editar`);
  const handleDelete = (id: number) => {
    const selecionado = banners.find((b) => b.id === id) || null;
    setBannerToDelete(selecionado);
  };

  const confirmDelete = async () => {
    if (!bannerToDelete) return;
    setExcluindoId(bannerToDelete.id);
    try {
      await carouselService.deletar(bannerToDelete.id);
      await carregarBanners();
      setBannerToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir banner:", error);
      alert("N\u00e3o foi poss\u00edvel excluir o banner.");
    } finally {
      setExcluindoId(null);
    }
  };

  const cancelDelete = () => {
    if (excluindoId) return;
    setBannerToDelete(null);
  };

  return (
    <div className=" rounded-[28px]  p-7">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-[34px] leading-none font-bold text-secondary">Carrossel</h1>
          <p className="text-sm text-zinc-500 mt-2">Visualize, crie, organize e gerencie todos os banners do seu carrossel de serviços.</p>
        </div>
      </div>

      <div className="mt-7 w-full rounded-xl border border-[#0a355e] bg-white p-1.5 flex flex-col lg:flex-row gap-2 items-stretch">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-44 rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Todos">Status</option>
            <option>Ativo</option>
            <option>Inativo</option>
          </select>

          <Input
            type="search"
            placeholder="Pesquisar banner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-50 focus:ring-2 focus:ring-[#1E84CF]"
          />
        </div>

        <Button 
          onClick={handleAddNew} 
          className="w-full lg:w-auto cursor-pointer bg-primary text-white font-bold shadow-sm transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] h-10 px-6 rounded-lg"
        >
            + Novo banner
        </Button>
      </div>

      {/* Tabela englobando a paginação no mesmo container (Igual ao Blog) */}
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
              {carregando ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-zinc-500">
                      <Loader2 className="h-7 w-7 animate-spin text-primary" />
                      <span>Buscando banners...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
              /* Agora renderizamos currentBanners em vez de filteredBanners */
              currentBanners.map((banner) => (
                <TableRow key={banner.id} className="hover:bg-zinc-50 bg-white">
                  <TableCell className="text-muted-foreground font-medium">#{banner.id}</TableCell>
                  <TableCell className="p-2">
                    <img src={banner.urlImagem} alt={banner.descricao} className="h-14 w-24 object-cover rounded-md shadow-sm border border-zinc-200" />
                  </TableCell>
                  <TableCell className="font-medium text-foreground truncate max-w-[420px]">{banner.descricao}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        banner.ativo === true ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {banner.ativo ? "Ativo" : "Inativo"}
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
                        disabled={excluindoId === banner.id}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label={`Excluir ${banner.id}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
              )}
            </TableBody>
            <TableCaption className="hidden">{filteredBanners.length} resultados</TableCaption>
          </Table>

          {!carregando && filteredBanners.length === 0 && (
            <div className="text-center py-10 text-zinc-500">Nenhum banner encontrado.</div>
          )}
        </div>

        {/* Paginação Perfeita Idêntica à do Blog */}
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

      {/* Modal de Exclusão */}
      {bannerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl border border-zinc-200 overflow-hidden">
            <div className="p-4 text-center border-b border-zinc-200">
              <h3 className="text-lg font-bold text-zinc-900">Excluir banner?</h3>
              <p className="mt-2 text-sm text-zinc-500">
                Tem certeza que deseja excluir o banner #{bannerToDelete.id}?<br />
                O banner será removido do fluxo do carrossel imediatamente.
              </p>
            </div>
            <div className="flex justify-end gap-2 p-4">
              <Button variant="outline" onClick={cancelDelete} className="h-10 cursor-pointer" disabled={Boolean(excluindoId)}>
                Voltar
              </Button>
              <Button variant="destructive" onClick={confirmDelete} className="h-10 cursor-pointer" disabled={Boolean(excluindoId)}>
                {excluindoId ? <Loader2 className="h-4 w-4 animate-spin" /> : "Excluir"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}