import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ModalNovaSolicitacao } from "@/components/sections/cliente/ModalNovaSolicitacao";
import { DashboardSolicitacoes } from "@/components/sections/cliente/DashboardSolicitacoes";
import { SolicitacoesEmpty } from "@/components/sections/cliente/SolicitacoesEmpty";
import {
  solicitacaoService,
  type SolicitacaoResumo,
} from "@/services/solicitacaoService";

const USUARIO_ID = 1;

export default function Solicitacoes() {
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(location.state?.openModal || false);
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoResumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  async function carregarSolicitacoes() {
    setLoading(true);
    setErro(null);

    try {
      const data = await solicitacaoService.listar({ usuario_id: USUARIO_ID });
      setSolicitacoes(data.solicitacoes);
    } catch {
      setErro("Nao foi possivel carregar as solicitacoes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center p-4 md:p-6">
        <p className="text-sm text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex h-40 items-center justify-center p-4 md:p-6">
        <p className="text-sm text-red-500">{erro}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Solicitacoes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Solicite novos processos e acompanhe a listagem disponivel nesta
            branch.
          </p>
        </div>

        {solicitacoes.length > 0 && (
          <Button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1 bg-[#3979A5] text-white hover:bg-[#2e5f83]"
          >
            <Plus className="h-4 w-4" />
            Nova solicitacao
          </Button>
        )}
      </div>

      {solicitacoes.length > 0 ? (
        <DashboardSolicitacoes solicitacoes={solicitacoes} />
      ) : (
        <SolicitacoesEmpty onNovaSolicitacao={() => setModalOpen(true)} />
      )}

      <ModalNovaSolicitacao
        open={modalOpen}
        onOpenChange={setModalOpen}
        usuarioId={USUARIO_ID}
        onSucesso={carregarSolicitacoes}
      />
    </div>
  );
}
