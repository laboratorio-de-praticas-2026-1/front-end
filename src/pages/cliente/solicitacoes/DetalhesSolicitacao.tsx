import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Download, Loader2, Paperclip } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  solicitacaoService,
  type SolicitacaoResumo,
  type StatusSolicitacao,
} from "@/services/solicitacaoService";

const USUARIO_ID = 1;

const STATUS_CONFIG: Record<
  StatusSolicitacao,
  { bg: string; text: string; dot: string; label: string }
> = {
  recebido: {
    bg: "bg-[#E5E7EA]",
    text: "text-[#4D5461]",
    dot: "bg-[#4D5461]",
    label: "Recebido",
  },
  em_andamento: {
    bg: "bg-[#B0DEFF]",
    text: "text-[#0088E8]",
    dot: "bg-[#0088E8]",
    label: "Em andamento",
  },
  aguardando_pagamento: {
    bg: "bg-[#FFE5B0]",
    text: "text-[#FFAA00]",
    dot: "bg-[#FFAA00]",
    label: "Aguardando pagamento",
  },
  aguardando_documento: {
    bg: "bg-[#FFC654]",
    text: "text-[#8C5E00]",
    dot: "bg-[#8C5E00]",
    label: "Aguardando documento",
  },
  concluido: {
    bg: "bg-[#C5E9CD]",
    text: "text-[#3DA755]",
    dot: "bg-[#3DA755]",
    label: "Concluido",
  },
  cancelado: {
    bg: "bg-[#FAC5C3]",
    text: "text-[#D93E39]",
    dot: "bg-[#D93E39]",
    label: "Cancelado",
  },
};

const ETAPAS: Array<{ status: StatusSolicitacao; label: string }> = [
  { status: "recebido", label: "Recebido" },
  { status: "em_andamento", label: "Andamento" },
  { status: "aguardando_pagamento", label: "Aguardando Pagamento" },
  { status: "aguardando_documento", label: "Aguardando Documento" },
  { status: "concluido", label: "Concluido" },
];

function formatarData(data: Date | null): string {
  if (!data || Number.isNaN(data.getTime())) {
    return "-";
  }

  return data.toLocaleDateString("pt-BR");
}

function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

function calcularPrazo(dataSolicitacao: Date, dias?: number): string {
  if (!dias) {
    return "-";
  }

  const prazo = new Date(dataSolicitacao);
  prazo.setDate(prazo.getDate() + dias);
  return formatarData(prazo);
}

export default function DetalhesSolicitacao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [solicitacao, setSolicitacao] = useState<SolicitacaoResumo | null>(null);
  const [prazoEstimado, setPrazoEstimado] = useState("-");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [baixandoRecibo, setBaixandoRecibo] = useState(false);
  const [erroRecibo, setErroRecibo] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;

    async function carregarDetalhes() {
      if (!id) {
        setErro("Solicitacao nao encontrada.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setErro(null);

      try {
        const encontrada = await solicitacaoService.buscarPorId(id, {
          usuario_id: USUARIO_ID,
        });

        if (!encontrada) {
          if (ativo) {
            setSolicitacao(null);
            setErro("Solicitacao nao encontrada.");
          }
          return;
        }

        let prazo = "-";

        try {
          const servicos = await solicitacaoService.listarServicosDisponiveis();
          const servico = servicos.find(
            (item) => item.id === encontrada.servicoId,
          );
          prazo = calcularPrazo(
            encontrada.dataSolicitacao,
            servico?.prazoEstimadoDias,
          );
        } catch {
          prazo = "-";
        }

        if (ativo) {
          setSolicitacao(encontrada);
          setPrazoEstimado(prazo);
        }
      } catch {
        if (ativo) {
          setErro("Nao foi possivel carregar a solicitacao.");
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    void carregarDetalhes();

    return () => {
      ativo = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center p-4 md:p-6">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (erro || !solicitacao) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            className="mt-1"
            onClick={() => navigate("/cliente/solicitacoes/historico")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <p className="mt-3 text-sm text-red-500">
            {erro ?? "Solicitacao nao encontrada."}
          </p>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[solicitacao.status];

  async function handleBaixarRecibo() {
    if (!solicitacao) {
      return;
    }

    const solicitacaoId = solicitacao.id;

    setBaixandoRecibo(true);
    setErroRecibo(null);

    try {
      const blob = await solicitacaoService.baixarRecibo({
        idSolicitacao: solicitacaoId,
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `recibo-solicitacao-${solicitacaoId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      setErroRecibo("Nao foi possivel baixar o recibo.");
    } finally {
      setBaixandoRecibo(false);
    }
  }


  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            className="mt-1"
            onClick={() => navigate("/cliente/solicitacoes/historico")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-lg md:text-xl font-semibold text-[#0F2A44]">
                {solicitacao.servico}
              </h1>

              <div
                className={`flex items-center gap-2 ${statusConfig.bg} ${statusConfig.text} px-3 py-1 rounded-full text-sm font-medium`}
              >
                <span className={`w-2 h-2 ${statusConfig.dot} rounded-full`}></span>
                {statusConfig.label}
              </div>
            </div>

            <span className="text-sm text-[#7F838F] mt-1">
              {solicitacao.protocolo ?? `Solicitacao #${solicitacao.id}`}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <Button
            type="button"
            variant="outline"
            className="gap-2 bg-white"
            onClick={handleBaixarRecibo}
            disabled={baixandoRecibo}
          >
            <Download className="w-4 h-4" />
            {baixandoRecibo ? "Baixando..." : "Baixar recibo"}
          </Button>
          {erroRecibo && (
            <span className="text-xs text-red-500">{erroRecibo}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-zinc-200">
          <div className="p-4">
            <p className="text-[#7F838F] text-sm mb-2">Veiculo</p>
            <p className="font-medium">Nao informado</p>
          </div>
        </Card>

        <Card className="border border-zinc-200">
          <div className="p-4">
            <p className="text-[#7F838F] text-sm mb-2">Valor base</p>
            <p className="text-green-600 font-semibold">
              {formatarMoeda(solicitacao.valorBase)}
            </p>
          </div>
        </Card>

        <Card className="border border-zinc-200">
          <div className="p-4">
            <p className="text-[#7F838F] text-sm mb-2">Datas</p>

            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-500">Solicitacao</span>
                <span className="font-medium text-zinc-900">
                  {formatarData(solicitacao.dataSolicitacao)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-500">Prazo</span>
                <span className="font-medium text-zinc-900">
                  {prazoEstimado}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border border-zinc-200">
        <div className="px-6 py-4 border-b border-zinc-200 bg-[#F9FAFB]">
          <h2 className="text-sm font-medium text-zinc-900">
            Progresso
          </h2>
        </div>

        <CardContent className="pt-6 bg-[#F9FAFB]">
          <div className="flex items-center justify-between relative">
            {ETAPAS.map((etapa, index) => {
              const ativo = etapa.status === solicitacao.status;

              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center relative"
                >
                  {index !== ETAPAS.length - 1 && (
                    <div className="absolute top-5 left-1/2 w-full h-[3px] bg-gray-300 z-0"></div>
                  )}

                  <div
                    className={`z-10 w-12 h-12 flex items-center justify-center rounded-full border-4 ${
                      ativo
                        ? "border-green-600"
                        : "border-gray-400"
                    } bg-white`}
                  >
                    <Check
                      className={`w-6 h-6 ${
                        ativo ? "text-green-600" : "text-gray-400"
                      }`}
                      strokeWidth={3}
                    />
                  </div>

                  <span className="text-xs mt-2 text-center text-zinc-900">
                    {etapa.label}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-zinc-200">
        <div className="px-6 py-4 border-b border-zinc-200 bg-[#F9FAFB]">
          <div className="flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-[#002749]" />
            <h2 className="text-sm font-medium text-black">
              Documentos enviados
            </h2>
          </div>
        </div>

        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="text-left text-[#7F838F]">
              <tr className="border-b border-gray-200">
                <th className="py-3 px-6 font-medium">Arquivo</th>
                <th className="font-medium">Tipo</th>
                <th className="font-medium">Status</th>
                <th className="font-medium text-right pr-6">Acoes</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-6 px-6 text-center text-gray-500" colSpan={4}>
                  Nenhum documento retornado pela API.
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
