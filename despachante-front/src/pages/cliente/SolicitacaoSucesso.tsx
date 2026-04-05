import { useNavigate } from "react-router-dom";
import { CheckCircle2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const mockSolicitacao = {
  protocolo: "SOL-260317-2122",
  servico: "Emissão de CRLV",
  valor: "R$ 120,00",
  veiculo: "DEF-5678 - Honda Civic",
  dataSolicitacao: "17/03/2026",
  prazoEstimado: "21/03/2026",
};

export default function SolicitacaoSucesso() {
  const navigate = useNavigate();

  const handleNovaSolicitacao = () => {
    navigate("/cliente/solicitacoes", { state: { openModal: true } });
  };

  const handleIrPainel = () => {
    navigate("/cliente/solicitacoes");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="border-green-200 shadow-lg overflow-hidden">
          <div className="bg-green-600 p-6 flex flex-col items-center text-white">
            <CheckCircle2 className="h-16 w-16 mb-3" />
            <h1 className="text-2xl font-bold text-center">
              Solicitação de Serviço realizada com sucesso!
            </h1>
            <p className="text-green-100 mt-2 text-center">
              Seu pedido foi registrado e está sendo processado.
            </p>
          </div>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-gray-700" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Protocolo</p>
                <p className="text-xl font-mono font-bold text-gray-900">
                  {mockSolicitacao.protocolo}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-baseline pb-2">
                <span className="text-sm text-gray-500">Serviço solicitado</span>
                <span className="font-medium text-gray-900">{mockSolicitacao.servico}</span>
              </div>
              <div className="flex justify-between items-baseline pb-2">
                <span className="text-sm text-gray-500">Valor base</span>
                <span className="font-medium text-gray-900">{mockSolicitacao.valor}</span>
              </div>
              <div className="flex justify-between items-baseline border-b-2 border-gray-300 pb-2">
                <span className="text-sm text-gray-500">Veículo</span>
                <span className="font-medium text-gray-900">{mockSolicitacao.veiculo}</span>
              </div>
              <div className="flex justify-between items-baseline pb-2">
                <span className="text-sm text-gray-500">Data de solicitação</span>
                <span className="font-medium text-gray-900">{mockSolicitacao.dataSolicitacao}</span>
              </div>
              <div className="flex justify-between items-baseline pb-2">
                <span className="text-sm text-gray-500">Prazo estimado</span>
                <span className="font-medium text-gray-900">{mockSolicitacao.prazoEstimado}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleIrPainel}
                className="flex-1 bg-[#002749] hover:bg-[#001a33] text-white"
              >
                Ir ao painel
              </Button>
              <Button
                onClick={handleNovaSolicitacao}
                className="flex-1 bg-[#3979A5] hover:bg-[#2e5f83] text-white"
              >
                Nova solicitação
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}