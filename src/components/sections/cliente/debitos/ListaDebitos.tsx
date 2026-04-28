import { DebitoItem } from "./DebitoItem";
import { ServicoAdicionalItem } from "./ServicoAdicionalItem";

interface ListaDebitosProps {
  itens: any[];
  servicosAdicionais: any[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  isLoading: boolean;
}

function ListaSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-16 bg-zinc-100 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

export function ListaDebitos({
  itens,
  servicosAdicionais,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  isLoading,
}: ListaDebitosProps) {
  const allIds = [...itens.map((i) => i.id), ...servicosAdicionais.map((s) => s.id)];
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));

  if (isLoading) return <ListaSkeleton />;

  return (
    <div className="space-y-5">
      {/* Header debitos */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-zinc-700 flex items-center gap-2">
          Débitos do veículo
          <span className="bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {itens.length}
          </span>
        </h3>
        <button
          onClick={onSelectAll}
          className="text-xs text-primary hover:text-primary/80 font-semibold transition-colors"
        >
          {allSelected ? "Desmarcar tudo" : "Selecionar tudo"}
        </button>
      </div>

      {/* Itens de débito */}
      <div className="space-y-2">
        {itens.map((item) => (
          <DebitoItem
            key={item.id}
            item={item}
            isSelected={selectedIds.includes(item.id)}
            onToggleSelect={onToggleSelect}
          />
        ))}
      </div>

      {/* Serviços adicionais */}
      {servicosAdicionais.length > 0 && (
        <div className="space-y-2 pt-2">
          <h3 className="text-sm font-bold text-zinc-700">Serviços adicionais</h3>
          {servicosAdicionais.map((s) => (
            <ServicoAdicionalItem
              key={s.id}
              item={s}
              isSelected={selectedIds.includes(s.id)}
              onToggleSelect={onToggleSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
