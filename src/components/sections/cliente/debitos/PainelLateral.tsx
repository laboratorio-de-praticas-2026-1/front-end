import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SeletorVeiculo } from "./SeletorVeiculo";
import { cn } from "@/lib/utils";

interface PainelLateralProps {
  itens: any[];
  servicosAdicionais: any[];
  selectedIds: string[];
  taxaServico: number;
  onSimular: (payload: { veiculoId: string; debitosSelecionados: string[]; formaPagamentoId: string }) => void;
  veiculoId: string;
}

function formatCurrency(value: number) {
  return `R$\u00a0${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function calcularParcelas(total: number) {
  const juros = 0.029; // 2.9% ao mês
  return [
    { id: "avista", label: "À vista", parcelas: 1, valorParcela: total, totalFinal: total },
    { id: "3x", label: "3x", parcelas: 3, valorParcela: (total * Math.pow(1 + juros, 3)) / 3, totalFinal: total * Math.pow(1 + juros, 3) },
    { id: "6x", label: "6x", parcelas: 6, valorParcela: (total * Math.pow(1 + juros, 6)) / 6, totalFinal: total * Math.pow(1 + juros, 6) },
    { id: "12x", label: "12x", parcelas: 12, valorParcela: (total * Math.pow(1 + juros, 12)) / 12, totalFinal: total * Math.pow(1 + juros, 12) },
  ];
}

export function PainelLateral({
  itens,
  servicosAdicionais,
  selectedIds,
  taxaServico,
  onSimular,
  veiculoId,
}: PainelLateralProps) {
  const [formaPagamentoId, setFormaPagamentoId] = useState<string | null>(null);

  const { totalDebitos, totalServicos, totalGeral } = useMemo(() => {
    const selectedDebitos = itens.filter((i) => selectedIds.includes(i.id));
    const selectedServicos = servicosAdicionais.filter((s) => selectedIds.includes(s.id));

    const totalDebitos = selectedDebitos.reduce((acc, i) => acc + i.valorTotal, 0);
    const totalServicos = selectedServicos.reduce((acc, s) => acc + s.valorTotal, 0);
    const taxa = selectedIds.length > 0 ? taxaServico : 0;
    const totalGeral = totalDebitos + totalServicos + taxa;

    return { totalDebitos, totalServicos, totalGeral };
  }, [itens, servicosAdicionais, selectedIds, taxaServico]);

  const temSelecao = selectedIds.length > 0;
  const opcoesParcelas = useMemo(() => calcularParcelas(totalGeral), [totalGeral]);

  const taxa = selectedIds.length > 0 ? taxaServico : 0;

  const handleContinuar = () => {
    if (!formaPagamentoId || !temSelecao) return;
    onSimular({ veiculoId, debitosSelecionados: selectedIds, formaPagamentoId });
  };

  return (
    <div className="flex flex-col gap-4 lg:sticky lg:top-4">
      {/* Seletor de veículo */}
      <Card className="border border-zinc-200 shadow-sm">
        <CardContent className="p-4">
          <SeletorVeiculo />
        </CardContent>
      </Card>

      {/* Formas de pagamento — só aparece se houver seleção (issue 5.4) */}
      {temSelecao && (
        <Card className="border border-zinc-200 shadow-sm">
          <CardContent className="p-4 space-y-3">
            <h3 className="text-sm font-bold text-zinc-800">Formas de pagamento</h3>
            <div className="space-y-2">
              {opcoesParcelas.map((op) => (
                <button
                  key={op.id}
                  onClick={() => setFormaPagamentoId(op.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition-all duration-200",
                    formaPagamentoId === op.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-zinc-200 hover:border-zinc-300 bg-white"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {/* Radio visual */}
                    <div className={cn(
                      "w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center",
                      formaPagamentoId === op.id ? "border-primary" : "border-zinc-300"
                    )}>
                      {formaPagamentoId === op.id && (
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="text-sm font-semibold text-zinc-800">{op.label}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-zinc-800">
                      {formatCurrency(op.valorParcela)}
                    </p>
                    {op.parcelas > 1 && (
                      <p className="text-[10px] text-zinc-500">
                        Total: {formatCurrency(op.totalFinal)}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sumário */}
      <Card className="border border-zinc-200 shadow-sm">
        <CardContent className="p-4 space-y-3">
          <h3 className="text-sm font-bold text-zinc-800">Sumário</h3>

          {!temSelecao ? (
            <p className="text-xs text-zinc-500 text-center py-3">
              Selecione os débitos para ver as opções.
            </p>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-zinc-600">
                <span>Débitos selecionados</span>
                <span className="font-medium">{formatCurrency(totalDebitos + totalServicos)}</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-600">
                <span>Taxa de serviço</span>
                <span className="font-medium">{formatCurrency(taxa)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-zinc-800 border-t border-zinc-100 pt-2">
                <span>Total</span>
                <span>{formatCurrency(totalGeral)}</span>
              </div>
            </div>
          )}

          <Button
            onClick={handleContinuar}
            disabled={!temSelecao || !formaPagamentoId}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg disabled:opacity-40"
          >
            Continuar para simular débitos
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
