import mockDashboard from "@/mocks/mockDashboard.json";
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
import { Clock, CalendarX, CalendarClock } from "lucide-react";

export default function SolicitacoesDashboard() {
  const s = mockDashboard.solicitacoes;
  const g = mockDashboard.geral;

  const totalSolicitacoes =
    s.porStatus.recebido +
    s.porStatus.emAndamento +
    s.porStatus.aguardandoPagamento +
    s.porStatus.aguardandoDocumento +
    s.porStatus.concluido +
    s.porStatus.cancelado;

  const emAberto =
    s.porStatus.recebido +
    s.porStatus.emAndamento +
    s.porStatus.aguardandoPagamento +
    s.porStatus.aguardandoDocumento;

  const concluido = s.porStatus.concluido;
  const docPendentes = mockDashboard.documentos.pendentes;

  const calcPct = (value: number) =>
    totalSolicitacoes > 0 ? Math.round((value / totalSolicitacoes) * 100) : 0;

  const grafico = [
    { name: "Em aberto", value: calcPct(emAberto), fill: "#D1D5DB" },
    { name: "Concluidas", value: calcPct(concluido), fill: "#1B2A4A" },
    { name: "Doc. pendentes", value: calcPct(docPendentes), fill: "#3AADE4" },
  ];

  const tempoMedio = s.tempoConclusaoPorServico.map((item) => ({
    servico: item.servicoNome,
    dias: item.mediaRealDias,
    prazo: item.prazoEstimadoDias,
  }));

  const tempoMedioGeral =
    tempoMedio.length > 0
      ? (
          tempoMedio.reduce((accumulator, item) => accumulator + item.dias, 0) /
          tempoMedio.length
        ).toFixed(1)
      : "-";

  const maxDias =
    tempoMedio.length > 0
      ? Math.max(...tempoMedio.map((item) => Math.max(item.dias, item.prazo))) + 2
      : 15;

  return (
    <>
      <span className="mb-6 block text-2xl font-bold text-secondary">
        Solicitacoes
      </span>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="border-[#D2D5DB] shadow-none lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-sm font-semibold">
              Grafico - Solicitacoes
            </CardTitle>
            <p className="text-center text-xs text-muted-foreground">
              Janeiro - Abril 2026
            </p>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="flex items-center gap-6">
              <div className="relative">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie
                      data={grafico}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={78}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                      strokeWidth={0}
                    >
                      {grafico.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `${Number(value ?? 0)}%`}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{totalSolicitacoes}</span>
                  <span className="text-xs text-muted-foreground">
                    Solicitacoes
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {grafico.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    {item.name} {item.value}%
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 w-full space-y-1 pt-3 text-center text-xs text-muted-foreground">
              <div className="font-medium text-[#333333]">
                Taxa de cancelamento:{" "}
                <span className="font-semibold">{g.taxaCancelamentoPct}%</span>
              </div>
              <div>
                Debitos em aberto: R${" "}
                {g.debitosEmAberto.valorTotal.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="flex-1 border-[#D2D5DB] shadow-none">
            <CardContent className="flex h-full items-center gap-4 p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1B2A4A]">
                <CalendarClock className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-muted-foreground">
                  {s.proximasDeVencer.quantidade}
                </div>
                <div className="text-sm text-muted-foreground">
                  Proximas de vencer
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1 border-[#D2D5DB] shadow-none">
            <CardContent className="flex h-full items-center gap-4 p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F5A623]">
                <CalendarX className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-muted-foreground">
                  {s.foraDoPrazo.quantidade}
                </div>
                <div className="text-sm text-muted-foreground">Fora do prazo</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-[#D2D5DB] shadow-none">
        <CardHeader>
          <CardTitle className="text-center text-base font-bold text-[#333333]">
            Tempo medio de conclusao por servico (Em dias)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tempoMedio.length > 0 ? (
            <div className="relative">
              <ResponsiveContainer
                width="100%"
                height={Math.max(120, tempoMedio.length * 60)}
              >
                <BarChart
                  layout="vertical"
                  data={tempoMedio}
                  margin={{ left: 8, right: 100 }}
                  barCategoryGap="20%"
                >
                  <CartesianGrid horizontal={false} stroke="#F0F0F0" />
                  <XAxis
                    type="number"
                    domain={[0, maxDias]}
                    tickFormatter={(value) => `${value}d`}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  />
                  <YAxis
                    type="category"
                    dataKey="servico"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6C6C6C" }}
                    width={100}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      `${Number(value ?? 0)} dias`,
                      name === "dias" ? "Tempo real" : "Prazo estimado",
                    ]}
                    cursor={{ fill: "#F3F4F6" }}
                  />
                  <Bar
                    dataKey="prazo"
                    fill="#D1D5DB"
                    radius={[4, 4, 4, 4]}
                    name="prazo"
                  />
                  <Bar
                    dataKey="dias"
                    fill="#1B2A4A"
                    radius={[4, 4, 4, 4]}
                    name="dias"
                    label={{
                      position: "right",
                      formatter: (value: unknown) =>
                        `${Number(value ?? 0)} dias`,
                      fontSize: 12,
                      fill: "#6C6C6C",
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>

              <div className="absolute bottom-2 right-0 flex items-center gap-3 rounded-xl border border-[#E9E9E9] bg-white px-4 py-3 shadow-sm">
                <Clock className="h-6 w-6 text-muted-foreground" />
                <div>
                  <div className="text-xs font-bold text-secondary">
                    Tempo medio geral
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {tempoMedioGeral} Dias
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nenhum servico concluido no periodo
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
