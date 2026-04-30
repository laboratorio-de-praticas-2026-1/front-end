import { useNavigate } from "react-router-dom";
import { FiDollarSign } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { DebitoItem } from "@/types/clienteDashboard.types";

interface DebitosWidgetProps {
  debitos: DebitoItem[];
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function DebitosWidget({ debitos }: DebitosWidgetProps) {
  const navigate = useNavigate();

  const total = debitos.reduce((acc, d) => acc + d.valor, 0);

  const licenciamento = debitos.find((d) => d.tipo === "licenciamento");
  const ipva = debitos.find((d) => d.tipo === "ipva_parcela");

  return (
    <Card className="border border-zinc-200 shadow-sm">
      <CardContent className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-zinc-100 pb-4">
          <div className="w-8 h-8 rounded-full border-2 border-zinc-700 flex items-center justify-center shrink-0">
            <FiDollarSign className="w-4 h-4 text-zinc-700" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-800">Débitos de veículo</h2>
            <p className="text-xs text-zinc-500">Débitos já disponíveis para pagamento:</p>
          </div>
        </div>

        {/* Licenciamento */}
        {licenciamento && (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-zinc-800">Licenciamento</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-100 rounded-lg p-4 space-y-0.5">
                <p className="text-xl font-bold text-zinc-800">{licenciamento.ano}</p>
                <p className="text-xs text-zinc-500">Vencimento</p>
              </div>
              <div className="bg-zinc-100 rounded-lg p-4 space-y-0.5">
                <p className="text-xl font-bold text-primary">R$ {formatCurrency(licenciamento.valor)}</p>
                <p className="text-xs text-primary font-medium">{licenciamento.vencimento}</p>
              </div>
            </div>
          </div>
        )}

        {/* IPVA */}
        {ipva && (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-zinc-800">IPVA</h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Todas as parcelas restantes */}
              <div className="bg-zinc-100 rounded-lg p-4 space-y-1">
                <div className="flex justify-between items-start">
                  <p className="text-xs text-zinc-600 font-medium leading-tight">Todas as parcelas restantes</p>
                  <p className="text-sm font-bold text-zinc-800 whitespace-nowrap ml-2">R$ {formatCurrency(ipva.valorTotal!)}</p>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <p className="text-xs text-zinc-500">Vencimento</p>
                  <p className="text-xs text-primary font-semibold">{ipva.vencimento}</p>
                </div>
              </div>
              {/* Parcela atual */}
              <div className="bg-zinc-100 rounded-lg p-4 space-y-1">
                <div className="flex justify-between items-start">
                  <p className="text-xs text-zinc-600 font-medium leading-tight">{ipva.subtitulo}</p>
                  <p className="text-sm font-bold text-zinc-800 whitespace-nowrap ml-2">R$ {formatCurrency(ipva.valor)}</p>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <p className="text-xs text-zinc-500">Vencimento</p>
                  <p className="text-xs text-primary font-semibold">{ipva.vencimento}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Separator */}
        <div className="border-t border-zinc-200" />

        {/* Totalizador */}
        <div className="space-y-2">
          {licenciamento && (
            <div className="flex justify-between items-center text-sm text-zinc-600">
              <span>{licenciamento.descricao}:</span>
              <span className="font-semibold">R$ {formatCurrency(licenciamento.valor)}</span>
            </div>
          )}
          {ipva && (
            <div className="flex justify-between items-center text-sm text-zinc-600">
              <span>{ipva.descricao}:</span>
              <span className="font-semibold">R$ {formatCurrency(ipva.valor)}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-1">
            <span className="text-base font-bold text-zinc-800">Total:</span>
            <span className="text-xl font-bold text-zinc-800">R$ {formatCurrency(total)}</span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-end pt-1">
          <Button
            onClick={() => navigate("/cliente/debitos")}
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 rounded-lg"
          >
            Ir para pagamento
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
