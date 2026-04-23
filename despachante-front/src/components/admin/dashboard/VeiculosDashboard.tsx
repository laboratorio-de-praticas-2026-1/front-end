import mockDashboard from "@/mocks/mockDashboard.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import { RiCarFill } from "react-icons/ri";

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
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold text-muted-foreground">{value}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

const carIcon = <RiCarFill className="h-6 w-6 text-white" />;
const PLACA_CORES = ["#1B2A4A", "#1B2A4A", "#3AADE4", "#D1D5DB"];

export default function VeiculosDashboard() {
  const v = mockDashboard.veiculos;

  const debitosPorPlaca = v.debitosPendentes.porVeiculo.map((item) => ({
    placa: item.placa,
    valor: item.valorTotal,
    valorFormatado: `R$ ${item.valorTotal.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    })}`,
  }));

  const totalFormatado = `R$ ${v.debitosPendentes.valorTotal.toLocaleString(
    "pt-BR",
    {
      minimumFractionDigits: 2,
    },
  )}`;

  return (
    <>
      <span className="mb-6 block text-2xl font-bold text-secondary">
        Veiculos
      </span>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <VehicleMetricCard
          iconBg="#1B2A4A"
          icon={carIcon}
          value={v.totalCadastrados}
          label="Total de veiculos cadastrados"
        />
        <VehicleMetricCard
          iconBg="#F5A623"
          icon={carIcon}
          value={v.comSolicitacaoAtiva}
          label="Veiculos com solicitacao ativa"
        />
        <VehicleMetricCard
          iconBg="#E74C3C"
          icon={carIcon}
          value={v.comDebitoPendente}
          label="Veiculos com debito pendente"
        />
      </div>

      <Card className="border-[#D2D5DB] shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-sm font-semibold">
            Valor total de debitos pendentes:
          </CardTitle>
          <p className="text-center text-2xl font-bold text-secondary">
            {totalFormatado}
          </p>
        </CardHeader>
        <CardContent>
          {debitosPorPlaca.length > 0 ? (
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
                  formatter={(value) => [
                    `R$ ${Number(value ?? 0).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}`,
                    "Debito",
                  ]}
                  labelFormatter={(
                    _label: unknown,
                    payload: readonly { payload?: { valorFormatado?: string } }[] = [],
                  ) => payload[0]?.payload?.valorFormatado ?? ""}
                  cursor={{ fill: "#F3F4F6" }}
                />
                <Bar
                  dataKey="valor"
                  radius={[4, 4, 4, 4]}
                >
                  <LabelList
                    dataKey="valorFormatado"
                    position="right"
                    fontSize={12}
                    fontWeight={600}
                    fill="#1B2A4A"
                  />
                  {debitosPorPlaca.map((_, index) => (
                    <Cell key={index} fill={PLACA_CORES[index] ?? "#9CA3AF"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nenhum debito pendente por veiculo
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
