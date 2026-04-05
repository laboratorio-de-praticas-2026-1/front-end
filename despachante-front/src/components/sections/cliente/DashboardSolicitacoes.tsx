// src/components/sections/cliente/DashboardSolicitacoes.tsx
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Solicitacao {
  id: string;
  protocolo: string;
  servico: string;
  valor: number;
  veiculo: string;
  dataSolicitacao: string;
  status: "Recebida" | "Em andamento" | "Concluída" | "Cancelada";
}

interface DashboardSolicitacoesProps {
  solicitacoes: Solicitacao[];
}

export function DashboardSolicitacoes({ solicitacoes }: DashboardSolicitacoesProps) {
  const navigate = useNavigate();

  const total = solicitacoes.length;
  const recebidas = solicitacoes.filter(s => s.status === "Recebida").length;
  const emAndamento = solicitacoes.filter(s => s.status === "Em andamento").length;
  const concluidas = solicitacoes.filter(s => s.status === "Concluída").length;

  const recentes = [...solicitacoes]
    .sort((a, b) => new Date(b.dataSolicitacao).getTime() - new Date(a.dataSolicitacao).getTime())
    .slice(0, 1);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Recebida":
        return "text-yellow-600 bg-yellow-100";
      case "Em andamento":
        return "text-blue-600 bg-blue-100";
      case "Concluída":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{total}</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Recebidas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{recebidas}</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Em andamento</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{emAndamento}</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{concluidas}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Solicitações Recentes</h2>
          <Button
            variant="link"
            className="text-gray-500 hover:text-gray-700"
            onClick={() => navigate("/cliente/solicitacoes/historico")}
          >
            Ver todas →
          </Button>
        </div>

        <div className="space-y-3">
          {recentes.map((solicitacao) => (
            <Card key={solicitacao.id} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{solicitacao.servico}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(
                        solicitacao.status
                      )}`}
                    >
                      {solicitacao.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {solicitacao.protocolo} - {solicitacao.veiculo} -{" "}
                    {solicitacao.dataSolicitacao}
                  </p>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  R$ {solicitacao.valor.toFixed(2).replace(".", ",")}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}