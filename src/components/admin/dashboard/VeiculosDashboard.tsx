import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogContent, DialogHeader } from "@/components/ui/dialog";
import {
  dashboardService,
  type DashboardVeiculosResponse,
} from "@/services/dashboardService";
import { Dialog, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { RiCarFill } from "react-icons/ri";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface VehicleMetricCardProps {
  icon: React.ReactNode;
  iconBg: string;
  value: number;
  label: string;
}

function VehicleMetricCard({
  icon,
  iconBg,
  value,
  label,
}: VehicleMetricCardProps) {
  return (
    <Card className="border-[#D2D5DB] shadow-none">
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className="flex items-center justify-center w-14 h-14 rounded-full shrink-0"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold text-muted-foreground">
            {value}
          </div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

const carIcon = <RiCarFill className="w-6 h-6 text-white" />;

const PLACA_CORES = ["#1B2A4A", "#1B2A4A", "#3AADE4", "#D1D5DB"];

export default function VeiculosDashboard() {
  const [v, setV] = useState<DashboardVeiculosResponse>();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const debitosPorPlaca = v?.debitosPendentes.porVeiculo.map((d) => ({
    placa: d.placa,
    valor: d.valorTotal,
    valorFormatado: `R$ ${d.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
  }));

  const totalFormatado = `R$ ${v?.debitosPendentes?.valorTotal? v.debitosPendentes.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : "0.00"}`;

  useEffect(() => {
    dashboardService
      .getVeiculos()
      .then((data) => {
        console.log("Dados do dashboard de veículos:", data);
        setV(data);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados do dashboard de veículos:", error);
        setErrorMessage(
          "Erro ao carregar dados do dashboard de veículos. Por favor, tente novamente mais tarde.",
        );
      });
  }, []);

  return (
    <>
      <span className="text-2xl font-bold text-secondary mb-6 block">
        Veículos
      </span>

      {/* Métricas superiores */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <VehicleMetricCard
          iconBg="#1B2A4A"
          icon={carIcon}
          value={v?.totalCadastrados ?? 0}
          label="Total de veículos cadastrados"
        />
        <VehicleMetricCard
          iconBg="#F5A623"
          icon={carIcon}
          value={v?.comSolicitacaoAtiva ?? 0}
          label="Veículos com solicitação ativa"
        />
        <VehicleMetricCard
          iconBg="#E74C3C"
          icon={carIcon}
          value={v?.comDebitoPendente ?? 0}
          label="Veículos com débito pendente"
        />
      </div>

      {/* Gráfico débitos por placa */}
      <Card className="border-[#D2D5DB] shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-center">
            Valor total de débitos pendentes:
          </CardTitle>
          <p className="text-2xl font-bold text-center text-secondary">
            {totalFormatado}
          </p>
        </CardHeader>
        <CardContent>
          {debitosPorPlaca ? debitosPorPlaca.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height={Math.max(120, debitosPorPlaca.length * 56)}
            >
              <BarChart
                layout="vertical"
                data={debitosPorPlaca}
                margin={{ left: 8, right: 130 }}
                barCategoryGap="25%"
              >
                <CartesianGrid horizontal={false} stroke="#F0F0F0" />
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="placa"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 600, fill: "#1B2A4A" }}
                  width={80}
                />
                <Tooltip
                  formatter={(value) => {
                    const numericValue =
                      typeof value === "number" ? value : Number(value ?? 0);
                    return [
                      `R$ ${numericValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
                      "Débito",
                    ];
                  }}
                  cursor={{ fill: "#F3F4F6" }}
                />
                <Bar
                  dataKey="valor"
                  radius={[4, 4, 4, 4]}
                  label={{
                    position: "right",
                    formatter: (value) => {
                      const numericValue =
                        typeof value === "number" ? value : Number(value ?? 0);
                      return `R$ ${numericValue.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}`;
                    },
                    fontSize: 12,
                    fontWeight: 600,
                    fill: "#1B2A4A",
                  }}
                >
                  {debitosPorPlaca.map((_, index) => (
                    <Cell key={index} fill={PLACA_CORES[index] ?? "#9CA3AF"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground py-8 text-sm">
              Nenhum débito pendente por veículo
            </p>
          ) : null}
        </CardContent>
      </Card>
      <Dialog
        open={Boolean(errorMessage)}
        onOpenChange={(open) => {
          if (!open) {
            setErrorMessage(null);
          }
        }}
      >
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-red-600">
              Erro ao carregar dados
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              {errorMessage}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end">
            <Button onClick={() => setErrorMessage(null)}>Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>  
  );
}
