import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Download, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  canGenerateReceipt,
  formatSolicitacaoCurrency,
  formatSolicitacaoDate,
  getSolicitacaoStatusLabel,
  solicitacaoService,
  type ClienteSolicitacao,
} from "@/services/solicitacaoService";

const ETAPAS: ClienteSolicitacao["status"][] = [
  "Recebida",
  "Em andamento",
  "Aguardando pagamento",
  "Aguardando documento",
  "Concluida",
];

const STATUS_STYLES: Record<
  ClienteSolicitacao["status"],
  { badge: string; dot: string }
> = {
  Recebida: {
    badge: "bg-[#E5E7EA] text-[#4D5461]",
    dot: "bg-[#4D5461]",
  },
  "Em andamento": {
    badge: "bg-[#B0DEFF] text-[#0088E8]",
    dot: "bg-[#0088E8]",
  },
  Concluida: {
    badge: "bg-[#C5E9CD] text-[#3DA755]",
    dot: "bg-[#3DA755]",
  },
  Cancelada: {
    badge: "bg-[#FAC5C3] text-[#D93E39]",
    dot: "bg-[#D93E39]",
  },
  "Aguardando pagamento": {
    badge: "bg-[#FFE5B0] text-[#FFAA00]",
    dot: "bg-[#FFAA00]",
  },
  "Aguardando documento": {
    badge: "bg-[#FFC654] text-[#8C5E00]",
    dot: "bg-[#8C5E00]",
  },
};

type LocationState = {
  solicitacao?: ClienteSolicitacao;
};

const gerarReciboHtml = (solicitacao: ClienteSolicitacao) => `
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>Recibo ${solicitacao.protocolo ?? solicitacao.routeId}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #1f2937; margin: 40px; }
      .sheet { max-width: 760px; margin: 0 auto; border: 1px solid #d1d5db; padding: 32px; border-radius: 12px; }
      .row { display: flex; justify-content: space-between; gap: 24px; margin-bottom: 16px; }
      .row strong { display: block; font-size: 12px; color: #6b7280; margin-bottom: 4px; }
      h1 { font-size: 28px; margin-bottom: 12px; color: #0f2a44; }
      h2 { font-size: 16px; margin: 24px 0 12px; color: #0f2a44; }
      p { margin: 0; }
      .divider { height: 1px; background: #e5e7eb; margin: 24px 0; }
      .signature { margin-top: 56px; padding-top: 16px; border-top: 1px solid #9ca3af; width: 280px; }
    </style>
  </head>
  <body>
    <div class="sheet">
      <h1>Recibo de solicitacao</h1>
      <p>Comprovante gerado em ${new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "full",
        timeStyle: "short",
      }).format(new Date())}</p>

      <div class="divider"></div>

      <div class="row">
        <div>
          <strong>Protocolo</strong>
          <p>${solicitacao.protocolo ?? solicitacao.routeId}</p>
        </div>
        <div>
          <strong>Status</strong>
          <p>${getSolicitacaoStatusLabel(solicitacao.status)}</p>
        </div>
      </div>

      <div class="row">
        <div>
          <strong>Cliente</strong>
          <p>${solicitacao.clienteNome}</p>
        </div>
        <div>
          <strong>Email</strong>
          <p>${solicitacao.clienteEmail}</p>
        </div>
      </div>

      <div class="row">
        <div>
          <strong>Servico</strong>
          <p>${solicitacao.servico}</p>
        </div>
        <div>
          <strong>Valor base</strong>
          <p>${formatSolicitacaoCurrency(solicitacao.valor)}</p>
        </div>
      </div>

      <div class="row">
        <div>
          <strong>Data da solicitacao</strong>
          <p>${formatSolicitacaoDate(solicitacao.dataSolicitacao)}</p>
        </div>
        <div>
          <strong>Data de conclusao</strong>
          <p>${formatSolicitacaoDate(solicitacao.dataConclusao)}</p>
        </div>
      </div>

      ${
        solicitacao.observacaoCliente || solicitacao.observacaoAdmin
          ? `
      <h2>Observacoes</h2>
      <p>${solicitacao.observacaoCliente || solicitacao.observacaoAdmin}</p>
      `
          : ""
      }

      <div class="signature">
        <p>Assinatura / conferido por</p>
      </div>
    </div>
  </body>
</html>
`;

export default function DetalhesSolicitacao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as LocationState) || {};

  const [solicitacao, setSolicitacao] = useState<ClienteSolicitacao | null>(
    locationState.solicitacao ?? null,
  );
  const [isLoading, setIsLoading] = useState(!locationState.solicitacao);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Solicitacao nao informada.");
      setIsLoading(false);
      return;
    }

    if (locationState.solicitacao?.routeId === id) {
      setSolicitacao(locationState.solicitacao);
      setIsLoading(false);
      return;
    }

    const carregarSolicitacao = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await solicitacaoService.buscarSolicitacao(id);
        if (!data) {
          setError("Nao encontramos essa solicitacao.");
          setSolicitacao(null);
          return;
        }

        setSolicitacao(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Nao foi possivel carregar os detalhes da solicitacao.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void carregarSolicitacao();
  }, [id, locationState.solicitacao]);

  const etapaAtual = useMemo(() => {
    if (!solicitacao) {
      return -1;
    }

    return ETAPAS.indexOf(solicitacao.status);
  }, [solicitacao]);

  const handleGenerateReceipt = () => {
    if (!solicitacao) {
      return;
    }

    const receiptWindow = window.open("", "_blank", "width=900,height=700");
    if (!receiptWindow) {
      setError("Nao foi possivel abrir a janela para gerar o recibo.");
      return;
    }

    receiptWindow.document.open();
    receiptWindow.document.write(gerarReciboHtml(solicitacao));
    receiptWindow.document.close();
    receiptWindow.focus();
    receiptWindow.print();
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Card className="border border-zinc-200">
          <CardContent className="p-6 text-sm text-zinc-500">
            Carregando detalhes da solicitacao...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !solicitacao) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            className="mt-1"
            onClick={() => navigate("/cliente/solicitacoes/historico")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div>
            <h1 className="text-lg font-semibold text-[#0F2A44] md:text-xl">
              Detalhes indisponiveis
            </h1>
            <span className="mt-1 block text-sm text-[#7F838F]">
              Referencia: {id ?? "--"}
            </span>
          </div>
        </div>

        <Card className="border border-red-200">
          <CardContent className="space-y-3 p-6 text-sm text-red-600">
            <p>{error ?? "Nao foi possivel carregar a solicitacao."}</p>
            <Button
              variant="outline"
              onClick={() => navigate("/cliente/solicitacoes/historico")}
            >
              Voltar para o historico
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusStyles = STATUS_STYLES[solicitacao.status];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            className="mt-1"
            onClick={() => navigate("/cliente/solicitacoes/historico")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-lg font-semibold text-[#0F2A44] md:text-xl">
                {solicitacao.servico}
              </h1>

              <div
                className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${statusStyles.badge}`}
              >
                <span className={`h-2 w-2 rounded-full ${statusStyles.dot}`} />
                {getSolicitacaoStatusLabel(solicitacao.status)}
              </div>
            </div>

            <span className="mt-1 text-sm text-[#7F838F]">
              {solicitacao.protocolo ?? `Solicitacao ${solicitacao.routeId}`}
            </span>
          </div>
        </div>

        <Button
          onClick={handleGenerateReceipt}
          disabled={!canGenerateReceipt(solicitacao)}
          className="flex items-center gap-2 bg-[#3979A5] text-white hover:bg-[#2e5f83]"
        >
          <Download className="h-4 w-4" />
          Gerar recibo
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="border border-zinc-200">
          <div className="p-4">
            <p className="mb-2 text-sm text-[#7F838F]">Cliente</p>
            <p className="font-medium">{solicitacao.clienteNome}</p>
          </div>
        </Card>

        <Card className="border border-zinc-200">
          <div className="p-4">
            <p className="mb-2 text-sm text-[#7F838F]">Email do cliente</p>
            <p className="font-medium">{solicitacao.clienteEmail}</p>
          </div>
        </Card>

        <Card className="border border-zinc-200">
          <div className="p-4">
            <p className="mb-2 text-sm text-[#7F838F]">Valor base</p>
            <p className="font-semibold text-green-600">
              {formatSolicitacaoCurrency(solicitacao.valor)}
            </p>
          </div>
        </Card>

        <Card className="border border-zinc-200">
          <div className="p-4">
            <p className="mb-2 text-sm text-[#7F838F]">Datas</p>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Solicitacao</span>
                <span className="font-medium text-zinc-900">
                  {formatSolicitacaoDate(solicitacao.dataSolicitacao)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-500">Conclusao</span>
                <span className="font-medium text-zinc-900">
                  {formatSolicitacaoDate(solicitacao.dataConclusao)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border border-zinc-200">
        <div className="border-b border-zinc-200 bg-[#F9FAFB] px-6 py-4">
          <h2 className="text-sm font-medium text-zinc-900">Progresso</h2>
        </div>

        <CardContent className="bg-[#F9FAFB] pt-6">
          <div className="relative flex items-center justify-between gap-2">
            {ETAPAS.map((etapa, index) => {
              const concluida =
                etapaAtual >= index && solicitacao.status !== "Cancelada";
              const ativa = etapaAtual === index;

              return (
                <div
                  key={etapa}
                  className="relative flex flex-1 flex-col items-center"
                >
                  {index !== ETAPAS.length - 1 && (
                    <div
                      className={`absolute left-1/2 top-5 h-[3px] w-full ${
                        etapaAtual > index && solicitacao.status !== "Cancelada"
                          ? "bg-green-600"
                          : "bg-gray-300"
                      }`}
                    />
                  )}

                  <div
                    className={`z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 bg-white ${
                      concluida ? "border-green-600" : "border-gray-400"
                    }`}
                  >
                    <Check
                      className={`h-6 w-6 ${
                        ativa || concluida ? "text-green-600" : "text-gray-400"
                      }`}
                      strokeWidth={3}
                    />
                  </div>

                  <span className="mt-2 text-center text-xs text-zinc-900">
                    {getSolicitacaoStatusLabel(etapa)}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-zinc-200">
        <div className="border-b border-zinc-200 bg-[#F9FAFB] px-6 py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#002749]" />
            <h2 className="text-sm font-medium text-black">Recibo</h2>
          </div>
        </div>

        <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-zinc-900">
              Comprovante da solicitacao
            </p>
            <p className="text-sm text-zinc-600">
              Gere um recibo com os dados da solicitacao exibida nesta tela.
            </p>
          </div>

          <Button
            onClick={handleGenerateReceipt}
            disabled={!canGenerateReceipt(solicitacao)}
            variant="outline"
            className="border-[#3979A5] text-[#3979A5] hover:bg-[#3979A5] hover:text-white"
          >
            Gerar recibo
          </Button>
        </CardContent>
      </Card>

      {(solicitacao.observacaoCliente || solicitacao.observacaoAdmin) && (
        <Card className="border border-zinc-200">
          <div className="border-b border-zinc-200 bg-[#F9FAFB] px-6 py-4">
            <h2 className="text-sm font-medium text-zinc-900">Observacoes</h2>
          </div>

          <CardContent className="space-y-4 p-6">
            {solicitacao.observacaoCliente && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-zinc-900">Cliente</p>
                <p className="text-sm text-zinc-600">
                  {solicitacao.observacaoCliente}
                </p>
              </div>
            )}

            {solicitacao.observacaoAdmin && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-zinc-900">Administracao</p>
                <p className="text-sm text-zinc-600">
                  {solicitacao.observacaoAdmin}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
