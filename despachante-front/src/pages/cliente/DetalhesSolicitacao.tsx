import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DetalhesSolicitacao() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/cliente/solicitacoes/historico")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div>
          <h1 className="text-2xl font-bold">Detalhes da solicitacao</h1>
          <p className="text-sm text-gray-500">
            A rota solicitada foi /cliente/solicitacoes/{id ?? ":id"}.
          </p>
        </div>
      </div>

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="space-y-3 p-6 text-sm text-amber-900">
          <p className="font-medium">
            Esta tela ainda nao pode ser integrada com dados reais nesta branch.
          </p>
          <p>
            O back-end atual nao expoe GET /solicitacoes/:id, nem rotas para
            listar ou baixar os documentos enviados da solicitacao.
          </p>
          <p>
            Assim que essas rotas forem disponibilizadas pela equipe responsavel,
            a tela pode voltar a renderizar status, datas, documentos e downloads
            sem mocks.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
