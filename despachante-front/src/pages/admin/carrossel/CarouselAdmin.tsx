import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption} from "@/components/ui/table";
import { FiEdit3, FiTrash2, FiChevronRight, FiMoreHorizontal } from "react-icons/fi";

export function CarouselAdmin() {
  type Banner = {
    id: string;
    image: string;
    description: string;
    status: "Ativo" | "Inativo";
  };

  const [statusFilter, setStatusFilter] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);

  const [banners] = useState<Banner[]>([
    {
      id: "#001",
      image: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=400&q=70",
      description: "O licenciamento SP 2026 já pode ser feito de maneira simples",
      status: "Ativo",
    },
    {
      id: "#002",
      image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=70",
      description: "Carros 2026: 5 modelos que vão ganhar as ruas",
      status: "Inativo",
    },
    {
      id: "#003",
      image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=400&q=70",
      description: "Como parcelar o IPVA 2026 atrasado",
      status: "Ativo",
    },
    {
      id: "#004",
      image: "https://images.unsplash.com/photo-1558980664-4bd4e7d17a0f?auto=format&fit=crop&w=400&q=70",
      description: "Como funcionará o pedágio free flow na anchieta",
      status: "Ativo",
    },
    {
      id: "#005",
      image: "https://images.unsplash.com/photo-1470312881728-2952259723d0?auto=format&fit=crop&w=400&q=70",
      description: "Licenciamento RJ 2026: Taxa do detran, prazo e consulta",
      status: "Inativo",
    },
    {
      id: "#006",
      image: "https://images.unsplash.com/photo-1554136898-4eed26652beb?auto=format&fit=crop&w=400&q=70",
      description: "Estacionamento Allianz Parque: preço, reserva e…",
      status: "Ativo",
    },
  ]);

  const filteredBanners = useMemo(() => {
    return banners.filter((banner) => {
      const term = searchTerm.toLowerCase();
      const matchesTerm =
        banner.id.toLowerCase().includes(term) ||
        banner.description.toLowerCase().includes(term);
      const matchesStatus =
        statusFilter === "Todos" ? true : banner.status === statusFilter;
      return matchesTerm && matchesStatus;
    });
  }, [banners, searchTerm, statusFilter]);

  const navigate = useNavigate();

  const handleAddNew = () => {
    navigate("/admin/carrossel/novo");
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/carrossel/${encodeURIComponent(id)}/editar`);
  };

  const handleDelete = (id: string) => {
    setBannerToDelete(id);
  };

  const confirmDelete = () => {
    if (!bannerToDelete) return;
    // Excluir via API aqui
    alert(`Banner ${bannerToDelete} excluído com sucesso`);
    setBannerToDelete(null);
  };

  const cancelDelete = () => {
    setBannerToDelete(null);
  };

  return (
    <div className="bg-zinc-100 rounded-[28px] shadow-sm border border-zinc-200 p-7">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-[34px] leading-none font-bold text-[#032a4e]">Carrossel</h1>
          <p className="text-sm text-zinc-500 mt-2">Visualize, crie, organize e gerencie todos os banners do seu carrossel de serviços.</p>
        </div>
      </div>

      <div className="mt-7 rounded-xl border border-[#0a355e] bg-zinc-100 p-1.5 flex flex-col sm:flex-row gap-2 items-stretch">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-44 rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full sm:w-96 bg-zinc-100"
          />
        </div>

        <Button onClick={handleAddNew} className="w-full sm:w-auto rounded-lg bg-blue-600 hover:bg-blue-700 h-10 px-5">
            + Novo banner
        </Button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-md border border-zinc-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#032a4e] hover:bg-[#032a4e]">
              <TableHead className="text-white font-semibold">ID</TableHead>
              <TableHead className="text-white font-semibold">Imagem</TableHead>
              <TableHead className="text-white font-semibold">Descrição</TableHead>
              <TableHead className="text-white font-semibold w-28">Status</TableHead>
              <TableHead className="text-white font-semibold w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredBanners.map((banner) => (
              <TableRow key={banner.id} className="hover:bg-zinc-50">
                <TableCell className="text-zinc-500">{banner.id}</TableCell>
                <TableCell className="p-2">
                  <img src={banner.image} alt={banner.description} className="h-12 w-20 object-cover rounded-md" />
                </TableCell>
                <TableCell className="max-w-[420px] truncate text-zinc-700">{banner.description}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                      banner.status === "Ativo" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {banner.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-3">
                    <button onClick={() => handleEdit(banner.id)} className="text-blue-500 hover:text-blue-700" aria-label={`Editar ${banner.id}`}>
                      <FiEdit3 />
                    </button>
                    <button onClick={() => handleDelete(banner.id)} className="text-rose-500 hover:text-rose-700" aria-label={`Excluir ${banner.id}`}>
                      <FiTrash2 />
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

      <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-zinc-500 px-1">
        <div className="flex items-center gap-2">
          <button className="text-zinc-400 hover:text-zinc-600">Previous</button>
          <button className="h-7 min-w-7 px-2 rounded-md border border-zinc-300 text-zinc-700 bg-white">1</button>
          <button className="h-7 min-w-7 px-2 rounded-md text-zinc-700">2</button>
          <button className="h-7 min-w-7 px-2 rounded-md text-zinc-700">3</button>
          <span className="px-1 text-zinc-500"><FiMoreHorizontal /></span>
          <button className="text-[#032a4e] hover:text-[#011f3a] flex items-center gap-1">
            Next <FiChevronRight size={14} />
          </button>
        </div>
        <div>1.234 resultados</div>
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
              <Button variant="outline" onClick={cancelDelete} className="h-10">
                Voltar
              </Button>
              <Button variant="destructive" onClick={confirmDelete} className="h-10">
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
