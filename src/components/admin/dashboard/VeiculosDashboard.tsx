import { veiculosMockData } from "@/mocks/veiculosData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { RiCarFill } from "react-icons/ri";


interface VehicleMetricCardProps {
  icon: React.ReactNode;
  iconBg: string;
  value: number;
  label: string;
}

function VehicleMetricCard({ icon, iconBg, value, label }: VehicleMetricCardProps) {
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
          <div className="text-2xl font-bold text-muted-foreground">{value}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

const carIcon = <RiCarFill className="w-6 h-6 text-white" />;

const PLACA_CORES = ["#1B2A4A", "#1B2A4A", "#3AADE4", "#D1D5DB"];

export default function VeiculosDashboard() {
  const d = veiculosMockData;

  return (
    <>
      <span className="text-2xl font-bold text-secondary mb-6 block">Veículos</span>

      {/* Gráfico + métricas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {/* Gráfico barras por placa */}
        <Card className="lg:col-span-2 border-[#D2D5DB] shadow-none">
          <CardHeader className="pb-2">
            <div className="text-center">
              <p className="text-base">Valor total de débitos pendentes:</p>
              <p className="text-2xl">{d.totalValorDebitosPendentes}</p>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                layout="vertical"
                data={d.debitosPorPlaca}
                margin={{ left: 8, right: 100 }}
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
                  formatter={(v: number) => [`R$ ${v.toLocaleString("pt-BR")}`, "Débito"]}
                  cursor={{ fill: "#F3F4F6" }}
                />
                <Bar
                  dataKey="valor"
                  radius={[0, 4, 4, 0]}
                  label={{
                    position: "right",
                    formatter: (_: unknown, entry: { valorFormatado?: string }) => entry?.valorFormatado ?? "",
                    fontSize: 13,
                    fontWeight: 600,
                    fill: "#1B2A4A",
                  }}
                >
                  {d.debitosPorPlaca.map((_, index) => (
                    <Cell key={index} fill={PLACA_CORES[index] ?? "#9CA3AF"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cards métricas */}
        <div className="flex flex-col gap-4">
          <VehicleMetricCard
            iconBg="#1B2A4A"
            icon={carIcon}
            value={d.metricas.totalCadastrados}
            label="Total de veículos cadastrados"
          />
          <VehicleMetricCard
            iconBg="#F5A623"
            icon={carIcon}
            value={d.metricas.comSolicitacaoAtiva}
            label="Veículos com solicitação ativa"
          />
          <VehicleMetricCard
            iconBg="#E74C3C"
            icon={carIcon}
            value={d.metricas.comDebitoPendente}
            label="Veículos com débito pendente"
          />
        </div>
      </div>

      {/* Tabela débitos */}
      <h3 className="text-lg font-bold text-secondary mb-4">Débitos em aberto</h3>
      <Card className="border-[#D2D5DB] shadow-none overflow-auto">
        <CardContent className="p-0">
          <Table className="">
            <TableHeader className="bg-secondary">
              <TableRow>
                <TableHead className="text-white font-semibold px-6 py-4">Cliente</TableHead>
                <TableHead className="text-white font-semibold px-6 py-4">Serviço</TableHead>
                <TableHead className="text-white font-semibold px-6 py-4">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {d.debitosEmAberto.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="px-6 py-4 text-muted-foreground">{row.cliente}</TableCell>
                  <TableCell className="px-6 py-4">{row.servico}</TableCell>
                  <TableCell className="px-6 py-4">{row.valor}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
