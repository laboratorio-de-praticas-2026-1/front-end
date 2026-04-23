import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BuscaCadastroPublicidade from "@/components/sections/admin/publicidade/BuscaCadastroPublicidade";
import PublicidadeTable from "@/components/tables/PublicidadeTable";
import { publicidadeService } from "@/services/publicidadeService";
import type { PublicidadePost } from "@/services/publicidadeService";
import { Button } from "@/components/ui/button";

export function PublicidadeAdmin() {
  const [publicidades, setPublicidades] = useState<PublicidadePost[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [termoBusca, setTermoBusca] = useState("");
  const [statusBusca, setStatusBusca] = useState("Todos");
  const [excluindoId, setExcluindoId] = useState<number | null>(null);
  const [publicidadeToDelete, setPublicidadeToDelete] = useState<PublicidadePost | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const delay = setTimeout(() => {
      carregarPublicidades();
    }, 350);

    return () => clearTimeout(delay);
  }, [termoBusca, statusBusca]);

  const carregarPublicidades = async () => {
    setCarregando(true);
    try {
      const dados = await publicidadeService.buscarPorTermo(termoBusca);

      const dadosFiltrados =
        statusBusca === "Todos"
          ? dados
          : dados.filter((item) => {
            if (typeof item.ativo !== "boolean") {
              return true;
            }
            return statusBusca === "Ativo" ? item.ativo : !item.ativo;
          });

      setPublicidades(dadosFiltrados);
    } catch (error) {
      console.error("Erro ao buscar publicidades:", error);
    } finally {
      setCarregando(false);
    }
  };

  const handlePesquisa = async (filtros: { busca: string; status: string }) => {
    setCarregando(true);
    try {
      if (!filtros.status || filtros.status === "Todos") {
        const dados = await publicidadeService.listarTodos();
        setPublicidades(dados);
        return;
      }

      const dados = await publicidadeService.buscarPorStatus(filtros.status);
      setPublicidades(dados);
    } catch (error) {
      console.error("Erro ao pesquisar publicidades:", error);
    } finally {
      setCarregando(false);
    }
  };

  const irParaCriarPublicidade = () => {
    navigate("/admin/publicidade/novo");
  };

  const solicitarExclusaoPublicidade = (id: number) => {
    const pubSelecionada = publicidades.find((pub) => pub.id === id) || null;
    setPublicidadeToDelete(pubSelecionada);
  };

  const confirmarExclusaoPublicidade = async () => {
    if (!publicidadeToDelete) return;

    setExcluindoId(publicidadeToDelete.id);
    try {
      await publicidadeService.deletar(publicidadeToDelete.id);
      await carregarPublicidades();
      setPublicidadeToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir publicidade:", error);
      alert("Não foi possível excluir a publicidade.");
    } finally {
      setExcluindoId(null);
    }
  };

  const cancelarExclusaoPublicidade = () => {
    if (excluindoId) return;
    setPublicidadeToDelete(null);
  };

  return (
    <div className="flex flex-col gap-6">

      <BuscaCadastroPublicidade onNovaPublicidade={irParaCriarPublicidade} onSearch={handlePesquisa} />
      
      <PublicidadeTable publicidades={publicidades} carregando={carregando} excluindoId={excluindoId} onExcluirPublicidade={solicitarExclusaoPublicidade} />

      {publicidadeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl border border-zinc-200 overflow-hidden">
            <div className="p-4 text-center border-b border-zinc-200">
              <h3 className="text-lg font-bold text-zinc-900">Excluir publicidade?</h3>
              <p className="mt-2 text-sm text-zinc-500">
                Tem certeza que deseja excluir a publicidade #{publicidadeToDelete.id}?<br />
                Esta ação não poderá ser desfeita.
              </p>
            </div>
            <div className="flex justify-end gap-2 p-4">
              <Button variant="outline" onClick={cancelarExclusaoPublicidade} className="h-10" disabled={Boolean(excluindoId)}>
                Voltar
              </Button>
              <Button variant="destructive" onClick={confirmarExclusaoPublicidade} className="h-10" disabled={Boolean(excluindoId)}>
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
