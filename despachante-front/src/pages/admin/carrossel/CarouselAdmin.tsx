import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption} from "@/components/ui/table";
import { FiEdit3, FiTrash2 } from "react-icons/fi";

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
    <div className="bg-white rounded-3xl shadow-sm border border-zinc-200">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between p-6 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Carrossel</h1>
          <p className="text-sm text-zinc-500">Visualize, crie, organize e gerencie todos os banners do seu carrossel de serviços.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-stretch">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className=" w-full sm:w-44 rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Todos</option>
            <option>Ativo</option>
            <option>Inativo</option>
          </select>

          <Input
            type="search"
            placeholder="Pesquisar banner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />

          <Button onClick={handleAddNew} className="w-full sm:w-auto rounded-lg">
            + Novo banner
          </Button>
        </div>
      </div>

      <div className="p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Imagem</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredBanners.map((banner) => (
              <TableRow key={banner.id} className="hover:bg-zinc-100">
                <TableCell>{banner.id}</TableCell>
                <TableCell className="p-2">
                  <img src={banner.image} alt={banner.description} className="h-12 w-20 object-cover rounded-md" />
                </TableCell>
                <TableCell>{banner.description}</TableCell>
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
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(banner.id)} className="text-blue-600 hover:text-blue-800">
                      <FiEdit3 />
                    </button>
                    <button onClick={() => handleDelete(banner.id)} className="text-rose-600 hover:text-rose-800">
                      <FiTrash2 />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableCaption>{filteredBanners.length} resultados</TableCaption>
        </Table>

        {filteredBanners.length === 0 && (
          <div className="text-center py-10 text-zinc-500">Nenhum banner encontrado.</div>
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
