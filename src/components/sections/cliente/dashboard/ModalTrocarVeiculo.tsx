import { FaCar } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";

interface ModalTrocarVeiculoProps {
  open: boolean;
  onClose: () => void;
}


const veiculosMock = [
  { id: "veiculo-001", placa: "CDJ6718", modelo: "Fiat Argo Trekking", versao: "1.3 Automático", ativo: true },
  { id: "veiculo-002", placa: "BRA2E19", modelo: "Honda Civic EXL", versao: "2.0 CVT", ativo: false },
];

export function ModalTrocarVeiculo({ open, onClose }: ModalTrocarVeiculoProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <FaCar className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-zinc-800">Trocar veículo</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-zinc-100 transition-colors text-zinc-500"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Vehicle list */}
        <div className="px-6 py-4 space-y-3">
          <p className="text-sm text-zinc-500">Selecione o veículo ativo no painel:</p>
          {veiculosMock.map((v) => (
            <button
              key={v.id}
              onClick={onClose}
              className={`w-full text-left p-4 rounded-lg border transition-all duration-150 flex items-center justify-between gap-3 ${
                v.ativo
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-zinc-200 hover:border-primary/40 hover:bg-zinc-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${v.ativo ? "bg-primary/10" : "bg-zinc-100"}`}>
                  <FaCar className={`w-4 h-4 ${v.ativo ? "text-primary" : "text-zinc-400"}`} />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-800">{v.modelo}</p>
                  <p className="text-xs text-zinc-500">{v.placa} · {v.versao}</p>
                </div>
              </div>
              {v.ativo && (
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                  Ativo
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50">
          <Link
            to="/cliente/veiculos"
            onClick={onClose}
            className="text-sm text-primary hover:underline font-medium"
          >
            Gerenciar meus veículos →
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
