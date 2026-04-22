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

  const calcPct = (v: number) =>
    totalSolicitacoes > 0 ? Math.round((v / totalSolicitacoes) * 100) : 0;

  const grafico = [
    { name: "Em aberto", value: calcPct(emAberto), fill: "#D1D5DB" },
    { name: "Concluídas", value: calcPct(concluido), fill: "#1B2A4A" },
    { name: "Doc. pendentes", value: calcPct(docPendentes), fill: "#3AADE4" },
  ];

  // Bar chart: status breakdown
  const statusData = [
    { label: "Recebido", valor: s.porStatus.recebido },
    { label: "Em Andamento", valor: s.porStatus.emAndamento },
    { label: "Ag. Pagamento", valor: s.porStatus.aguardandoPagamento },
    { label: "Ag. Documento", valor: s.porStatus.aguardandoDocumento },
    { label: "Concluído", valor: s.porStatus.concluido },
    { label: "Cancelado", valor: s.porStatus.cancelado },
  ].filter((d) => d.valor > 0 || true); // show all statuses

  // Tempo medio por servico
  const tempoMedio = s.tempoConclusaoPorServico.map((t) => ({
    servico: t.servicoNome,
    dias: t.mediaRealDias,
    prazo: t.prazoEstimadoDias,
  }));

  const tempoMedioGeral =
    tempoMedio.length > 0
      ? (tempoMedio.reduce((acc, t) => acc + t.dias, 0) / tempoMedio.length).toFixed(1)
      : "—";

  const maxDias =
    tempoMedio.length > 0 ? Math.max(...tempoMedio.map((t) => Math.max(t.dias, t.prazo))) + 2 : 15;

  const STATUS_CORES: Record<string, string> = {
    Recebido: "#3AADE4",
    "Em Andamento": "#1B2A4A",
    "Ag. Pagamento": "#F5A623",
    "Ag. Documento": "#9E9E9E",
    Concluído: "#27AE60",
    Cancelado: "#E74C3C",
  };

  return (
    <>
      <span className="text-2xl font-bold text-secondary mb-6 block">Solicitações</span>

      {/* Top row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Donut */}
        <Card className="border-[#D2D5DB] shadow-none lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-center">
              Gráfico — Solicitações
            </CardTitle>
            <p className="text-xs text-muted-foreground text-center">Janeiro – Abril 2026</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="flex items-center gap-6">
              <div className="relative">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart className="z-10">
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
                    <Tooltip formatter={(v: number) => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-1">
                  <span className="text-2xl font-bold">{totalSolicitacoes}</span>
                  <span className="text-xs text-muted-foreground">Solicitações</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {grafico.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.fill }} />
                    {s.name} {s.value}%
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 w-full pt-3 text-xs text-muted-foreground text-center space-y-1">
              <div className="font-medium text-[#333333]">
                Taxa de cancelamento:{" "}
                <span className="font-semibold">{g.taxaCancelamentoPct}%</span>
              </div>
              <div>
                Débitos em aberto: R${" "}
                {g.debitosEmAberto.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info cards */}
        <div className="flex flex-col gap-4">
          <Card className="border-[#D2D5DB] shadow-none flex-1">
            <CardContent className="flex items-center gap-4 p-5 h-full">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1B2A4A] shrink-0">
                <CalendarClock className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-muted-foreground">
                  {s.proximasDeVencer.quantidade}
                </div>
                <div className="text-sm text-muted-foreground">Próximas de vencer</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#D2D5DB] shadow-none flex-1">
            <CardContent className="flex items-center gap-4 p-5 h-full">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#F5A623] shrink-0">
                <CalendarX className="w-5 h-5 text-white" />
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


      {/* Tempo médio por serviço */}
      <Card className="border-[#D2D5DB] shadow-none">
        <CardHeader>
          <CardTitle className="text-base font-bold text-[#333333] text-center">
            Tempo médio de conclusão por serviço (Em dias)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tempoMedio.length > 0 ? (
            <div className="relative">
              <ResponsiveContainer width="100%" height={Math.max(120, tempoMedio.length * 60)}>
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
                    tickFormatter={(v) => `${v}d`}
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
                    formatter={(v: number, name: string) => [
                      `${v} dias`,
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
                      formatter: (v: number) => `${v} dias`,
                      fontSize: 12,
                      fill: "#6C6C6C",
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>

              <div className="absolute bottom-2 right-0 flex items-center gap-3 border border-[#E9E9E9] rounded-xl px-4 py-3 bg-white shadow-sm">
                <Clock className="w-6 h-6 text-muted-foreground" />
                <div>
                  <div className="text-xs font-bold text-secondary">Tempo médio geral</div>
                  <div className="text-xs text-muted-foreground">{tempoMedioGeral} Dias</div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8 text-sm">
              Nenhum serviço concluído no período
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
