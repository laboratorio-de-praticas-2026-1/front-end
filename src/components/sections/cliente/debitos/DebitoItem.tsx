import { useState } from "react";
import { FiChevronDown, FiAlertTriangle, FiFileText, FiTool } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { DebitoBadge } from "./DebitoBadge";

interface DebitoItemData {
  id: string;
  tipo: string;
  titulo: string;
  vencimento: string;
  valorTotal: number;
  valorOriginal: number;
  juros: number;
  multa: number;
  isAtrasado: boolean;
  badges: string[];
}

interface DebitoItemProps {
  item: DebitoItemData;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

function formatCurrency(value: number) {
  return `R$\u00a0${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getIcon(tipo: string) {
  if (tipo === "Multa") return <FiAlertTriangle className="w-4 h-4 text-orange-500" />;
  if (tipo === "Licenciamento") return <FiTool className="w-4 h-4 text-teal-600" />;
  return <FiFileText className="w-4 h-4 text-blue-500" />;
}

export function DebitoItem({ item, isSelected, onToggleSelect }: DebitoItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDetails = item.juros > 0 || item.multa > 0 || item.valorOriginal !== item.valorTotal;

  return (
    <div
      className={cn(
        "border rounded-xl transition-all duration-200",
        isSelected ? "border-primary/40 bg-primary/5" : "border-zinc-200 bg-white",
        item.isAtrasado && !isSelected && "border-red-200"
      )}
    >
      {/* Main row */}
      <div className="flex items-start gap-3 p-4">
        {/* Checkbox */}
        <div className="pt-0.5">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(item.id)}
            className="w-4 h-4 rounded border-zinc-300 text-primary accent-primary cursor-pointer"
          />
        </div>

        {/* Icon */}
        <div className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
          item.tipo === "Multa" ? "bg-orange-50" : item.tipo === "Licenciamento" ? "bg-teal-50" : "bg-blue-50"
        )}>
          {getIcon(item.tipo)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            {item.badges.map((b) => <DebitoBadge key={b} label={b} />)}
          </div>
          <p className="text-sm font-semibold text-zinc-800 leading-snug">{item.titulo}</p>
          <p className="text-xs text-zinc-500 mt-0.5">{item.vencimento}</p>
        </div>

        {/* Value + expand */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-bold text-zinc-800">{formatCurrency(item.valorTotal)}</span>
          {hasDetails && (
            <button
              onClick={() => setIsExpanded((p) => !p)}
              className="text-xs text-primary hover:text-primary/80 flex items-center gap-0.5 font-medium"
            >
              <FiChevronDown
                className={cn("w-4 h-4 transition-transform duration-300", isExpanded && "rotate-180")}
              />
            </button>
          )}
        </div>
      </div>

      {/* Accordion details */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isExpanded ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 pb-4 pt-0 ml-16 space-y-1.5 border-t border-zinc-100">
          <div className="flex justify-between text-xs text-zinc-600 pt-3">
            <span>Valor original</span>
            <span className="font-medium">{formatCurrency(item.valorOriginal)}</span>
          </div>
          {item.juros > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-zinc-600">Juros</span>
              <span className="text-red-600 font-semibold">+{formatCurrency(item.juros)}</span>
            </div>
          )}
          {item.multa > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-zinc-600">Multa</span>
              <span className="text-red-600 font-semibold">+{formatCurrency(item.multa)}</span>
            </div>
          )}
          <div className="flex justify-between text-xs font-bold border-t border-zinc-100 pt-1.5">
            <span className="text-zinc-800">Total</span>
            <span className="text-zinc-800">{formatCurrency(item.valorTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
