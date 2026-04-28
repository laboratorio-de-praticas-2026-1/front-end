import { useEffect, useMemo, useState } from "react";
import { useVeiculo } from "@/context/VeiculoContext";
import { getDebitosByVeiculoId } from "@/services/debitosService";
import { ListaDebitos } from "@/components/sections/cliente/debitos/ListaDebitos";
import { PainelLateral } from "@/components/sections/cliente/debitos/PainelLateral";

export default function DebitosPage() {
  const { veiculoAtivo } = useVeiculo();
  const [debitosData, setDebitosData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Busca débitos sempre que o veículo ativo mudar
  useEffect(() => {
    if (!veiculoAtivo) return;
    setIsLoading(true);
    setSelectedIds([]); // limpa seleção ao trocar veículo
    getDebitosByVeiculoId(veiculoAtivo.id)
      .then(setDebitosData)
      .finally(() => setIsLoading(false));
  }, [veiculoAtivo?.id]);

  const itens = debitosData?.itens ?? [];
  const servicosAdicionais = debitosData?.servicosAdicionais ?? [];
  const taxaServico = debitosData?.taxaServico ?? 14.99;

  const allIds = useMemo(
    () => [...itens.map((i: any) => i.id), ...servicosAdicionais.map((s: any) => s.id)],
    [itens, servicosAdicionais]
  );

  function handleToggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleSelectAll() {
    const allSelected = allIds.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : allIds);
  }

  function handleSimular(payload: { veiculoId: string; debitosSelecionados: string[]; formaPagamentoId: string }) {
    // Issue 5.5 vai implementar a chamada real aqui
    console.log("Payload de simulação:", payload);
    alert("Simulação: " + JSON.stringify(payload, null, 2));
  }

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-[#032a4e]">Débitos</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Acompanhe todos os débitos do seu veículo.</p>
      </div>

      {/* Layout de duas colunas */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Lista (esquerda, maior) */}
        <div className="flex-1 min-w-0">
          <ListaDebitos
            itens={itens}
            servicosAdicionais={servicosAdicionais}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            isLoading={isLoading}
          />
        </div>

        {/* Painel lateral (direita, fixo) */}
        <div className="w-full lg:w-80 shrink-0">
          <PainelLateral
            itens={itens}
            servicosAdicionais={servicosAdicionais}
            selectedIds={selectedIds}
            taxaServico={taxaServico}
            veiculoId={veiculoAtivo?.id ?? ""}
            onSimular={handleSimular}
          />
        </div>
      </div>
    </div>
  );
}
