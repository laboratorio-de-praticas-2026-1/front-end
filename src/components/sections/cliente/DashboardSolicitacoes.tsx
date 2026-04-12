import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type SolicitacaoResumo,
  type StatusSolicitacao,
} from "@/services/solicitacaoService";

interface DashboardSolicitacoesProps {
  solicitacoes: SolicitacaoResumo[];
}

const STATUS_LABEL: Record<StatusSolicitacao, string> = {
  recebido: "Recebida",
  em_andamento: "Em andamento",
  aguardando_pagamento: "Aguardando pagamento",
  aguardando_documento: "Aguardando documento",
  concluido: "Concluida",
  cancelado: "Cancelada",
};

const STATUS_COLOR: Record<StatusSolicitacao, string> = {
  recebido: "text-yellow-600 bg-yellow-100",
  em_andamento: "text-blue-600 bg-blue-100",
  aguardando_pagamento: "text-orange-600 bg-orange-100",
  aguardando_documento: "text-orange-600 bg-orange-100",
  concluido: "text-green-600 bg-green-100",
  cancelado: "text-gray-600 bg-gray-100",
};

function getLinhaSecundaria(solicitacao: SolicitacaoResumo) {
  const data = new Date(solicitacao.dataSolicitacao).toLocaleDateString("pt-BR");
  return solicitacao.protocolo
    ? `${solicitacao.protocolo} - ${data}`
    : `Solicitada em ${data}`;
}

export function DashboardSolicitacoes({
  solicitacoes,
}: DashboardSolicitacoesProps) {
  const navigate = useNavigate();

  const total = solicitacoes.length;
  const recebidas = solicitacoes.filter((s) => s.status === "recebido").length;
  const emAndamento = solicitacoes.filter(
    (s) => s.status === "em_andamento",
  ).length;
  const concluidas = solicitacoes.filter((s) => s.status === "concluido").length;

  const recentes = [...solicitacoes]
    .sort(
      (a, b) =>
        new Date(b.dataSolicitacao).getTime() -
        new Date(a.dataSolicitacao).getTime(),
    )
    .slice(0, 1);

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
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Solicitacoes Recentes</h2>
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
              key={`${solicitacao.clienteId}-${solicitacao.servico}-${solicitacao.dataSolicitacao.toISOString()}`}
              className="border-gray-200 shadow-sm"
            >
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{solicitacao.servico}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${STATUS_COLOR[solicitacao.status]}`}
                    >
                      {STATUS_LABEL[solicitacao.status]}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500">
                    {getLinhaSecundaria(solicitacao)}
                  </p>
                </div>

                <div className="text-lg font-bold text-gray-900">
                  R$ {Number(solicitacao.valorBase).toFixed(2).replace(".", ",")}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
