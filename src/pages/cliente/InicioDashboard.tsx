import { useEffect, useState } from "react";
import { DebitosWidget } from "@/components/sections/cliente/dashboard/DebitosWidget";
import { VeiculoResumoWidget } from "@/components/sections/cliente/dashboard/VeiculoResumoWidget";
import { ActionCards } from "@/components/sections/cliente/dashboard/ActionCards";
import { DebitosWidgetSkeleton, VeiculoResumoWidgetSkeleton } from "@/components/sections/cliente/dashboard/DashboardSkeletons";
import { DebitosEmptyState } from "@/components/sections/cliente/dashboard/DebitosEmptyState";
import { ModalTrocarVeiculo } from "@/components/sections/cliente/dashboard/ModalTrocarVeiculo";
import { getDashboardData } from "@/services/clienteDashboardService";

export default function InicioDashboard() {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTrocarVeiculoOpen, setIsTrocarVeiculoOpen] = useState(false);

  useEffect(() => {
    getDashboardData()
      .then(setData)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-[#032a4e]">Início</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Acompanhe os débitos e status do seu veículo.</p>
      </div>

      {/* Main grid: Débitos (left, wider) + Veículo (right, sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Débitos — spans 2 columns on large screens */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <DebitosWidgetSkeleton />
          ) : data && data.debitos.length > 0 ? (
            <DebitosWidget debitos={data.debitos} />
          ) : (
            <DebitosEmptyState />
          )}
        </div>

        {/* Veículo — 1 column */}
        <div className="lg:col-span-1">
          {isLoading ? (
            <VeiculoResumoWidgetSkeleton />
          ) : data ? (
            <VeiculoResumoWidget
              veiculo={data.veiculo}
              onTrocarVeiculo={() => setIsTrocarVeiculoOpen(true)}
            />
          ) : null}
        </div>
      </div>

      {/* Bottom action cards */}
      <ActionCards />

      {/* Modal */}
      <ModalTrocarVeiculo
        open={isTrocarVeiculoOpen}
        onClose={() => setIsTrocarVeiculoOpen(false)}
      />
    </div>
  );
}
