import { Link } from "react-router-dom";
import { FaCar } from "react-icons/fa";
import { FiFileText, FiCheckCircle } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";
import type { VeiculoResumo } from "@/types/clienteDashboard.types";

interface VeiculoResumoWidgetProps {
  veiculo: VeiculoResumo;
  onTrocarVeiculo: () => void;
}

const STATUS_CONFIG = {
  em_dia: {
    label: "Licenciamento em dia",
    className: "bg-[#032a4e] text-white",
  },
  pendente: {
    label: "Licenciamento pendente",
    className: "bg-warning-500 text-white",
  },
  vencido: {
    label: "Licenciamento vencido",
    className: "bg-destructive text-white",
  },
};

export function VeiculoResumoWidget({ veiculo, onTrocarVeiculo }: VeiculoResumoWidgetProps) {
  const statusConfig = STATUS_CONFIG[veiculo.statusLicenciamento];

  return (
    <div className ="flex flex-col gap-4">
      <Card className="border border-zinc-200">
        <CardContent className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
            <FaCar className="w-5 h-5 text-zinc-700" />
            <h2 className="text-base font-bold text-zinc-800">Meu veículo</h2>
          </div>

          {/* Vehicle info */}
          <div className="bg-zinc-50 rounded-lg p-4 space-y-1 border border-zinc-100">
            <p className="text-sm font-semibold text-zinc-500 tracking-wider">{veiculo.placa}</p>
            <p className="text-lg font-bold text-zinc-800">{veiculo.modelo}</p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-500">{veiculo.versao}</p>
              <button
                onClick={onTrocarVeiculo}
                className="text-xs text-primary hover:underline font-medium"
              >
                Trocar veículo
              </button>
            </div>
          </div>

          {/* Status badge */}
          <button className={`w-full py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 ${statusConfig.className}`}>
            {statusConfig.label}
          </button>

          {/* Meta info */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Última atualização:</span>
              <span className="font-medium text-zinc-700">{veiculo.ultimaAtualizacao}</span>
            </div>
            <hr/>
            <div className="flex justify-between">
              <span>Último pagamento:</span>
              <span className="font-medium text-zinc-700">{veiculo.ultimoPagamento}</span>
            </div>
            <div className="flex justify-between">
              <span>Vencimento:</span>
              <span className="font-medium text-zinc-700">{veiculo.vencimento}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-zinc-200">
          <CardContent className="p-5 space-y-4">
            <div className="border-t border-zinc-100 pt-3 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 font-semibold">
                  <div className="w-10 h-10 bg-[linear-gradient(315deg,_#1E84CF_0%,_#BCE1F9_100%)] flex items-center justify-center rounded-lg"> <FiFileText className="w-5 h-5 text-secondary" /> </div>
                  <span>Solicitações</span>
                </div>
                <Link to="/cliente/solicitacoes" className="text-sm text-secondary hover:underline font-medium">
                  Veja mais
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 font-semibold">
                  <div className="w-10 h-10 bg-[linear-gradient(315deg,_#1E84CF_0%,_#BCE1F9_100%)] flex items-center justify-center rounded-lg"> <FaCar className="w-5 h-5 text-secondary" /> </div>
                  <span>Meus veículos</span>
                </div>
                <Link to="/cliente/veiculos" className="text-sm text-secondary hover:underline font-medium">
                  Veja mais
                </Link>
              </div>
            </div>
          </CardContent>
      </Card>
    </div>
  );
}
