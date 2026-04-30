import { useState } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";
import { FaCar } from "react-icons/fa";
import { useVeiculo } from "@/context/VeiculoContext";
import { cn } from "@/lib/utils";

export function SeletorVeiculo() {
  const { veiculos, veiculoAtivo, setVeiculoAtivo, isLoading } = useVeiculo();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="w-full h-14 bg-zinc-100 rounded-xl animate-pulse" />
    );
  }

  if (!veiculoAtivo) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center gap-3 bg-white border border-zinc-200 rounded-xl px-4 py-3 text-left shadow-sm hover:border-primary/50 transition-colors"
      >
        {/* Car icon */}
        <div className="w-9 h-9 bg-[#032a4e] rounded-lg flex items-center justify-center shrink-0">
          <FaCar className="w-4 h-4 text-white" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold text-zinc-400 tracking-widest uppercase">
            {veiculoAtivo.placa}
          </p>
          <p className="text-sm font-bold text-zinc-800 truncate">{veiculoAtivo.modelo}</p>
        </div>

        {/* Arrow */}
        <FiChevronDown
          className={cn(
            "w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {veiculos.map((v) => (
            <button
              key={v.id}
              onClick={() => {
                setVeiculoAtivo(v);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors text-left"
            >
              <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0">
                <FaCar className="w-3.5 h-3.5 text-zinc-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-zinc-400 tracking-widest uppercase">
                  {v.placa}
                </p>
                <p className="text-sm font-semibold text-zinc-800 truncate">{v.modelo}</p>
              </div>
              {veiculoAtivo.id === v.id && (
                <FiCheck className="w-4 h-4 text-primary shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
