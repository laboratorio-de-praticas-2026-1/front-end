import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface SolicitacaoCriadaState {
  mensagem: string;
  servico: string;
  valorBase: number | null;
  dataSolicitacao: string;
  prazoEstimado: string;
  clienteNome: string;
}

interface LocationState {
  solicitacaoCriada?: SolicitacaoCriadaState;
}

function formatarData(data: string): string {
  const valor = new Date(`${data}T00:00:00`);

  if (Number.isNaN(valor.getTime())) {
    return data;
  }

  return valor.toLocaleDateString("pt-BR");
}

function formatarMoeda(valor: number | null): string {
  if (valor === null) {
    return "-";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

export default function SolicitacaoSucesso() {
  const navigate = useNavigate();
  const location = useLocation();
  const { solicitacaoCriada } = (location.state as LocationState) ?? {};

  useEffect(() => {
    if (!solicitacaoCriada) {
      navigate("/cliente/solicitacoes", { replace: true });
    }
  }, [navigate, solicitacaoCriada]);

  if (!solicitacaoCriada) {
    return null;
  }

  const handleNovaSolicitacao = () => {
    navigate("/cliente/solicitacoes", { state: { openModal: true } });
  };

  const handleIrPainel = () => {
    navigate("/cliente/solicitacoes");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl">
        <Card className="overflow-hidden border-green-200 shadow-lg">
          <div className="flex flex-col items-center bg-green-600 p-6 text-white">
            <CheckCircle2 className="mb-3 h-16 w-16" />
            <h1 className="text-center text-2xl font-bold">
              Solicitacao de Servico realizada com sucesso!
            </h1>
            <p className="mt-2 text-center text-green-100">
              {solicitacaoCriada.mensagem}
            </p>
          </div>

          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-gray-700" />
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Cliente
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {solicitacaoCriada.clienteNome}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between gap-4 pb-2">
                <span className="text-sm text-gray-500">Servico solicitado</span>
                <span className="text-right font-medium text-gray-900">
                  {solicitacaoCriada.servico}
                </span>
              </div>

              <div className="flex justify-between gap-4 pb-2">
                <span className="text-sm text-gray-500">Valor base</span>
                <span className="text-right font-medium text-gray-900">
                  {formatarMoeda(solicitacaoCriada.valorBase)}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-b-2 border-gray-300 pb-2">
                <span className="text-sm text-gray-500">Veiculo</span>
                <span className="text-right font-medium text-gray-900">-</span>
              </div>

              <div className="flex justify-between gap-4 pb-2">
                <span className="text-sm text-gray-500">Data de solicitacao</span>
                <span className="text-right font-medium text-gray-900">
                  {formatarData(solicitacaoCriada.dataSolicitacao)}
                </span>
              </div>

              <div className="flex justify-between gap-4 pb-2">
                <span className="text-sm text-gray-500">Prazo estimado</span>
                <span className="text-right font-medium text-gray-900">
                  {formatarData(solicitacaoCriada.prazoEstimado)}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <Button
                onClick={handleIrPainel}
                className="flex-1 bg-[#002749] text-white hover:bg-[#001a33]"
              >
                Ir ao painel
              </Button>
              <Button
                onClick={handleNovaSolicitacao}
                className="flex-1 bg-[#3979A5] text-white hover:bg-[#2e5f83]"
              >
                Nova solicitacao
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
