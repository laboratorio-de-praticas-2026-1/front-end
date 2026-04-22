import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatSolicitacaoCurrency,
  formatSolicitacaoDate,
  getSolicitacaoStatusLabel,
  type ClienteSolicitacao,
} from "@/services/solicitacaoService";

interface DashboardSolicitacoesProps {
  solicitacoes: ClienteSolicitacao[];
}

const STATUS_COLOR: Record<ClienteSolicitacao["status"], string> = {
  Recebida: "bg-yellow-100 text-yellow-700",
  "Em andamento": "bg-blue-100 text-blue-700",
  Concluida: "bg-green-100 text-green-700",
  Cancelada: "bg-red-100 text-red-700",
  "Aguardando pagamento": "bg-orange-100 text-orange-700",
  "Aguardando documento": "bg-amber-100 text-amber-800",
};

export function DashboardSolicitacoes({
  solicitacoes,
}: DashboardSolicitacoesProps) {
  const navigate = useNavigate();

  const total = solicitacoes.length;
  const recebidas = solicitacoes.filter((item) => item.status === "Recebida").length;
  const emAndamento = solicitacoes.filter(
    (item) => item.status === "Em andamento",
  ).length;
  const concluidas = solicitacoes.filter((item) => item.status === "Concluida").length;

  const recentes = [...solicitacoes]
    .sort(
      (a, b) =>
        new Date(b.dataSolicitacao).getTime() -
        new Date(a.dataSolicitacao).getTime(),
    )
    .slice(0, 3);

  const abrirDetalhes = (solicitacao: ClienteSolicitacao) => {
    navigate(`/cliente/solicitacoes/${encodeURIComponent(solicitacao.routeId)}`, {
      state: { solicitacao },
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{total}</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Recebidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{recebidas}</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Em andamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{emAndamento}</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Concluidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{concluidas}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Solicitacoes recentes</h2>
          <Button
            variant="link"
            className="text-gray-500 hover:text-gray-700"
            onClick={() => navigate("/cliente/solicitacoes/historico")}
          >
            Ver todas
          </Button>
        </div>

        <div className="space-y-3">
          {recentes.map((solicitacao) => (
            <Card
              key={solicitacao.routeId}
              className="cursor-pointer border-gray-200 shadow-sm transition-shadow hover:shadow-md"
              onClick={() => abrirDetalhes(solicitacao)}
            >
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{solicitacao.servico}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        STATUS_COLOR[solicitacao.status]
                      }`}
                    >
                      {getSolicitacaoStatusLabel(solicitacao.status)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500">
                    {solicitacao.protocolo
                      ? `${solicitacao.protocolo} - `
                      : "Solicitada em "}
                    {formatSolicitacaoDate(solicitacao.dataSolicitacao)}
                  </p>

                  {solicitacao.observacaoCliente && (
                    <p className="line-clamp-2 text-sm text-gray-500">
                      {solicitacao.observacaoCliente}
                    </p>
                  )}
                </div>

                <div className="text-lg font-bold text-gray-900">
                  {formatSolicitacaoCurrency(solicitacao.valor)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
