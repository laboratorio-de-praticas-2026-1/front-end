import { FiGrid } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface ServicoAdicionalItemProps {
  item: {
    id: string;
    titulo: string;
    descricao: string;
    valorTotal: number;
  };
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

function formatCurrency(value: number) {
  return `R$\u00a0${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function ServicoAdicionalItem({ item, isSelected, onToggleSelect }: ServicoAdicionalItemProps) {
  return (
    <div
      className={cn(
        "border rounded-xl transition-all duration-200",
        isSelected ? "border-primary/40 bg-primary/5" : "border-zinc-200 bg-white"
      )}
    >
      <div className="flex items-center gap-3 p-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(item.id)}
          className="w-4 h-4 rounded border-zinc-300 text-primary accent-primary cursor-pointer shrink-0"
        />
        <div className="w-9 h-9 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0">
          <FiGrid className="w-4 h-4 text-zinc-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-zinc-800 leading-snug">{item.titulo}</p>
          <p className="text-xs text-zinc-500">{item.descricao}</p>
        </div>
        <span className="text-sm font-bold text-zinc-800 shrink-0">{formatCurrency(item.valorTotal)}</span>
      </div>
    </div>
  );
}
