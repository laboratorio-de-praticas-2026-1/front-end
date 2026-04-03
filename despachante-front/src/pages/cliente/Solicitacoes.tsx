import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ModalNovaSolicitacao } from "../../components/sections/cliente/ModalNovaSolicitacao";
import { DashboardSolicitacoes } from "../../components/sections/cliente/DashboardSolicitacoes";
import { mockSolicitacoes } from "../../mocks/mockSolicitacoes";

export default function Solicitacoes() {
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(location.state?.openModal || false);

  const solicitacoes = mockSolicitacoes;

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">Solicitações</h1>
          <p className="text-sm text-gray-500 mt-1">
            Solicite novos processos e os acompanhe em tempo real.
          </p>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1 bg-[#3979A5] hover:bg-[#2e5f83] text-white"
        >
          <Plus className="h-4 w-4" />
          Nova solicitação
        </Button>
      </div>

      {solicitacoes.length > 0 ? (
        <DashboardSolicitacoes solicitacoes={solicitacoes} />
      ) : (
        <div className="text-center py-20 text-gray-500">
          Nenhuma solicitação encontrada.
        </div>
      )}

      <ModalNovaSolicitacao open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}