import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Plus } from "lucide-react";

import { DashboardSolicitacoes } from "@/components/sections/cliente/DashboardSolicitacoes";
import { ModalNovaSolicitacao } from "@/components/sections/cliente/ModalNovaSolicitacao";
import { SolicitacoesEmpty } from "@/components/sections/cliente/SolicitacoesEmpty";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  resolveClienteUsuarioId,
  solicitacaoService,
  type ClienteSolicitacao,
} from "@/services/solicitacaoService";

export default function Solicitacoes() {
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(location.state?.openModal || false);
  const [solicitacoes, setSolicitacoes] = useState<ClienteSolicitacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const usuarioId = resolveClienteUsuarioId();

  const carregarSolicitacoes = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await solicitacaoService.listarSolicitacoes({ usuarioId });
      setSolicitacoes(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Nao foi possivel carregar as solicitacoes.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void carregarSolicitacoes();
  }, [usuarioId]);

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Solicitacoes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Acompanhe suas solicitacoes e gere o recibo direto na tela de
            detalhes.
          </p>
        </div>

        <Button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1 bg-[#3979A5] text-white hover:bg-[#2e5f83]"
        >
          <Plus className="h-4 w-4" />
          Nova solicitacao
        </Button>
      </div>

      {isLoading ? (
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6 text-sm text-gray-500">
            Carregando solicitacoes...
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border-red-200 shadow-sm">
          <CardContent className="p-6 text-sm text-red-600">{error}</CardContent>
        </Card>
      ) : solicitacoes.length > 0 ? (
        <DashboardSolicitacoes solicitacoes={solicitacoes} />
      ) : (
        <SolicitacoesEmpty onNovaSolicitacao={() => setModalOpen(true)} />
      )}

      <ModalNovaSolicitacao
        open={modalOpen}
        onOpenChange={setModalOpen}
        usuarioId={usuarioId}
        onSucesso={carregarSolicitacoes}
      />
    </div>
  );
}
