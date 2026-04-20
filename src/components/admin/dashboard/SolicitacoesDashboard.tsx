import { solicitacoesMockData } from "./Solicitacoes/solicitacoesData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Clock, TrendingUp } from "lucide-react";

export default function SolicitacoesDashboard() {
  const d = solicitacoesMockData;

  return (
    <>
      <span className="text-2xl font-bold text-secondary mb-6 block">Solicitações</span>

      {/* Gráficos superiores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Donut */}
        <Card className="border-[#D2D5DB] shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-center">
              Gráfico - Solicitações
            </CardTitle>
            <p className="text-xs text-muted-foreground text-center">{d.periodo}</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="flex items-center gap-6">
              <div className="relative">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie
                      data={d.graficoSolicitacoes}
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={72}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                      strokeWidth={0}
                    >
                      {d.graficoSolicitacoes.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold">{d.totalSolicitacoes}</span>
                  <span className="text-xs text-muted-foreground">Solicitações</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {d.graficoSolicitacoes.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.fill }} />
                    {s.name} {s.value}%
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 w-full pt-3 text-xs text-muted-foreground space-y-1 text-center">
              <div className="flex items-center justify-center gap-2 text-[#333333] font-medium">
                Taxa de cancelamento: <span className="font-semibold font-foreground">{d.taxaCancelamento}</span> <TrendingUp className="size-4" />
              </div>
              <div>Total de créditos em aberto: {d.totalCreditosEmAberto}</div>
            </div>
          </CardContent>
        </Card>

        {/* Bar chart — débitos mensais */}
        <Card className="border-[#D2D5DB] shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-center">
              Gráfico - Débitos em aberto
            </CardTitle>
            <p className="text-lg text-center font-medium text-muted-foreground">
              Total: <span className="font-bold">{d.totalDebitosAberto}</span>
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="80%" height={160} className="mx-auto">
              <BarChart data={d.graficoDebitos} barCategoryGap="10%">
                <CartesianGrid vertical={false} stroke="#F0F0F0" />
                <XAxis
                  dataKey="mes"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#9CA3AF" }}
                />
                <YAxis hide />
                <Tooltip
                  formatter={(v: number) => [`R$${v.toLocaleString("pt-BR")}`, "Débito"]}
                  cursor={{ fill: "#F3F4F6" }}
                />
                <Bar dataKey="valor" fill="#3AADE4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tempo médio por serviço — bar chart horizontal */}
      <Card className="border-[#D2D5DB] shadow-none">
        <CardHeader>
          <CardTitle className="text-base font-bold font-[#333333] align-middle text-center">
            Tempo médio de conclusão por serviço (Em dias)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                layout="vertical"
                data={d.tempoMedioPorServico}
                margin={{ left: 8, right: 80 }}
                barCategoryGap="20%"
              >
                <CartesianGrid horizontal={false} stroke="#F0F0F0" />
                <XAxis
                  type="number"
                  domain={[0, 4]}
                  ticks={[0, 1, 2, 3, 4]}
                  tickFormatter={(v) => `${v} Dias`}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                />
                <YAxis
                  type="category"
                  dataKey="servico"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 13, fill: "#6C6C6C" }}
                  width={72}
                />
                <Tooltip
                  formatter={(v: number) => [`${v} dias`, "Tempo médio"]}
                  cursor={{ fill: "#F3F4F6" }}
                />
                <Bar
                  dataKey="dias"
                  radius={[4, 4, 4, 4]}
                  label={{ position: "right", formatter: (v: number) => `${v} dias`, fontSize: 13, fill: "#6C6C6C" }}
                >
                  {d.tempoMedioPorServico.map((entry, index) => {
                    const cores = ["#1B2A4A", "#1B2A4A", "#3AADE4", "#D1D5DB"];
                    return <Cell key={index} fill={cores[index] ?? "#9CA3AF"} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Badge tempo médio geral */}
            <div className="absolute bottom-2 right-0 flex items-center gap-3 border border-[#E9E9E9] rounded-xl px-4 py-3 bg-white shadow-sm">
              <Clock className="w-6 h-6 text-muted-foreground" />
              <div>
                <div className="text-xs font-bold text-secondary">Tempo médio geral</div>
                <div className="text-xs text-muted-foreground">{d.tempoMedioGeral} Dias</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
